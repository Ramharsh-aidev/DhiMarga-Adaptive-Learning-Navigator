import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNavigator } from '../../../context/NavigatorContext';
import ReadinessGauge from '../../../components/ui/student/navigator/ReadinessGauge';
import LearningDebtCard from '../../../components/ui/student/navigator/LearningDebtCard';
import LearnerStatePanel from '../../../components/ui/student/navigator/LearnerStatePanel';
import NextActionCard from '../../../components/ui/student/navigator/NextActionCard';
import CanvasPath from '../../../components/ui/student/navigator/CanvasPath';
import ChatPanel from '../../../components/ui/student/navigator/ChatPanel';
import { calculateLearningDebt, calculateGoalReadiness, diagnoseRootCause } from '../../../engine/learningDebtCalculator';
import { MessageSquare, Clock, CheckCircle2, Circle, AlertCircle, TrendingDown } from 'lucide-react';
import ContentSelectionModal from '../../../components/ui/student/navigator/ContentSelectionModal';
import Layout from '../../../components/layout/Layout';

const NavigatorDashboard = () => {
  const { state, dispatch } = useNavigator();
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    if (state.pathStatus === 'blocked') {
      navigate('/student/navigator/recovery');
    }
  }, [state.pathStatus, navigate]);

  const readiness = calculateGoalReadiness(state.learnerState, state.capabilityGraph, state.currentPath);
  const debtItems = calculateLearningDebt(state.learnerState, state.capabilityGraph, state.currentPath);
  
  // Stats calculation
  const stats = useMemo(() => {
    if (!state.goal || state.pathStatus === 'planning') {
      return { verified: 0, gap: 0, upcoming: 0, totalHours: 0, total: 0 };
    }
    let verified = 0;
    let gap = 0;
    let upcoming = 0;
    let totalHours = 0;
    
    state.currentPath.forEach(node => {
      const ls = state.learnerState[node.skillId];
      if (ls?.status === 'verified') verified++;
      else if (ls?.status === 'gap') gap++;
      else upcoming++;
      
      if (ls?.status !== 'verified') {
        totalHours += node.estimatedHours || 0;
      }
    });
    
    return { verified, gap, upcoming, totalHours, total: state.currentPath.length };
  }, [state.currentPath, state.learnerState, state.goal, state.pathStatus]);

  if (state.isLoadingPaths) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (!state.goal) return <Navigate to="/student/navigator" />;
  if (state.pathStatus === 'planning') return <Navigate to="/student/navigator/plan" />;
  
  if (state.capabilityGraph === null) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (state.capabilityGraph?.error) return (
    <div className="flex items-center justify-center h-full bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-md text-center">
        <AlertCircle size={48} className="mx-auto text-rose-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Oops, something went wrong</h2>
        <p className="text-slate-500 mb-6">We couldn't load your learning path data. This might happen if the path structure is being updated.</p>
        <button onClick={() => navigate('/student/paths')} className="px-6 py-2 bg-violet-600 text-white rounded-xl font-bold">Go to My Paths</button>
      </div>
    </div>
  );

  // Determine current node (first unverified node in path order)
  const currentNode = state.currentPath.find(n => {
    const ls = state.learnerState[n.skillId];
    return !ls || ls.status !== 'verified';
  });

  const rootCauses = useMemo(() => {
    if (!currentNode) return [];
    return diagnoseRootCause(currentNode.skillId, state.learnerState, state.capabilityGraph);
  }, [currentNode, state.learnerState, state.capabilityGraph]);

  const handleStartNextAction = () => {
    if (currentNode) {
      navigate(`/student/navigator/assess/${currentNode.skillId}`);
    }
  };

  const handleSkip = async () => {
    if (currentNode) {
      await dispatch({
        type: 'UPDATE_MASTERY',
        payload: { skillId: currentNode.skillId, masteryScore: 100 }
      });
      await dispatch({ type: 'REPLAN_PATH' });
    }
  };

  const handleSelectContentMode = (mode) => {
    dispatch({ type: 'SET_CONTENT_MODE', payload: mode });
  };

  const activePathsList = state.paths?.filter(p => p.status === 'active') || [];

  return (
    <Layout>
      <div className="flex flex-col h-full bg-gray-50/30">
        {/* Show content selection if not chosen yet */}
        {state.pathStatus === 'active' && !state.goal?.contentMode && (
          <ContentSelectionModal onSelect={handleSelectContentMode} />
        )}
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <button 
                onClick={() => navigate('/student/dashboard')}
                className="hover:text-indigo-600 transition-colors"
              >
                Dashboard
              </button>
              <span>/</span>
              <button 
                onClick={() => navigate('/student/paths')}
                className="hover:text-indigo-600 transition-colors"
              >
                My Paths
              </button>
              <span>/</span>
              <span className="text-gray-900 font-medium">
                {state.goal?.targetRole?.replace('_', ' ') || 'Active Journey'}
              </span>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 p-5 mb-8"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Path Progress</span>
                <span className="text-sm font-bold text-violet-600 bg-violet-50 px-3 py-1 rounded-full">{stats.verified} of {stats.total} skills verified</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-violet-600 via-purple-500 to-pink-500 transition-all duration-1000 ease-out"
                  style={{ width: `${stats.total > 0 ? (stats.verified / stats.total) * 100 : 0}%` }}
                />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-between items-end mb-8"
            >
              <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Active Journey</h1>
                
                {/* Path and Mode Switchers */}
                <div className="flex items-center gap-4 mt-2">
                  {activePathsList.length > 1 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500">Current Path:</span>
                      <select 
                        className="bg-white border border-slate-200 text-sm font-medium rounded-lg px-3 py-1.5 outline-hidden focus:ring-2 focus:ring-violet-500 shadow-sm text-slate-700"
                        value={state.activePathId || ''}
                        onChange={(e) => dispatch({ type: 'SWITCH_PATH', payload: e.target.value })}
                      >
                        {activePathsList.map(p => (
                          <option key={p.id} value={p.id}>{p.goal?.targetRole?.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Content Mode:</span>
                    <select 
                      className="bg-white border border-slate-200 text-sm font-medium rounded-lg px-3 py-1.5 outline-hidden focus:ring-2 focus:ring-violet-500 shadow-sm text-slate-700"
                      value={state.goal?.contentMode || ''}
                      onChange={(e) => handleSelectContentMode(e.target.value)}
                    >
                      <option value="mentor">Mentor-Led</option>
                      <option value="opensource">Open Source</option>
                    </select>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setChatOpen(!chatOpen)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-violet-50 hover:border-violet-200 shadow-sm transition-all hover:text-violet-600"
              >
                <MessageSquare size={18} className="text-violet-500" /> Ask AI Assistant
              </button>
            </motion.div>
            
            {/* Status Pills */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-xl shadow-sm border border-green-100 text-sm">
                <CheckCircle2 size={18} className="text-green-600" />
                <span className="font-semibold text-slate-800">{stats.verified} Verified</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-xl shadow-sm border border-violet-100 text-sm">
                <Circle size={18} className="text-violet-500" />
                <span className="font-semibold text-slate-800">{stats.upcoming} Remaining</span>
              </div>
              {stats.gap > 0 && (
                <div className="flex items-center gap-2 bg-rose-50 px-5 py-2.5 rounded-xl shadow-sm border border-rose-200 text-sm">
                  <AlertCircle size={18} className="text-rose-500" />
                  <span className="font-semibold text-rose-700">{stats.gap} Needs Review</span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-slate-50 px-5 py-2.5 rounded-xl shadow-sm border border-slate-200 text-sm ml-auto">
                <Clock size={18} className="text-slate-500" />
                <span className="font-semibold text-slate-700">~{Math.round(stats.totalHours)}h Estimated</span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8"
            >
              <div className="lg:col-span-2 space-y-6">
                {rootCauses.length > 0 && (
                  <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl shadow-sm flex items-start gap-4">
                    <TrendingDown className="text-rose-500 shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="text-lg font-bold text-rose-900 mb-1">Root Cause Identified</h3>
                      <p className="text-rose-700 mb-3 text-sm">
                        You are struggling with <strong>{currentNode.nodeRef?.label || currentNode.skillId}</strong> because you have foundational gaps in its prerequisites. We recommend addressing these root causes first.
                      </p>
                      <ul className="space-y-2">
                        {rootCauses.map(rc => (
                          <li key={rc.skillId} className="flex items-center gap-2 text-sm font-medium text-rose-800 bg-white/50 px-3 py-2 rounded-lg">
                            <AlertCircle size={16} /> {rc.skillName} (Gap: {rc.gap}%)
                          </li>
                        ))}
                      </ul>
                      <button 
                        onClick={() => dispatch({ type: 'TRIGGER_RECOVERY', payload: currentNode.skillId })}
                        className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
                      >
                        Start Remediation Path
                      </button>
                    </div>
                  </div>
                )}
                <NextActionCard 
                  currentNode={currentNode} 
                  onStart={handleStartNextAction} 
                  onSkip={handleSkip} 
                />
              </div>
              <div>
                <ReadinessGauge readiness={readiness} />
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
              <div className="lg:col-span-2 bg-white/80 backdrop-blur-md rounded-3xl shadow-sm border border-slate-200 p-8">
                <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-100 to-purple-100 flex items-center justify-center text-violet-600 shadow-sm border border-violet-200/50">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  </div>
                  Your Learning Path
                </h3>
                <CanvasPath path={state.currentPath} isEditing={false} />
              </div>
              <div className="space-y-6">
                <LearningDebtCard debtItems={debtItems} />
                {currentNode && <LearnerStatePanel state={state.learnerState[currentNode.skillId] || { status: 'upcoming', evidenceLevel: 'none', masteryScore: 0 }} />}
              </div>
            </div>
          </div>
        </div>
        <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      </div>
    </Layout>
  );
};

export default NavigatorDashboard;
