import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Search, ArrowRight, Briefcase, Zap, CheckCircle2 } from 'lucide-react';
import { getAvailableGraphs } from '../../services/navigatorService';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../hooks/useAuth';
import { useNavigator } from '../../context/NavigatorContext';

export default function CareerExplorer() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state } = useNavigator();
  const [graphs, setGraphs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAvailableGraphs().then(data => {
      setGraphs(data);
      setLoading(false);
    }).catch(e => {
      console.error(e);
      setLoading(false);
    });
  }, []);

  const filteredGraphs = graphs.filter(g => g.name.toLowerCase().includes(search.toLowerCase()) || g.description?.toLowerCase().includes(search.toLowerCase()));

  // Get currently verified skills from active path
  const verifiedSkills = Object.values(state.learnerState || {})
    .filter(ls => ls.status === 'verified')
    .map(ls => ls.skillId);

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight flex items-center gap-3">
            <Briefcase className="text-violet-600" size={40} />
            Career Goal Explorer
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Browse industry-standard capability graphs, see exactly what skills are required, and analyze your readiness for different roles.
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search roles (e.g., Data Analyst, ML Engineer)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-violet-500 focus:ring-0 text-lg transition-colors outline-none"
            />
          </div>
          <button 
            onClick={() => navigate('/student/careers/compare')}
            className="px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold flex items-center gap-2 transition-colors shrink-0"
          >
            Compare Two Roles <ArrowRight size={18} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGraphs.map(graph => {
              // Calculate gap
              const totalNodes = graph.nodes?.length || 0;
              const overlap = (graph.nodes || []).filter(n => verifiedSkills.includes(n.skillId)).length;
              const missing = totalNodes - overlap;
              const matchPercent = totalNodes > 0 ? Math.round((overlap / totalNodes) * 100) : 0;

              return (
                <motion.div
                  key={graph.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col h-full cursor-pointer hover:shadow-xl transition-all"
                  onClick={() => navigate(`/student/careers/${graph.slug}`)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center shrink-0">
                      <Target className="text-violet-600" size={24} />
                    </div>
                    {matchPercent > 30 && (
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={14} /> {matchPercent}% Match
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{graph.name}</h3>
                  <p className="text-slate-500 mb-6 text-sm flex-grow line-clamp-3">
                    {graph.description || `Comprehensive learning path for ${graph.name}.`}
                  </p>
                  
                  <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">Total Skills Required</span>
                      <span className="font-bold text-slate-900">{totalNodes}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">Skills You Have</span>
                      <span className="font-bold text-emerald-600">{overlap}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">Missing Skills</span>
                      <span className="font-bold text-rose-500">{missing}</span>
                    </div>
                  </div>

                  <button className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                    View Role Map <ArrowRight size={18} />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
