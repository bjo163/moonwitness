-- Migration 002: Add text_tajweed column for Tajweed color tags (Idgham, Ikhfa, Qalqalah, Ghunnah, Iqlab, Mad)
ALTER TABLE ayahs ADD COLUMN IF NOT EXISTS text_tajweed TEXT DEFAULT '';
