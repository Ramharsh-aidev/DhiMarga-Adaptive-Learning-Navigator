import React, { useEffect, useState } from 'react';
import { Users, Swords, Globe, Star, ArrowRight, UserPlus } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import LeaderboardWidget from '../../components/ui/student/LeaderboardWidget';
import { getRecommendedMentors, getChallenges, getSquads } from '../../services/socialService';

export default function SocialHub() {
  const [mentors, setMentors] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [squads, setSquads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getRecommendedMentors().catch(() => []),
      getChallenges().catch(() => []),
      getSquads().catch(() => [])
    ]).then(([m, c, s]) => {
      setMentors(m);
      setChallenges(c);
      setSquads(s);
      setLoading(false);
    });
  }, []);

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
          <Globe className="text-violet-600" size={36} />
          Social Hub
        </h1>
        <p className="text-slate-600 mb-10 text-lg">Connect with peers, tackle team challenges, and track your global ranking.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Peer Challenges */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center">
                    <Swords className="text-rose-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Peer Challenges</h2>
                    <p className="text-slate-500">Challenge friends to master skills faster</p>
                  </div>
                </div>
                <button className="text-sm font-bold text-rose-600 bg-rose-50 px-4 py-2 rounded-xl hover:bg-rose-100 transition-colors">
                  + New Challenge
                </button>
              </div>
              
              {loading ? (
                <div className="animate-pulse h-24 bg-slate-100 rounded-2xl"></div>
              ) : challenges.length > 0 ? (
                <div className="space-y-3">
                  {challenges.map(c => (
                    <div key={c.id} className="flex justify-between items-center p-4 border border-slate-200 rounded-2xl">
                      <div>
                        <p className="font-bold text-slate-900">{c.skillName}</p>
                        <p className="text-xs text-slate-500">Status: {c.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                  <p className="text-slate-500 font-medium mb-2">No active challenges.</p>
                  <p className="text-sm text-slate-400">Click '+ New Challenge' to invite a peer!</p>
                </div>
              )}
            </div>

            {/* Team Learning */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Team Learning (Squads)</h2>
                    <p className="text-slate-500">Collaborate on community projects</p>
                  </div>
                </div>
                <button className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors">
                  Join Squad
                </button>
              </div>

              {loading ? (
                <div className="animate-pulse h-24 bg-slate-100 rounded-2xl"></div>
              ) : squads.length > 0 ? (
                <div className="space-y-3">
                  {squads.map(s => (
                    <div key={s.id} className="flex justify-between items-center p-4 border border-slate-200 rounded-2xl">
                      <div>
                        <p className="font-bold text-slate-900">{s.name}</p>
                        <p className="text-xs text-slate-500">Topic: {s.topic}</p>
                      </div>
                      <div className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                        {s.currentMembers}/{s.maxMembers}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                  <p className="text-slate-500 font-medium">No open squads matching your path.</p>
                </div>
              )}
            </div>
            
            {/* Mentor Recommendations */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                  <Star className="text-amber-600" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">AI Mentor Recommendations</h2>
                  <p className="text-slate-500">Find industry experts based on your path</p>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="animate-pulse h-32 bg-slate-100 rounded-2xl"></div>
                  <div className="animate-pulse h-32 bg-slate-100 rounded-2xl"></div>
                </div>
              ) : mentors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mentors.map(m => (
                    <div key={m.id} className="p-4 border border-slate-200 rounded-2xl hover:border-amber-300 transition-colors flex flex-col justify-between cursor-pointer">
                      <div className="mb-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-slate-900">{m.name}</h3>
                          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-md">{m.matchScore}% Match</span>
                        </div>
                        <p className="text-xs text-slate-500">{m.expertise}</p>
                      </div>
                      <button className="flex items-center justify-center gap-2 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-bold rounded-xl transition-colors">
                        <UserPlus size={16} /> Request
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                  <p className="text-slate-500 font-medium">No active mentors found for your current goals.</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <LeaderboardWidget />
          </div>
        </div>
      </div>
    </Layout>
  );
}
