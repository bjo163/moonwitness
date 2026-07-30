-- Migration 003: Universal Divine Scriptures Schema (scriptures, scripture_sections, scripture_verses)
CREATE TABLE IF NOT EXISTS scriptures (
  id TEXT PRIMARY KEY,
  title_id TEXT NOT NULL,
  title_ar TEXT,
  title_original TEXT,
  messenger_id TEXT NOT NULL,
  language_original TEXT NOT NULL,
  status TEXT NOT NULL,
  total_sections INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scripture_sections (
  id BIGSERIAL PRIMARY KEY,
  scripture_id TEXT REFERENCES scriptures(id) ON DELETE CASCADE,
  section_number INT NOT NULL,
  title_latin TEXT NOT NULL,
  title_original TEXT,
  translation_id TEXT NOT NULL,
  total_verses INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scripture_verses (
  id BIGSERIAL PRIMARY KEY,
  scripture_id TEXT REFERENCES scriptures(id) ON DELETE CASCADE,
  section_number INT NOT NULL,
  verse_number INT NOT NULL,
  text_original TEXT NOT NULL,
  text_transliteration TEXT DEFAULT '',
  translation_id TEXT NOT NULL,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for fast query performance
CREATE INDEX IF NOT EXISTS idx_scripture_verses_lookup ON scripture_verses(scripture_id, section_number, verse_number);

-- Enable RLS & Public Read Access
ALTER TABLE scriptures ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripture_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripture_verses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Scriptures" ON scriptures FOR SELECT USING (true);
CREATE POLICY "Public Read Scripture Sections" ON scripture_sections FOR SELECT USING (true);
CREATE POLICY "Public Read Scripture Verses" ON scripture_verses FOR SELECT USING (true);
