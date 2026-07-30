-- Migration 006: Track User Daily History Securely in Supabase Cloud Database
CREATE TABLE IF NOT EXISTS user_daily_history (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  item_type TEXT NOT NULL, -- 'AYAH', 'HADITH', 'WISDOM'
  item_id BIGINT NOT NULL,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, item_type, item_id)
);

CREATE INDEX IF NOT EXISTS idx_user_daily_history_lookup ON user_daily_history(session_id, item_type);

ALTER TABLE user_daily_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Manage Daily History" ON user_daily_history FOR ALL USING (true);
