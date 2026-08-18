import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-indigo-100 text-indigo-600' : 'bg-purple-100 text-purple-600'}`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${isUser ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-800 shadow-sm rounded-tl-sm'}`}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        {message.action && (
          <div className="mt-2 text-xs bg-purple-50 text-purple-700 p-2 rounded border border-purple-100 font-mono">
            ⚡ Action: {message.action.type}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
