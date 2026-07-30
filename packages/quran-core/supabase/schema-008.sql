-- SCHEMA 008: USER PROFILES (WITH ROLES PUBLIC/ADMIN, EMAIL, & PASSWORD) & INSPIRATION COMMENTS
-- Execute this DDL script on Supabase Cloud SQL Editor (https://ixclyaugedwwptbqsozv.supabase.co)

-- 1. Create User Profiles Table with Password & Role
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'public', -- 'public' or 'admin'
  avatar_url TEXT DEFAULT '🌙',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration check: add password & role columns if table was created previously without them
ALTER TABLE IF EXISTS user_profiles ADD COLUMN IF NOT EXISTS password TEXT DEFAULT '';
ALTER TABLE IF EXISTS user_profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'public';

-- 2. Create Inspiration Comments Table with User Reference & Role Badge
CREATE TABLE IF NOT EXISTS inspiration_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_code TEXT NOT NULL, -- e.g. 'zuhur', 'subuh'
  date_str TEXT NOT NULL, -- e.g. '2026-07-26'
  item_type TEXT NOT NULL DEFAULT 'AYAH', -- 'AYAH', 'HADITH', 'WISDOM'
  item_id INT NOT NULL, -- e.g. ayah_id or hadith_id
  user_email TEXT,
  user_name TEXT NOT NULL,
  user_role TEXT DEFAULT 'public', -- 'public' or 'admin'
  user_avatar TEXT DEFAULT '🌙',
  comment_text TEXT NOT NULL,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast retrieval
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_comments_date_period ON inspiration_comments(date_str, period_code);
