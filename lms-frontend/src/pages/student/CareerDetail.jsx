import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, ArrowLeft, CheckCircle2, Circle, AlertCircle, Play } from 'lucide-react';
import { getGraph } from '../../services/navigatorService';
import Layout from '../../components/layout/Layout';
import { useNavigator } from '../../context/NavigatorContext';

export default function CareerDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useNavigator();
  
  const [graph, setGraph] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGraph(slug).then(data => {
      setGraph(data);
      setLoading(false);
    }).catch(e => {
      console.error(e);
      setLoading(false);
    });
  }, [slug]);

  // Verified skills from current active path
  const verifiedSkills = useMemo(() => {
    return Object.values(state.learnerState || {})
      .filter(ls => ls.status === 'verified')
      .map(ls => ls.skillId);
  }, [state.learnerState]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
        </div>
      </Layout>
    );
  }

  if (!graph) {
    return (
      <Layout>
        <div className="p-8 text-center text-slate-500">Career path not found.</div>
      </Layout>
    );
  }

  // Group nodes by category
  const categories = {};
  (graph.nodes || []).forEach(node => {
    const cat = node.category || 'General';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(node);
  });

  const totalSkills = graph.nodes?.length || 0;
  const knownSkills = (graph.nodes || []).filter(n => verifiedSkills.includes(n.skillId)).length;
  const missingSkills = totalSkills - knownSkills;
  const readinessPercent = totalSkills > 0 ? Math.round((knownSkills / totalSkills) * 100) : 0;

  const handleAdoptPath = async () => {
    // This will route the user to the onboarding wizard, pre-selecting this goal
    // Or we can just create the path directly.
    navigate('/student/navigator', { state: { prefilledRole: slug } });
  };

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
        <button 
          onClick={() => navigate('/student/careers')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 font-medium transition-colors"
        >
          <ArrowLeft size={20} /> Back to Careers
        </button>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center shrink-0">
                  <Target className="text-violet-600" size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900">{graph.name}</h1>
                  <p className="text-slate-500">Role-to-Skill Mapping</p>
                </div>
              </div>
              <p className="text-lg text-slate-600 max-w-2xl">{graph.description}</p>
            </div>
            
            <div className="flex flex-col items-end gap-4 shrink-0">
              <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 text-center min-w-[200px]">
                <div className="text-sm text-slate-500 font-bold mb-1 uppercase tracking-wider">Missing Skill Analysis</div>
                <div className="text-3xl font-extrabold text-violet-600">{readinessPercent}% Match</div>
                <div className="text-sm text-slate-600 mt-1">
                  You have {knownSkills} of {totalSkills} skills
                </div>
              </div>
              <button 
                onClick={handleAdoptPath}
                className="w-full px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Play size={18} fill="currentColor" /> Adopt This Path
              </button>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-6">Required Capability Graph</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {Object.entries(categories).map(([cat, nodes]) => (
            <div key={cat} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">{cat}</h3>
              <div className="space-y-3">
                {nodes.map(node => {
                  const isKnown = verifiedSkills.includes(node.skillId);
                  return (
                    <div 
                      key={node.skillId} 
                      className={`flex items-start justify-between p-3 rounded-xl border ${isKnown ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}
                    >
                      <div className="flex items-center gap-3">
                        {isKnown ? (
                          <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                        ) : (
                          <Circle className="text-slate-300 shrink-0" size={20} />
                        )}
                        <div>
                          <p className={`font-bold ${isKnown ? 'text-emerald-900' : 'text-slate-700'}`}>{node.label}</p>
                          <div className="flex gap-4 mt-1 text-xs">
                            <span className={isKnown ? 'text-emerald-600' : 'text-slate-500'}>Mastery Target: {node.masteryThreshold}%</span>
                            <span className={isKnown ? 'text-emerald-600' : 'text-slate-500'}>Goal Relevance: {Math.round(node.goalRelevance * 100)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
