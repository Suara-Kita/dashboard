import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  const rows = await query(
    `SELECT
       constituency,
       COUNT(*)::int AS count
     FROM interactions
     WHERE constituency IN ($1, $2)
     GROUP BY constituency`,
    ['P.141 Sekijang - N.03 Pemanis', 'P.141 Sekijang - N.04 Kemelah'],
  );

  const map = Object.fromEntries(rows.map((r: Record<string, unknown>) => [r.constituency, r.count]));
  const pemanis = (map['P.141 Sekijang - N.03 Pemanis'] as number) ?? 0;
  const kemelah = (map['P.141 Sekijang - N.04 Kemelah'] as number) ?? 0;

  return NextResponse.json({ pemanis, kemelah, total: pemanis + kemelah });
}
