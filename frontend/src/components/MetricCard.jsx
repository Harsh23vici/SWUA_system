import React from 'react';

export default function MetricCard({
  title,
  value,
  unit = 'Liters',
  subtitle,
  icon: Icon,
  badge,
  badgeType = 'info', // 'info', 'success', 'warning', 'danger'
  highlight = false,
}) {
  const badgeStyles = {
    info: 'bg-ocean-50 text-ocean-700 border-ocean-200/80',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/80',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/80',
  };

  return (
    <div
      className={`relative p-5 sm:p-6 rounded-2xl transition-all duration-200 ${
        highlight
          ? 'bg-gradient-to-br from-white via-ocean-50/30 to-white border-2 border-ocean-300 shadow-md shadow-ocean-500/5'
          : 'premium-card hover:border-slate-300 hover:shadow-premium-hover'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
          {title}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            <Icon className="w-4 h-4 text-ocean-600" />
          </div>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="mt-3.5 flex items-baseline space-x-1.5">
        <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
          {value}
        </span>
        {unit && (
          <span className="text-xs sm:text-sm font-semibold text-slate-500">
            {unit}
          </span>
        )}
      </div>

      {/* Bottom Subtitle / Badge */}
      <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
        {subtitle && <span className="text-slate-500 font-medium">{subtitle}</span>}
        {badge && (
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
              badgeStyles[badgeType] || badgeStyles.info
            }`}
          >
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
