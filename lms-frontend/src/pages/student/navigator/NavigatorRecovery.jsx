import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useNavigator } from '../../../context/NavigatorContext';
import RecoveryCard from '../../../components/ui/student/navigator/RecoveryCard';

const NavigatorRecovery = () => {
  const { state, dispatch } = useNavigator();
  const navigate = useNavigate();

  if (state.pathStatus !== 'blocked') {
    return <Navigate to="/student/navigator/dashboard" />;
  }

  // Find the first blocking node for prototype purposes
  const blockedNode = state.currentPath.find(n => n.status === 'blocked') || state.currentPath[0];
  
  // Dummy recovery event
  const mockRecoveryEvent = {
    rootGapSkill: blockedNode.nodeRef || { label: 'Unknown prerequisite' },
    interventionResource: { title: 'Emergency Review Session', durationMinutes: 30 },
    interventionCostMinutes: 30
  };

  const handleStartRecovery = () => {
    // In reality, this would navigate to a content player for the resource
    // For prototype, we'll auto-resolve it
    alert('Simulating recovery intervention completion...');
    
    // Auto-verify the skill to clear blockage
    dispatch({
      type: 'UPDATE_MASTERY',
      payload: { skillId: blockedNode.skillId, masteryScore: 100 }
    });
    
    dispatch({ type: 'SET_PATH_STATUS', payload: 'active' });
    dispatch({ type: 'REPLAN_PATH' });
    navigate('/student/navigator/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Adaptive Recovery</h1>
        <p className="text-gray-600">We detected a blockage in your learning path. Instead of restarting you, we've found the minimum required intervention.</p>
      </div>

      <RecoveryCard recoveryEvent={mockRecoveryEvent} onStart={handleStartRecovery} />
      
      <div className="mt-8 text-center">
        <button 
          onClick={() => {
            dispatch({ type: 'SET_PATH_STATUS', payload: 'active' });
            navigate('/student/navigator/dashboard');
          }}
          className="text-gray-500 text-sm hover:text-gray-800 underline"
        >
          Ignore and continue anyway (Not recommended)
        </button>
      </div>
    </div>
  );
};

export default NavigatorRecovery;
