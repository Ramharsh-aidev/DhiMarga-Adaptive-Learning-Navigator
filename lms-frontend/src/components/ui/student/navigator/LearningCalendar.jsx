import React, { useMemo } from 'react';
import { useNavigator } from '../../../../context/NavigatorContext';
import { Calendar as CalendarIcon } from 'lucide-react';

const LearningCalendar = ({ path }) => {
  const learningDates = path?.learningDates || [];

  const { calendarGrid, totalDays } = useMemo(() => {
    // Generate last 12 weeks of data
    const today = new Date();
    const weeks = 12;
    const daysInWeek = 7;
    const grid = [];
    
    let totalActive = 0;

    // Start from 12 weeks ago, aligned to Sunday
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (weeks * daysInWeek) + (today.getDay() === 0 ? 0 : 7 - today.getDay())); 

    for (let w = 0; w < weeks; w++) {
      const week = [];
      for (let d = 0; d < daysInWeek; d++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + (w * daysInWeek + d));
        
        const dateString = date.toISOString().split('T')[0];
        const isActive = learningDates.includes(dateString);
        
        if (isActive) totalActive++;
        
        week.push({
          date: dateString,
          isActive,
          isFuture: date > today
        });
      }
      grid.push(week);
    }

    return { calendarGrid: grid, totalDays: totalActive };
  }, [learningDates]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-800 font-semibold">
          <CalendarIcon size={18} className="text-indigo-600" />
          <h3>Learning Consistency</h3>
        </div>
        <span className="text-xs font-medium bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
          {totalDays} Active Days
        </span>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-2 custom-scrollbar justify-end">
        {calendarGrid.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-1">
            {week.map((day, dIdx) => (
              <div 
                key={`${wIdx}-${dIdx}`}
                title={day.date}
                className={`w-3.5 h-3.5 rounded-sm ${
                  day.isFuture 
                    ? 'bg-transparent' 
                    : day.isActive 
                      ? 'bg-indigo-500 shadow-[0_0_4px_rgba(99,102,241,0.5)] ring-1 ring-indigo-400' 
                      : 'bg-slate-100 border border-slate-200'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 text-xs text-slate-400 flex justify-end items-center gap-2">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3.5 h-3.5 bg-slate-100 rounded-sm"></div>
          <div className="w-3.5 h-3.5 bg-indigo-300 rounded-sm"></div>
          <div className="w-3.5 h-3.5 bg-indigo-500 rounded-sm"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default LearningCalendar;
