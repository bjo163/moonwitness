-- schema-014.sql
-- Expand schema for Universal Reader (Tafsir, Transliteration, Tags, etc.)

-- 1. Tambahan untuk setiap AYAT (scripture_verses)
ALTER TABLE scripture_verses 
ADD COLUMN IF NOT EXISTS tafsir TEXT,
ADD COLUMN IF NOT EXISTS audio_url TEXT,
ADD COLUMN IF NOT EXISTS text_transliteration TEXT, -- Cara membaca Ibrani/Sanskerta/dll dalam huruf Latin
ADD COLUMN IF NOT EXISTS topic_tags JSONB DEFAULT '[]'::jsonb; -- Tagging topik (Misal: "Tauhid", "Mercy", "Justice")

-- 2. Tambahan untuk setiap PASAL / KITAB (scripture_books)
ALTER TABLE scripture_books 
ADD COLUMN IF NOT EXISTS summary TEXT, -- Ringkasan isi pasal/kitab
ADD COLUMN IF NOT EXISTS audio_url TEXT; -- Audio bacaan full 1 pasal
