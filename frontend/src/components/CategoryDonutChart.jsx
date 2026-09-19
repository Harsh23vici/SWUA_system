import React, { useState } from 'react';

const CATEGORY_COLORS = {
  bathing: '#0284c7',    // ocean-600
  toilet: '#06b6d4',     // cyan-500
  kitchen: '#14b8a6',    // teal-500
  laundry: '#6366f1',    // indigo-500
  cleaning: '#f59e0b',   // amber-500
  gardening: '#10b981',  // emerald-500
  leakage: '#f43f5e',    // rose-500
  other: '#8b5cf6',      // purple-500
};

export default function CategoryDonutChart({ breakdown = [], totalLiters = 0 }) {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Filter out zero-usage categories
  const activeCategories = breakdown.filter((item) => item.liters_per_day > 0);

  // SVG parameters
  const size = 260;
  const strokeWidth = 36;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Compute stroke offsets
  let accumulatedPercent = 0;
  const segments = activeCategories.map((cat) => {
    const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += cat.percentage;
    const color = CATEGORY_COLORS[cat.category_key] || '#94a3b8';
    return {
      ...cat,
      strokeDasharray,
      strokeDashoffset,
      color,
    };
  });

  const activeSegment = hoveredCategory
    ? segments.find((s) => s.category_key === hoveredCategory)
    : segments[0];

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4">
      {/* Donut graphic */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          {/* Colored Segments */}
          {segments.map((seg) => (
            <circle
              key={seg.category_key}
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke={seg.color}
              strokeWidth={hoveredCategory === seg.category_key ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={seg.strokeDasharray}
              strokeDashoffset={seg.strokeDashoffset}
              strokeLinecap="round"
              className="cursor-pointer transition-all duration-300 hover:opacity-90"
              onMouseEnter={() => setHoveredCategory(seg.category_key)}
              onMouseLeave={() => setHoveredCategory(null)}
            />
          ))}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {hoveredCategory && activeSegment ? activeSegment.category_name : 'Total Daily'}
          </span>
          <span className="text-2xl font-black text-slate-800 tracking-tight mt-0.5">
            {hoveredCategory && activeSegment
              ? `${activeSegment.liters_per_day} L`
              : `${totalLiters} L`}
          </span>
          <span className="text-xs font-bold text-ocean-600">
            {hoveredCategory && activeSegment ? `${activeSegment.percentage}%` : '100%'}
          </span>
        </div>
      </div>

      {/* Legend list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
        {segments.map((seg) => (
          <div
            key={seg.category_key}
            onMouseEnter={() => setHoveredCategory(seg.category_key)}
            onMouseLeave={() => setHoveredCategory(null)}
            className={`flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer border ${
              hoveredCategory === seg.category_key
                ? 'bg-sky-50/80 border-sky-300 shadow-sm'
                : 'bg-white/60 border-slate-100 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-2 truncate pr-2">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: seg.color }}
              />
              <span className="font-medium text-slate-700 truncate">
                {seg.category_name}
              </span>
            </div>
            <div className="text-right shrink-0">
              <span className="font-bold text-slate-800">{seg.liters_per_day} L</span>
              <span className="text-slate-400 ml-1">({seg.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
