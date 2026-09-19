import React from 'react';
import { X, Globe2, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function SdgInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 border border-sky-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-ocean-600 flex items-center justify-center text-white shadow-md shadow-ocean-500/20">
              <Globe2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-ocean-600 uppercase tracking-wider">
                United Nations Sustainable Development Goals
              </span>
              <h3 className="text-xl font-extrabold text-slate-800">
                SDG 6: Clean Water and Sanitation
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-5 space-y-5 text-sm text-slate-600 leading-relaxed">
          {/* Target 6.4 Banner */}
          <div className="p-4 rounded-2xl bg-ocean-50/80 border border-ocean-200">
            <span className="font-bold text-ocean-900 block mb-1">
              Direct Alignment: Target 6.4 (Water-use Efficiency)
            </span>
            <p className="text-xs text-ocean-800">
              <em>
                "By 2030, substantially increase water-use efficiency across all sectors and ensure sustainable withdrawals and supply of freshwater to address water scarcity."
              </em>
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-2">How this application supports SDG 6</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Democratizes Water Literacy:</strong> Most urban households have zero visibility into where their water flows. This tool converts opaque monthly bills into tangible daily category breakdowns.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Empowers Demand-Side Conservation:</strong> Water utility infrastructure suffers severe peak strains. Helping individual homes trim 50–100 liters daily reduces pressure on groundwater aquifers.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Identifies Invisible Leaks:</strong> Silent toilet leaks and dripping faucets quietly waste over 30% of domestic water without providing any utility.
                </span>
              </li>
            </ul>
          </div>

          {/* Honest perspective note */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3 text-xs text-slate-600">
            <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <strong>Realistic Stewardship:</strong> This advisor encourages responsible domestic behavior. It does not claim to single-handedly resolve agricultural water stress or global water governance, but provides meaningful personal action toward collective sustainability.
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-ocean-600 hover:bg-ocean-700 text-white font-semibold text-sm transition-colors shadow-sm"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
