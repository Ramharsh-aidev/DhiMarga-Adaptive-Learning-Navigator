import React, { useState, useEffect } from 'react';
import { Reorder } from 'framer-motion';
import CanvasNode from './CanvasNode';
import { useNavigator } from '../../../../context/NavigatorContext';
import { validatePathDependencies } from '../../../../engine/graphEngine';

const CanvasPath = ({ path, isEditing }) => {
  const { state, dispatch } = useNavigator();
  const [items, setItems] = useState(path);
  const [errorMsg, setErrorMsg] = useState(null);

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
        <div className="space-y-2">
          {items.map((item) => (
            <CanvasNode key={item.skillId} item={item} isDraggable={false} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CanvasPath;
