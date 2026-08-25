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

  const handleStartRecovery = async () => {
    // In reality, this would navigate to a content player for the resource
    // For prototype, we'll auto-resolve it
    alert('Simulating recovery intervention completion...');
    
    // Auto-verify the skill to clear blockage
    await dispatch({
      type: 'UPDATE_MASTERY',
      payload: { skillId: blockedNode.skillId, masteryScore: 100 }
    });
    
    await dispatch({ type: 'SET_PATH_STATUS', payload: 'active' });
    await dispatch({ type: 'REPLAN_PATH' });
    navigate('/student/navigator/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Adaptive Recovery</h1>
        <p className="text-slate-600 font-medium">We detected a blockage in your learning path. Instead of restarting you, we've found the minimum required intervention.</p>
      </div>

      <RecoveryCard recoveryEvent={mockRecoveryEvent} onStart={handleStartRecovery} />
      
      <div className="mt-8 text-center">
        <button 
          onClick={async () => {
            await dispatch({ type: 'SET_PATH_STATUS', payload: 'active' });
            navigate('/student/navigator/dashboard');
          }}
          className="text-slate-500 text-sm font-bold hover:text-slate-800 underline transition-colors"
        >
          Ignore and continue anyway (Not recommended)
        </button>
      </div>
    </div>
  );
};

export default NavigatorRecovery;
