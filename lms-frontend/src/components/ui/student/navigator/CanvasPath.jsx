import React, { useState, useEffect } from 'react';
import { Reorder } from 'framer-motion';
import CanvasNode from './CanvasNode';
import { useNavigator } from '../../../../context/NavigatorContext';
import { validatePathDependencies } from '../../../../engine/graphEngine';

const CanvasPath = ({ path, isEditing }) => {
  const { state, dispatch } = useNavigator();
  const [items, setItems] = useState(path);
  const [errorMsg, setErrorMsg] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5);

  // Sync internal state if external path changes
  useEffect(() => {
    setItems(path);
  }, [path]);

  const handleReorder = (newOrder) => {
    setItems(newOrder);
    
    // Validate dependencies
    const skillIds = newOrder.map(item => item.skillId);
    const validation = validatePathDependencies(state.capabilityGraph, skillIds);
    
    if (validation.valid) {
      setErrorMsg(null);
      // Dispatch an action to save new order if needed, or rely on local state until explicitly saved
      // For now, let's keep it simple
    } else {
      setErrorMsg(validation.reason);
      // Revert after brief delay
      setTimeout(() => {
        setItems(path);
        setErrorMsg(null);
      }, 3000);
    }
  };

  return (
    <div className="pl-2 relative pb-8">
      {errorMsg && (
        <div className="absolute top-[-40px] left-0 right-0 bg-rose-100 text-rose-600 font-bold text-xs p-2 rounded-lg border border-rose-200 text-center shadow-sm">
          {errorMsg}
        </div>
      )}

      {isEditing ? (
        <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="space-y-2">
          {items.map((item) => (
            <Reorder.Item key={item.skillId} value={item}>
              <CanvasNode item={item} isDraggable={true} />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      ) : (
        <div className="relative py-4 max-h-[700px] overflow-y-auto custom-scrollbar w-full flex flex-col items-center">
          {/* Main central path line */}
          <div className="absolute left-1/2 top-8 bottom-8 w-[2px] bg-slate-200 transform -translate-x-1/2" />
          
          <div className="space-y-12 w-full flex flex-col items-center pt-4 pb-8">
            {items.slice(0, visibleCount).map((item, index) => {
              const isEven = index % 2 === 0;
              const hasGift = index > 0 && index % 3 === 0; // Add a gift every 3 items

              return (
                <div key={item.skillId} className="w-full flex flex-col items-center relative">
                  
                  {/* Gift/Chest Node */}
                  {hasGift && (
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-white rounded-full border border-slate-200 flex items-center justify-center shadow-sm z-20">
                      <span className="text-xl">🎁</span>
                    </div>
                  )}

                  {/* Level Pill */}
                  <div className="bg-white border border-slate-200 text-slate-500 text-xs font-bold px-4 py-1.5 rounded-full z-20 mb-6 shadow-sm">
                    Level {index + 1}
                  </div>

                  {/* The Node Card */}
                  <div className="relative z-10">
                    <CanvasNode item={item} isDraggable={false} isTreeMode={true} />
                  </div>
                </div>
              );
            })}
          </div>
          
          {visibleCount < items.length && (
            <div className="mt-8 flex justify-center w-full relative z-20 pb-8">
              <button 
                onClick={() => setVisibleCount(prev => prev + 5)}
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 transition-all shadow-sm flex items-center gap-2"
              >
                Load Next Levels ↓
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CanvasPath;
