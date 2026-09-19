import React from 'react';
import { Info } from 'lucide-react';

export default function DisclaimerBadge({ className = '' }) {
  return (
    <div className={`inline-flex items-start sm:items-center space-x-2 px-3 py-2 rounded-lg bg-sky-50/80 border border-sky-200/80 text-sky-900 text-xs ${className}`}>
      <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5 sm:mt-0" />
      <span>
        <strong>Empirical Estimate:</strong> Calculated using standardized household flow benchmarks, not physical pipe telemetry. Individual fixture flow rates may vary with water pressure.
      </span>
    </div>
  );
}
