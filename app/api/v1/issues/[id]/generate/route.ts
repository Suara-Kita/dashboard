import { NextRequest, NextResponse } from 'next/server';
import { query as sql } from '@/lib/db';
import { generateResponseText } from '@/lib/llm';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const rows = await sql(
      `SELECT raw_text, cleaned_summary, raw_language
       FROM interactions WHERE ingestion_id = $1`,
      [id],
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    const issue = rows[0] as { raw_text: string; cleaned_summary: string | null; raw_language: string };

    const text = await generateResponseText({
      raw_text: issue.raw_text,
      cleaned_summary: issue.cleaned_summary,
      raw_language: issue.raw_language,
    });

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 },
    );
  }
}
