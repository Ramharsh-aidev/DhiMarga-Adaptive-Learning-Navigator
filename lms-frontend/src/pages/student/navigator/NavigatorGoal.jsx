import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Send, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigator } from '../../../context/NavigatorContext';
import { aiService } from '../../../services/aiService';

const NavigatorGoal = () => {
  const { dispatch } = useNavigator();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      // 1. Parse goal
      const goal = await aiService.parseGoal(input);
      
      // 2. Dispatch to context
      dispatch({ type: 'SET_GOAL', payload: { ...goal, forceNew: true } });
      
      // 3. Add initial chat message
      dispatch({
        type: 'ADD_CHAT_MESSAGE',
        payload: {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Great! I've built a capability graph for a ${goal.targetRole.replace('_', ' ')}. Let's review your personalized learning path.`
        }
      });
      
      // 4. Navigate to canvas plan
      navigate('/student/navigator/plan');
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <button 
        onClick={() => navigate('/student/dashboard')}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-violet-600 mb-6 transition-colors font-bold"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="text-center mb-12">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-violet-200"
        >
          <Bot size={40} />
        </motion.div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 bg-clip-text text-transparent bg-linear-to-r from-violet-600 via-purple-500 to-pink-500">
          Adaptive Learning Navigator
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
          Describe your learning goal, current skills, and time constraints. I'll build a personalized path that continuously adapts to your progress.
        </p>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 shadow-violet-500/5"
      >
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            What do you want to achieve?
          </label>
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="E.g., I want to become an ML Engineer in 10 weeks. I know Python and SQL. I have 8 hours a week to study."
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all outline-hidden resize-none text-slate-700 placeholder:text-slate-400"
              disabled={isProcessing}
            />
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={!input.trim() || isProcessing}
              className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-violet-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-violet-500/30 disabled:opacity-50 transition-all shadow-sm"
            >
              {isProcessing ? 'Analyzing...' : 'Generate Path'}
              {!isProcessing && <ArrowRight size={18} />}
            </button>
          </div>
        </form>
      </motion.div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-sm text-slate-500 font-medium">
        <div>
          <h4 className="font-bold text-slate-700 mb-1">Tailored to You</h4>
          <p>Path optimized for your existing knowledge and schedule.</p>
        </div>
        <div>
          <h4 className="font-bold text-slate-700 mb-1">Evidence-Based</h4>
          <p>Continuously measures your true mastery.</p>
        </div>
        <div>
          <h4 className="font-bold text-slate-700 mb-1">Adaptive Recovery</h4>
          <p>Never restarts you. Finds the minimum intervention.</p>
        </div>
      </div>
    </div>
  );
};

export default NavigatorGoal;
