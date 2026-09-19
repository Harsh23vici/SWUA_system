import React from 'react';
import { ArrowDown, Droplets, ShowerHead, Bath, Utensils, Shirt, Wrench } from 'lucide-react';

const CATEGORY_ICONS = {
  bathing: ShowerHead,
  toilet: Bath,
  kitchen: Utensils,
  laundry: Shirt,
  cleaning: Wrench,
  gardening: Droplets,
  leakage: Droplets,
  other: Droplets,
};

export default function WaterFlowDiagram({ totalLiters = 0, breakdown = [] }) {
  // Take top 4 categories
  const activeBreakdown = breakdown
    .filter((cat) => cat.liters_per_day > 0)
    .slice(0, 4);

  return (
    <div className="premium-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-[11px] font-bold text-ocean-700 uppercase tracking-wider">
            Water Flow Architecture
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">
            Where Every Drop Cascades
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Flow: 100% Inflow
        </span>
      </div>

      {/* Main Flow Chain */}
      <div className="flex flex-col items-center space-y-3">
        {/* Source: Total Water Inflow */}
        <div className="w-full max-w-md p-4 rounded-xl bg-gradient-to-r from-ocean-900 to-ocean-800 text-white shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-aqua-400 fill-aqua-400/30" />
            </div>
            <div>
              <span className="text-[10px] text-ocean-200 uppercase font-bold tracking-wider block">
                Total Household Inflow
              </span>
              <span className="text-lg font-extrabold tracking-tight">
                {totalLiters.toLocaleString()} Liters / day
              </span>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/10 text-ocean-100 border border-white/10">
            100%
          </span>
        </div>

        {/* Down Arrow Connector */}
        <div className="flex items-center justify-center text-slate-300 py-0.5">
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </div>

        {/* Distributed Destination Nodes */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {activeBreakdown.map((item) => {
            const Icon = CATEGORY_ICONS[item.category_key] || Droplets;
            return (
              <div
                key={item.category_key}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-ocean-300 hover:bg-white transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded-lg bg-ocean-50 text-ocean-700 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-ocean-700 bg-ocean-50 px-2 py-0.5 rounded-full">
                    {item.percentage}%
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block truncate">
                    {item.category_name}
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                    {item.liters_per_day.toLocaleString()} L
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
