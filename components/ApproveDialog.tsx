'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Issue } from '@/lib/types';

interface ApproveDialogProps {
  issue: Issue;
  cache: Map<string, string>;
  onClose: () => void;
  onApproved: () => void;
}

export default function ApproveDialog({ issue, cache, onClose, onApproved }: ApproveDialogProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(!cache.has(issue.ingestion_id));
  const [error, setError] = useState<string | null>(null);
  const [approving, setApproving] = useState(false);

  const loadGenerated = useCallback(async () => {
    const cached = cache.get(issue.ingestion_id);
    if (cached) {
      setText(cached);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/v1/issues/${issue.ingestion_id}/generate`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed to generate' }));
        throw new Error(err.error || 'Failed to generate');
      }
      const data = await res.json() as { text: string };
      cache.set(issue.ingestion_id, data.text);
      setText(data.text);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [issue.ingestion_id, cache]);

  useEffect(() => {
    loadGenerated();
  }, [loadGenerated]);

  const handleTextChange = (value: string) => {
    setText(value);
    cache.set(issue.ingestion_id, value);
  };

  const handleApprove = async () => {
    setApproving(true);
    try {
      const res = await fetch(`/api/v1/issues/${issue.ingestion_id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Approve failed' }));
        throw new Error(err.error || 'Approve failed');
      }

      onApproved();
    } catch (err) {
      setError((err as Error).message);
      setApproving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[min(90vw,720px)] max-h-[85vh] glass-panel border border-outline-variant rounded-lg flex flex-col overflow-hidden">
        <div className="p-4 border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-container">rate_review</span>
            <div>
              <h2 className="font-section-header text-section-header text-primary-fixed-dim uppercase">
                Approve Response
              </h2>
              <p className="text-micro-metric text-on-surface-variant">
                {issue.primary_category} &middot; {issue.urgency.toUpperCase()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-4 p-4">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded p-3">
            <p className="text-micro-metric text-on-surface-variant uppercase mb-1">Original message</p>
            <p className="text-telemetry-data text-on-surface text-sm">
              {issue.raw_text}
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <span className="text-micro-metric text-on-surface-variant animate-pulse">
                Generating response...
              </span>
            </div>
          )}

          {error && (
            <div className="bg-error/10 border border-error/30 rounded p-3">
              <p className="text-micro-metric text-error">{error}</p>
            </div>
          )}

          {!loading && (
            <textarea
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full flex-1 min-h-[120px] bg-surface-container border border-outline-variant rounded p-3 text-telemetry-data text-on-surface resize-none focus:outline-none focus:border-primary-container transition-colors"
              placeholder="Response text..."
            />
          )}
        </div>

        <div className="p-4 border-t border-outline-variant flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-micro-metric text-on-surface-variant hover:text-on-surface transition-colors uppercase"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleApprove}
            disabled={loading || approving || !text.trim()}
            className="px-4 py-2 bg-primary-container text-on-primary-fixed text-micro-metric font-bold uppercase rounded hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            type="button"
          >
            {approving ? 'Approving...' : 'Approve & Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
