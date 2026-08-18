import React from 'react';
import { motion } from 'framer-motion';

const ReadinessGauge = ({ readiness }) => {
  // Simple circular gauge using SVG
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (readiness / 100) * circumference;

  let color = 'text-red-500';
  if (readiness >= 75) color = 'text-green-500';
  else if (readiness >= 50) color = 'text-blue-500';
  else if (readiness >= 25) color = 'text-yellow-500';

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Goal Readiness</h3>
      <div className="relative flex items-center justify-center">
        <svg className="transform -rotate-90 w-32 h-32">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-gray-100"
          />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
            className={color}
          />
        </svg>
        <div className="absolute text-3xl font-bold text-gray-800">
          {readiness}%
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-4 text-center">
        Based on verified mastery vs required thresholds.
      </p>
    </div>
  );
};

export default ReadinessGauge;
