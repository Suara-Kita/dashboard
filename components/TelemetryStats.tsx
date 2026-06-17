'use client';

import { useState, useEffect } from 'react';

interface ConstituencyStats {
  pemanis: number;
  kemelah: number;
  total: number;
}

export default function TelemetryStats() {
  const [stats, setStats] = useState<ConstituencyStats>({ pemanis: 0, kemelah: 0, total: 0 });

  useEffect(() => {
    let cancelled = false;
    async function fetchStats() {
      try {
        const res = await fetch('/api/v1/stats/constituency');
        if (res.ok) {
          const data = (await res.json()) as ConstituencyStats;
          if (!cancelled) setStats(data);
        }
      } catch {
        /* ignore */
      }
    }
    fetchStats();
    const interval = setInterval(fetchStats, 15_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex items-center gap-md px-md">
      <div className="flex flex-col items-end">
        <span className="text-micro-metric text-on-surface-variant uppercase">DUN Pemanis</span>
        <span className="font-telemetry-data text-primary-container text-sm">{stats.pemanis}</span>
      </div>
      <div className="h-8 w-px bg-outline-variant/30" />
      <div className="flex flex-col items-end">
        <span className="text-micro-metric text-on-surface-variant uppercase">DUN Kemelah</span>
        <span className="font-telemetry-data text-secondary-fixed-dim text-sm">{stats.kemelah}</span>
      </div>
      <div className="h-8 w-px bg-outline-variant/30" />
      <div className="flex flex-col items-end">
        <span className="text-micro-metric text-on-surface-variant uppercase">Total</span>
        <span className="font-telemetry-data text-on-primary-container text-sm">{stats.total}</span>
      </div>
    </div>
  );
}
