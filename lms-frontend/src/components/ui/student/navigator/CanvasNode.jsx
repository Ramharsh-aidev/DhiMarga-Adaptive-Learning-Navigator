import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle, GripVertical, X, PlayCircle, ExternalLink, Lock } from 'lucide-react';
import { useNavigator } from '../../../../context/NavigatorContext';

const CanvasNode = ({ item, isDraggable = false, isTreeMode = false }) => {
  const { state, dispatch } = useNavigator();
  const { nodeRef, estimatedHours, isUserAdded } = item;

  // Determine actual status based on learner state
  const ls = state.learnerState[item.skillId];
  const isVerified = ls?.status === 'verified';
  const isGap = ls?.status === 'gap';
  const isSkipped = ls?.status === 'skipped' || item.status === 'skipped';
  
  // Is this the first unverified item?
  const currentPathNode = state.currentPath.find(n => {
    const s = state.learnerState[n.skillId]?.status;
    return !s || (s !== 'verified' && s !== 'skipped');
  });
  const isCurrent = currentPathNode?.skillId === item.skillId && !isSkipped && !isVerified;

  // Derive display status
  let displayStatus = 'upcoming';
  if (item.draftStatus) displayStatus = item.draftStatus;
  else if (isSkipped) displayStatus = 'skipped';
  else if (isVerified) displayStatus = 'completed';
  else if (isCurrent) displayStatus = 'current';
  else if (isGap) displayStatus = 'blocked';

  const statusConfig = {
    completed: { color: 'bg-green-50 border-green-200', text: 'text-green-700', icon: CheckCircle2, ring: 'border-green-500' },
    current: { color: 'bg-violet-50 border-violet-300 shadow-md', text: 'text-violet-800', icon: Clock, ring: 'border-violet-500 ring-4 ring-violet-100' },
    upcoming: { color: 'bg-white border-slate-200', text: 'text-slate-600', icon: Clock, ring: 'border-slate-300' },
    blocked: { color: 'bg-rose-50 border-rose-300', text: 'text-rose-800', icon: AlertCircle, ring: 'border-rose-400' },
    pending_removal: { color: 'bg-slate-100 border-slate-300 opacity-50 saturate-50', text: 'text-slate-400 line-through', icon: X, ring: 'border-slate-300' },
    skipped: { color: 'bg-slate-100 border-slate-300 opacity-50 saturate-50', text: 'text-slate-400 line-through', icon: X, ring: 'border-slate-300' },
    pending_addition: { color: 'bg-amber-50 border-amber-300 ring-2 ring-amber-100', text: 'text-amber-800', icon: Clock, ring: 'border-amber-400' },
  };

  const config = statusConfig[displayStatus] || statusConfig.upcoming;
  const Icon = config.icon;

  const handleRemove = () => {
    dispatch({ type: 'REMOVE_SKILLS_FROM_PATH', payload: [item.skillId], meta: { isDraft: true } });
  };

  return (
    <div className={`relative flex items-stretch py-3 group ${isTreeMode ? 'gap-0' : 'gap-4'}`}>
      
      {/* Timeline Graphic (hidden in tree mode on md+ screens, or entirely if preferred. Let's hide entirely in tree mode) */}
      {!isTreeMode && (
        <div className="relative flex flex-col items-center justify-start pt-4 w-6">
          <div className={`w-4 h-4 rounded-full border-2 bg-white z-10 transition-colors ${config.ring}`} />
          <div className="absolute top-8 bottom-[-16px] w-0.5 bg-slate-200 group-last:bg-transparent" />
        </div>
      )}

      {/* Node Card */}
      {/* Node Card */}
      {isTreeMode ? (
        <div className={`relative flex flex-col w-[300px] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border ${
          isCurrent ? 'border-violet-400 ring-2 ring-violet-200 scale-[1.02]' : isVerified ? 'border-green-200' : 'border-slate-200'
        }`}>
          {/* Top Half */}
          <div className={`px-5 py-6 ${
            item.draftStatus === 'pending_addition' ? 'bg-linear-to-r from-amber-400 to-amber-500'
            : (item.draftStatus === 'pending_removal' || displayStatus === 'skipped') ? 'bg-slate-200 opacity-50 saturate-50'
            : isVerified ? 'bg-linear-to-r from-emerald-400 to-green-500' 
            : isCurrent ? 'bg-linear-to-r from-violet-500 to-purple-600' 
            : isGap ? 'bg-linear-to-r from-rose-400 to-red-500'
            : 'bg-slate-300'
          } ${(item.draftStatus === 'pending_removal' || displayStatus === 'skipped') ? 'text-slate-400 line-through' : 'text-white'}`}>
            <h4 className="font-bold text-lg leading-tight pr-12 line-clamp-2 shadow-black/10 text-shadow-sm">
              {nodeRef?.label || item.skillId}
            </h4>
          </div>
          
          {/* Bottom Half */}
          <div className="bg-white px-5 py-4 flex items-center justify-between">
            <div className="flex flex-col gap-1.5 text-xs font-bold text-slate-500">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Time:</span>
                <span className="text-slate-700 flex items-center gap-1"><Clock size={12}/> {Math.round(estimatedHours)}h</span>
              </div>
              {item.selectedResource?.url && (
                <a 
                  href={item.selectedResource.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-violet-600 hover:text-violet-800 transition-colors mt-1"
                >
                  <PlayCircle size={14} className="fill-violet-100" /> Watch Video
                </a>
              )}
            </div>
          </div>

          {/* Action Button Overlapping */}
          <div className="absolute right-4 top-[50%] transform -translate-y-1/2">
            {displayStatus === 'current' && (
              <a 
                href={`/student/navigator/assess/${item.skillId}`}
                className="w-14 h-14 rounded-full bg-white text-violet-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform group"
                title="Start Assessment"
              >
                <PlayCircle size={32} className="group-hover:text-violet-500 fill-violet-100" />
              </a>
            )}
            
            {displayStatus === 'upcoming' && (
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center shadow-sm cursor-not-allowed">
                <Lock size={24} />
              </div>
            )}

            {(displayStatus === 'skipped' || item.draftStatus === 'pending_removal') && (
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-300 border border-slate-200 flex items-center justify-center shadow-sm cursor-not-allowed">
                <X size={24} />
              </div>
            )}

            {displayStatus === 'completed' && (
              <div className="w-14 h-14 rounded-full bg-green-50 text-green-500 border border-green-200 flex items-center justify-center shadow-sm">
                <CheckCircle2 size={32} />
              </div>
            )}

            {displayStatus === 'blocked' && (
               <a 
                 href={`/student/navigator/assess/${item.skillId}`}
                 className="w-14 h-14 rounded-full bg-white text-rose-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform group border border-rose-100"
                 title="Resolve Gap"
               >
                 <AlertCircle size={28} />
               </a>
            )}
          </div>
        </div>
      ) : (
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
              {(isUserAdded || item.isAiInjected) && (
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-bold border border-violet-200">Personalized</span>
              )}
            </div>
            
            {item.isAiInjected && item.personalizationNote && (
              <p className="text-xs text-violet-600 mt-1 mb-1 font-medium bg-violet-50 px-2 py-1 rounded-md border border-violet-100 inline-block">
                ✨ {item.personalizationNote}
              </p>
            )}
            
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
                className="flex items-center justify-center gap-2 text-sm px-6 py-2.5 rounded-xl bg-linear-to-r from-violet-600 via-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-violet-500/20 font-bold transition-all shadow-sm w-full sm:w-auto"
                title="Take assessment"
              >
                <PlayCircle size={18} /> Start
              </a>
            )}
            
            {displayStatus === 'upcoming' && (
              <div className="flex items-center justify-center gap-2 text-sm px-6 py-2.5 rounded-xl bg-slate-100 text-slate-400 font-bold border border-slate-200 cursor-not-allowed w-full sm:w-auto">
                <Lock size={16} /> Locked
              </div>
            )}

            {displayStatus === 'blocked' && (
               <a 
                 href={`/student/navigator/assess/${item.skillId}`}
                 className="flex items-center justify-center gap-2 text-sm px-6 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 font-bold transition-colors shadow-sm w-full sm:w-auto"
               >
                 Resolve Gap
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
      )}
    </div>
  );
};

export default CanvasNode;
