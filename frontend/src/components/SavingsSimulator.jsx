import React, { useState } from 'react';
import { Sliders, Sparkles, TrendingDown, ArrowRight, Droplets } from 'lucide-react';
import { useWater } from '../context/WaterContext';

export default function SavingsSimulator() {
  const { formData, calculationResult, setActiveView, sendChatMessage } = useWater();
  const [shavedMinutes, setShavedMinutes] = useState(3);
  const [fixLeak, setFixLeak] = useState(true);

  const numPeople = formData?.num_people || 4;
  const flowRateLpm = 9.5; // Empirical standard showerhead L/min

  // Deterministic client calculations
  const showerSavingsPerDay = Math.round(shavedMinutes * flowRateLpm * numPeople);
  const leakSavingsPerDay = fixLeak && formData.leak_detected !== 'none'
    ? (formData.leak_detected === 'running_toilet' ? 220 : formData.leak_detected === 'dripping_faucet' ? 25 : 80)
    : 0;

  const totalSimulatedSavingsLpd = showerSavingsPerDay + leakSavingsPerDay;
  const totalSimulatedSavingsMonth = Math.round(totalSimulatedSavingsLpd * 30);
  const totalSimulatedSavingsYear = Math.round(totalSimulatedSavingsLpd * 365);

  const handleAskSimulator = () => {
    setActiveView('chat');
    sendChatMessage(`How can my household realistically reduce showers by ${shavedMinutes} minutes each day without losing comfort?`);
  };

  return (
    <div className="premium-card p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-white via-ocean-50/20 to-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-ocean-50 text-ocean-700 flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-ocean-700 uppercase tracking-wider">
              Interactive Impact Modeler
            </span>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              See Your Potential Savings
            </h3>
          </div>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Simulating for <strong>{numPeople} occupants</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Interactive Controls */}
        <div className="lg:col-span-7 space-y-5">
          {/* Shower reduction slider */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                If you reduce each shower by:
              </span>
              <span className="text-sm font-extrabold text-ocean-700 bg-ocean-50 px-2.5 py-0.5 rounded-full border border-ocean-200/80">
                {shavedMinutes} {shavedMinutes === 1 ? 'minute' : 'minutes'}
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="6"
              step="1"
              value={shavedMinutes}
              onChange={(e) => setShavedMinutes(parseInt(e.target.value))}
              className="w-full accent-ocean-600"
            />

            <div className="flex justify-between text-[10px] font-semibold text-slate-400">
              <span>1 min</span>
              <span>2 min</span>
              <span>3 min (Recommended)</span>
              <span>4 min</span>
              <span>5 min</span>
              <span>6 min</span>
            </div>
          </div>

          {/* Leak fix simulation toggle (if leak detected) */}
          {formData.leak_detected !== 'none' && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/80 text-xs">
              <div className="flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-800">
                  Include fixing your reported leak ({formData.leak_detected.replace('_', ' ')})
                </span>
              </div>
              <input
                type="checkbox"
                checked={fixLeak}
                onChange={(e) => setFixLeak(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Right: Projected Savings Outcome Card */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-gradient-to-br from-ocean-900 to-ocean-950 text-white shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-bold text-ocean-200 uppercase tracking-wider block">
              Projected Water Retained
            </span>
            <div className="mt-1 flex items-baseline space-x-1.5">
              <span className="text-3xl sm:text-4xl font-black text-white font-sans">
                +{totalSimulatedSavingsLpd.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-aqua-300">Liters / day</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-ocean-800 text-xs">
            <div>
              <span className="text-[10px] text-ocean-300 block uppercase font-bold">Monthly Savings</span>
              <span className="font-extrabold text-white text-sm">
                ~{totalSimulatedSavingsMonth.toLocaleString()} L
              </span>
            </div>
            <div>
              <span className="text-[10px] text-ocean-300 block uppercase font-bold">Annual Impact</span>
              <span className="font-extrabold text-emerald-400 text-sm">
                ~{totalSimulatedSavingsYear.toLocaleString()} L
              </span>
            </div>
          </div>

          <button
            onClick={handleAskSimulator}
            className="w-full mt-2 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-ocean-950 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-ocean-600" />
            <span>Ask Aqua AI how to achieve this</span>
          </button>
        </div>
      </div>
    </div>
  );
}
