"use client";

import { useState } from "react";
import type { Issue } from "@/lib/types";

interface DataCardProps {
  issue: Issue;
  isNew?: boolean;
  onClick?: () => void;
}

function urgencyColor(urgency: string): string {
  switch (urgency) {
    case "high":
      return "error";
    case "medium":
      return "secondary-fixed-dim";
    default:
      return "primary-container";
  }
}

function issueType(issue: Issue): string {
  if (issue.urgency === "high") return "Critical Alert";
  if (issue.source_channel === "telegram") return "Voter Feed";
  if (issue.scope === "national") return "National Pulse";
  return "Intelligence";
}

function sourceLabel(issue: Issue): string {
  if (issue.voter?.client_identifier)
    return `TG:${issue.voter.client_identifier.slice(0, 10)}`;
  return issue.source_channel.toUpperCase();
}

export default function DataCard({ issue, isNew, onClick }: DataCardProps) {
  const [hovered, setHovered] = useState(false);
  const color = urgencyColor(issue.urgency);
  const bgColor = `var(--color-${color})`;
  const borderOpacity = hovered ? 0.6 : 0.3;
  const isClickable = onClick != null && issue.status === 'pending';

  return (
    <div
      className={`p-2 glass-panel relative overflow-hidden flex flex-col gap-2 transition-colors ${isClickable ? 'cursor-pointer' : ''} group ${isNew ? 'animate-enter' : ''}`}
      style={{
        backgroundColor: `color-mix(in srgb, ${bgColor} ${hovered ? 20 : 10}%, transparent)`,
        borderColor: `color-mix(in srgb, ${bgColor} ${borderOpacity * 100}%, transparent)`,
        borderWidth: 1,
        borderStyle: "solid",
        transition: "background-color 0.2s, border-color 0.2s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={isClickable ? onClick : undefined}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="flex justify-between items-start relative z-10">
        <span
          className="text-micro-metric font-bold uppercase"
          style={{ color: bgColor }}
        >
          {issueType(issue)}
        </span>
        <span className="text-micro-metric text-on-surface-variant">
          {new Date(issue.ingested_at).toLocaleTimeString()}
        </span>
      </div>
      <p className="text-telemetry-data text-on-surface font-bold leading-tight relative z-10">
        {issue.cleaned_summary || issue.raw_text}
      </p>
      <div className="flex gap-2 relative z-10">
        <span
          className="px-1 text-[8px] font-bold border rounded"
          style={{
            color: `var(--color-on-${color})`,
            backgroundColor: bgColor,
            borderColor: `color-mix(in srgb, ${bgColor} 20%, transparent)`,
          }}
        >
          {(issue.urgency ?? "unknown").toUpperCase()}
        </span>
        <span className="px-1 bg-surface-container-highest text-[8px] text-on-surface-variant border border-outline-variant rounded">
          {sourceLabel(issue)}
        </span>
      </div>
    </div>
  );
}
