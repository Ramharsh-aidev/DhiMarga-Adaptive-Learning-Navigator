import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { getLeaderboard } from '../../../services/socialService';

export default function LeaderboardWidget() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    getLeaderboard(page, 10).then(data => {
      setLeaders(data.data || []);
      setTotalPages(data.totalPages || 1);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [page]);

  if (loading && leaders.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <Trophy className="text-amber-600" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Global Leaderboard</h2>
            <p className="text-sm text-slate-500">Top learners by XP</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 min-h-[300px]">
        {leaders.map((leader, index) => {
          const globalRank = page * 10 + index;
          return (
            <div key={leader.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${globalRank === 0 ? 'bg-amber-100 text-amber-600' : globalRank === 1 ? 'bg-slate-100 text-slate-600' : globalRank === 2 ? 'bg-orange-100 text-orange-700' : 'bg-transparent text-slate-400'}`}>
                  {globalRank < 3 ? <Medal size={16} /> : `#${globalRank + 1}`}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{leader.displayName}</div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <span>Lvl {leader.level}</span>
                    <span className="flex items-center gap-1 text-orange-500">
                      <Flame size={12} /> {leader.streak}
                    </span>
                  </div>
                </div>
              </div>
              <div className="font-extrabold text-violet-600 bg-violet-50 px-3 py-1 rounded-lg">
                {leader.xp} XP
              </div>
            </div>
          );
        })}
        {leaders.length === 0 && (
          <div className="text-center py-10 text-slate-500">No learners found.</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
          <button 
            disabled={page === 0} 
            onClick={() => setPage(p => p - 1)}
            className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium text-slate-600">Page {page + 1} of {totalPages}</span>
          <button 
            disabled={page >= totalPages - 1} 
            onClick={() => setPage(p => p + 1)}
            className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
