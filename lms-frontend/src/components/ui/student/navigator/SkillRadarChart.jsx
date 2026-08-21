import React, { useMemo } from 'react';
import { useNavigator } from '../../../../context/NavigatorContext';

const SkillRadarChart = ({ path, width = 300, height = 300 }) => {
  const chartData = useMemo(() => {
    if (!path || !path.capabilityGraph || !path.learnerState) return [];

    const categories = {};
    const nodes = path.capabilityGraph.nodes || {};
    
    // Group skills by category
    Object.keys(nodes).forEach(nodeId => {
      const node = nodes[nodeId];
      const cat = node.category || 'General';
      
      if (!categories[cat]) categories[cat] = { total: 0, count: 0 };
      
      const score = path.learnerState[nodeId]?.masteryScore || 0;
      categories[cat].total += score;
      categories[cat].count += 1;
    });

    // Calculate averages
    return Object.keys(categories).map(cat => ({
      category: cat,
      score: Math.round(categories[cat].total / categories[cat].count)
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
        <polygon
          points={polygonPoints}
          fill="rgba(99, 102, 241, 0.2)"
          stroke="#4f46e5"
          strokeWidth="2"
        />

        {/* Data Points & Labels */}
        {chartData.map((d, i) => {
          const p = getPoint(d.score, i, chartData.length);
          const labelP = getPoint(115, i, chartData.length); // Push labels out slightly
          
          let textAnchor = "middle";
          if (labelP.x > cx + 10) textAnchor = "start";
          if (labelP.x < cx - 10) textAnchor = "end";

          return (
            <g key={`point-${i}`}>
              <circle cx={p.x} cy={p.y} r="4" fill="#4f46e5" />
              <text
                x={labelP.x}
                y={labelP.y}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                className="text-[10px] font-medium fill-slate-600"
              >
                {d.category}
              </text>
              <text
                x={labelP.x}
                y={labelP.y + 12}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                className="text-[10px] font-bold fill-indigo-600"
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
