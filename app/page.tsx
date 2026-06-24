"use client";

import { useState, useCallback } from "react";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import ColumnMap from "@/components/ColumnMap";
import ColumnFeed from "@/components/ColumnFeed";
import ColumnNews from "@/components/ColumnNews";
import ColumnPdm from "@/components/ColumnPdm";
import SettingsDialog from "@/components/SettingsDialog";
import ApproveDialog from "@/components/ApproveDialog";
import NewsDialog from "@/components/NewsDialog";
import type { Issue } from "@/lib/types";
import type { ColumnFeedConfig } from "@/lib/types";

const DEFAULT_COLUMNS: ColumnFeedConfig[] = [
  {
    id: "incoming",
    title: "Incoming Data Feed",
    statusFilter: "pending",
    visible: true,
    kind: "feed",
  },
  {
    id: "dispatched",
    title: "Dispatched",
    statusFilter: "dispatched",
    visible: true,
    kind: "feed",
  },
  {
    id: "news",
    title: "News Daily",
    statusFilter: "",
    visible: true,
    kind: "news",
  },
  {
    id: "pdm",
    title: "PDM Directory",
    statusFilter: "",
    visible: true,
  },
];

export default function DashboardPage() {
  const [dialogIssue, setDialogIssue] = useState<Issue | null>(null);
  const [newsDialogIssue, setNewsDialogIssue] = useState<Issue | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [columns, setColumns] = useState<ColumnFeedConfig[]>(DEFAULT_COLUMNS);

  const openDialog = useCallback((issue: Issue) => setDialogIssue(issue), []);
  const closeDialog = useCallback(() => setDialogIssue(null), []);
  const openNewsDialog = useCallback((issue: Issue) => setNewsDialogIssue(issue), []);
  const closeNewsDialog = useCallback(() => setNewsDialogIssue(null), []);

  const toggleColumn = useCallback((id: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === id ? { ...col, visible: !col.visible } : col,
      ),
    );
  }, []);

  return (
    <>
      <BackgroundWrapper>
        <ColumnMap />
      </BackgroundWrapper>
      <main className="fixed inset-0 z-10 flex flex-col gap-0 p-2">
        <div className="w-full h-full flex p-lg gap-4 overflow-hidden pt-16">
          {columns
            .filter((c) => c.visible)
            .map((col) =>
              col.id === "pdm" ? (
                <ColumnPdm key={col.id} />
              ) : col.kind === "news" ? (
                <ColumnNews key={col.id} title={col.title} onOpenDialog={openNewsDialog} />
              ) : (
                <ColumnFeed
                  key={col.id}
                  title={col.title}
                  statusFilter={col.statusFilter}
                  onOpenDialog={openDialog}
                />
              ),
            )}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 w-full z-50 p-md flex items-center bg-gradient-to-t from-background to-transparent pointer-events-none p-2">
        <button
          type="button"
          onClick={() => setShowSettings(true)}
          className="pointer-events-auto bg-primary-container/20 border border-primary-container text-primary-container font-bold text-xs px-md p-2 rounded active:scale-95 transition-transform uppercase flex items-center gap-sm"
        >
          <span className="material-symbols-outlined text-sm">settings</span>
        </button>
      </footer>

      {showSettings && (
        <SettingsDialog
          columns={columns}
          onToggle={toggleColumn}
          onClose={() => setShowSettings(false)}
        />
      )}

      {dialogIssue && (
        <ApproveDialog
          issue={dialogIssue}
          onClose={closeDialog}
          onApproved={closeDialog}
        />
      )}

      {newsDialogIssue && (
        <NewsDialog
          issue={newsDialogIssue}
          onClose={closeNewsDialog}
        />
      )}
    </>
  );
}
