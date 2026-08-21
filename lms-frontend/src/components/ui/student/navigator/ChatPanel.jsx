import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageSquare, Loader2 } from 'lucide-react';
import { useNavigator } from '../../../../context/NavigatorContext';
import { aiService } from '../../../../services/aiService';
import ChatMessage from './ChatMessage';

const ChatPanel = ({ isOpen, onClose }) => {
  const { state, dispatch } = useNavigator();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.chatHistory, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = { id: Date.now().toString(), role: 'user', content: input };
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMsg });
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await aiService.processChat(input, state, dispatch);
      
      const aiMsg = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: responseText 
      };
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: aiMsg });
    } catch (error) {
      console.error("Chat error:", error);
      dispatch({ 
        type: 'ADD_CHAT_MESSAGE', 
        payload: { id: Date.now().toString(), role: 'assistant', content: "Sorry, I ran into an error processing that request." } 
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 w-96 h-screen bg-white/95 backdrop-blur-xl border-l border-gray-200 shadow-2xl flex flex-col z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-linear-to-r from-violet-50 to-purple-50">
            <div className="flex items-center gap-2">
              <MessageSquare className="text-violet-600" size={20} />
              <h3 className="font-bold text-slate-800">AI Navigator</h3>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white rounded-full text-slate-500 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
            {state.chatHistory.length === 0 ? (
              <div className="text-center text-slate-500 mt-10 text-sm font-medium">
                <p>Hello! I'm your AI learning assistant.</p>
                <p className="mt-2">Ask me to modify your plan, explain a requirement, or update your schedule.</p>
              </div>
            ) : (
              state.chatHistory.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))
            )}
            
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-sm p-2 font-medium">
                <Loader2 size={16} className="animate-spin" />
                <span>AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a request..."
                className="w-full pl-4 pr-12 py-3 bg-slate-100 border-transparent rounded-full text-sm font-medium focus:bg-white focus:border-violet-300 focus:ring-2 focus:ring-violet-100 transition-all outline-hidden text-slate-800 placeholder:text-slate-400"
                disabled={isTyping}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping}
                className="absolute right-2 p-2 bg-linear-to-br from-violet-600 to-purple-600 text-white rounded-full hover:shadow-md hover:shadow-violet-500/30 disabled:opacity-50 disabled:shadow-none transition-all"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatPanel;
