const postgres = require('postgres');

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://voter_app:changeme@localhost:5433/voter_intelligence';

async function check() {
  const sql = postgres(DATABASE_URL);
  const news = await sql.unsafe(`
    SELECT i.ingestion_id, i.cleaned_summary, i.source_channel, i.constituency, i.marked, vp.client_identifier, vp.display_name
    FROM interactions i
    LEFT JOIN voter_profiles vp ON i.voter_profile_id = vp.id
    WHERE i.source_channel = 'news_crawler'
    ORDER BY i.ingested_at DESC
    LIMIT 5
  `);
  console.log(JSON.stringify(news, null, 2));
  await sql.end();
}

check().catch(console.error);
