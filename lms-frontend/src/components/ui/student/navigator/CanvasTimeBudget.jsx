import React from 'react';

const CanvasTimeBudget = ({ currentHours, maxHours }) => {
  const percentage = Math.min(100, (currentHours / maxHours) * 100);
  const isOver = currentHours > maxHours;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h4 className="text-sm font-semibold text-gray-700">Time Budget</h4>
          <p className="text-xs text-gray-500">Based on your available hours</p>
        </div>
        <div className="text-right">
          <span className={`text-lg font-bold ${isOver ? 'text-red-600' : 'text-indigo-600'}`}>
            {Math.round(currentHours)}h
          </span>
          <span className="text-sm text-gray-500"> / {maxHours}h</span>
        </div>
      </div>
      
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
        <div 
          className={`h-full transition-all duration-500 ${isOver ? 'bg-red-500' : 'bg-indigo-500'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {isOver && (
        <p className="text-xs text-red-500 mt-2">
          Your path exceeds your available time. Ask the AI to optimize it.
        </p>
      )}
    </div>
  );
};

export default CanvasTimeBudget;
