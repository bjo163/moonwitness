-- SCHEMA 009: MULTILINGUAL ENGLISH TRANSLATION COLUMNS (HADITHS, SCRIPTURE VERSES, ASMAUL HUSNA & AYAHS)
-- Execute this DDL script on Supabase Cloud SQL Editor (https://ixclyaugedwwptbqsozv.supabase.co)

-- 1. Add text_en column to hadiths table for English translations
ALTER TABLE IF EXISTS hadiths ADD COLUMN IF NOT EXISTS text_en TEXT DEFAULT '';

-- 2. Add translation_en and notes_en columns to scripture_verses table
ALTER TABLE IF EXISTS scripture_verses ADD COLUMN IF NOT EXISTS translation_en TEXT DEFAULT '';
ALTER TABLE IF EXISTS scripture_verses ADD COLUMN IF NOT EXISTS notes_en TEXT DEFAULT '';

-- 3. Migration check for asmaul_husna table to ensure translation_en exists
ALTER TABLE IF EXISTS asmaul_husna ADD COLUMN IF NOT EXISTS translation_en TEXT DEFAULT '';

-- 4. Migration check for ayahs table to ensure translation_en exists
ALTER TABLE IF EXISTS ayahs ADD COLUMN IF NOT EXISTS translation_en TEXT DEFAULT '';

-- Create indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_hadiths_book_number ON hadiths(book_slug, number);
CREATE INDEX IF NOT EXISTS idx_scripture_verses_lookup ON scripture_verses(scripture_id, verse_number);
