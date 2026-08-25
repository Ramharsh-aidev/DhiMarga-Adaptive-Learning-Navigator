import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigator } from '../../../../context/NavigatorContext';

const SkillRadarChart = ({ path, width = 300, height = 300, activeSkillId }) => {
  const chartData = useMemo(() => {
    if (!path || !path.nodes) return [];

    const categories = {};
    const nodes = path.nodes;
    
    // Group skills by category
    nodes.forEach(node => {
      const cat = node.graphNode?.category || 'General';
      
      if (!categories[cat]) categories[cat] = { total: 0, count: 0, nodeIds: [] };
      
      const score = node.masteryScore || 0;
      categories[cat].total += score;
      categories[cat].count += 1;
      categories[cat].nodeIds.push(node.skillId);
    });

    // Calculate averages
    return Object.keys(categories).map(cat => ({
      category: cat,
      score: Math.round(categories[cat].total / categories[cat].count),
      nodeIds: categories[cat].nodeIds
    }));
  }, [path]);

  if (chartData.length < 3) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-50 border border-slate-100 rounded-xl text-slate-400 text-sm p-4 text-center">
        Not enough categories to generate a radar chart. Add more diverse skills.
      </div>
    );
  }

  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(cx, cy) - 40; // padding

  // Generate SVG polygon points
  const getPoint = (value, index, total) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const distance = (value / 100) * radius;
    return {
      x: cx + distance * Math.cos(angle),
      y: cy + distance * Math.sin(angle)
    };
  };

  const polygonPoints = chartData.map((d, i) => {
    const p = getPoint(d.score, i, chartData.length);
    return `${p.x},${p.y}`;
  }).join(' ');

  // Background web points (100%, 75%, 50%, 25%)
  const getWebPoints = (percent) => {
    return chartData.map((d, i) => {
      const p = getPoint(percent, i, chartData.length);
      return `${p.x},${p.y}`;
    }).join(' ');
  };

  return (
    <div className="flex flex-col items-center">
      <svg width={width} height={height} className="overflow-visible">
        {/* Background webs */}
        {[25, 50, 75, 100].map(percent => (
          <polygon
            key={`web-${percent}`}
            points={getWebPoints(percent)}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        ))}

        {/* Axes */}
        {chartData.map((_, i) => {
          const p = getPoint(100, i, chartData.length);
          return (
            <line
              key={`axis-${i}`}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Polygon */}
        <motion.polygon
          points={polygonPoints}
          fill="rgba(124, 58, 237, 0.2)"
          stroke="#7c3aed"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          style={{ transformOrigin: "center" }}
        />

        {/* Data Points & Labels */}
        {chartData.map((d, i) => {
          const p = getPoint(d.score, i, chartData.length);
          const labelP = getPoint(115, i, chartData.length); // Push labels out slightly
          
          let textAnchor = "middle";
          if (labelP.x > cx + 10) textAnchor = "start";
          if (labelP.x < cx - 10) textAnchor = "end";

          const isActiveCategory = activeSkillId && d.nodeIds.includes(activeSkillId);

          return (
            <g key={`point-${i}`}>
              <motion.circle 
                cx={p.x} cy={p.y} 
                r={isActiveCategory ? "6" : "4"} 
                fill="#7c3aed" 
                animate={{ 
                  scale: isActiveCategory ? [1, 1.3, 1] : 1,
                  filter: isActiveCategory ? "drop-shadow(0px 0px 4px rgba(124, 58, 237, 0.8))" : "none"
                }}
                transition={{ repeat: isActiveCategory ? Infinity : 0, duration: 1.5 }}
              />
              <text
                x={labelP.x}
                y={labelP.y}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                className={`text-[10px] transition-all ${isActiveCategory ? 'font-extrabold fill-violet-700' : 'font-medium fill-slate-600'}`}
              >
                {d.category}
              </text>
              <text
                x={labelP.x}
                y={labelP.y + 12}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                className={`text-[10px] font-bold ${isActiveCategory ? 'fill-violet-700' : 'fill-violet-600'}`}
              >
                {d.score}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default SkillRadarChart;
