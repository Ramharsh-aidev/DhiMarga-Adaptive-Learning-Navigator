import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const LearningVelocityChart = ({ path }) => {
  const chartData = useMemo(() => {
    if (!path?.nodes) return [];

    // Group completions by week
    const weeks = {};
    const now = new Date();
    
    // Initialize last 8 weeks
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - (i * 7));
      weeks[`W${8-i}`] = { label: `Week ${8-i}`, count: 0 };
    }

    path.nodes.forEach(node => {
      if (node.completedAt) {
        const completedDate = new Date(node.completedAt);
        const diffTime = Math.abs(now - completedDate);
        const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
        if (diffWeeks < 8) {
          weeks[`W${8 - diffWeeks}`].count += 1;
        }
      }
    });

    return Object.values(weeks);
  }, [path]);

  const maxCount = Math.max(1, ...chartData.map(d => d.count));
  const height = 100;
  const width = 300;
  
  const getPoints = () => {
    return chartData.map((d, i) => {
      const x = (i / (chartData.length - 1)) * width;
      const y = height - (d.count / maxCount) * height * 0.8; // leaving some top padding
      return `${x},${y}`;
    }).join(' ');
  };

  const points = getPoints();
  const fillPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-800 font-bold">
          <Activity size={18} className="text-violet-600" />
          <h3>Learning Velocity</h3>
        </div>
        <span className="text-xs font-bold text-slate-500">
          Last 8 Weeks
        </span>
      </div>

      <div className="relative w-full h-24 mt-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(124, 58, 237, 0.4)" />
              <stop offset="100%" stopColor="rgba(124, 58, 237, 0.0)" />
            </linearGradient>
          </defs>
          
          {/* Fill */}
          <motion.polygon
            points={fillPoints}
            fill="url(#velocityGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          />
          
          {/* Line */}
          <motion.polyline
            points={points}
            fill="none"
            stroke="#7c3aed"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          {/* Points */}
          {chartData.map((d, i) => {
            const x = (i / (chartData.length - 1)) * width;
            const y = height - (d.count / maxCount) * height * 0.8;
            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill="#ffffff"
                stroke="#7c3aed"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 1 + (i * 0.1) }}
                whileHover={{ scale: 1.5 }}
              />
            );
          })}
        </svg>
      </div>
      
      <div className="flex justify-between mt-2 px-1">
        {chartData.map((d, i) => (
          <span key={i} className="text-[10px] font-bold text-slate-400">
            {i % 2 === 0 ? `W${i+1}` : ''}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LearningVelocityChart;
