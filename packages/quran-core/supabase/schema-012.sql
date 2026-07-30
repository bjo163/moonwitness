-- Migration: 012
-- Description: Create adhkar table for Prophetic Adhkar & Supplications module

CREATE TABLE public.adhkar (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    arabic TEXT NOT NULL,
    latin TEXT NOT NULL,
    translation TEXT NOT NULL,
    category TEXT DEFAULT 'Harian',
    timing TEXT DEFAULT 'Semua',
    source TEXT DEFAULT 'Al-Quran / Sunnah',
    benefit TEXT DEFAULT 'Ketenangan Hati',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- Izinkan akses publik (jika RLS aktif)
ALTER TABLE public.adhkar ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.adhkar FOR SELECT USING (true);
CREATE POLICY "Enable insert/update for service role" ON public.adhkar FOR ALL USING (true);
