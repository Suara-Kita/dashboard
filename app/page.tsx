'use client';

import { useRef, useState, useCallback } from 'react';
import BackgroundWrapper from "@/components/BackgroundWrapper";
import ColumnMap from "@/components/ColumnMap";
import ColumnIncomingFeed from "@/components/ColumnIncomingFeed";
import ApproveDialog from "@/components/ApproveDialog";
import type { Issue } from "@/lib/types";

export default function DashboardPage() {
  const [dialogIssue, setDialogIssue] = useState<Issue | null>(null);
  const responseCache = useRef<Map<string, string>>(new Map());

  const openDialog = useCallback((issue: Issue) => setDialogIssue(issue), []);
  const closeDialog = useCallback(() => setDialogIssue(null), []);

  return (
    <>
      <BackgroundWrapper>
        <ColumnMap />
      </BackgroundWrapper>
      <main className="fixed inset-0 z-10 flex gap-0 p-2">
        <div className="w-full h-full flex p-lg gap-4 overflow-hidden pt-16">
          <ColumnIncomingFeed onOpenDialog={openDialog} />
        </div>
      </main>

      {dialogIssue && (
        <ApproveDialog
          issue={dialogIssue}
          cache={responseCache.current}
          onClose={closeDialog}
          onApproved={closeDialog}
        />
      )}
    </>
  );
}
