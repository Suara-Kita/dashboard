'use client';

import { useRef, useState, useEffect } from 'react';
import DataCard from './DataCard';
import { useDashboardData } from '@/lib/hooks';
import type { Issue } from '@/lib/types';

interface ColumnIncomingFeedProps {
  onOpenDialog: (issue: Issue) => void;
}

export default function ColumnIncomingFeed({ onOpenDialog }: ColumnIncomingFeedProps) {
  const { metrics, issues, loading, error } = useDashboardData();
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const prevIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const currentIds = new Set(issues.map(i => i.ingestion_id));
    const fresh = [...currentIds].filter(id => !prevIdsRef.current.has(id));

    if (fresh.length > 0) {
      setNewIds(prev => {
        const next = new Set(prev);
        fresh.forEach(id => next.add(id));
        return next;
      });
      setTimeout(() => {
        setNewIds(prev => {
          const next = new Set(prev);
          fresh.forEach(id => next.delete(id));
          return next;
        });
      }, 3000);
    }

    prevIdsRef.current = currentIds;
  }, [issues]);

  return (
    <div className="w-80 p-sm flex flex-col gap-sm glass-panel border border-outline-variant rounded-lg overflow-hidden border-glow opacity-50">
      <div className="p-md bg-surface-container-lowest border-b border-outline-variant p-2">
        <h2 className="font-section-header text-section-header text-primary-fixed-dim uppercase mb-md">
          Incoming Data Feed
        </h2>
        <div className="grid grid-cols-3 gap-xs mt-1">
          <div className="flex flex-col items-center p-1 bg-surface-container border border-outline-variant/30 rounded">
            <span className="text-micro-metric text-on-surface-variant uppercase">
              Pending
            </span>
            <span className="font-telemetry-data text-primary-container text-lg">
              {loading ? '...' : (metrics?.total_raw_inputs ?? 0)}
            </span>
          </div>
          <div className="flex flex-col items-center p-1 bg-surface-container border border-outline-variant/30 rounded">
            <span className="text-micro-metric text-on-surface-variant uppercase">
              Approved
            </span>
            <span className="font-telemetry-data text-secondary-fixed-dim text-lg">
              {loading ? '...' : (metrics?.total_approved ?? 0)}
            </span>
          </div>
          <div className="flex flex-col items-center p-1 bg-surface-container border border-outline-variant/30 rounded">
            <span className="text-micro-metric text-on-surface-variant uppercase">
              High Urg
            </span>
            <span className="font-telemetry-data text-on-primary-container text-lg">
              {loading ? '...' : (metrics?.high_urgency_pending ?? 0)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-sm">
        {loading && (
          <p className="text-micro-metric text-on-surface-variant text-center py-8">
            Loading...
          </p>
        )}
        {error && (
          <p className="text-micro-metric text-error text-center py-8">
            {error}
          </p>
        )}
        {!loading && !error && issues.length === 0 && (
          <p className="text-micro-metric text-on-surface-variant text-center py-8">
            No issues yet
          </p>
        )}
        {issues.map((issue) => (
          <DataCard
            key={issue.ingestion_id}
            issue={issue}
            isNew={newIds.has(issue.ingestion_id)}
            onClick={issue.status === 'pending' && issue.source_channel === 'telegram' ? () => onOpenDialog(issue) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
