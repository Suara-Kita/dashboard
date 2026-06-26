"use client";

import { useRef, useState, useEffect } from "react";
import DataCard from "./DataCard";
import { useDashboardData } from "@/lib/hooks";
import type { Issue } from "@/lib/types";

interface ColumnFeedProps {
  title: string;
  statusFilter: string;
  onOpenDialog: (issue: Issue) => void;
}

export default function ColumnFeed({
  title,
  statusFilter,
  onOpenDialog,
}: ColumnFeedProps) {
  const sort = statusFilter === 'dispatched' ? 'dispatched_at' : undefined;
  const { issues, loading, error } = useDashboardData(statusFilter, sort);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const prevIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const currentIds = new Set(issues.map((i) => i.ingestion_id));
    const fresh = [...currentIds].filter((id) => !prevIdsRef.current.has(id));
    prevIdsRef.current = currentIds;

    if (fresh.length === 0) return;

    setNewIds((prev) => {
      const next = new Set(prev);
      fresh.forEach((id) => next.add(id));
      return next;
    });

    const timer = setTimeout(() => {
      setNewIds((prev) => {
        const next = new Set(prev);
        fresh.forEach((id) => next.delete(id));
        return next;
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [issues]);

  return (
    <div className="w-80 p-sm flex flex-col gap-sm glass-panel border border-outline-variant rounded-lg overflow-hidden border-glow opacity-50">
      <div className="p-md bg-surface-container-lowest border-b border-outline-variant p-2">
        <h2 className="font-section-header text-section-header text-primary-fixed-dim uppercase mb-md">
          {title}
        </h2>
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
            No {statusFilter} issues
          </p>
        )}
        {issues.map((issue) => (
          <DataCard
            key={issue.ingestion_id}
            issue={issue}
            isNew={newIds.has(issue.ingestion_id)}
            onClick={
              issue.source_channel === "telegram"
                ? () => onOpenDialog(issue)
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
