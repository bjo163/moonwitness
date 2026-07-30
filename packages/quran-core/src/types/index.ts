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
export interface Scripture {
  id: string; // 'quran', 'taurat', 'zabur', 'injil'
  titleId: string;
  titleArabic?: string;
  titleOriginal?: string;
  messengerId: string;
  languageOriginal: string;
  status: string;
  totalSections: number;
}

export interface ScriptureSection {
  id: number;
  scriptureId: string;
  sectionNumber: number;
  titleLatin: string;
  titleOriginal?: string;
  translationId: string;
  totalVerses: number;
}

export interface ScriptureVerse {
  id: number;
  scriptureId: string;
  sectionNumber: number;
  verseNumber: number;
  textOriginal: string; // Teks Asli (Hebrew / Aramaic / Arabic)
  textTransliteration?: string; // Transliterasi / Cara Membaca
  translationId: string; // Terjemahan Indonesia
  notes?: string; // Catatan Sejarah & Otentisitas Teks
}

export interface ApiResponse<T> {
  code: number;
  status: string;
  message?: string;
  data: T;
}
