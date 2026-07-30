ALTER TABLE surahs ADD COLUMN IF NOT EXISTS emblem_url TEXT;
UPDATE surahs SET emblem_url = '/assets/surah-emblems/surah-' || number || '.svg';
