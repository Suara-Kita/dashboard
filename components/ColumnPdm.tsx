"use client";

import { useState } from "react";
import { pdmEntries, type PdmEntry } from "@/lib/pdm-data";

function filterEntries(entries: PdmEntry[], query: string): PdmEntry[] {
  if (!query.trim()) return entries;
  const q = query.toLowerCase();
  return entries.filter(
    (e) =>
      e.nama_pdm.toLowerCase().includes(q) ||
      e.kod_pdm.toLowerCase().includes(q) ||
      e.pusat_daerah_mengundi.toLowerCase().includes(q) ||
      e.ketua_pdm_pengerusi.toLowerCase().includes(q) ||
      e.alamat_pdm.toLowerCase().includes(q) ||
      e.dun.toLowerCase().includes(q),
  );
}

export default function ColumnPdm() {
  const [search, setSearch] = useState("");

  const filtered = filterEntries(pdmEntries, search);

  return (
    <div className="w-80 glass-panel border border-primary-container/30 rounded flex flex-col overflow-hidden shadow-[0_0_12px_rgba(0,230,57,0.18)]">
      <div className="p-2 border-b border-primary-container/20">
        <h2 className="text-section-header font-bold text-primary-container uppercase tracking-widest text-xs">
          PDM Directory
        </h2>
        <span className="text-[10px] text-on-surface-variant">
          {filtered.length} polling district{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="px-2 py-1.5">
        <input
          type="text"
          placeholder="Search PDM..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface-container-high text-on-surface text-xs rounded px-2 py-1.5 border border-outline-variant/30 placeholder-on-surface-variant outline-none focus:border-primary-container"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 px-2 pb-2">
        {filtered.map((entry) => (
          <div
            key={entry.kod_pdm + entry.pusat_daerah_mengundi}
            className="glass-panel border border-primary-container/10 rounded p-2 space-y-0.5 cursor-default hover:bg-primary-container/5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-primary-container">
                {entry.nama_pdm}
              </span>
              <span className="text-[9px] text-on-surface-variant font-mono">
                {entry.kod_pdm}
              </span>
            </div>
            <div className="text-[10px] text-on-surface/80 space-y-0.5">
              <p className="text-secondary-fixed-dim text-[9px] uppercase tracking-wider">
                {entry.pusat_daerah_mengundi}
              </p>
              <p>{entry.alamat_pdm}</p>
              <div className="flex justify-between text-[9px] text-on-surface-variant">
                <span>{entry.dun ? `DUN: ${entry.dun}` : ""}</span>
                <span>{entry.saluran} saluran</span>
              </div>
              <div className="flex justify-between text-[9px] border-t border-primary-container/10 pt-0.5 mt-0.5">
                <span>{entry.ketua_pdm_pengerusi}</span>
                <span className="font-mono">{entry.no_telefon}</span>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-[10px] text-on-surface-variant text-center py-4">
            No PDM found
          </p>
        )}
      </div>
    </div>
  );
}
