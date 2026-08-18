import React from 'react';
import { motion } from 'framer-motion';

const LearnerStatePanel = ({ state }) => {
  if (!state) return null;

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">State Details</h4>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Mastery Score</span>
            <span className="font-medium">{state.masteryScore || 0}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${state.masteryScore || 0}%` }}
              className="h-full bg-blue-500"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Confidence Score</span>
            <span className="font-medium">{state.confidenceScore || 0}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${state.confidenceScore || 0}%` }}
              className="h-full bg-purple-500"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-gray-50">
          <p className="text-xs text-gray-500">
            Evidence Level: <span className="font-medium text-gray-800 capitalize">{state.evidenceLevel || 'none'}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Status: <span className="font-medium text-gray-800 capitalize">{state.status || 'unverified'}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LearnerStatePanel;
