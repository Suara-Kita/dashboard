'use client';

import { useState, useEffect } from 'react';
import type { DashboardMetrics, Issue } from './types';

interface DashboardData {
  metrics: DashboardMetrics | null;
  issues: Issue[];
  loading: boolean;
  error: string | null;
}

export function useDashboardData(statusFilter?: string, sort?: string): DashboardData {
  const [data, setData] = useState<DashboardData>({
    metrics: null,
    issues: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    const params = new URLSearchParams({ per_page: '50' });
    if (statusFilter) params.set('status', statusFilter);
    if (sort) params.set('sort', sort);
    params.append('exclude_source_channel', 'news_crawler');
    params.append('exclude_source_channel', 'web_portal');

    async function fetchData() {
      try {
        const [metricsRes, issuesRes] = await Promise.all([
          fetch('/api/v1/dashboard/metrics'),
          fetch(`/api/v1/issues?${params.toString()}`),
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

export function useMarkedData(refreshKey?: number): { issues: Issue[]; loading: boolean; error: string | null } {
  const [data, setData] = useState<{ issues: Issue[]; loading: boolean; error: string | null }>({
    issues: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const res = await fetch('/api/v1/issues?marked=true&per_page=50');
        if (!res.ok) throw new Error('Failed to fetch marked issues');
        const json = await res.json() as { data: Issue[] };
        if (!cancelled) setData({ issues: json.data ?? [], loading: false, error: null });
      } catch (err) {
        if (!cancelled) setData({ issues: [], loading: false, error: (err as Error).message });
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 10_000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [refreshKey]);

  return data;
}

export function useOnnAIUnmatched(): { issues: Issue[]; loading: boolean; error: string | null } {
  const [data, setData] = useState<{ issues: Issue[]; loading: boolean; error: string | null }>({
    issues: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const res = await fetch('/api/v1/issues?source_channel=web_portal&per_page=50');
        if (!res.ok) throw new Error('Failed to fetch onn-ai queries');
        const json = await res.json() as { data: Issue[] };
        if (!cancelled) setData({ issues: json.data ?? [], loading: false, error: null });
      } catch (err) {
        if (!cancelled) setData({ issues: [], loading: false, error: (err as Error).message });
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 15_000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  return data;
}

export function useNewsData(): { issues: Issue[]; loading: boolean; error: string | null } {
  const [data, setData] = useState<{ issues: Issue[]; loading: boolean; error: string | null }>({
    issues: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const res = await fetch('/api/v1/issues?source_channel=news_crawler&per_page=50');
        if (!res.ok) throw new Error('Failed to fetch news');
        const json = await res.json() as { data: Issue[] };
        if (!cancelled) setData({ issues: json.data ?? [], loading: false, error: null });
      } catch (err) {
        if (!cancelled) setData({ issues: [], loading: false, error: (err as Error).message });
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 30_000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  return data;
}
