import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, CheckCircle } from 'lucide-react';

const RecoveryCard = ({ recoveryEvent, onStart }) => {
  if (!recoveryEvent) return null;

  const { rootGapSkill, interventionResource, interventionCostMinutes } = recoveryEvent;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-linear-to-br from-rose-50 to-rose-100/50 border border-rose-200 rounded-2xl p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 shadow-sm">
          <AlertCircle size={20} />
        </div>
        <div>
          <h3 className="font-bold text-rose-800">Learning Blockage Detected</h3>
          <p className="text-sm font-medium text-rose-600">Root gap identified: {rootGapSkill.label}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 mb-4 shadow-sm border border-rose-100">
        <h4 className="text-sm font-bold text-slate-800 mb-2">Recommended Minimum Intervention</h4>
        
        {interventionResource ? (
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-violet-700">{interventionResource.title}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-1 font-medium">
                <span className="flex items-center gap-1"><Clock size={12}/> {interventionCostMinutes} min</span>
                <span className="flex items-center gap-1"><CheckCircle size={12}/> High relevance</span>
              </div>
            </div>
            <button 
              onClick={onStart}
              className="px-4 py-2 bg-linear-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:shadow-md hover:shadow-violet-500/30 transition-all flex items-center gap-2 text-sm font-bold shadow-sm"
            >
              <Play size={16} /> Start
            </button>
          </div>
        ) : (
          <p className="text-sm text-slate-600 font-medium">No specific resource found. Please review the material for {rootGapSkill.label}.</p>
        )}
      </div>
      
      <p className="text-xs text-rose-700 text-center font-bold">
        Completing this intervention will restore your mastery and unlock the blocked path.
      </p>
    </motion.div>
  );
};

import { AlertCircle } from 'lucide-react';
export default RecoveryCard;
