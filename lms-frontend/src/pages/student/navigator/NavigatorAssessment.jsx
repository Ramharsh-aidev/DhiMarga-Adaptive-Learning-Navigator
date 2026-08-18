import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNavigator } from '../../../context/NavigatorContext';
import { getQuestionsForSkill } from '../../../data/assessmentQuestions';
import QuizQuestion from '../../../components/ui/student/navigator/QuizQuestion';

const NavigatorAssessment = () => {
  const { skillId } = useParams();
  const { state, dispatch } = useNavigator();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setQuestions(getQuestionsForSkill(skillId));
  }, [skillId]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(s => s + 1);
    
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setCompleted(true);
      
      // Calculate final score
      const finalScorePercentage = Math.round(((score + (isCorrect ? 1 : 0)) / questions.length) * 100);
      
      dispatch({
        type: 'UPDATE_MASTERY',
        payload: { skillId, masteryScore: finalScorePercentage }
      });
      
      // Check if blocked (e.g. failed a critical dependency)
      // For prototype, we randomly simulate a blockage if they fail
      if (finalScorePercentage < 60) {
        dispatch({ type: 'TRIGGER_RECOVERY', payload: { skillId } });
      } else {
        dispatch({ type: 'REPLAN_PATH' }); // Update path to mark current as completed and shift up
      }
    }
  };

  if (!questions.length) return <div className="p-8">Loading assessment...</div>;

  if (completed) {
    const finalScore = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto py-12 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Assessment Complete</h2>
        <div className="text-4xl font-bold mb-6 text-indigo-600">{finalScore}%</div>
        <button 
          onClick={() => navigate(finalScore < 60 ? '/student/navigator/recovery' : '/student/navigator/dashboard')}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
        >
          {finalScore < 60 ? 'View Recovery Plan' : 'Return to Dashboard'}
        </button>
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
        question={questions[currentIdx]} 
        onAnswer={handleAnswer} 
      />
    </div>
  );
};

export default NavigatorAssessment;
