import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNavigator } from '../../../context/NavigatorContext';
import { getQuestionsForSkill } from '../../../data/assessmentQuestions';
import QuizQuestion from '../../../components/ui/student/navigator/QuizQuestion';

import { aiService } from '../../../services/aiService';
import { Loader2 } from 'lucide-react';

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

  useEffect(() => {
    setQuestions(getQuestionsForSkill(skillId));
  }, [skillId]);

  const handleAnswer = async (isCorrect, selectedOption) => {
    if (isCorrect) setScore(s => s + 1);
    
    const newAnswers = [...answers, {
      question: questions[currentIdx].question,
      userAnswer: selectedOption,
      correctAnswer: questions[currentIdx].correctAnswer,
      isCorrect
    }];
    setAnswers(newAnswers);
    
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setCompleted(true);
      setIsEvaluating(true);
      
      const finalScorePercentage = Math.round(((score + (isCorrect ? 1 : 0)) / questions.length) * 100);
      
      dispatch({
        type: 'UPDATE_MASTERY',
        payload: { skillId, masteryScore: finalScorePercentage }
      });
      
      // Call AI to evaluate and potentially modify the path
      const result = await aiService.evaluateAssessment(skillId, newAnswers, state, dispatch);
      setEvaluationResult(result);
      
      if (finalScorePercentage < 60 && (!result?.action || result.action.type !== 'ADD_SUBTREE')) {
        dispatch({ type: 'TRIGGER_RECOVERY', payload: { skillId } });
      } else {
        dispatch({ type: 'REPLAN_PATH' });
      }
      setIsEvaluating(false);
    }
  };

  if (!questions.length) return <div className="p-8">Loading assessment...</div>;

  if (completed) {
    const finalScore = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto py-12 px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Assessment Complete</h2>
          <div className="text-4xl font-bold mb-6 text-indigo-600">{finalScore}%</div>
        </div>

        {isEvaluating ? (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-8 flex flex-col items-center justify-center text-indigo-600">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="font-medium">AI is evaluating your responses and updating your path...</p>
          </div>
        ) : evaluationResult ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">AI Evaluation</h3>
            <p className="text-gray-700 mb-6">{evaluationResult.summary}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Strong Topics</h4>
                <ul className="list-disc pl-5 text-sm text-green-700">
                  {evaluationResult.strongTopics?.map((t, i) => <li key={i}>{t}</li>) || <li>None</li>}
                </ul>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">Needs Review</h4>
                <ul className="list-disc pl-5 text-sm text-orange-700">
                  {evaluationResult.weakTopics?.map((t, i) => <li key={i}>{t}</li>) || <li>None</li>}
                </ul>
              </div>
            </div>

            <div className="flex justify-center">
              <button 
                onClick={() => navigate(finalScore < 60 ? '/student/navigator/recovery' : '/student/navigator/dashboard')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
              >
                {finalScore < 60 ? 'View Recovery Plan' : 'Continue to Dashboard'}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <div className="mb-8">
        <p className="text-sm text-gray-500 mb-2">Question {currentIdx + 1} of {questions.length}</p>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300" 
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

export default NavigatorAssessment;
