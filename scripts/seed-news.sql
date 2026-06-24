-- Seed dummy news data for testing the feed marking feature
-- Run: psql $DATABASE_URL -f scripts/seed-news.sql

INSERT INTO voter_profiles (client_identifier, source_channel, display_name, inferred_constituency)
VALUES ('bharian', 'news_crawler', 'Berita Harian', 'P.141 Sekijang'),
       ('utusan', 'news_crawler', 'Utusan Malaysia', 'P.141 Sekijang')
ON CONFLICT (client_identifier) DO NOTHING;

INSERT INTO interactions (ingestion_id, voter_profile_id, source_channel, raw_text, cleaned_summary, primary_category, intent_type, scope, urgency, voter_sentiment, raw_language, status, constituency, ingested_at, processed_at)
SELECT
  gen_random_uuid(),
  (SELECT id FROM voter_profiles WHERE client_identifier = 'bharian'),
  'news_crawler',
  'Kerajaan negeri Johor mengumumkan peruntukan RM5 juta untuk menaik taraf infrastruktur jalan di kawasan Pemanis dan Kemelah.' || E'\n\n' || 'Baca artikel penuh: https://www.bharian.com.my/berita/nasional/2026/06/sample123',
  'Kerajaan negeri Johor peruntuk RM5 juta naik taraf jalan di Pemanis dan Kemelah',
  'infrastructure', 'report', 'local', 'high', 'positive', 'malay', 'pending', 'P.141 Sekijang - N.03 Pemanis', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '30 minutes'),

  (gen_random_uuid(),
  (SELECT id FROM voter_profiles WHERE client_identifier = 'utusan'),
  'news_crawler',
  'Program bantuan bakul makanan terus diperluas ke lebih 5,000 penerima di kawasan Parlimen Sekijang.' || E'\n\n' || 'Baca artikel penuh: https://www.utusan.com.my/berita/2026/06/sample456',
  'Program bantuan bakul makanan diperluas ke 5,000 penerima di Sekijang',
  'welfare_and_aid', 'report', 'local', 'medium', 'neutral', 'malay', 'pending', 'P.141 Sekijang - N.04 Kemelah', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '90 minutes');
