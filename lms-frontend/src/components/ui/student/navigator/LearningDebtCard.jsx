import React from 'react';
import { motion } from 'framer-motion';
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

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemAnim = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
        <AlertCircle size={16} className="text-rose-500" /> Learning Debt
      </h3>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
        {debtItems.map((item) => (
          <motion.div 
            variants={itemAnim}
            key={item.skillId} 
            className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-rose-200 transition-colors"
          >
            <div>
              <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                {item.skillName}
                {item.type === 'BLOCKING' && <span className="px-1.5 py-0.5 text-[10px] bg-red-100 text-red-600 rounded font-bold uppercase tracking-wider">Blocking</span>}
                {item.type === 'WEAK' && <span className="px-1.5 py-0.5 text-[10px] bg-amber-100 text-amber-600 rounded font-bold uppercase tracking-wider">Weak</span>}
              </p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Gap: {item.gap}% below threshold</p>
              {item.blockedSkills && item.blockedSkills.length > 0 && (
                <p className="text-[10px] text-rose-500 font-semibold mt-1">
                  Blocks {item.blockedSkills.length} active/upcoming skill(s)
                </p>
              )}
            </div>
            <div className={`px-2 py-1 text-xs font-bold rounded ${item.severity === 'HIGH' ? 'bg-rose-100 text-rose-700' : item.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'}`}>
              {item.severity} RISK
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default LearningDebtCard;
