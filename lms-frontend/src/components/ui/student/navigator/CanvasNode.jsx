import React from 'react';
import { motion, Reorder } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle, GripVertical, X } from 'lucide-react';
import { useNavigator } from '../../../../context/NavigatorContext';

const CanvasNode = ({ item, isDraggable = false }) => {
  const { dispatch } = useNavigator();
  const { nodeRef, status, estimatedHours, isUserAdded } = item;

  const statusConfig = {
    completed: { color: 'bg-green-50 border-green-200 text-green-700', icon: CheckCircle2 },
    current: { color: 'bg-blue-50 border-blue-300 text-blue-700 shadow-md ring-2 ring-blue-200', icon: Clock },
    upcoming: { color: 'bg-white border-gray-200 text-gray-600', icon: Clock },
    blocked: { color: 'bg-red-50 border-red-300 text-red-700 ring-2 ring-red-200', icon: AlertCircle },
    skipped: { color: 'bg-gray-50 border-gray-200 text-gray-400 opacity-60', icon: X }
  };

  const config = statusConfig[status] || statusConfig.upcoming;
  const Icon = config.icon;

  const handleRemove = () => {
    dispatch({ type: 'REMOVE_SKILL_FROM_PATH', payload: item.skillId });
  };

  return (
    <div className={`relative flex items-center gap-4 py-2 ${status === 'skipped' ? 'grayscale' : ''}`}>
      {/* Node Graphic */}
      <div className="relative flex flex-col items-center">
        <div className={`w-4 h-4 rounded-full border-2 bg-white z-10 ${status === 'completed' ? 'border-green-500' : status === 'current' ? 'border-blue-500' : status === 'blocked' ? 'border-red-500' : 'border-gray-300'}`} />
        <div className="absolute top-4 bottom-[-24px] w-0.5 bg-gray-200" />
      </div>

      {/* Card */}
      <div className={`flex-1 flex items-center p-4 rounded-xl border transition-all ${config.color}`}>
        {isDraggable && (
          <div className="mr-3 cursor-grab text-gray-400 hover:text-gray-600">
            <GripVertical size={16} />
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Icon size={16} className={config.color.includes('text') ? config.color.split(' ').find(c => c.startsWith('text-')) : ''} />
            <h4 className="font-semibold text-sm">{nodeRef?.label || item.skillId}</h4>
            {isUserAdded && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-600 font-medium">Added</span>
            )}
          </div>
          <p className="text-xs mt-1 opacity-80">{nodeRef?.category}</p>
          {item.selectedResource?.url && (
            <a 
              href={item.selectedResource.url} 
              target="_blank" 
              rel="noreferrer"
              className="text-[10px] inline-block mt-2 font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-0.5 px-2 rounded-full transition-colors"
            >
              Watch Video
            </a>
          )}
        </div>

        <div className="text-right flex flex-col items-end">
          <div className="text-xs font-medium mb-2">~{Math.round(estimatedHours)}h</div>
          
          <div className="flex items-center gap-2">
            {status !== 'completed' && (
              <a 
                href={`/student/navigator/assess/${item.skillId}`}
                className="text-[10px] px-2 py-1 rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-medium transition-colors cursor-pointer"
                title="I already know this - take assessment"
              >
                Verify
              </a>
            )}
            
            {isDraggable && status !== 'completed' && (
              <button onClick={handleRemove} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasNode;
