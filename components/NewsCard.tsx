"use client";

import type { Issue } from "@/lib/types";

const FEED_LABELS: Record<string, string> = {
  bharian: "Berita Harian",
  utusan: "Utusan Malaysia",
  sinarharian: "Sinar Harian",
  nst: "New Straits Times",
  fmt: "Free Malaysia Today",
  tmi: "The Malaysian Insight",
  harakahdaily: "Harakahdaily",
};

interface NewsCardProps {
  issue: Issue;
  isNew?: boolean;
  onClick?: () => void;
}

export default function NewsCard({ issue, isNew, onClick }: NewsCardProps) {
  const isRelevant = issue.status !== "noise";
  const outlet = FEED_LABELS[issue.voter?.client_identifier ?? ""] ?? issue.voter?.client_identifier?.toUpperCase() ?? "NEWS";

  return (
    <div
      className={`p-2 glass-panel relative overflow-hidden flex flex-col gap-2 rounded border transition-colors cursor-pointer ${isNew ? "animate-enter" : ""}`}
      onClick={onClick}
      style={{
        backgroundColor: `color-mix(in srgb, var(--color-secondary-fixed-dim) ${isRelevant ? 12 : 6}%, transparent)`,
        borderColor: `color-mix(in srgb, var(--color-secondary-fixed-dim) ${isRelevant ? 30 : 15}%, transparent)`,
        borderWidth: 1,
        borderStyle: "solid",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="flex justify-between items-start relative z-10">
        <span className="text-[9px] font-bold uppercase text-secondary-fixed-dim">
          {outlet}
        </span>
        <span className="text-micro-metric text-on-surface-variant">
          {new Date(issue.ingested_at).toLocaleTimeString()}
        </span>
      </div>
      <p className="text-telemetry-data text-on-surface font-bold leading-tight relative z-10 line-clamp-4">
        {issue.cleaned_summary ?? issue.raw_text}
      </p>
      <div className="flex gap-2 relative z-10 flex-wrap">
        {issue.primary_category && (
          <span className="px-1 text-[8px] font-bold border rounded"
            style={{
              color: "var(--color-secondary-fixed-dim)",
              backgroundColor: "color-mix(in srgb, var(--color-secondary-fixed-dim) 15%, transparent)",
              borderColor: "color-mix(in srgb, var(--color-secondary-fixed-dim) 30%, transparent)",
            }}
          >
            {issue.primary_category.toUpperCase()}
          </span>
        )}
        <span className={`px-1 text-[8px] border rounded ${isRelevant ? "text-primary-container border-primary-container/30 bg-primary-container/10" : "text-on-surface-variant border-outline-variant bg-surface-container"}`}>
          {isRelevant ? "RELEVANT" : "GENERAL"}
        </span>
      </div>
    </div>
  );
}
