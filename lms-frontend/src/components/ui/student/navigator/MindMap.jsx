import React, { useState, useMemo, useRef } from 'react';
import { ChevronRight, ChevronLeft, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigator } from '../../../../context/NavigatorContext';

const MindMapNode = ({ node, isRoot = false }) => {
  // Compress by default unless it's the root node
  const [expanded, setExpanded] = useState(isRoot);
  const { state } = useNavigator();

  const childrenData = node.children || [];
  const hasChildren = childrenData.length > 0;
  
  const learnerSkill = state.learnerState[node.originalId];
  const isVerified = learnerSkill?.status === 'verified';
  const isBlocked = learnerSkill?.status === 'blocked';
  
  // Light theme colors
  let bgClass = "bg-white border-gray-200 text-gray-700 shadow-sm hover:shadow-md hover:border-indigo-200";
  let iconBg = "bg-gray-100 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600";
  
  if (isRoot) {
    bgClass = "bg-indigo-600 border-indigo-700 text-white font-bold shadow-lg shadow-indigo-200/50";
    iconBg = "bg-indigo-500 text-white hover:bg-indigo-400";
  } else if (node.id === '__user_additions__') {
    bgClass = "bg-purple-50 border-purple-200 text-purple-700 font-semibold shadow-sm";
    iconBg = "bg-purple-100 text-purple-600 hover:bg-purple-200";
  } else if (node.isUserAdded) {
    bgClass = "bg-amber-50 border-amber-300 text-amber-800 shadow-sm hover:shadow-md hover:border-amber-400";
    iconBg = "bg-amber-100 text-amber-700 hover:bg-amber-200";
  } else if (isVerified) {
    bgClass = "bg-green-50 border-green-200 text-green-700 shadow-sm";
    iconBg = "bg-green-100 text-green-600 hover:bg-green-200";
  } else if (isBlocked) {
    bgClass = "bg-red-50 border-red-200 text-red-700 shadow-sm";
    iconBg = "bg-red-100 text-red-600 hover:bg-red-200";
  } else if (node.isDuplicate) {
    bgClass = "bg-gray-50 border-gray-200 text-gray-400 border-dashed shadow-none";
    iconBg = "bg-gray-200 text-gray-400";
  }

  // Line color
  const lineColor = "border-indigo-200";

  return (
    <div className="flex items-center relative py-1.5">
      
      {/* Node Card */}
      <div className={`px-4 py-2.5 rounded-xl border flex items-center gap-3 whitespace-nowrap z-10 ${bgClass} transition-all duration-200`}>
        <span className="text-sm font-medium tracking-wide">{node.label}</span>
        {hasChildren && (
          <button 
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors ${iconBg}`}
          >
            {expanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        )}
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div className="flex items-center transition-all duration-300">
          {/* Horizontal line exiting the parent */}
          <div className={`w-10 border-t-2 ${lineColor}`} />
          
          <div className="flex flex-col justify-center relative">
            {childrenData.map((child, idx) => {
              const childIsFirst = idx === 0;
              const childIsLast = idx === childrenData.length - 1;
              const childIsOnly = childrenData.length === 1;

              return (
                <div key={`${child.id}-${idx}`} className="relative flex items-center">
                  
                  {/* Connector logic */}
                  {!childIsOnly && (
                    <div className={`absolute left-0 border-l-2 ${lineColor} w-10
                      ${childIsFirst ? 'top-1/2 bottom-0 rounded-tl-2xl border-t-2' : ''}
                      ${childIsLast ? 'top-0 bottom-1/2 rounded-bl-2xl border-b-2' : ''}
                      ${!childIsFirst && !childIsLast ? 'top-0 bottom-0' : ''}
                    `} />
                  )}
                  
                  {!childIsFirst && !childIsLast && !childIsOnly && (
                    <div className={`absolute left-0 top-1/2 w-10 border-t-2 ${lineColor}`} />
                  )}
                  
                  {childIsOnly && (
                    <div className={`absolute left-0 top-1/2 w-10 border-t-2 ${lineColor}`} />
                  )}

                  <div className="ml-10">
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
      children: isDuplicate ? [] : (node.unlocks || []).map(uid => nodes[uid] ? buildNode(nodes[uid]) : null).filter(Boolean)
    };
  };

  const treeChildren = roots.map(r => buildNode(r));

  // Safety net: collect all nodes NOT yet visited (user-added nodes not reachable via unlocks chain)
  // Group them under an "Added Topics" virtual node so they appear on the canvas
  const orphans = Object.values(nodes).filter(n => !visited.has(n.id));
  if (orphans.length > 0) {
    // Group orphans by their first prerequisite to avoid a flat dump
    const orphanChildren = orphans.map(n => buildNode(n)).filter(Boolean);
    treeChildren.push({
      id: '__user_additions__',
      label: 'Added Topics',
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
    return buildDepTree(state.capabilityGraph, state.goal?.targetRole?.replace('_', ' '));
  }, [state.capabilityGraph, state.goal]);

  if (!treeData) return <div className="text-gray-500">Loading Mind Map...</div>;

  const handleWheel = (e) => {
    if (e.deltaY < 0) {
      setScale(s => Math.min(s + 0.1, 2));
    } else {
      setScale(s => Math.max(s - 0.1, 0.4));
    }
  };

  const handleRecenter = () => {
    setScale(1);
  };

  return (
    <div 
      ref={containerRef}
      onWheel={handleWheel}
      className="relative overflow-hidden w-full h-full bg-gray-50/50 flex items-center justify-center rounded-xl border border-gray-100 shadow-inner cursor-grab active:cursor-grabbing"
    >
      <motion.div 
        drag
        dragConstraints={{ left: -1500, right: 1500, top: -1500, bottom: 1500 }}
        dragElastic={0.1}
        dragMomentum={false}
        style={{ scale }}
        className="will-change-transform w-max h-max p-20 flex items-center justify-center origin-center"
      >
        <MindMapNode node={treeData} isRoot={true} />
      </motion.div>

      {/* Zoom Controls Overlay */}
      <div className="absolute bottom-4 right-4 flex items-center bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 z-50">
        <button 
          onClick={() => setScale(s => Math.max(s - 0.2, 0.4))} 
          className="p-2 hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100"
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
        
        <button 
          onClick={handleRecenter}
          className="px-3 py-2 text-xs font-semibold text-gray-600 min-w-[60px] text-center hover:bg-gray-50 transition-colors"
          title="Recenter"
        >
          {Math.round(scale * 100)}%
        </button>
        
        <button 
          onClick={() => setScale(s => Math.min(s + 0.2, 2))} 
          className="p-2 hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100"
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
      </div>
    </div>
  );
};

export default MindMap;
