import { Flame } from 'lucide-react';

export default function StreakCounter({ streak }) {
  return (
    <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-xl border border-orange-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <Flame className="text-orange-500" size={24} fill="currentColor" />
      <div className="flex flex-col">
        <span className="text-sm font-bold text-orange-600 leading-none mb-1">
          {streak} Day{streak !== 1 ? 's' : ''}
        </span>
        <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">
          Streak
        </span>
      </div>
    </div>
  );
}
