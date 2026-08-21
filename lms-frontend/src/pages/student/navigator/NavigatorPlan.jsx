import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useNavigator } from '../../../context/NavigatorContext';
import CanvasPath from '../../../components/ui/student/navigator/CanvasPath';
import MindMap from '../../../components/ui/student/navigator/MindMap';
import CanvasTimeBudget from '../../../components/ui/student/navigator/CanvasTimeBudget';
import ChatPanel from '../../../components/ui/student/navigator/ChatPanel';
import { MessageSquare, Play, ArrowLeft } from 'lucide-react';

const NavigatorPlan = () => {
  const { state, dispatch } = useNavigator();
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(true);
  const [viewMode, setViewMode] = useState('mindmap');

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
        <div className="w-full h-full flex flex-col mx-auto">
          <button 
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-4 transition-colors w-fit"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          
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

          <div className="mb-8">
            <CanvasTimeBudget currentHours={totalHours} maxHours={state.goal.totalBudgetHours} />
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col flex-1 min-h-[500px]">
            <div className="flex justify-between items-center p-6 pb-4 shrink-0 border-b border-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">Learning Sequence</h3>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-xs' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  List View
                </button>
                <button
                  onClick={() => setViewMode('mindmap')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${viewMode === 'mindmap' ? 'bg-white text-indigo-600 shadow-xs' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Mind Map
                </button>
              </div>
            </div>
            
            <div className="flex-1 min-h-0 relative bg-gray-50/30 rounded-b-xl overflow-hidden">
              {viewMode === 'list' ? (
                <div className="absolute inset-0 overflow-y-auto p-6 pr-4">
                  <CanvasPath path={state.currentPath} isEditing={true} />
                </div>
              ) : (
                <div className="absolute inset-0">
                  <MindMap />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Chat Panel */}
      <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default NavigatorPlan;
