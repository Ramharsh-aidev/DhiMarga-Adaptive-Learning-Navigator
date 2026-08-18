import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const NextActionCard = ({ currentNode, onStart }) => {
  if (!currentNode) return null;

  return (
    <div className="bg-linear-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10 blur-2xl"></div>
      <div className="absolute bottom-0 right-16 -mb-10 w-24 h-24 rounded-full bg-white opacity-10 blur-xl"></div>
      
      <div className="relative z-10 flex justify-between items-center">
        <div>
          <h3 className="text-indigo-100 text-sm font-medium mb-1">Up Next</h3>
          <h2 className="text-2xl font-bold mb-2">{currentNode.nodeRef?.label || currentNode.skillId}</h2>
          <p className="text-indigo-100 text-sm max-w-md">
            {currentNode.selectedResource?.title || 'Proceed to the next module in your personalized path.'}
          </p>
        </div>
        
        <button 
          onClick={onStart}
          className="w-14 h-14 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        >
          <Play size={24} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default NextActionCard;
