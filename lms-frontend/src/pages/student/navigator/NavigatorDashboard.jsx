import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useNavigator } from '../../../context/NavigatorContext';
import ReadinessGauge from '../../../components/ui/student/navigator/ReadinessGauge';
import LearningDebtCard from '../../../components/ui/student/navigator/LearningDebtCard';
import LearnerStatePanel from '../../../components/ui/student/navigator/LearnerStatePanel';
import NextActionCard from '../../../components/ui/student/navigator/NextActionCard';
import CanvasPath from '../../../components/ui/student/navigator/CanvasPath';
import ChatPanel from '../../../components/ui/student/navigator/ChatPanel';
import { calculateLearningDebt, calculateGoalReadiness } from '../../../engine/learningDebtCalculator';
import { classifySkillState } from '../../../engine/blockageDetector';
import { MessageSquare } from 'lucide-react';
import ContentSelectionModal from '../../../components/ui/student/navigator/ContentSelectionModal';

const NavigatorDashboard = () => {
  const { state, dispatch } = useNavigator();
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    if (state.pathStatus === 'blocked') {
      navigate('/student/navigator/recovery');
    }
  }, [state.pathStatus, navigate]);

  if (!state.goal) return <Navigate to="/student/navigator" />;
  if (state.pathStatus === 'planning') return <Navigate to="/student/navigator/plan" />;

  const readiness = calculateGoalReadiness(state.learnerState, state.capabilityGraph);
  const debtItems = calculateLearningDebt(state.learnerState, state.capabilityGraph);
  
  const currentNode = state.currentPath.find(n => n.status === 'current');

  const handleStartNextAction = () => {
    if (currentNode) {
      navigate(`/student/navigator/assess/${currentNode.skillId}`);
    }
  };

  const handleSelectContentMode = (mode) => {
    dispatch({ type: 'SET_CONTENT_MODE', payload: mode });
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Show content selection if not chosen yet */}
      {state.pathStatus === 'active' && !state.goal?.contentMode && (
        <ContentSelectionModal onSelect={handleSelectContentMode} />
      )}
      
      <div className="flex-1 overflow-y-auto bg-gray-50/30 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Active Journey</h1>
            <button 
              onClick={() => setChatOpen(!chatOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <MessageSquare size={18} /> Ask AI
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <NextActionCard currentNode={currentNode} onStart={handleStartNextAction} />
            </div>
            <div>
              <ReadinessGauge readiness={readiness} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Your Path</h3>
              <CanvasPath path={state.currentPath} isEditing={false} />
            </div>
            <div className="space-y-6">
              <LearningDebtCard debtItems={debtItems} />
              {currentNode && <LearnerStatePanel state={state.learnerState[currentNode.skillId]} />}
            </div>
          </div>
        </div>
      </div>
      <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default NavigatorDashboard;
