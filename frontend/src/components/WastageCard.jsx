import React from 'react';
import { ArrowUpRight, CheckCircle2, Sparkles, Droplets } from 'lucide-react';
import { useWater } from '../context/WaterContext';

export default function WastageCard({ point }) {
  const { setActiveView, sendChatMessage } = useWater();

  const handleAskAdvisor = () => {
    setActiveView('chat');
    sendChatMessage(`How can I fix or reduce water waste from my ${point.category_name.toLowerCase()}?`);
  };

  const difficultyColors = {
    Easy: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    Moderate: 'bg-amber-50 text-amber-700 border-amber-200/80',
    Investment: 'bg-ocean-50 text-ocean-700 border-ocean-200/80',
  };

  const formattedRank = String(point.rank).padStart(2, '0');

  return (
    <div className="premium-card p-5 sm:p-6 rounded-2xl flex flex-col justify-between hover:border-slate-300 hover:shadow-premium-hover transition-all">
      <div>
        {/* Top Header with Rank and Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2.5">
            <span className="text-xs font-mono font-bold text-ocean-700 bg-ocean-50 px-2 py-0.5 rounded-md border border-ocean-200/70">
              {formattedRank}
            </span>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">
              {point.category_name}
            </h4>
          </div>
          <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${difficultyColors[point.difficulty] || difficultyColors.Easy}`}>
            {point.difficulty} Fix
          </span>
        </div>

        {/* Current Impact vs Savings Potential Bar */}
        <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/70 mb-3.5 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Estimated Impact</span>
            <span className="font-bold text-slate-800 flex items-center space-x-1 mt-0.5">
              <Droplets className="w-3.5 h-3.5 text-rose-500" />
              <span>~{point.estimated_water_impact_lpd.toLocaleString()} L/day</span>
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Potential Savings</span>
            <span className="font-bold text-emerald-700 flex items-center space-x-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>+{point.potential_water_saving_lpd.toLocaleString()} L/day</span>
            </span>
          </div>
        </div>

        {/* Why it matters */}
        <div className="mb-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Why it matters
          </span>
          <p className="text-xs text-slate-600 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-100">
            {point.why_it_matters}
          </p>
        </div>

        {/* Recommended Action */}
        <div className="mb-4">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
            Action
          </span>
          <p className="text-xs text-slate-800 leading-relaxed font-medium bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-200/60">
            {point.recommended_action}
          </p>
        </div>
      </div>

      {/* Action CTA */}
      <button
        onClick={handleAskAdvisor}
        className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-50 hover:bg-ocean-50 text-slate-700 hover:text-ocean-700 text-xs font-semibold border border-slate-200 hover:border-ocean-300 transition-all group"
      >
        <Sparkles className="w-3.5 h-3.5 text-ocean-600 group-hover:scale-110 transition-transform" />
        <span>Ask Aqua Advisor how to fix this</span>
        <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-ocean-600 transition-colors" />
      </button>
    </div>
  );
}
