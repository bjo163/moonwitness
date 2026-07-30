-- Migration 001: Add text_latin column to ayahs table for transliteration / cara membaca
ALTER TABLE ayahs ADD COLUMN IF NOT EXISTS text_latin TEXT DEFAULT '';
