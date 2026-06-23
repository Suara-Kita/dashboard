import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  const [dunRows, catRows] = await Promise.all([
    query(
      `SELECT
         constituency,
         COUNT(*)::int AS count
       FROM interactions
       WHERE constituency IN ($1, $2)
         AND source_channel != 'news_crawler'
       GROUP BY constituency`,
      ['P.141 Sekijang - N.03 Pemanis', 'P.141 Sekijang - N.04 Kemelah'],
    ),
    query(
      `SELECT primary_category, COUNT(*)::int AS count
       FROM interactions
       WHERE primary_category IS NOT NULL AND primary_category != ''
         AND source_channel != 'news_crawler'
       GROUP BY primary_category
       ORDER BY count DESC`,
    ),
  ]);

  const map = Object.fromEntries(dunRows.map((r: Record<string, unknown>) => [r.constituency, r.count]));
  const pemanis = (map['P.141 Sekijang - N.03 Pemanis'] as number) ?? 0;
  const kemelah = (map['P.141 Sekijang - N.04 Kemelah'] as number) ?? 0;

  const categories = catRows.map((r: Record<string, unknown>) => ({
    category: r.primary_category as string,
    count: r.count as number,
  }));

  return NextResponse.json({ pemanis, kemelah, total: pemanis + kemelah, categories });
}
