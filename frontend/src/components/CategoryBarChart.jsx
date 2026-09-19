import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CATEGORY_COLORS = {
  bathing: { bar: 'bg-ocean-600', text: 'text-ocean-700' },
  toilet: { bar: 'bg-aqua-500', text: 'text-aqua-700' },
  kitchen: { bar: 'bg-teal-500', text: 'text-teal-700' },
  laundry: { bar: 'bg-indigo-500', text: 'text-indigo-700' },
  cleaning: { bar: 'bg-amber-500', text: 'text-amber-700' },
  gardening: { bar: 'bg-emerald-500', text: 'text-emerald-700' },
  leakage: { bar: 'bg-rose-500', text: 'text-rose-700' },
  other: { bar: 'bg-slate-500', text: 'text-slate-700' },
};

export default function CategoryBarChart({ breakdown = [] }) {
  const [hoveredKey, setHoveredKey] = useState(null);
  const maxLiters = Math.max(...breakdown.map((b) => b.liters_per_day), 1);

  return (
    <div className="space-y-4 pt-1">
      {breakdown.map((item, index) => {
        const color = CATEGORY_COLORS[item.category_key] || { bar: 'bg-slate-500', text: 'text-slate-700' };
        const relativeWidth = Math.min(100, Math.round((item.liters_per_day / maxLiters) * 100));
        const isHovered = hoveredKey === item.category_key;

        return (
          <div
            key={item.category_key}
            onMouseEnter={() => setHoveredKey(item.category_key)}
            onMouseLeave={() => setHoveredKey(null)}
            className={`p-2.5 rounded-xl transition-all duration-150 ${
              isHovered ? 'bg-slate-50 border border-slate-200/80 shadow-xs' : 'border border-transparent'
            }`}
          >
            {/* Top Label Row */}
            <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
              <div className="flex items-center space-x-2">
                <span className={`w-2.5 h-2.5 rounded-sm ${color.bar} shrink-0`}></span>
                <span className="font-bold text-slate-800 tracking-tight">{item.category_name}</span>
                <span className="text-slate-400 text-xs hidden md:inline">• {item.description}</span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="font-extrabold text-slate-900 text-xs sm:text-sm font-sans">
                  {item.liters_per_day.toLocaleString()} L/day
                </span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  {item.percentage}%
                </span>
              </div>
            </div>

            {/* Horizontal progress bar with entrance animation */}
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${relativeWidth}%` }}
                transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`h-full rounded-full ${color.bar} ${isHovered ? 'brightness-110' : ''} transition-all`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
