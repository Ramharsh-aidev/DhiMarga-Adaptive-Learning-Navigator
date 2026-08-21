import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle, GripVertical, X, PlayCircle, ExternalLink } from 'lucide-react';
import { useNavigator } from '../../../../context/NavigatorContext';

const CanvasNode = ({ item, isDraggable = false }) => {
  const { state, dispatch } = useNavigator();
  const { nodeRef, estimatedHours, isUserAdded } = item;

  // Determine actual status based on learner state
  const ls = state.learnerState[item.skillId];
  const isVerified = ls?.status === 'verified';
  const isGap = ls?.status === 'gap';
  
  // Is this the first unverified item?
  const currentPathNode = state.currentPath.find(n => !state.learnerState[n.skillId] || state.learnerState[n.skillId].status !== 'verified');
  const isCurrent = currentPathNode?.skillId === item.skillId;

  // Derive display status
  let displayStatus = 'upcoming';
  if (isVerified) displayStatus = 'completed';
  else if (isCurrent) displayStatus = 'current';
  else if (isGap) displayStatus = 'blocked';

  const statusConfig = {
    completed: { color: 'bg-green-50 border-green-200', text: 'text-green-700', icon: CheckCircle2, ring: 'border-green-500' },
    current: { color: 'bg-violet-50 border-violet-300 shadow-md', text: 'text-violet-800', icon: Clock, ring: 'border-violet-500 ring-4 ring-violet-100' },
    upcoming: { color: 'bg-white border-slate-200', text: 'text-slate-600', icon: Clock, ring: 'border-slate-300' },
    blocked: { color: 'bg-rose-50 border-rose-300', text: 'text-rose-800', icon: AlertCircle, ring: 'border-rose-400' },
  };

  const config = statusConfig[displayStatus] || statusConfig.upcoming;
  const Icon = config.icon;

  const handleRemove = () => {
    dispatch({ type: 'REMOVE_SKILL_FROM_PATH', payload: item.skillId });
  };

  return (
    <div className="relative flex items-stretch gap-4 py-3 group">
      
      {/* Timeline Graphic */}
      <div className="relative flex flex-col items-center justify-start pt-4 w-6">
        <div className={`w-4 h-4 rounded-full border-2 bg-white z-10 transition-colors ${config.ring}`} />
        <div className="absolute top-8 bottom-[-16px] w-0.5 bg-slate-200 group-last:bg-transparent" />
      </div>

      {/* Node Card */}
      <div className={`flex-1 flex flex-col sm:flex-row items-start sm:items-center p-4 rounded-2xl border transition-all duration-200 ${config.color} ${isCurrent ? 'scale-[1.02]' : 'hover:border-violet-300 hover:shadow-sm'}`}>
        
        {isDraggable && (
          <div className="mr-3 cursor-grab text-slate-400 hover:text-violet-600 transition-colors">
            <GripVertical size={18} />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-bold text-base truncate ${config.text}`}>
              {nodeRef?.label || item.skillId}
            </h4>
            {isVerified && <Icon size={16} className="text-green-500 shrink-0" />}
            {isGap && <Icon size={16} className="text-rose-500 shrink-0" />}
            {isUserAdded && (
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-bold border border-violet-200">Added</span>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-xs opacity-80 mt-1.5 font-medium">
            <span className="bg-white/60 px-2 py-1 rounded-md">{nodeRef?.category || 'Topic'}</span>
            <span className="flex items-center gap-1"><Clock size={12}/> ~{Math.round(estimatedHours)}h</span>
            
            {item.selectedResource?.url && (
              <a 
                href={item.selectedResource.url} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1 text-violet-600 hover:text-violet-800 transition-colors bg-violet-50 hover:bg-violet-100 px-2 py-1 rounded-md"
              >
                <ExternalLink size={12} /> Material
              </a>
            )}
          </div>
        </div>

        <div className="mt-4 sm:mt-0 sm:ml-4 flex items-center gap-3 shrink-0">
          {displayStatus === 'current' && (
            <a 
              href={`/student/navigator/assess/${item.skillId}`}
              className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl bg-linear-to-r from-violet-600 via-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-violet-500/20 font-bold transition-all shadow-sm"
              title="Take assessment"
            >
              <PlayCircle size={16} /> Start
            </a>
          )}
          
          {displayStatus !== 'current' && displayStatus !== 'completed' && (
             <a 
               href={`/student/navigator/assess/${item.skillId}`}
               className="text-xs px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-violet-600 hover:border-violet-300 font-bold transition-colors"
             >
               Verify
             </a>
          )}
          
          {isDraggable && displayStatus !== 'completed' && (
            <button 
              onClick={handleRemove} 
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CanvasNode;
