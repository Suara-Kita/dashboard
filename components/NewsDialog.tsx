'use client';

import type { Issue } from '@/lib/types';

const FEED_LABELS: Record<string, string> = {
  bharian: 'Berita Harian',
  utusan: 'Utusan Malaysia',
  sinarharian: 'Sinar Harian',
  nst: 'New Straits Times',
  fmt: 'Free Malaysia Today',
  tmi: 'The Malaysian Insight',
  harakahdaily: 'Harakahdaily',
};

const URL_MARKER = '\n\nBaca artikel penuh: ';

function parseNewsContent(rawText: string): { body: string; url: string | null } {
  const idx = rawText.lastIndexOf(URL_MARKER);
  if (idx === -1) return { body: rawText, url: null };
  return {
    body: rawText.slice(0, idx).trim(),
    url: rawText.slice(idx + URL_MARKER.length).trim(),
  };
}

interface NewsDialogProps {
  issue: Issue;
  onClose: () => void;
}

export default function NewsDialog({ issue, onClose }: NewsDialogProps) {
  const outlet = FEED_LABELS[issue.voter?.client_identifier ?? ''] ?? issue.voter?.client_identifier?.toUpperCase() ?? 'NEWS';
  const { body, url } = parseNewsContent(issue.raw_text);
  const isRelevant = issue.status !== 'noise';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-[min(90vw,720px)] max-h-[85vh] glass-panel border border-outline-variant rounded-lg flex flex-col overflow-hidden">
        <div className="p-4 border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary-fixed-dim">newspaper</span>
            <div>
              <h2 className="font-section-header text-section-header text-secondary-fixed-dim uppercase">
                {outlet}
              </h2>
              <p className="text-micro-metric text-on-surface-variant">
                {issue.primary_category && `${issue.primary_category} · `}
                {new Date(issue.ingested_at).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-2 py-0.5 text-[9px] font-bold border rounded ${isRelevant ? 'text-primary-container border-primary-container/30 bg-primary-container/10' : 'text-on-surface-variant border-outline-variant bg-surface-container'}`}>
              {isRelevant ? 'RELEVANT' : 'GENERAL'}
            </span>
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-on-surface transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-4 p-4">
          {issue.cleaned_summary && (
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded p-3">
              <p className="text-micro-metric text-secondary-fixed-dim uppercase mb-1">Summary</p>
              <p className="text-telemetry-data text-on-surface text-sm leading-relaxed">
                {issue.cleaned_summary}
              </p>
            </div>
          )}

          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded p-3">
            <p className="text-micro-metric text-on-surface-variant uppercase mb-1">Original Content</p>
            <p className="text-telemetry-data text-on-surface text-sm leading-relaxed whitespace-pre-wrap">
              {body}
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-outline-variant flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-micro-metric text-on-surface-variant hover:text-on-surface transition-colors uppercase"
            type="button"
          >
            Close
          </button>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-secondary-fixed-dim/20 border border-secondary-fixed-dim/30 text-secondary-fixed-dim text-micro-metric font-bold uppercase rounded hover:bg-secondary-fixed-dim/30 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              Read Original Article
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
