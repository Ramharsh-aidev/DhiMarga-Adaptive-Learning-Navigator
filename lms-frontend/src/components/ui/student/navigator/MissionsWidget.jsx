import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle2, AlertCircle, Clock, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { diagnoseRootCause } from '../../../../engine/learningDebtCalculator';

const MissionsWidget = ({ state, dispatch, currentNode }) => {
  const navigate = useNavigate();

  // Root cause diagnosis for the current node (if it's a gap)
  const rootCauses = useMemo(() => {
    if (!currentNode || state.learnerState[currentNode.skillId]?.status !== 'gap') return [];
    return diagnoseRootCause(currentNode.skillId, state.learnerState, state.capabilityGraph);
  }, [currentNode, state.learnerState, state.capabilityGraph]);

  const isGap = state.learnerState[currentNode?.skillId]?.status === 'gap';

  const handleStart = () => {
    if (currentNode) {
      navigate(`/student/navigator/assess/${currentNode.skillId}`);
    }
  };

  if (!currentNode) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-sm">
        <CheckCircle2 size={48} className="mx-auto text-green-500 mb-4" />
        <h3 className="text-2xl font-bold text-slate-900 mb-2">All Caught Up!</h3>
        <p className="text-slate-500">You have no active missions. Take a break or start a new path.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Root Cause Alert */}
      {rootCauses.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rose-50 border border-rose-200 p-5 rounded-2xl shadow-sm flex items-start gap-4"
        >
          <AlertCircle className="text-rose-500 shrink-0 mt-1" size={24} />
          <div>
            <h3 className="text-lg font-bold text-rose-900 mb-1">Foundational Debt Detected</h3>
            <p className="text-rose-700 mb-3 text-sm">
              You are blocked on <strong>{currentNode.nodeRef?.label || currentNode.skillId}</strong> because you have foundational gaps in its prerequisites. We recommend addressing these root causes first.
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
        </motion.div>
      )}

      {/* Main Mission Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-slate-200 rounded-3xl p-1 overflow-hidden shadow-xl shadow-violet-500/5"
      >
        <div className={`rounded-[22px] p-8 sm:p-10 relative overflow-hidden ${
          isGap ? 'bg-linear-to-br from-rose-50 to-orange-50' : 'bg-linear-to-br from-violet-50 to-purple-50'
        }`}>
          
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-40 blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-8">
            <div className="flex-1 max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-sm border flex items-center gap-1.5 ${
                  isGap ? 'bg-white text-rose-600 border-rose-100' : 'bg-white text-violet-600 border-violet-100'
                }`}>
                  <Target size={14} />
                  {isGap ? 'Recovery Mission' : 'Mastery Mission'}
                </span>
                <span className="text-slate-500 text-sm font-medium flex items-center gap-1">
                  <Clock size={14} /> ~{Math.round(currentNode.estimatedHours || 3)}h Focus
                </span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
                {currentNode.nodeRef?.label || currentNode.skillId}
              </h2>
              
              <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed mb-6">
                {isGap 
                  ? 'This skill is currently blocking your progress. Review the material and clear your learning debt to unlock the rest of your journey.'
                  : 'Master this topic to continue advancing on your personalized learning journey. Ready to dive in?'}
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-4 w-full md:w-auto mt-4 md:mt-0 bg-white/60 p-6 rounded-2xl border border-white backdrop-blur-md shadow-sm">
              <p className="text-sm text-slate-600 font-bold text-center mb-1">
                {isGap ? 'Ready to recover?' : 'Ready for the test?'}
              </p>
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
                  className={`absolute inset-0 rounded-full blur-md pointer-events-none ${isGap ? 'bg-rose-400' : 'bg-violet-400'}`}
                />
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStart}
                  className={`relative w-20 h-20 text-white rounded-full flex items-center justify-center shadow-lg transition-shadow shrink-0 group z-10 ${
                    isGap 
                      ? 'bg-linear-to-r from-rose-500 to-orange-500 shadow-rose-500/30' 
                      : 'bg-linear-to-r from-violet-600 via-purple-500 to-pink-500 shadow-violet-500/30'
                  }`}
                  title={isGap ? "Start Recovery" : "Start Assessment"}
                >
                  <Play size={32} className="ml-2 group-hover:text-white/80 transition-colors" fill="currentColor" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MissionsWidget;
