-- schema-013.sql
-- Universal Scripture Database (Canonical Scripture Codex)

DROP TABLE IF EXISTS scripture_verses CASCADE;
DROP TABLE IF EXISTS scripture_books CASCADE;
DROP TABLE IF EXISTS divine_scriptures CASCADE;

-- 1. Divine Scriptures (The Books themselves)
CREATE TABLE IF NOT EXISTS divine_scriptures (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  original_name TEXT,
  religion TEXT,
  type TEXT DEFAULT 'Canonical', -- Canonical, Additional, Philosophy, etc.
  books_count INT DEFAULT 0,
  chapters_count INT DEFAULT 0,
  verses_count INT DEFAULT 0,
  authenticity_status TEXT, -- e.g., "100% Authentic", "Preserved (Partial)"
  revelation_era TEXT,
  prophet TEXT,
  description TEXT,
  cover_image_url TEXT,
  theme_color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Scripture Books (The divisions inside a scripture, e.g., Genesis, Exodus, or Psalms)
CREATE TABLE IF NOT EXISTS scripture_books (
  id BIGSERIAL PRIMARY KEY,
  scripture_id BIGINT NOT NULL REFERENCES divine_scriptures(id) ON DELETE CASCADE,
  book_number INT NOT NULL,
  name TEXT NOT NULL,
  original_name TEXT,
  chapters_count INT DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Scripture Verses (The actual text)
CREATE TABLE IF NOT EXISTS scripture_verses (
  id BIGSERIAL PRIMARY KEY,
  scripture_id BIGINT NOT NULL REFERENCES divine_scriptures(id) ON DELETE CASCADE,
  book_id BIGINT REFERENCES scripture_books(id) ON DELETE CASCADE,
  chapter_number INT NOT NULL,
  verse_number INT NOT NULL,
  text_original TEXT, -- Hebrew, Greek, Sanskrit, etc.
  text_translated TEXT NOT NULL, -- Indonesian / English
  tafsir TEXT, -- Exegesis / Commentary / Makna
  audio_url TEXT, -- Recitation audio if available
  footnote TEXT,
  cross_references JSONB DEFAULT '[]'::jsonb, -- Store links to other verses
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for fast querying
CREATE INDEX IF NOT EXISTS idx_scripture_verses_scripture_id ON scripture_verses(scripture_id);
CREATE INDEX IF NOT EXISTS idx_scripture_verses_book_id ON scripture_verses(book_id);
CREATE INDEX IF NOT EXISTS idx_scripture_verses_chapter ON scripture_verses(scripture_id, chapter_number);
CREATE INDEX IF NOT EXISTS idx_scripture_books_scripture ON scripture_books(scripture_id);

-- Enable RLS
ALTER TABLE divine_scriptures ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripture_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripture_verses ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access
CREATE POLICY "Public Read Divine Scriptures" ON divine_scriptures FOR SELECT USING (true);
CREATE POLICY "Public Read Scripture Books" ON scripture_books FOR SELECT USING (true);
CREATE POLICY "Public Read Scripture Verses" ON scripture_verses FOR SELECT USING (true);
