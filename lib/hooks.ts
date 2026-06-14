'use client';

import { useState, useEffect } from 'react';
import type { DashboardMetrics, Issue } from './types';

interface DashboardData {
  metrics: DashboardMetrics | null;
  issues: Issue[];
  loading: boolean;
  error: string | null;
}

export function useDashboardData(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    metrics: null,
    issues: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const [metricsRes, issuesRes] = await Promise.all([
          fetch('/api/v1/dashboard/metrics'),
          fetch('/api/v1/issues?per_page=20'),
        ]);

        if (!metricsRes.ok || !issuesRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const metrics = await metricsRes.json() as DashboardMetrics;
        const issuesJson = await issuesRes.json() as { data: Issue[] };
        const issues = issuesJson.data ?? [];

        if (!cancelled) {
          setData({ metrics, issues, loading: false, error: null });
        }
      } catch (err) {
        if (!cancelled) {
          setData({ metrics: null, issues: [], loading: false, error: (err as Error).message });
        }
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 15_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return data;
}
