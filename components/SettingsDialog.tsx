'use client';

import type { ColumnFeedConfig } from '@/lib/types';

interface SettingsDialogProps {
  columns: ColumnFeedConfig[];
  onToggle: (id: string) => void;
  onClose: () => void;
}

export default function SettingsDialog({ columns, onToggle, onClose }: SettingsDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-[min(90vw,400px)] bg-surface-container border border-outline-variant rounded-lg shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant">
          <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider">Settings</h2>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
        <div className="p-4 space-y-3">
          {columns.length === 0 && (
            <p className="text-micro-metric text-on-surface-variant text-center py-4">No feeds configured</p>
          )}
          {columns.map((col) => (
            <label
              key={col.id}
              className="flex items-center justify-between cursor-pointer group"
            >
              <span className="text-sm font-medium text-on-surface group-hover:text-primary-container transition-colors">
                {col.title}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={col.visible}
                onClick={() => onToggle(col.id)}
                className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none ${
                  col.visible ? 'bg-[#00f0ff]' : 'bg-surface-container-high'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    col.visible ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
