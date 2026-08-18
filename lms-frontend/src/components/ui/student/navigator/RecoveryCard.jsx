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
      className="bg-linear-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
          <AlertCircle size={20} />
        </div>
        <div>
          <h3 className="font-bold text-red-800">Learning Blockage Detected</h3>
          <p className="text-sm text-red-600">Root gap identified: {rootGapSkill.label}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 mb-4 shadow-xs border border-red-100">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Recommended Minimum Intervention</h4>
        
        {interventionResource ? (
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-indigo-700">{interventionResource.title}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                <span className="flex items-center gap-1"><Clock size={12}/> {interventionCostMinutes} min</span>
                <span className="flex items-center gap-1"><CheckCircle size={12}/> High relevance</span>
              </div>
            </div>
            <button 
              onClick={onStart}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
            >
              <Play size={16} /> Start
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-600">No specific resource found. Please review the material for {rootGapSkill.label}.</p>
        )}
      </div>
      
      <p className="text-xs text-red-700 text-center">
        Completing this intervention will restore your mastery and unlock the blocked path.
      </p>
    </motion.div>
  );
};

import { AlertCircle } from 'lucide-react';
export default RecoveryCard;
