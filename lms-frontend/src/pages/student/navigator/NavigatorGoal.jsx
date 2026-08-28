import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, ArrowRight, ArrowLeft, Loader2, Target, Clock, Zap, Brain, Rocket, Sparkles } from 'lucide-react';
import { usePathOnboarding } from '../../../hooks/usePathOnboarding';
import { aiService } from '../../../services/aiService';

export default function NavigatorGoal() {
  const navigate = useNavigate();
  const { startOnboarding } = usePathOnboarding();
  
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    goal: '',
    timeAvailability: '',
    learningStyle: '',
    additionalContext: ''
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  
  // Custom quick goals
  const popularGoals = [
    { id: 'ml_engineer', label: 'Machine Learning Engineer', icon: Brain },
    { id: 'fullstack_dev', label: 'Full-Stack Developer', icon: Target },
    { id: 'data_analyst', label: 'Data Analyst', icon: Sparkles },
    { id: 'not_sure', label: "I'm not sure yet", icon: Rocket }
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      analyzeAnswers();
    }
  };

  const analyzeAnswers = async () => {
    setIsAnalyzing(true);
    try {
      const result = await aiService.analyzeOnboardingAnswers(answers);
      setAnalysisResult(result);
      setStep(4); // Results step
    } catch (err) {
      console.error(err);
      // Fallback if AI fails, just push directly to standard input
      startOnboarding(`Target: ${answers.goal}. Context: ${answers.additionalContext}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectPath = async (modeId) => {
    // Pass the pre-analyzed payload directly to avoid double LLM calls
    const payload = {
      targetRole: analysisResult.targetRole,
      topologyMode: modeId,
      customTopics: [],
      customContext: answers.additionalContext // Pass this so usePathOnboarding can extract known skills
    };
    await startOnboarding(payload);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center max-w-4xl mx-auto py-12 px-6 relative">
      <button 
        onClick={() => step > 0 ? setStep(step - 1) : navigate('/student/dashboard')}
        className="absolute top-0 left-6 flex items-center gap-1 text-sm text-slate-500 hover:text-violet-600 mb-6 transition-colors font-bold z-10"
      >
        <ArrowLeft size={16} /> {step > 0 ? 'Back' : 'Back to Dashboard'}
      </button>

      <AnimatePresence mode="wait">
        
        {/* Step 0: Welcome & Goal */}
        {step === 0 && (
          <motion.div 
            key="step0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full text-center"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="w-24 h-24 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm border border-violet-200"
            >
              <Bot size={48} />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Let's get started with your journey!
            </h1>
            <p className="text-xl text-slate-600 mb-12 font-medium">
              Ready to begin? Tell me what you're here to learn.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {popularGoals.map((goal) => {
                const Icon = goal.icon;
                return (
                  <button
                    key={goal.id}
                    onClick={() => {
                      setAnswers({ ...answers, goal: goal.label });
                      handleNext();
                    }}
                    className="p-6 bg-white border-2 border-slate-100 hover:border-violet-400 hover:bg-violet-50 rounded-2xl flex items-center gap-4 transition-all text-left group shadow-sm hover:shadow-md"
                  >
                    <div className="w-12 h-12 bg-slate-50 group-hover:bg-violet-100 rounded-xl flex items-center justify-center transition-colors">
                      <Icon className="w-6 h-6 text-slate-500 group-hover:text-violet-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg group-hover:text-violet-700">{goal.label}</h3>
                    </div>
                  </button>
                )
              })}
            </div>
            
            <div className="mt-8 max-w-2xl mx-auto flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-slate-400 font-bold text-sm">OR TYPE YOUR OWN</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <div className="mt-8 max-w-2xl mx-auto relative">
              <input
                type="text"
                placeholder="e.g. I want to build iOS apps..."
                value={answers.goal !== "I'm not sure yet" && popularGoals.find(g => g.label === answers.goal) ? '' : answers.goal}
                onChange={(e) => setAnswers({ ...answers, goal: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && answers.goal && handleNext()}
                className="w-full p-5 pl-6 pr-16 bg-white border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-hidden text-lg font-medium text-slate-700 placeholder:text-slate-400 shadow-sm"
              />
              <button 
                onClick={handleNext}
                disabled={!answers.goal}
                className="absolute right-3 top-3 bottom-3 w-12 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 rounded-xl flex items-center justify-center text-white transition-colors"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 1: Time Constraints */}
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-2xl mx-auto"
          >
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
              <Clock size={32} />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">How much time can you commit?</h2>
            <p className="text-lg text-slate-600 mb-8 font-medium">This helps us calculate your estimated completion date.</p>
            
            <div className="grid grid-cols-1 gap-4">
              {['Less than 5 hours/week', '5-10 hours/week', '10-20 hours/week', 'Full-time (20+ hours/week)'].map(option => (
                <button
                  key={option}
                  onClick={() => {
                    setAnswers({ ...answers, timeAvailability: option });
                    handleNext();
                  }}
                  className="p-5 bg-white border-2 border-slate-200 hover:border-indigo-500 rounded-xl text-left font-bold text-slate-700 hover:text-indigo-700 transition-all shadow-sm"
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Learning Style */}
        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-2xl mx-auto"
          >
            <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
              <Zap size={32} />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">How do you prefer to learn?</h2>
            <p className="text-lg text-slate-600 mb-8 font-medium">We'll adapt the course structure to match your style.</p>
            
            <div className="grid grid-cols-1 gap-4">
              {[
                'I want a balance of theory and practice',
                'Just let me build projects immediately',
                'I need deep theoretical foundations first',
                'Fastest route possible, just give me the essentials'
              ].map(option => (
                <button
                  key={option}
                  onClick={() => {
                    setAnswers({ ...answers, learningStyle: option });
                    handleNext();
                  }}
                  className="p-5 bg-white border-2 border-slate-200 hover:border-pink-500 rounded-xl text-left font-bold text-slate-700 hover:text-pink-700 transition-all shadow-sm"
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Final Context */}
        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-2xl mx-auto"
          >
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
              <Sparkles size={32} />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Anything else I should know?</h2>
            <p className="text-lg text-slate-600 mb-8 font-medium">Mention any specific topics, deadlines, or prior experience.</p>
            
            <textarea
              autoFocus
              value={answers.additionalContext}
              onChange={(e) => setAnswers({ ...answers, additionalContext: e.target.value })}
              placeholder="e.g. I already know Python but struggle with Math. I have an interview in 2 months."
              className="w-full h-40 p-5 bg-white border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-hidden text-lg font-medium text-slate-700 placeholder:text-slate-400 shadow-sm resize-none mb-6"
            />
            
            <button
              onClick={handleNext}
              disabled={isAnalyzing}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 rounded-xl font-bold text-white text-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {isAnalyzing ? (
                <><Loader2 className="animate-spin" /> Analyzing your profile...</>
              ) : (
                <><Sparkles size={20} /> Generate My Path Options</>
              )}
            </button>
          </motion.div>
        )}

        {/* Step 4: AI Path Selection */}
        {step === 4 && analysisResult && (
          <motion.div 
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
                Your Path to <span className="text-violet-600">{analysisResult.targetRoleDisplay}</span>
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Based on your answers, I've designed 3 potential routes. 
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {analysisResult.options.map(option => {
                const isRecommended = option.id === analysisResult.recommendedMode;
                return (
                  <div 
                    key={option.id}
                    onClick={() => handleSelectPath(option.id)}
                    className={`relative cursor-pointer p-6 rounded-2xl border-2 transition-all flex flex-col h-full
                      ${isRecommended 
                        ? 'bg-violet-50 border-violet-500 shadow-lg shadow-violet-500/20 scale-105 z-10' 
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                      }`}
                  >
                    {isRecommended && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm flex items-center gap-1 whitespace-nowrap">
                        <Sparkles size={14} /> AI RECOMMENDED
                      </div>
                    )}
                    
                    <h3 className={`text-xl font-extrabold mb-2 ${isRecommended ? 'text-violet-900' : 'text-slate-800'}`}>
                      {option.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-4 text-sm font-bold text-slate-500">
                      <Clock size={16} /> Est. {option.estimatedTime}
                    </div>
                    
                    <p className={`flex-1 text-sm font-medium leading-relaxed ${isRecommended ? 'text-violet-700' : 'text-slate-600'}`}>
                      {option.description}
                    </p>

                    {isRecommended && (
                      <div className="mt-4 pt-4 border-t border-violet-200">
                        <p className="text-xs font-bold text-violet-600 italic">
                          " {analysisResult.recommendationReason} "
                        </p>
                      </div>
                    )}
                    
                    <button 
                      className={`mt-6 w-full py-3 rounded-xl font-bold transition-colors
                        ${isRecommended 
                          ? 'bg-violet-600 text-white hover:bg-violet-700' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                    >
                      Select Route
                    </button>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
