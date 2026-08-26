import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { aiService } from '../../../../services/aiService';

const SocraticTutor = ({ skillId, onComplete }) => {
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', content: `Hello! I see you had some trouble with ${skillId}. Instead of a standard quiz, let's work through this together. What do you currently understand about this topic?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [masteryReached, setMasteryReached] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = { id: Date.now().toString(), role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const result = await aiService.processSocraticTutoring(skillId, newMessages);
      
      const aiMsg = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: result.reply 
      };
      setMessages(prev => [...prev, aiMsg]);
      
      if (result.masteryReached) {
        setMasteryReached(true);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Sorry, I encountered an error. Could you try explaining that again?' }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (masteryReached) {
    return (
      <div className="bg-green-50 border border-green-200 p-8 rounded-3xl text-center shadow-sm">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-2xl font-bold text-green-900 mb-2">Excellent Understanding!</h3>
        <p className="text-green-700 mb-6">You've successfully demonstrated mastery of this concept through our conversation.</p>
        <button 
          onClick={onComplete}
          className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-md shadow-green-500/20"
        >
          Claim Mastery XP
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[500px]">
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">Socratic Tutor Mode</h3>
          <p className="text-xs text-slate-500 font-medium">Interactive gap recovery for {skillId}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        {messages.map(msg => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-500/20 font-medium' 
                : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm leading-relaxed'
            }`}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-5 py-4 text-slate-400 flex gap-1">
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-slate-300 rounded-full" />
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-slate-300 rounded-full" />
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-slate-300 rounded-full" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 relative">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Explain your understanding..."
          className="w-full pl-5 pr-14 py-4 bg-slate-100 rounded-2xl outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all text-slate-700 font-medium border border-transparent"
        />
        <button 
          type="submit"
          disabled={!input.trim() || isTyping}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-md shadow-blue-500/20"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default SocraticTutor;
