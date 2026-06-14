import { NextRequest, NextResponse } from 'next/server';
import { query as sql } from '@/lib/db';
import { redis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const rows = await sql(
      `UPDATE interactions
       SET status = 'approved', approved_at = NOW()
       WHERE ingestion_id = $1 AND status = 'pending'
       RETURNING ingestion_id, source_channel, raw_text, cleaned_summary,
                 primary_category, intent_type, scope, urgency, voter_sentiment`,
      [id],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Issue not found or already approved' },
        { status: 404 },
      );
    }

    const issue = rows[0] as Record<string, unknown>;

    try {
      const payload = JSON.stringify({
        ingestion_id: issue.ingestion_id,
        source_channel: issue.source_channel,
        raw_text: issue.raw_text,
        cleaned_summary: issue.cleaned_summary,
        primary_category: issue.primary_category,
        intent_type: issue.intent_type,
        scope: issue.scope,
        urgency: issue.urgency,
        voter_sentiment: issue.voter_sentiment,
        approved_at: new Date().toISOString(),
      });
      await redis.lpush('queue:approved_actions', payload);
    } catch {
      console.warn('Redis unavailable, approved action not enqueued');
    }

    return NextResponse.json({ approved: true, ingestion_id: id });
  } catch (error) {
    console.error('Approve API error:', error);
    return NextResponse.json(
      { error: 'Failed to approve issue' },
      { status: 500 },
    );
  }
}
