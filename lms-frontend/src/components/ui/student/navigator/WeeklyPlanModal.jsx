import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Loader2, BookOpen, PenTool, RefreshCw } from 'lucide-react';
import { useNavigator } from '../../../../context/NavigatorContext';
import { aiService } from '../../../../services/aiService';

const WeeklyPlanModal = ({ isOpen, onClose }) => {
  const { state } = useNavigator();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    if (isOpen && !plan && !loading) {
      generatePlan();
    }
  }, [isOpen]);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const generated = await aiService.generateWeeklyPlan(state);
      setPlan(generated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getIconForType = (type) => {
    if (type === 'practice') return <PenTool size={14} className="text-pink-500" />;
    if (type === 'review') return <RefreshCw size={14} className="text-amber-500" />;
    return <BookOpen size={14} className="text-violet-500" />;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-linear-to-r from-violet-50 to-purple-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-violet-600 shadow-sm">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">AI Weekly Study Planner</h3>
                  <p className="text-xs text-slate-500 font-medium">{state.goal?.availableHoursPerWeek || 10} hours this week</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={generatePlan}
                  disabled={loading}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:text-violet-600 hover:border-violet-200 shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                  Regenerate
                </button>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-violet-100 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-violet-600 rounded-full border-t-transparent animate-spin absolute inset-0"></div>
                  </div>
                  <p className="text-slate-500 font-medium">Drafting your personalized weekly schedule...</p>
                </div>
              ) : plan ? (
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-slate-700 font-medium text-lg leading-relaxed">
                      " {plan.summary} "
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plan.days?.map((day, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-violet-300 transition-colors group">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-slate-800 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-xs text-slate-500 group-hover:bg-violet-100 group-hover:text-violet-600 transition-colors">
                              {day.day}
                            </span>
                            {day.title}
                          </h4>
                          <span className="text-xs font-bold text-slate-400">
                            {day.tasks?.reduce((acc, t) => acc + (t.allocatedHours || 0), 0)}h
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          {day.tasks?.map((task, tIdx) => (
                            <div key={tIdx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                              <div className="mt-0.5">
                                {getIconForType(task.type)}
                              </div>
                              <div className="flex-1">
                                <h5 className="text-sm font-bold text-slate-700 mb-0.5">{task.label}</h5>
                                <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-400">
                                  <span>{task.allocatedHours} Hours</span>
                                  <span>•</span>
                                  <span className={
                                    task.type === 'practice' ? 'text-pink-500' :
                                    task.type === 'review' ? 'text-amber-500' : 'text-violet-500'
                                  }>{task.type}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                          {(!day.tasks || day.tasks.length === 0) && (
                            <div className="text-center py-4 text-sm text-slate-400 font-medium italic">
                              Rest Day
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-slate-500">
                  Could not generate plan.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WeeklyPlanModal;
