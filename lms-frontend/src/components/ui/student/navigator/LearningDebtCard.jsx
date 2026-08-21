import React from 'react';
import { AlertCircle, Target, Zap } from 'lucide-react';

const LearningDebtCard = ({ debtItems = [] }) => {
  if (debtItems.length === 0) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
          <Target size={16} className="text-green-500" /> Learning Debt
        </h3>
        <p className="text-sm text-slate-500 font-medium">No learning debt! Your foundation is solid.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
        <AlertCircle size={16} className="text-rose-500" /> Learning Debt
      </h3>
      <div className="space-y-3">
        {debtItems.map((item) => (
          <div key={item.skillId} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <p className="text-sm font-bold text-slate-800">{item.skillName}</p>
              <p className="text-xs text-slate-500 font-medium">Gap: {item.gap}% below threshold</p>
            </div>
            <div className={`px-2 py-1 text-xs font-bold rounded ${item.severity === 'HIGH' ? 'bg-rose-100 text-rose-700' : item.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
              {item.severity}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningDebtCard;
