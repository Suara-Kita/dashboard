const postgres = require('postgres');

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://voter_app:changeme@localhost:5433/voter_intelligence';

async function seed() {
  const sql = postgres(DATABASE_URL);

  // Upsert voter profiles for news outlets
  await sql.unsafe(`
    INSERT INTO voter_profiles (client_identifier, source_channel, display_name, inferred_constituency)
    VALUES ('bharian', 'news_crawler', 'Berita Harian', 'P.141 Sekijang'),
           ('utusan', 'news_crawler', 'Utusan Malaysia', 'P.141 Sekijang')
    ON CONFLICT (client_identifier) DO NOTHING
  `);

  const [bhari] = await sql.unsafe(`SELECT id FROM voter_profiles WHERE client_identifier = 'bharian'`);
  const [utusan] = await sql.unsafe(`SELECT id FROM voter_profiles WHERE client_identifier = 'utusan'`);

  if (bhari) {
    await sql.unsafe(`
      INSERT INTO interactions (ingestion_id, voter_profile_id, source_channel, raw_text, cleaned_summary, primary_category, intent_type, scope, urgency, voter_sentiment, raw_language, status, constituency, ingested_at, processed_at)
      VALUES (gen_random_uuid(), '${bhari.id}', 'news_crawler', 'Kerajaan negeri Johor mengumumkan peruntukan RM5 juta untuk menaik taraf infrastruktur jalan di kawasan Pemanis dan Kemelah.\n\nBaca artikel penuh: https://www.bharian.com.my/berita/nasional/2026/06/sample123', 'Kerajaan negeri Johor peruntuk RM5 juta naik taraf jalan di Pemanis dan Kemelah', 'infrastructure', 'report', 'local', 'high', 'positive', 'malay', 'pending', 'P.141 Sekijang - N.03 Pemanis', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '30 minutes')
    `);
    console.log('Inserted bharian news article');
  }

  if (utusan) {
    await sql.unsafe(`
      INSERT INTO interactions (ingestion_id, voter_profile_id, source_channel, raw_text, cleaned_summary, primary_category, intent_type, scope, urgency, voter_sentiment, raw_language, status, constituency, ingested_at, processed_at)
      VALUES (gen_random_uuid(), '${utusan.id}', 'news_crawler', 'Program bantuan bakul makanan terus diperluas ke lebih 5,000 penerima di kawasan Parlimen Sekijang.\n\nBaca artikel penuh: https://www.utusan.com.my/berita/2026/06/sample456', 'Program bantuan bakul makanan diperluas ke 5,000 penerima di Sekijang', 'welfare_and_aid', 'report', 'local', 'medium', 'neutral', 'malay', 'pending', 'P.141 Sekijang - N.04 Kemelah', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '90 minutes')
    `);
    console.log('Inserted utusan news article');
  }

  await sql.end();
  console.log('Seed complete');
}

seed().catch((err) => { console.error(err); process.exit(1); });
