import { NextRequest, NextResponse } from 'next/server';
import { query as sql } from '@/lib/db';
import type { Issue, PaginatedResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const urgency = searchParams.get('urgency');
    const scope = searchParams.get('scope');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get('per_page') || '20', 10)));

    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (status) { conditions.push(`i.status = $${idx++}`); params.push(status); }
    if (category) { conditions.push(`i.primary_category = $${idx++}`); params.push(category); }
    if (urgency) { conditions.push(`i.urgency = $${idx++}`); params.push(urgency); }
    if (scope) { conditions.push(`i.scope = $${idx++}`); params.push(scope); }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (page - 1) * perPage;

    const countRows = await sql(
      `SELECT COUNT(*)::int AS total FROM interactions i ${where}`,
      params,
    );
    const total = (countRows[0] as { total: number })?.total ?? 0;

    const limitIdx = idx++;
    const offsetIdx = idx++;
    const rows = await sql(
      `SELECT
        i.ingestion_id, i.source_channel, i.raw_text, i.cleaned_summary,
        i.primary_category, i.intent_type, i.scope, i.urgency,
        i.voter_sentiment, i.status, i.raw_language, i.rejection_reason,
        i.ingested_at, i.processed_at, i.constituency,
        vp.client_identifier, vp.display_name, vp.inferred_constituency
      FROM interactions i
      LEFT JOIN voter_profiles vp ON i.voter_profile_id = vp.id
      ${where}
      ORDER BY i.ingested_at DESC
      LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
      [...params, perPage, offset],
    );

    const issues: Issue[] = rows.map((r: Record<string, unknown>) => ({
      ingestion_id: r.ingestion_id as string,
      source_channel: r.source_channel as string,
      raw_text: r.raw_text as string,
      cleaned_summary: r.cleaned_summary as string,
      constituency: r.constituency as string | null,
      primary_category: r.primary_category as string,
      intent_type: r.intent_type as string,
      scope: r.scope as string,
      urgency: r.urgency as string,
      voter_sentiment: r.voter_sentiment as string,
      status: r.status as string,
      raw_language: r.raw_language as string,
      rejection_reason: r.rejection_reason as string | null,
      ingested_at: r.ingested_at as string,
      processed_at: r.processed_at as string | null,
      voter: r.client_identifier
        ? {
            client_identifier: r.client_identifier as string,
            display_name: r.display_name as string | null,
            inferred_constituency: r.inferred_constituency as string | null,
          }
        : null,
    }));

    const response: PaginatedResponse<Issue> = {
      data: issues,
      total,
      page,
      per_page: perPage,
      total_pages: Math.ceil(total / perPage),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Issues API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch issues' },
      { status: 500 },
    );
  }
}
