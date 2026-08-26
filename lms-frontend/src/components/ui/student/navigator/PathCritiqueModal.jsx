import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Loader2, Target, Zap, AlertTriangle } from 'lucide-react';
import { useNavigator } from '../../../../context/NavigatorContext';
import { aiService } from '../../../../services/aiService';
import { awardChallengerBadge } from '../../../../services/navigatorService';

const PathCritiqueModal = ({ isOpen, onClose }) => {
  const { state, dispatch } = useNavigator();
  const [loading, setLoading] = useState(false);
  const [critique, setCritique] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const cacheKey = `path_critique_${state.activePathId}_xp_${state.userProgress?.xp || 0}`;

  useEffect(() => {
    if (isOpen && !critique && !loading) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          setCritique(JSON.parse(cached));
        } catch (e) {
          generateCritique();
        }
      } else {
        generateCritique();
      }
    }
  }, [isOpen, cacheKey]);

  const generateCritique = async () => {
    setLoading(true);
    setShowConfirm(false);
    try {
      const result = await aiService.critiquePath(state);
      setCritique(result);
      localStorage.setItem(cacheKey, JSON.stringify(result));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyAlternative = async () => {
    if (!critique?.alternativePath) return;
    
    // Inject the new nodes directly into the upcoming path (interleaved/enhancement)
    await dispatch({
      type: 'INJECT_ALTERNATIVE_PATH',
      payload: critique.alternativePath
    });
    
    // Award Challenger Badge
    if (state.activePathId) {
      await awardChallengerBadge(state.activePathId);
    }

    onClose();
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
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-linear-to-r from-amber-50 to-orange-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-amber-600 shadow-sm">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">AI Path Critique</h3>
                  <p className="text-xs text-slate-500 font-medium">Challenge your current learning strategy</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={generateCritique}
                  disabled={loading}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:text-amber-600 hover:border-amber-200 shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Sparkles size={14} className={loading ? "animate-pulse text-amber-500" : "text-amber-500"} />
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
                    <div className="w-16 h-16 border-4 border-amber-100 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-amber-500 rounded-full border-t-transparent animate-spin absolute inset-0"></div>
                  </div>
                  <p className="text-slate-500 font-medium">Analyzing your path and finding alternatives...</p>
                </div>
              ) : critique ? (
                <div className="max-w-3xl mx-auto space-y-6">
                  {/* Current Assessment */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Target size={18} className="text-blue-500" /> Current Strategy Analysis
                    </h4>
                    <p className="text-slate-700 leading-relaxed mb-4">{critique.currentAnalysis}</p>
                    
                    <div className="flex gap-4">
                      <div className="flex-1 bg-green-50 p-4 rounded-xl border border-green-100">
                        <h5 className="font-bold text-green-800 mb-2 text-sm">Strengths</h5>
                        <ul className="list-disc pl-4 text-sm text-green-700 space-y-1">
                          {critique.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                      <div className="flex-1 bg-rose-50 p-4 rounded-xl border border-rose-100">
                        <h5 className="font-bold text-rose-800 mb-2 text-sm">Weaknesses</h5>
                        <ul className="list-disc pl-4 text-sm text-rose-700 space-y-1">
                          {critique.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Alternative Suggestion */}
                  <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-1 rounded-2xl shadow-lg">
                    <div className="bg-white p-6 rounded-2xl h-full">
                      <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <Zap size={18} className="text-amber-500" /> Proposed Alternative Path
                      </h4>
                      <p className="text-slate-600 text-sm mb-6">{critique.alternativeReasoning}</p>
                      
                      <div className="space-y-3 mb-6">
                        {critique.alternativePath?.map((node, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">
                              {idx + 1}
                            </div>
                            <div>
                              <div className="font-bold text-slate-700">{node.label}</div>
                              <div className="text-xs text-slate-500">{node.reason}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        {showConfirm ? (
                          <div className="flex-1 bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Sparkles className="text-amber-500" size={20} />
                              <div>
                                <p className="font-bold text-amber-800 text-sm">Enhance your path?</p>
                                <p className="text-amber-600 text-xs">These new nodes will be injected immediately into your upcoming curriculum to enhance it.</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setShowConfirm(false)}
                                className="px-3 py-1.5 bg-white text-slate-600 text-sm font-bold border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                              >
                                Cancel
                              </button>
                              <button 
                                onClick={applyAlternative}
                                className="px-3 py-1.5 bg-amber-600 text-white text-sm font-bold rounded-lg hover:bg-amber-700 shadow-sm transition-colors"
                              >
                                Yes, Inject Nodes
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <button 
                              onClick={onClose}
                              className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                            >
                              Keep Current Path
                            </button>
                            <button 
                              onClick={() => setShowConfirm(true)}
                              className="px-5 py-2.5 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors shadow-md shadow-amber-500/20 flex items-center gap-2"
                            >
                              <Target size={16} /> Adopt Alternative Strategy
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-slate-500">
                  Could not generate critique.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PathCritiqueModal;
