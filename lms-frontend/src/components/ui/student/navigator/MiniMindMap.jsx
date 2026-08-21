import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { useNavigator } from '../../../../context/NavigatorContext';

const MiniMindMap = ({ onExpand }) => {
  const { state } = useNavigator();
  const { capabilityGraph, learnerState, currentPath } = state;

  if (!capabilityGraph || !capabilityGraph.nodes || !currentPath.length) {
    return <div className="p-4 text-sm text-gray-500">No active path map available.</div>;
  }

  // Find the root (or current focus). For mini map, we'll just show the next 4 items in the current path.
  const pathItems = currentPath.slice(0, 4);

  return (
    <div className="relative w-full h-full min-h-[120px] bg-slate-50 rounded-xl border border-slate-200 p-4 overflow-hidden flex flex-col justify-center items-center">
      <div className="absolute top-2 right-2 flex gap-1">
        <span className="w-2 h-2 rounded-full bg-green-400"></span>
        <span className="w-2 h-2 rounded-full bg-violet-400"></span>
        <span className="w-2 h-2 rounded-full bg-slate-300"></span>
      </div>

      <div className="flex items-center justify-start w-full overflow-hidden pb-2 pt-2">
        {pathItems.map((node, idx) => {
          const isMastered = learnerState[node.skillId]?.status === 'verified';
          const isCurrent = node.status === 'current';
          const isGap = learnerState[node.skillId]?.status === 'gap';

          let bgColor = 'bg-slate-100 border-slate-200';
          let textColor = 'text-slate-500';
          let Icon = Circle;
          let iconColor = 'text-slate-400';

          if (isMastered) {
            bgColor = 'bg-green-50 border-green-200';
            textColor = 'text-green-800';
            Icon = CheckCircle2;
            iconColor = 'text-green-600';
          } else if (isCurrent) {
            bgColor = 'bg-violet-50 border-violet-300 ring-2 ring-violet-100 shadow-sm font-bold';
            textColor = 'text-violet-800';
            Icon = Clock;
            iconColor = 'text-violet-600';
          } else if (isGap) {
            bgColor = 'bg-rose-50 border-rose-200';
            textColor = 'text-rose-800';
          }

          return (
            <React.Fragment key={node.skillId}>
              <div className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${bgColor} ${textColor} transition-all`}>
                <Icon size={16} className={iconColor} />
                <span className="max-w-[100px] truncate">{node.label}</span>
              </div>
              {idx < pathItems.length - 1 && (
                <div className="shrink-0 h-[2px] w-3 bg-slate-300" />
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {onExpand && (
        <button 
          onClick={onExpand}
          className="mt-2 text-xs font-bold text-violet-600 hover:text-violet-800 transition-colors self-end"
        >
          View Full Map →
        </button>
      )}
    </div>
  );
};

export default MiniMindMap;
