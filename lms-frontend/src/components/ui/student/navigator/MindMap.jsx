import React, { useState, useMemo, useRef } from 'react';
import { ChevronRight, ChevronLeft, ZoomIn, ZoomOut, Play, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigator } from '../../../../context/NavigatorContext';
import { useNavigate } from 'react-router-dom';

const MindMapNode = ({ node, isRoot = false }) => {
  const [expanded, setExpanded] = useState(isRoot || node.id === '__user_additions__');
  const [showTooltip, setShowTooltip] = useState(false);
  const { state } = useNavigator();
  const navigate = useNavigate();

  const childrenData = node.children || [];
  const hasChildren = childrenData.length > 0;
  
  const learnerSkill = state.learnerState[node.originalId];
  const isVerified = learnerSkill?.status === 'verified';
  const isBlocked = learnerSkill?.status === 'gap';
  const masteryScore = learnerSkill?.masteryScore || 0;

  // Find if this node is the 'current' one (first unverified in the path)
  const currentPathNode = state.currentPath?.find(n => n.skillId === node.originalId);
  
  // Determine if it's the actual current learning target
  const isCurrent = !isRoot && currentPathNode && !isVerified && 
    state.currentPath.find(n => !state.learnerState[n.skillId] || state.learnerState[n.skillId].status !== 'verified')?.skillId === node.originalId;

  // Styling based on status
  let bgClass = "bg-white border-slate-200 text-slate-600 shadow-sm";
  let iconBg = "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700";
  let ringClass = "";
  
  if (isRoot) {
    bgClass = "bg-linear-to-r from-violet-600 to-purple-600 border-violet-700 text-white font-extrabold shadow-lg shadow-violet-200/50";
    iconBg = "bg-violet-500 text-white hover:bg-violet-400";
  } else if (node.id === '__user_additions__') {
    bgClass = "bg-purple-50 border-purple-200 text-purple-700 font-bold shadow-sm";
    iconBg = "bg-purple-100 text-purple-600 hover:bg-purple-200";
  } else if (isCurrent) {
    bgClass = "bg-violet-50 border-violet-400 text-violet-800 font-bold shadow-md";
    iconBg = "bg-violet-100 text-violet-600 hover:bg-violet-200";
    ringClass = "ring-4 ring-violet-400/20 animate-pulse";
  } else if (isVerified) {
    bgClass = "bg-green-50 border-green-300 text-green-800 shadow-sm font-bold";
    iconBg = "bg-green-100 text-green-600 hover:bg-green-200";
  } else if (isBlocked) {
    bgClass = "bg-rose-50 border-rose-300 text-rose-800 shadow-sm font-bold";
    iconBg = "bg-rose-100 text-rose-600 hover:bg-rose-200";
  } else if (node.isUserAdded) {
    bgClass = "bg-amber-50 border-amber-300 text-amber-800 shadow-sm font-bold";
    iconBg = "bg-amber-100 text-amber-700 hover:bg-amber-200";
  } else if (node.isDuplicate) {
    bgClass = "bg-slate-50 border-slate-200 text-slate-400 border-dashed shadow-none opacity-60 font-medium";
    iconBg = "bg-slate-200 text-slate-400";
  }

  const handlePlayClick = (e) => {
    e.stopPropagation();
    navigate(`/student/navigator/assess/${node.originalId}`);
  };

  const nodeRefData = currentPathNode?.nodeRef || node.nodeRef;
  const estimatedHours = currentPathNode?.estimatedHours || nodeRefData?.estimatedHours || 3;

  return (
    <div className="flex items-center relative py-2">
      
      {/* Node Card */}
      <div 
        className={`relative px-4 py-3 rounded-xl border flex items-center gap-3 whitespace-nowrap z-10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${bgClass} ${ringClass}`}
        onClick={() => setExpanded(!expanded)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span className="text-sm tracking-wide">{node.label}</span>
        
        {isCurrent && (
          <button 
            onClick={handlePlayClick}
            className="ml-2 w-7 h-7 flex items-center justify-center bg-violet-600 text-white rounded-full hover:bg-violet-700 hover:scale-110 transition-all shadow-sm"
            title="Start Assessment"
          >
            <Play size={14} fill="currentColor" className="ml-0.5" />
          </button>
        )}
        
        {!isCurrent && isVerified && <CheckCircle size={16} className="text-green-600 ml-1" />}
        {!isCurrent && isBlocked && <AlertCircle size={16} className="text-rose-500 ml-1" />}

        {hasChildren && (
          <button 
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className={`w-6 h-6 ml-1 flex items-center justify-center rounded-full transition-colors ${iconBg}`}
          >
            {expanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        )}

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && !isRoot && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute left-1/2 -translate-x-1/2 -top-12 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none flex items-center gap-2 font-medium"
            >
              <span>{estimatedHours}h</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">{nodeRefData?.category || 'Topic'}</span>
              <span className="text-slate-500">•</span>
              <span className={masteryScore >= 60 ? 'text-green-400' : 'text-slate-300'}>
                Mastery: {masteryScore}%
              </span>
              
              {/* Tooltip triangle */}
              <div className="absolute left-1/2 -bottom-1 w-2 h-2 bg-slate-900 rotate-45 -translate-x-1/2" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Children with pure SVG connecting lines */}
      {hasChildren && expanded && (
        <div className="flex items-center transition-all duration-300">
          <svg className="w-10 h-2 absolute right-[-40px]" style={{ zIndex: 0 }}>
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#cbd5e1" strokeWidth="2" />
          </svg>
          
          <div className="flex flex-col justify-center relative ml-10">
            {childrenData.map((child, idx) => {
              const childIsFirst = idx === 0;
              const childIsLast = idx === childrenData.length - 1;
              const childIsOnly = childrenData.length === 1;

              return (
                <div key={`${child.id}-${idx}`} className="relative flex items-center">
                  
                  {/* CSS-based SVG-like curved connectors (cleaner cross-browser than complex SVG paths for dynamic heights) */}
                  {!childIsOnly && (
                    <div className={`absolute left-[-40px] border-l-2 border-slate-300 w-10
                      ${childIsFirst ? 'top-1/2 bottom-0 rounded-tl-xl border-t-2' : ''}
                      ${childIsLast ? 'top-0 bottom-1/2 rounded-bl-xl border-b-2' : ''}
                      ${!childIsFirst && !childIsLast ? 'top-0 bottom-0' : ''}
                    `} />
                  )}
                  
                  {!childIsFirst && !childIsLast && !childIsOnly && (
                    <div className={`absolute left-[-40px] top-1/2 w-10 border-t-2 border-slate-300`} />
                  )}
                  
                  {childIsOnly && (
                    <div className={`absolute left-[-40px] top-1/2 w-10 border-t-2 border-slate-300`} />
                  )}

                  <div>
                    <MindMapNode node={child} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const buildDepTree = (graph, goalRole) => {
  if (!graph) return null;
  
  const nodes = graph.nodes;
  const roots = Object.values(nodes).filter(n => n.prerequisites.length === 0);
  
  const visited = new Set();
  
  const buildNode = (node) => {
    if (!node) return null;
    const isDuplicate = visited.has(node.id);
    visited.add(node.id);
    
    return {
      id: isDuplicate ? `${node.id}_ref_${Math.random()}` : node.id,
      label: node.label,
      originalId: node.id,
      isDuplicate,
      isUserAdded: !!node.isUserAdded,
      nodeRef: node,
      children: isDuplicate ? [] : (node.unlocks || []).map(uid => nodes[uid] ? buildNode(nodes[uid]) : null).filter(Boolean)
    };
  };

  const treeChildren = roots.map(r => buildNode(r)).filter(Boolean);

  const orphans = Object.values(nodes).filter(n => !visited.has(n.id));
  if (orphans.length > 0) {
    const orphanChildren = orphans.map(n => buildNode(n)).filter(Boolean);
    treeChildren.push({
      id: '__user_additions__',
      label: 'Custom Topics',
      originalId: '__user_additions__',
      isDuplicate: false,
      isUserAdded: true,
      children: orphanChildren,
    });
  }

  return {
    id: 'goal_root',
    label: goalRole || graph.name,
    originalId: 'goal_root',
    children: treeChildren,
  };
};

const MindMap = () => {
  const { state } = useNavigator();
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);
  
  const treeData = useMemo(() => {
    if (!state.capabilityGraph || state.capabilityGraph.error) return null;
    return buildDepTree(state.capabilityGraph, state.goal?.targetRole?.replace('_', ' '));
  }, [state.capabilityGraph, state.goal]);

  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!treeData) setLoadingTimeout(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, [treeData]);

  if (!treeData) {
     if (loadingTimeout) {
         return (
             <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-slate-50/50">
                 <AlertCircle className="mx-auto mb-4 text-slate-400" size={48} />
                 <h3 className="text-lg font-bold text-slate-700 mb-2">No Mind Map Available</h3>
                 <p className="text-slate-500 max-w-sm">We couldn't generate a visual mind map for this specific path. Please use the List View instead to see your sequence.</p>
             </div>
         );
     }
     return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div></div>;
  }

  const handleWheel = (e) => {
    if (e.deltaY < 0) {
      setScale(s => Math.min(s + 0.1, 2));
    } else {
      setScale(s => Math.max(s - 0.1, 0.4));
    }
  };

  const expandAll = (expand) => {
    // A full react-way to expand all nodes would require a global expand state or context, 
    // but users can zoom and click. A simple zoom-to-fit works better.
    setScale(expand ? 0.6 : 1);
  };

  return (
    <div 
      ref={containerRef}
      onWheel={handleWheel}
      className="relative overflow-hidden w-full h-full bg-slate-50 flex items-center justify-center cursor-grab active:cursor-grabbing"
    >
      <motion.div 
        drag
        dragConstraints={{ left: -2000, right: 2000, top: -2000, bottom: 2000 }}
        dragElastic={0.1}
        dragMomentum={false}
        style={{ scale }}
        className="will-change-transform w-max h-max p-32 flex items-center justify-center origin-center"
      >
        <MindMapNode node={treeData} isRoot={true} />
      </motion.div>

      {/* Legend Overlay */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-slate-200 z-50 text-xs text-slate-600 flex flex-col gap-2 font-medium">
        <h4 className="font-bold text-slate-800 mb-1">Path Status</h4>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-400"></div> Verified / Complete</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-violet-400 animate-pulse"></div> Current Focus</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-400"></div> Needs Review (Gap)</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300"></div> Upcoming</div>
      </div>

      {/* Zoom Controls Overlay */}
      <div className="absolute bottom-4 right-4 flex items-center bg-white shadow-lg rounded-xl overflow-hidden border border-slate-200 z-50">
        <button 
          onClick={() => setScale(s => Math.max(s - 0.2, 0.4))} 
          className="p-2 hover:bg-slate-50 text-slate-600 transition-colors border-r border-slate-100"
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
        
        <button 
          onClick={() => setScale(1)}
          className="px-3 py-2 text-xs font-bold text-slate-600 min-w-[60px] text-center hover:bg-slate-50 transition-colors"
          title="Recenter"
        >
          {Math.round(scale * 100)}%
        </button>
        
        <button 
          onClick={() => setScale(s => Math.min(s + 0.2, 2))} 
          className="p-2 hover:bg-slate-50 text-slate-600 transition-colors border-l border-slate-100"
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
      </div>
    </div>
  );
};

export default MindMap;
