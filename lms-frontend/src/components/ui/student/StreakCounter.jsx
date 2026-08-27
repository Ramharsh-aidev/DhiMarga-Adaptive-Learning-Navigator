export default function StreakCounter({ streak }) {
  return (
    <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-xl border border-orange-100 shadow-sm">
      <span className="text-xl">🔥</span>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-orange-600 leading-none">
          {streak} Day{streak !== 1 ? 's' : ''}
        </span>
        <span className="text-[10px] font-semibold text-orange-400 uppercase tracking-wider">
          Streak
        </span>
      </div>
    </div>
  );
}
