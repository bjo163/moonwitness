-- Migration 007: Asmaul Husna (99 Beautiful Names of Allah SWT)
CREATE TABLE IF NOT EXISTS asmaul_husna (
  number INT PRIMARY KEY,
  name_arabic TEXT NOT NULL,
  name_latin TEXT NOT NULL,
  translation_id TEXT NOT NULL,
  translation_en TEXT DEFAULT '',
  quran_reference TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE asmaul_husna ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Asmaul Husna" ON asmaul_husna FOR SELECT USING (true);
