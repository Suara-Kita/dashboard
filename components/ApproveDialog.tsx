'use client';

import { useState } from 'react';
import type { Issue } from '@/lib/types';

interface ApproveDialogProps {
  issue: Issue;
  onClose: () => void;
  onApproved: () => void;
  onMarkedToggle?: () => void;
}

export default function ApproveDialog({ issue, onClose, onApproved, onMarkedToggle }: ApproveDialogProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [approving, setApproving] = useState(false);
  const [marked, setMarked] = useState(issue.marked);

  const isReadOnly = issue.status === 'dispatched';

  const handleToggleMark = async () => {
    try {
      const res = await fetch(`/api/v1/issues/${issue.ingestion_id}/mark`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json() as { marked: boolean };
        setMarked(data.marked);
        onMarkedToggle?.();
      }
    } catch {
      // ignore
    }
  };

  const handleApprove = async () => {
    setApproving(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/issues/${issue.ingestion_id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, raw_language: issue.raw_language }),
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-[min(90vw,720px)] max-h-[85vh] glass-panel border border-outline-variant rounded-lg flex flex-col overflow-hidden">
        <div className="p-4 border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-container">
              {isReadOnly ? 'visibility' : 'rate_review'}
            </span>
            <div>
              <h2 className="font-section-header text-section-header text-primary-fixed-dim uppercase">
                {isReadOnly ? 'View Response' : 'Approve Response'}
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

          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded p-3">
            <p className="text-micro-metric text-on-surface-variant uppercase mb-1">Summary</p>
            <p className="text-telemetry-data text-on-surface text-sm">
              {issue.cleaned_summary}
            </p>
          </div>

          {isReadOnly && issue.response_text && (
            <div className="bg-primary-container/10 border border-primary-container/30 rounded p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-sm text-primary-container">check_circle</span>
                <p className="text-micro-metric text-primary-container uppercase font-bold">Response sent</p>
                {issue.dispatched_at && (
                  <span className="text-micro-metric text-on-surface-variant ml-auto">
                    {new Date(issue.dispatched_at).toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-telemetry-data text-on-surface text-sm whitespace-pre-wrap">
                {issue.response_text}
              </p>
            </div>
          )}

          {isReadOnly && !issue.response_text && (
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded p-3">
              <p className="text-micro-metric text-on-surface-variant">No response text recorded</p>
            </div>
          )}

          {!isReadOnly && error && (
            <div className="bg-error/10 border border-error/30 rounded p-3">
              <p className="text-micro-metric text-error">{error}</p>
            </div>
          )}

          {!isReadOnly && (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full flex-1 min-h-[120px] bg-surface-container border border-outline-variant rounded p-3 text-telemetry-data text-on-surface resize-none focus:outline-none focus:border-primary-container transition-colors"
              placeholder="Type your response..."
            />
          )}
        </div>

        <div className="p-4 border-t border-outline-variant flex items-center justify-end gap-3">
          <button
            onClick={handleToggleMark}
            className={`px-4 py-2 text-micro-metric font-bold uppercase rounded transition-colors ${marked ? 'text-[#f97316]' : 'text-on-surface-variant hover:text-on-surface'}`}
            type="button"
          >
            <span className="material-symbols-outlined text-sm align-middle mr-1">
              {marked ? 'push_pin' : 'push_pin'}
            </span>
            {marked ? 'Pinned' : 'Pin'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-micro-metric text-on-surface-variant hover:text-on-surface transition-colors uppercase"
            type="button"
          >
            {isReadOnly ? 'Close' : 'Cancel'}
          </button>
          {!isReadOnly && (
            <button
              onClick={handleApprove}
              disabled={approving || !text.trim()}
              className="px-4 py-2 bg-primary-container text-on-primary-fixed text-micro-metric font-bold uppercase rounded hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              type="button"
            >
              {approving ? 'Approving...' : 'Approve & Send'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
