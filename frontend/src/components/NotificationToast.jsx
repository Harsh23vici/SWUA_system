import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function NotificationToast({ error, success, onClose }) {
  if (!error && !success) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-short">
      {error && (
        <div className="flex items-start space-x-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 shadow-lg">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">{error}</div>
          <button
            onClick={onClose}
            className="text-rose-400 hover:text-rose-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && !error && (
        <div className="flex items-start space-x-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">{success}</div>
          <button
            onClick={onClose}
            className="text-emerald-400 hover:text-emerald-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
