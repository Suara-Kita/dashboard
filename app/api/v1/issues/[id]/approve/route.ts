import { NextRequest, NextResponse } from 'next/server';
import { query as sql } from '@/lib/db';
import { redis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({})) as { text?: string };
    const customText = body.text?.trim();

    const responseText = customText || '';

    const rows = await sql(
      `UPDATE interactions
       SET status = 'approved', approved_at = NOW(), response_text = $2
       WHERE ingestion_id = $1 AND status = 'pending'
       RETURNING ingestion_id, source_channel, raw_text, cleaned_summary,
                 primary_category, intent_type, scope, urgency, voter_sentiment,
                 response_id`,
      [id, responseText],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Issue not found or already approved' },
        { status: 404 },
      );
    }

    const issue = rows[0] as Record<string, unknown>;

    try {
      if (issue.source_channel === 'telegram') {
        const payload = JSON.stringify({
          ingestion_id: issue.ingestion_id,
          response_id: issue.response_id,
          response: customText || issue.cleaned_summary,
          primary_category: issue.primary_category,
          urgency: issue.urgency,
          approved_at: new Date().toISOString(),
        });
        await redis.lpush('dispatch_telegram_queue', payload);
      }
    } catch {
      console.warn('Redis unavailable, dispatch not enqueued');
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
