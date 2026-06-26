"use client";

import { useRef, useState, useEffect } from "react";
import { useOnnAIUnmatched } from "@/lib/hooks";
import ApproveDialog from "./ApproveDialog";
import type { Issue } from "@/lib/types";

function OnnAICard({
  issue,
  isNew,
  onClick,
}: {
  issue: Issue;
  isNew?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`p-2 glass-panel relative overflow-hidden flex flex-col gap-2 cursor-pointer hover:opacity-80 transition-opacity ${isNew ? "animate-enter" : ""}`}
      style={{
        backgroundColor: "color-mix(in srgb, var(--color-tertiary) 10%, transparent)",
        borderColor: "color-mix(in srgb, var(--color-tertiary) 30%, transparent)",
        borderWidth: 1,
        borderStyle: "solid",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="flex justify-between items-start relative z-10">
        <span className="text-micro-metric font-bold uppercase" style={{ color: "var(--color-tertiary)" }}>
          {issue.primary_category ?? "Unmatched"}
        </span>
        <span className="text-micro-metric text-on-surface-variant">
          {new Date(issue.ingested_at).toLocaleTimeString()}
        </span>
      </div>
      <p className="text-telemetry-data text-on-surface font-bold leading-tight relative z-10">
        {issue.cleaned_summary || issue.raw_text}
      </p>
      <div className="flex gap-2 relative z-10">
        {issue.urgency && (
          <span className="px-1 text-[8px] font-bold border rounded"
            style={{
              color: "var(--color-on-tertiary)",
              backgroundColor: "var(--color-tertiary)",
              borderColor: "color-mix(in srgb, var(--color-tertiary) 20%, transparent)",
            }}>
            {issue.urgency.toUpperCase()}
          </span>
        )}
        <span className="px-1 bg-surface-container-highest text-[8px] text-on-surface-variant border border-outline-variant rounded">
          ONN AI
        </span>
        <span className="px-1 bg-surface-container-highest text-[8px] text-on-surface-variant border border-outline-variant rounded">
          {issue.status.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

export default function ColumnOnnAI({ title }: { title: string }) {
  const { issues, loading, error } = useOnnAIUnmatched();
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const prevRef = useRef<Set<string>>(new Set());
  const [dialogIssue, setDialogIssue] = useState<Issue | null>(null);

  useEffect(() => {
    const current = new Set(issues.map((i) => i.ingestion_id));
    const fresh = [...current].filter((id) => !prevRef.current.has(id));
    prevRef.current = current;

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
    <>
      <div className="w-80 p-sm flex flex-col gap-sm glass-panel border border-outline-variant rounded-lg overflow-hidden border-glow opacity-50">
        <div className="p-md bg-surface-container-lowest border-b border-outline-variant p-2">
          <h2 className="font-section-header text-section-header uppercase mb-md" style={{ color: "var(--color-tertiary)" }}>
            {title}
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-sm">
          {loading && <p className="text-micro-metric text-on-surface-variant text-center py-8">Loading...</p>}
          {error && <p className="text-micro-metric text-error text-center py-8">{error}</p>}
          {!loading && !error && issues.length === 0 && (
            <p className="text-micro-metric text-on-surface-variant text-center py-8">No unmatched queries</p>
          )}
          {issues.map((issue) => (
            <OnnAICard
              key={issue.ingestion_id}
              issue={issue}
              isNew={newIds.has(issue.ingestion_id)}
              onClick={() => setDialogIssue(issue)}
            />
          ))}
        </div>
      </div>

      {dialogIssue && (
        <ApproveDialog
          issue={dialogIssue}
          onClose={() => setDialogIssue(null)}
          onApproved={() => setDialogIssue(null)}
        />
      )}
    </>
  );
}
