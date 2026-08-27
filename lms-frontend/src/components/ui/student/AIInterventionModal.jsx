import React, { useState, useEffect } from 'react';
import Modal from '../../../components/common/Modal';
import { Loader2, Zap, ArrowRight, Activity, TrendingUp } from 'lucide-react';
import { useNavigator } from '../../../context/NavigatorContext';
import { aiService } from '../../../services/aiService';

export default function AIInterventionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [interventions, setInterventions] = useState(null);
  const { state } = useNavigator();

  useEffect(() => {
    const handleOpen = async (e) => {
      setIsOpen(true);
      setLoading(true);
      
      try {
        const stateData = e.detail || { debt: 0, activeGaps: 0, progress: 0 };
        const data = await aiService.generateInterventions(stateData);
        setInterventions(data);
      } catch (err) {
        console.error(err);
        setInterventions({
          diagnosis: "Could not generate insights at this time.",
          options: []
        });
      } finally {
        setLoading(false);
      }
    };

    window.addEventListener('OPEN_AI_INTERVENTION_MODAL', handleOpen);
    return () => window.removeEventListener('OPEN_AI_INTERVENTION_MODAL', handleOpen);
  }, [state]);

  const handleApply = (id) => {
    // Here we would dispatch an action to inject the intervention into the path
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="AI Path Analysis & Interventions" size="lg">
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center text-slate-500">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-violet-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <Loader2 className="w-16 h-16 animate-spin text-violet-600 relative z-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Analyzing Path Efficiency...</h3>
          <p className="text-center max-w-sm">The AI is reviewing your learning debt, gap resolution speed, and upcoming dependencies to formulate optimal interventions.</p>
        </div>
      ) : interventions ? (
        <div className="p-6">
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-8 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-indigo-500/10 opacity-50">
              <Activity size={120} />
            </div>
            <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2 text-lg relative z-10">
              <Zap size={24} className="text-indigo-600 fill-indigo-600" /> 
              AI Diagnostic Report
            </h3>
            <p className="text-indigo-800 leading-relaxed font-medium relative z-10 text-[15px]">
              {interventions.diagnosis}
            </p>
          </div>

          <h4 className="font-bold text-slate-900 mb-4 text-lg flex items-center gap-2">
            <TrendingUp size={20} className="text-slate-400" />
            Suggested Interventions
          </h4>
          
          <div className="space-y-4">
            {interventions.options.map(opt => (
              <div key={opt.id} className="border border-slate-200 rounded-2xl p-5 hover:border-violet-300 hover:shadow-md transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                <div>
                  <div className="font-bold text-slate-800 text-lg mb-1">{opt.title}</div>
                  <div className="text-sm text-slate-600 mb-3 max-w-md leading-relaxed">{opt.description}</div>
                  <div className={`text-xs font-bold inline-block px-3 py-1.5 rounded-lg ${opt.impactColor}`}>
                    {opt.impact}
                  </div>
                </div>
                <button 
                  onClick={() => handleApply(opt.id)}
                  className="shrink-0 px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  {opt.actionText} <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
