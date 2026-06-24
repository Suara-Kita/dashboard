'use client';

import { useState } from 'react';
import type { ColumnFeedConfig } from '@/lib/types';

interface SettingsDialogProps {
  columns: ColumnFeedConfig[];
  onToggle: (id: string) => void;
  onClose: () => void;
  markerStyle: "green" | "saluran";
  onMarkerStyleChange: (style: "green" | "saluran") => void;
}

export default function SettingsDialog({ columns, onToggle, onClose, markerStyle, onMarkerStyleChange }: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<"windows" | "marker">("windows");

  const tabClass = (tab: "windows" | "marker") =>
    `px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
      activeTab === tab
        ? 'text-[#00f0ff] border-b-2 border-[#00f0ff]'
        : 'text-on-surface-variant hover:text-on-surface'
    }`;

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
        <div className="flex border-b border-outline-variant">
          <button onClick={() => setActiveTab("windows")} className={tabClass("windows")}>Windows</button>
          <button onClick={() => setActiveTab("marker")} className={tabClass("marker")}>Map Marker</button>
        </div>
        <div className="p-4 space-y-3">
          {activeTab === "windows" && (
            <>
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
            </>
          )}
          {activeTab === "marker" && (
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Marker Color</p>
              <select
                value={markerStyle}
                onChange={(e) => onMarkerStyleChange(e.target.value as "green" | "saluran")}
                className="w-full bg-surface-container-high text-on-surface text-sm border border-outline-variant rounded px-2 py-1.5"
              >
                <option value="green">All Green</option>
                <option value="saluran">By Saluran</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
