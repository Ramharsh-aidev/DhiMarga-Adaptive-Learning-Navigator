import React from 'react';

const CanvasTimeBudget = ({ currentHours, maxHours }) => {
  const percentage = Math.min(100, (currentHours / maxHours) * 100);
  const isOver = currentHours > maxHours;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h4 className="text-sm font-bold text-slate-700">Time Budget</h4>
          <p className="text-xs text-slate-500 font-medium">Based on your available hours</p>
        </div>
        <div className="text-right">
          <span className={`text-lg font-bold ${isOver ? 'text-rose-600' : 'text-violet-600'}`}>
            {Math.round(currentHours)}h
          </span>
          <span className="text-sm text-slate-500 font-medium"> / {maxHours}h</span>
        </div>
      </div>
      
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
        <div 
          className={`h-full transition-all duration-500 ${isOver ? 'bg-rose-500' : 'bg-violet-500'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {isOver && (
        <p className="text-xs text-rose-500 mt-2 font-medium">
          Your path exceeds your available time. Ask the AI to optimize it.
        </p>
      )}
    </div>
  );
};

export default CanvasTimeBudget;
