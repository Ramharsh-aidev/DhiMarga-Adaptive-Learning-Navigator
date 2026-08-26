import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNavigator } from '../../../context/NavigatorContext';
import { getQuestionsForSkill } from '../../../data/assessmentQuestions';
import QuizQuestion from '../../../components/ui/student/navigator/QuizQuestion';
import SocraticTutor from '../../../components/ui/student/navigator/SocraticTutor';
import Layout from '../../../components/layout/Layout';
import { aiService } from '../../../services/aiService';
import { Loader2, ArrowLeft, RotateCcw, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NavigatorAssessment = () => {
  const { skillId } = useParams();
  const { state, dispatch } = useNavigator();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [xpEarned, setXpEarned] = useState(0);

  // If this skill is currently a 'gap', default to Socratic Tutor mode
  const [useSocraticTutor, setUseSocraticTutor] = useState(
    state.learnerState[skillId]?.status === 'gap'
  );

  // Get current path details for breadcrumb
  const currentPathNode = state.currentPath?.find(n => n.skillId === skillId);
  const skillLabel = currentPathNode?.nodeRef?.label || skillId.replace(/_/g, ' ');
  const pathName = state.goal?.targetRole?.replace(/_/g, ' ') || 'Learning Path';

  const fetchQuestions = useCallback(async () => {
    setIsLoadingQuestions(true);
    setCompleted(false);
    setCurrentIdx(0);
    setScore(0);
    setAnswers([]);
    setEvaluationResult(null);

    try {
      const generated = await aiService.generateQuestions(skillId, 5);
      if (generated && generated.length > 0) {
        setQuestions(generated);
      } else {
        setQuestions(getQuestionsForSkill(skillId)); // Safe fallback
      }
    } catch (err) {
      console.error('Failed to generate questions:', err);
      setQuestions(getQuestionsForSkill(skillId));
    } finally {
      setIsLoadingQuestions(false);
    }
  }, [skillId]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleAnswer = async (isCorrect, selectedOption) => {
    if (isCorrect) setScore(s => s + 1);
    
    const newAnswers = [...answers, {
      question: questions[currentIdx].question,
      userAnswer: selectedOption,
      correctAnswer: questions[currentIdx].correctAnswer,
      isCorrect
    }];
    setAnswers(newAnswers);

    // Adaptive Assessment logic: Check for 2 consecutive wrong answers early on
    const consecutiveWrong = newAnswers.slice(-2).filter(a => !a.isCorrect).length === 2;
    
    if (consecutiveWrong && questions.length <= 5 && !questions[currentIdx].isAdaptive) {
      setIsLoadingQuestions(true);
      try {
        const adaptiveQuestions = await aiService.generateAdaptiveQuestions(skillId, newAnswers.slice(-2));
        const newQuestions = [
          ...questions.slice(0, currentIdx + 1),
          ...adaptiveQuestions.map(q => ({ ...q, isAdaptive: true }))
        ];
        setQuestions(newQuestions);
      } catch (err) {
        console.error("Adaptive fallback failed", err);
      } finally {
        setIsLoadingQuestions(false);
      }
    }
    
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setCompleted(true);
      setIsEvaluating(true);
      
      const finalScorePercentage = Math.round(((score + (isCorrect ? 1 : 0)) / questions.length) * 100);
      
      const prevXp = state.userProgress?.xp || 0;

      const newSummary = await dispatch({
        type: 'UPDATE_MASTERY',
        payload: { skillId, masteryScore: finalScorePercentage }
      });
      
      if (newSummary && newSummary.xp > prevXp) {
        setXpEarned(newSummary.xp - prevXp);
      }
      
      // Call AI to evaluate and potentially modify the path
      const result = await aiService.evaluateAssessment(skillId, newAnswers, state, dispatch);
      setEvaluationResult(result);
      
      if (finalScorePercentage < 60 && (!result?.action || result.action.type !== 'ADD_SUBTREE')) {
        await dispatch({ type: 'TRIGGER_RECOVERY', payload: { skillId } });
      } else {
        await dispatch({ type: 'REPLAN_PATH' });
      }
      setIsEvaluating(false);
    }
  };

  const handleSocraticComplete = async () => {
    setCompleted(true);
    setIsEvaluating(true);
    const prevXp = state.userProgress?.xp || 0;
    
    // Give them full marks for recovering a gap via tutoring
    const newSummary = await dispatch({
      type: 'UPDATE_MASTERY',
      payload: { skillId, masteryScore: 100 }
    });
    
    if (newSummary && newSummary.xp > prevXp) {
      setXpEarned(newSummary.xp - prevXp);
    }
    
    setScore(questions.length || 5); // visually show 100%
    setEvaluationResult({
      summary: "You successfully demonstrated mastery through the Socratic Tutor!",
      strongTopics: [skillLabel],
      weakTopics: []
    });
    
    await dispatch({ type: 'REPLAN_PATH' });
    setIsEvaluating(false);
  };

  const renderContent = () => {
    if (useSocraticTutor) {
      return (
        <div className="max-w-4xl mx-auto py-4">
          <div className="mb-4 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Recovery Mission: {skillLabel}</h2>
            <button 
              onClick={() => setUseSocraticTutor(false)}
              className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Switch to Standard Quiz
            </button>
          </div>
          <SocraticTutor skillId={skillLabel} onComplete={handleSocraticComplete} />
        </div>
      );
    }

    if (isLoadingQuestions) {
      return (
        <div className="flex flex-col items-center justify-center py-32 text-violet-600">
          <Loader2 className="animate-spin mb-4" size={48} />
          <h3 className="text-2xl font-bold mb-2">Crafting your questions...</h3>
          <p className="text-slate-500 font-medium">Our AI is generating a personalized assessment for you.</p>
        </div>
      );
    }

    if (!questions.length) {
      return (
        <div className="flex flex-col items-center justify-center py-32">
          <p className="text-slate-500 mb-4 font-medium">Could not load assessment questions.</p>
          <button 
            onClick={() => navigate('/student/navigator/dashboard')}
            className="px-4 py-2 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 font-bold"
          >
            Go Back
          </button>
        </div>
      );
    }

    if (completed) {
      const finalScore = Math.round((score / questions.length) * 100);
      return (
        <div className="max-w-2xl mx-auto py-8">
          <div className="text-center mb-8 relative">
            <h2 className="text-3xl font-extrabold mb-4 text-slate-900 tracking-tight">Assessment Complete</h2>
            <div className={`text-5xl font-extrabold mb-6 ${finalScore >= 60 ? 'text-green-600' : 'text-rose-500'}`}>
              {finalScore}%
            </div>
            
            <AnimatePresence>
              {xpEarned > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute -right-8 top-12 bg-linear-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-2xl shadow-xl shadow-orange-500/30 flex items-center gap-2 transform rotate-12"
                >
                  <Zap size={20} className="fill-white" />
                  <span className="font-extrabold text-xl">+{xpEarned} XP</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isEvaluating ? (
            <div className="bg-violet-50 border border-violet-100 rounded-2xl p-8 flex flex-col items-center justify-center text-violet-600 shadow-sm">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p className="font-bold text-lg">AI is evaluating your responses and updating your path...</p>
            </div>
          ) : evaluationResult ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-md">
              <h3 className="text-xl font-bold text-slate-900 mb-4">AI Evaluation</h3>
              <p className="text-slate-700 mb-6 text-lg font-medium">{evaluationResult.summary}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-green-50/50 border border-green-100 p-5 rounded-xl">
                  <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Strong Topics
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-green-700 font-medium">
                    {evaluationResult.strongTopics?.map((t, i) => <li key={i}>{t}</li>) || <li>None</li>}
                  </ul>
                </div>
                <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-xl">
                  <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> Needs Review
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-amber-700 font-medium">
                    {evaluationResult.weakTopics?.map((t, i) => <li key={i}>{t}</li>) || <li>None</li>}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={fetchQuestions}
                  className="px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <RotateCcw size={18} /> Retake Quiz
                </button>
                <button 
                  onClick={() => navigate(finalScore < 60 ? '/student/navigator/recovery' : '/student/navigator/dashboard')}
                  className="px-6 py-3 bg-linear-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-violet-500/30 transition-all font-bold"
                >
                  {finalScore < 60 ? 'View Recovery Plan' : 'Continue Journey'}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      );
    }

    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-900">Knowledge Check: {skillLabel}</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setUseSocraticTutor(true)}
                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold border border-blue-100 hover:bg-blue-100 transition-colors"
              >
                Use Tutor Mode
              </button>
              <span className="px-3 py-1 bg-violet-50 text-violet-700 rounded-full text-sm font-bold border border-violet-100">
                Question {currentIdx + 1} of {questions.length}
              </span>
            </div>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-violet-600 transition-all duration-300 ease-out" 
              style={{ width: `${((currentIdx) / questions.length) * 100}%` }}
            />
          </div>
        </div>
        
        <QuizQuestion 
          key={currentIdx}
          question={questions[currentIdx]} 
          onAnswer={handleAnswer} 
        />
      </div>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50/50 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 font-medium">
            <button 
              onClick={() => navigate('/student/dashboard')}
              className="hover:text-violet-600 transition-colors"
            >
              Dashboard
            </button>
            <span>/</span>
            <button 
              onClick={() => navigate('/student/navigator/dashboard')}
              className="hover:text-violet-600 transition-colors"
            >
              {pathName}
            </button>
            <span>/</span>
            <span className="text-slate-900 font-bold">Assessment</span>
          </div>
          
          {/* Back button for exiting mid-quiz */}
          {!completed && !isLoadingQuestions && (
            <button 
              onClick={() => navigate('/student/navigator/dashboard')}
              className="flex items-center gap-2 text-slate-600 hover:text-violet-600 transition-colors mb-4 group w-fit font-bold"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Path
            </button>
          )}

          {renderContent()}
        </div>
      </div>
    </Layout>
  );
};

export default NavigatorAssessment;
