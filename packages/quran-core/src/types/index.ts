export type RevelationType = "MAKKIYAH" | "MADANIYAH";

export interface SurahMeta {
  number: number;
  nameArabic: string;
  nameLatin: string;
  translationId: string;
  translationEn: string;
  numberOfAyahs: number;
  revelationType: RevelationType;
}

export interface Ayah {
  number: number; // nomor urut global di Quran (1-6236)
  numberInSurah: number; // nomor ayat dalam surah (misal 1, 2, 3...)
  textArabic: string; // teks Arab Uthmani
  textTajweed?: string; // teks Arab dengan tag warna Tajwid
  textLatin?: string; // Cara membaca (Transliterasi Latin)
  translationId: string; // terjemahan Indonesia
  translationEn?: string; // terjemahan Inggris
  audioUrl?: string; // URL audio per ayat
  juz?: number;
  page?: number;
  hizbQuarter?: number;
}

export interface SurahDetail extends SurahMeta {
  audioFull?: string;
  ayahs: Ayah[];
}

export interface Reciter {
  id: string;
  name: string;
  style?: string;
  audioBaseUrl: string;
}

/* === Universal Divine Scriptures Interfaces === */
export interface DivineScripture {
  id: string; // 'quran', 'taurat', 'zabur', 'injil'
  name: string;
  originalName?: string;
  religion?: string;
  type?: string;
  booksCount?: number;
  chaptersCount?: number;
  versesCount?: number;
  authenticityStatus?: string;
  revelationEra?: string;
  prophet?: string;
  description?: string;
  coverImageUrl?: string;
  themeColor?: string;
}

export interface ScriptureBook {
  id: number;
  scriptureId: string;
  bookNumber: number;
  name: string;
  originalName?: string;
  chaptersCount?: number;
  description?: string;
  summary?: string;
  audioUrl?: string;
}

export interface ScriptureVerse {
  id: number;
  scriptureId: string;
  bookId?: number;
  chapterNumber: number;
  verseNumber: number;
  textOriginal: string; // Teks Asli (Hebrew / Aramaic / Arabic)
  textTranslated: string; // Terjemahan
  tafsir?: string;
  audioUrl?: string;
  footnote?: string;
  crossReferences?: any;
  textTransliteration?: string; // Transliterasi / Cara Membaca
  topicTags?: any;
}

export interface ApiResponse<T> {
  code: number;
  status: string;
  message?: string;
  data: T;
}
