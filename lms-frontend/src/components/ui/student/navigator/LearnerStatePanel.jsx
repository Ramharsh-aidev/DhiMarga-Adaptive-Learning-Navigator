import React from 'react';
import { motion } from 'framer-motion';

const LearnerStatePanel = ({ state }) => {
  if (!state) return null;

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      <h4 className="text-sm font-bold text-slate-700 mb-3">State Details</h4>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500 font-medium">Mastery Score</span>
            <span className="font-bold text-slate-900">{state.masteryScore || 0}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${state.masteryScore || 0}%` }}
              className="h-full bg-violet-500"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500 font-medium">Confidence Score</span>
            <span className="font-bold text-slate-900">{state.confidenceScore || 0}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${state.confidenceScore || 0}%` }}
              className="h-full bg-purple-500"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500 font-medium">
            Evidence Level: <span className="font-bold text-slate-800 capitalize">{state.evidenceLevel || 'none'}</span>
          </p>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Status: <span className="font-bold text-slate-800 capitalize">{state.status || 'unverified'}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LearnerStatePanel;
