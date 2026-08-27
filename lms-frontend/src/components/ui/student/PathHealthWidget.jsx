import React, { useMemo } from 'react';
import { useNavigator } from '../../../context/NavigatorContext';

export default function PathHealthWidget() {
  const { state } = useNavigator();

  const { debt, activeGaps, progress, hoursSaved, pathEfficiency, recoveryEfficiency } = useMemo(() => {
    if (!state || !state.currentPath || !state.learnerState) {
      return { debt: 0, activeGaps: 0, progress: 0, hoursSaved: 0 };
    }

    let debtCalc = 0;
    let gapsCount = 0;
    let completedCount = 0;
    let saved = 0;

    state.currentPath.forEach(node => {
      const ls = state.learnerState[node.skillId];
      if (ls?.status === 'gap') {
        gapsCount++;
        // Very basic debt calc for the dashboard: 1 gap = 2 debt points
        debtCalc += 2; 
      }
      if (ls?.status === 'verified' || ls?.status === 'completed') {
        completedCount++;
        if (ls?.evidenceLevel === 'strong_recovery') {
          // Average 2.25 hours saved per gap recovery
          saved += 2.25; 
        }
      }
    });

    const prog = state.currentPath.length > 0 
      ? Math.round((completedCount / state.currentPath.length) * 100) 
      : 0;

    const recoveredCount = saved / 2.25;
    const pathEfficiency = Math.round(Math.max(0, 100 - (debtCalc / Math.max(1, completedCount)) * 10));
    const recoveryEfficiency = Math.round(recoveredCount === 0 && gapsCount === 0 ? 100 : (recoveredCount / Math.max(1, recoveredCount + gapsCount)) * 100);

    return { 
      debt: debtCalc, 
      activeGaps: gapsCount, 
      progress: prog, 
      hoursSaved: saved.toFixed(1),
      pathEfficiency,
      recoveryEfficiency
    };
  }, [state]);

  // Calculate health score (0-100) based on debt and gaps
  // 100 is perfect health. Deduct 10 points per gap, and 5 points per unit of debt.
  const healthScore = Math.max(0, 100 - (activeGaps * 10) - (debt * 5));
  
  let healthColor = 'text-green-500';
  let healthBg = 'bg-green-500';
  let healthLabel = 'Excellent';
  if (healthScore < 70) {
    healthColor = 'text-amber-500';
    healthBg = 'bg-amber-500';
    healthLabel = 'Fair';
  }
  if (healthScore < 40) {
    healthColor = 'text-rose-500';
    healthBg = 'bg-rose-500';
    healthLabel = 'Needs Attention';
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800">Path Health & Efficiency</h3>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className={`text-xl font-black ${healthColor}`}>{healthScore}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{healthLabel}</div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-100 flex items-center justify-center relative">
            <svg className="w-12 h-12 absolute -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={healthColor}
                strokeDasharray={`${healthScore}, 100`}
                strokeWidth="3"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 grow mb-6">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-center">
          <div className="text-sm text-slate-500 font-medium mb-1 flex items-center justify-between">
            Learning Debt
          </div>
          <div className="text-2xl font-black text-slate-700">{debt} <span className="text-sm text-slate-400 font-normal">pts</span></div>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-center">
          <div className="text-sm text-slate-500 font-medium mb-1 flex items-center justify-between">
            Active Gaps
          </div>
          <div className={`text-2xl font-black ${activeGaps > 0 ? 'text-amber-500' : 'text-slate-700'}`}>{activeGaps}</div>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-center">
          <div className="text-sm text-slate-500 font-medium mb-1 flex items-center justify-between">
            Path Efficiency
          </div>
          <div className="text-2xl font-black text-indigo-500">{pathEfficiency}%</div>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-center">
          <div className="text-sm text-slate-500 font-medium mb-1 flex items-center justify-between">
            Recovery Rate
          </div>
          <div className="text-2xl font-black text-sky-500">{recoveryEfficiency}%</div>
        </div>
        <div className="p-4 bg-green-50 rounded-xl border border-green-100 flex flex-col justify-center relative overflow-hidden md:col-span-2 lg:col-span-1">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-green-500/10 rounded-full blur-xl"></div>
          <div className="text-sm text-green-700 font-medium mb-1">
            Unnecessary Learning Avoided
          </div>
          <div className="text-2xl font-black text-green-600">{hoursSaved} <span className="text-sm font-bold">hrs saved</span></div>
          <div className="text-xs text-green-600/80 mt-1 font-medium">via AI gap recovery vs generic course</div>
        </div>
      </div>

      <button 
        onClick={() => {
          // Trigger AI intervention analysis modal with real state data
          window.dispatchEvent(new CustomEvent('OPEN_AI_INTERVENTION_MODAL', {
            detail: { debt, activeGaps, progress }
          }));
        }}
        className="w-full py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
      >
        <span className="text-violet-200">✨</span> Analyze Path Interventions
      </button>
    </div>
  );
}
