-- Migration 005: Prophetic Oral Traditions Equivalent to Hadith for Taurat, Zabur, Injil
CREATE TABLE IF NOT EXISTS prophetic_traditions (
  id BIGSERIAL PRIMARY KEY,
  scripture_id TEXT REFERENCES scriptures(id) ON DELETE CASCADE,
  collection_name TEXT NOT NULL, -- 'Mishna Pirkei Avot', 'Tasbih Daud', 'Didache (Ajaran 12 Rasul)'
  chapter_number INT NOT NULL DEFAULT 1,
  item_number INT NOT NULL,
  title TEXT NOT NULL,
  text_original TEXT,
  text_transliteration TEXT DEFAULT '',
  translation_id TEXT NOT NULL,
  historical_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prophetic_traditions_lookup ON prophetic_traditions(scripture_id, collection_name);

ALTER TABLE prophetic_traditions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Prophetic Traditions" ON prophetic_traditions FOR SELECT USING (true);
