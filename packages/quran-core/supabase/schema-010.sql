-- SCHEMA 010: ENABLE UPDATE RLS POLICIES FOR MULTILINGUAL ENRICHMENT
-- Execute this DDL script on Supabase Cloud SQL Editor (https://ixclyaugedwwptbqsozv.supabase.co)

-- Enable RLS & Add UPDATE Policies for Public Seeding
ALTER TABLE IF EXISTS hadiths ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public update on hadiths" ON hadiths;
CREATE POLICY "Allow public update on hadiths" ON hadiths FOR UPDATE USING (true);

ALTER TABLE IF EXISTS scripture_verses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public update on scripture_verses" ON scripture_verses;
CREATE POLICY "Allow public update on scripture_verses" ON scripture_verses FOR UPDATE USING (true);

ALTER TABLE IF EXISTS ayahs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public update on ayahs" ON ayahs;
CREATE POLICY "Allow public update on ayahs" ON ayahs FOR UPDATE USING (true);

ALTER TABLE IF EXISTS asmaul_husna ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public update on asmaul_husna" ON asmaul_husna;
CREATE POLICY "Allow public update on asmaul_husna" ON asmaul_husna FOR UPDATE USING (true);
