// Scripture & Quranic Matrix Domain Types

export interface Ayah {
  number: number
  text: string
  translation: string
  transliteration?: string
  tafsir?: string
  juz?: number
  page?: number
  audioUrl?: string
}

export interface Surah {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: "Meccan" | "Medinan"
  ayahs?: Ayah[]
}

export interface QuranAyahItem {
  id: string
  surahNumber: number
  surahName: string
  ayahNumber: number
  arabicText: string
  transliteration: string
  translation: string
  tafsirNote: string
  updatedAt: string
}

export interface TafsirEntry {
  surahNumber: number
  ayahNumber: number
  author: string
  text: string
  sourceEdition: string
}

export interface TajweedRule {
  id: string
  name: string
  color: string
  description: string
  examples: string[]
}

export interface ScriptureEdition {
  id: string
  name: string
  language: string
  type: "translation" | "quran" | "tafsir"
  direction: "ltr" | "rtl"
}

export interface ScriptureComparison {
  ayahKey: string // e.g. "2:255"
  editions: Record<string, string>
  linguisticNotes?: string
}