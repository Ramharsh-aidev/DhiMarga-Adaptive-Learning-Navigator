import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useNavigator } from '../../../context/NavigatorContext';
import CanvasPath from '../../../components/ui/student/navigator/CanvasPath';
import CanvasTimeBudget from '../../../components/ui/student/navigator/CanvasTimeBudget';
import ChatPanel from '../../../components/ui/student/navigator/ChatPanel';
import { MessageSquare, Play } from 'lucide-react';

const NavigatorPlan = () => {
  const { state, dispatch } = useNavigator();
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(true);

  if (!state.goal || !state.capabilityGraph) {
    return <Navigate to="/student/navigator" />;
  }

  // Calculate current hours
  const totalHours = state.currentPath.reduce((acc, item) => {
    if (item.status !== 'skipped') return acc + item.estimatedHours;
    return acc;
  }, 0);

  const handleStart = () => {
    dispatch({ type: 'SET_PATH_STATUS', payload: 'active' });
    navigate('/student/navigator/dashboard');
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Main Canvas Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50/30 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Learning Path</h1>
              <p className="text-gray-600">
                Target: <span className="font-semibold text-indigo-600">{state.goal.targetRole.replace('_', ' ')}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setChatOpen(!chatOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <MessageSquare size={18} /> Chat with AI
              </button>
              <button 
                onClick={handleStart}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-md"
              >
                <Play size={18} /> Start Journey
              </button>
            </div>
          </div>

          <CanvasTimeBudget currentHours={totalHours} maxHours={state.goal.totalBudgetHours} />
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Learning Sequence</h3>
            <CanvasPath path={state.currentPath} isEditing={true} />
          </div>
        </div>
      </div>

      {/* Persistent Chat Panel */}
      <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default NavigatorPlan;
