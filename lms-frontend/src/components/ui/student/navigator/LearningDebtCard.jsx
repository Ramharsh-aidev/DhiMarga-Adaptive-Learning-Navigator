import React from 'react';
import { AlertCircle, Target, Zap } from 'lucide-react';

const LearningDebtCard = ({ debtItems = [] }) => {
  if (debtItems.length === 0) {
    return (
      <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Target size={16} className="text-green-500" /> Learning Debt
        </h3>
        <p className="text-sm text-gray-500">No learning debt! Your foundation is solid.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <AlertCircle size={16} className="text-red-500" /> Learning Debt
      </h3>
      <div className="space-y-3">
        {debtItems.map((item) => (
          <div key={item.skillId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-800">{item.skillName}</p>
              <p className="text-xs text-gray-500">Gap: {item.gap}% below threshold</p>
            </div>
            <div className={`px-2 py-1 text-xs font-bold rounded ${item.severity === 'HIGH' ? 'bg-red-100 text-red-700' : item.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
              {item.severity}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningDebtCard;
