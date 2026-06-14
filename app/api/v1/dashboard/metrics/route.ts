import { NextResponse } from 'next/server';
import { query as sql } from '@/lib/db';
import { redis } from '@/lib/redis';
import type { DashboardMetrics } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [pendingRows, approvedRows, highUrgencyRows, votersRows] =
      await Promise.all([
        sql("SELECT COUNT(*)::int AS count FROM interactions WHERE status = 'pending'"),
        sql("SELECT COUNT(*)::int AS count FROM interactions WHERE status = 'approved'"),
        sql("SELECT COUNT(*)::int AS count FROM interactions WHERE status = 'pending' AND urgency = 'high'"),
        sql("SELECT COUNT(*)::int AS count FROM voter_profiles"),
      ]);

    const pendingCount = (pendingRows[0] as { count: number })?.count ?? 0;
    const approvedCount = (approvedRows[0] as { count: number })?.count ?? 0;
    const highUrgencyCount = (highUrgencyRows[0] as { count: number })?.count ?? 0;
    const votersCount = (votersRows[0] as { count: number })?.count ?? 0;

    let queueVoterInputs = 0;
    let queueApprovedActions = 0;
    try {
      const [vDepth, aDepth] = await Promise.all([
        redis.llen('main_triage:voter_inputs'),
        redis.llen('queue:approved_actions'),
      ]);
      queueVoterInputs = vDepth;
      queueApprovedActions = aDepth;
    } catch {
      // Redis unavailable — return 0 for queue depths
    }

    const metrics: DashboardMetrics = {
      total_raw_inputs: pendingCount,
      total_approved: approvedCount,
      total_voters: votersCount,
      high_urgency_pending: highUrgencyCount,
      queue_voter_inputs_depth: queueVoterInputs,
      queue_approved_actions_depth: queueApprovedActions,
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Metrics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 },
    );
  }
}
