import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, GitCompare } from 'lucide-react';
import { getAvailableGraphs } from '../../services/navigatorService';
import Layout from '../../components/layout/Layout';

export default function CareerCompare() {
  const navigate = useNavigate();
  const [graphs, setGraphs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [roleA, setRoleA] = useState('');
  const [roleB, setRoleB] = useState('');

  useEffect(() => {
    getAvailableGraphs().then(data => {
      setGraphs(data);
      setLoading(false);
    }).catch(console.error);
  }, []);

  const graphA = graphs.find(g => g.slug === roleA);
  const graphB = graphs.find(g => g.slug === roleB);

  // Calculate Comparison
  let shared = [];
  let uniqueA = [];
  let uniqueB = [];

  if (graphA && graphB) {
    const nodesA = graphA.nodes || [];
    const nodesB = graphB.nodes || [];
    
    const idsA = nodesA.map(n => n.skillId);
    const idsB = nodesB.map(n => n.skillId);
    
    shared = nodesA.filter(n => idsB.includes(n.skillId));
    uniqueA = nodesA.filter(n => !idsB.includes(n.skillId));
    uniqueB = nodesB.filter(n => !idsA.includes(n.skillId));
  }

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
        <button 
          onClick={() => navigate('/student/careers')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 font-medium transition-colors"
        >
          <ArrowLeft size={20} /> Back to Careers
        </button>

        <h1 className="text-4xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
          <GitCompare className="text-violet-600" size={36} />
          Career Path Comparison
        </h1>
        <p className="text-slate-600 mb-10 text-lg">Select two career paths to compare their required skills and find the overlap.</p>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Select Role A</h2>
                <select 
                  className="w-full p-4 rounded-xl border border-slate-200 focus:border-violet-500 outline-none"
                  value={roleA}
                  onChange={(e) => setRoleA(e.target.value)}
                >
                  <option value="">-- Select Role --</option>
                  {graphs.map(g => (
                    <option key={g.slug} value={g.slug} disabled={g.slug === roleB}>{g.name}</option>
                  ))}
                </select>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Select Role B</h2>
                <select 
                  className="w-full p-4 rounded-xl border border-slate-200 focus:border-violet-500 outline-none"
                  value={roleB}
                  onChange={(e) => setRoleB(e.target.value)}
                >
                  <option value="">-- Select Role --</option>
                  {graphs.map(g => (
                    <option key={g.slug} value={g.slug} disabled={g.slug === roleA}>{g.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {graphA && graphB && (
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
                <div className="flex items-center justify-center gap-8 mb-12">
                  <div className="text-center">
                    <div className="text-4xl font-extrabold text-slate-900 mb-1">{graphA.nodes?.length || 0}</div>
                    <div className="text-sm text-slate-500 font-bold uppercase">{graphA.name} Skills</div>
                  </div>
                  <div className="w-px h-16 bg-slate-300"></div>
                  <div className="text-center">
                    <div className="text-4xl font-extrabold text-violet-600 mb-1">{shared.length}</div>
                    <div className="text-sm text-slate-500 font-bold uppercase">Shared Skills</div>
                  </div>
                  <div className="w-px h-16 bg-slate-300"></div>
                  <div className="text-center">
                    <div className="text-4xl font-extrabold text-slate-900 mb-1">{graphB.nodes?.length || 0}</div>
                    <div className="text-sm text-slate-500 font-bold uppercase">{graphB.name} Skills</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Unique to {graphA.name}</h3>
                    <ul className="space-y-2">
                      {uniqueA.map(n => (
                        <li key={n.skillId} className="text-sm text-slate-600 py-1">{n.label}</li>
                      ))}
                      {uniqueA.length === 0 && <li className="text-sm text-slate-400 italic">No unique skills</li>}
                    </ul>
                  </div>

                  <div className="bg-violet-50 rounded-2xl p-6 border border-violet-100 shadow-sm relative transform md:-translate-y-4">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                      Overlap
                    </div>
                    <h3 className="font-bold text-violet-900 mb-4 pb-2 border-b border-violet-200 text-center">Shared Foundation</h3>
                    <ul className="space-y-2">
                      {shared.map(n => (
                        <li key={n.skillId} className="text-sm text-violet-700 py-1 text-center font-medium">{n.label}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Unique to {graphB.name}</h3>
                    <ul className="space-y-2">
                      {uniqueB.map(n => (
                        <li key={n.skillId} className="text-sm text-slate-600 py-1">{n.label}</li>
                      ))}
                      {uniqueB.length === 0 && <li className="text-sm text-slate-400 italic">No unique skills</li>}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
