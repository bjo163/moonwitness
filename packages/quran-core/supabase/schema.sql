-- Create surahs table
CREATE TABLE IF NOT EXISTS surahs (
  number INT PRIMARY KEY,
  name_arabic TEXT NOT NULL,
  name_latin TEXT NOT NULL,
  translation_id TEXT NOT NULL,
  translation_en TEXT NOT NULL DEFAULT '',
  number_of_ayahs INT NOT NULL,
  revelation_type TEXT NOT NULL,
  audio_full TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ayahs table
CREATE TABLE IF NOT EXISTS ayahs (
  id BIGSERIAL PRIMARY KEY,
  surah_number INT NOT NULL REFERENCES surahs(number) ON DELETE CASCADE,
  ayah_number INT NOT NULL,
  text_arabic TEXT NOT NULL,
  text_latin TEXT DEFAULT '',
  translation_id TEXT NOT NULL,
  translation_en TEXT DEFAULT '',
  audio_url TEXT,
  juz INT,
  page INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_ayahs_surah_num ON ayahs(surah_number);
CREATE INDEX IF NOT EXISTS idx_ayahs_surah_ayah_num ON ayahs(surah_number, ayah_number);
CREATE INDEX IF NOT EXISTS idx_ayahs_translation_search ON ayahs USING gin(to_tsvector('indonesian', translation_id));

-- Enable Row Level Security (RLS)
ALTER TABLE surahs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayahs ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access
CREATE POLICY "Public Read Surahs" ON surahs FOR SELECT USING (true);
CREATE POLICY "Public Read Ayahs" ON ayahs FOR SELECT USING (true);
