"use client";

import { useState, useEffect } from "react";

interface CategoryItem {
  category: string;
  count: number;
}

interface ConstituencyStats {
  pemanis: number;
  kemelah: number;
  total: number;
  categories: CategoryItem[];
}

function labelFromCategory(category: string): string {
  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function TelemetryStats() {
  const [stats, setStats] = useState<ConstituencyStats>({
    pemanis: 0,
    kemelah: 0,
    total: 0,
    categories: [],
  });

  useEffect(() => {
    let cancelled = false;
    async function fetchStats() {
      try {
        const res = await fetch("/api/v1/stats/constituency");
        if (res.ok) {
          const data = (await res.json()) as ConstituencyStats;
          if (!cancelled) setStats(data);
        }
      } catch {
        /* ignore */
      }
    }
    fetchStats();
    const interval = setInterval(fetchStats, 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div className="flex items-center gap-md px-md ml-auto mt-5">
        <div className="flex flex-col items-end w-32">
          <span className="text-xs text-on-surface-variant uppercase">
            Pemanis
          </span>
          <span className="font-telemetry-data text-primary-container text-5xl">
            {stats.pemanis}
          </span>
        </div>
        <div className="h-12 w-px bg-outline-variant/30" />
        <div className="flex flex-col items-end w-32">
          <span className="text-xs text-on-surface-variant uppercase">
            Kemelah
          </span>
          <span className="font-telemetry-data text-secondary-fixed-dim text-5xl">
            {stats.kemelah}
          </span>
        </div>
        <div className="h-12 w-px bg-outline-variant/30" />
        <div className="flex flex-col items-end w-32">
          <span className="text-xs text-on-surface-variant uppercase">
            Total
          </span>
          <span className="font-telemetry-data text-on-primary-container text-5xl">
            {stats.total}
          </span>
        </div>
      </div>

      <div className="fixed top-24 right-0 mt-3 mr-4 w-64 glass-panel border border-primary-container/30 rounded p-2 space-y-1 z-50 shadow-[0_0_15px_rgba(0,255,65,0.1)]">
        <div className="pb-1.5 mb-1.5 border-b border-primary-container/20">
          <span className="text-micro-metric font-bold text-primary-container uppercase tracking-widest">
            Metric Breakdown
          </span>
        </div>
        <div className="space-y-0.5 font-telemetry-data">
          {stats.categories.map((item) => (
            <div
              key={item.category}
              className="flex justify-between text-[10px] text-on-surface/80 hover:bg-primary-container/10 px-1 py-0.5 rounded cursor-default"
            >
              <span>{labelFromCategory(item.category)}</span>
              <span className="text-primary-container">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
