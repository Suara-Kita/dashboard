import { NextRequest, NextResponse } from 'next/server';
import { query as sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const rows = await sql(
      `UPDATE interactions SET marked = NOT marked WHERE ingestion_id = $1 RETURNING marked`,
      [id],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ marked: rows[0].marked });
  } catch (error) {
    console.error('Mark API error:', error);
    return NextResponse.json(
      { error: 'Failed to toggle mark' },
      { status: 500 },
    );
  }
}
