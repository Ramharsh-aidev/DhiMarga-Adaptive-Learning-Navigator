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
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-violet-100 text-violet-600' : 'bg-purple-100 text-purple-600 shadow-sm'}`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      <div className={`px-4 py-3 rounded-2xl max-w-[80%] ${isUser ? 'bg-violet-600 text-white rounded-tr-sm shadow-sm' : 'bg-white border border-slate-200 text-slate-800 shadow-sm rounded-tl-sm'}`}>
        <p className="text-sm whitespace-pre-wrap font-medium">{message.content}</p>
        {message.action && (
          <div className="mt-2 text-xs bg-purple-50 text-purple-700 p-2 rounded-lg border border-purple-100 font-mono font-bold">
            ⚡ Action: {message.action.type}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
