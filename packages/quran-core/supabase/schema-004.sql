-- Migration 004: Hadith Collections & Hadiths Table in Supabase Cloud
CREATE TABLE IF NOT EXISTS hadith_books (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  total_hadiths INT DEFAULT 0,
  level_grade TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hadiths (
  id BIGSERIAL PRIMARY KEY,
  book_slug TEXT REFERENCES hadith_books(slug) ON DELETE CASCADE,
  number INT NOT NULL,
  text_id TEXT NOT NULL,
  text_ar TEXT,
  grade TEXT DEFAULT 'SHAHIH',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hadiths_lookup ON hadiths(book_slug, number);

ALTER TABLE hadith_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE hadiths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Hadith Books" ON hadith_books FOR SELECT USING (true);
CREATE POLICY "Public Read Hadiths" ON hadiths FOR SELECT USING (true);
