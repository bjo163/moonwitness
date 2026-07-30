import type { SurahMeta, SurahDetail, Ayah, ScriptureVerse } from "../types/index";
import { SURAH_LIST } from "../constants/surahs";
import { 
  getSurahListFromSupabase, 
  getSurahDetailFromSupabase, 
  getJuzFromSupabase, 
  searchAyahsFromSupabase,
  getHadithsFromSupabase,
  getScriptureVersesFromSupabase
} from "../supabase/client";

const QURAN_COM_BASE_URL = "https://api.quran.com/api/v4";
const EQURAN_BASE_URL = "https://equran.id/api/v2";

/**
 * Mengambil daftar 114 Surah (Default Utama: Supabase Cloud Database)
 */
export async function getSurahList(): Promise<SurahMeta[]> {
  const sbList = await getSurahListFromSupabase();
  if (sbList && sbList.length === 114) {
    return sbList;
  }

  try {
    const res = await fetch(`${QURAN_COM_BASE_URL}/chapters?language=id`);
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.chapters)) {
        return json.chapters.map((c: any) => ({
          number: c.id,
          nameArabic: c.name_arabic,
          nameLatin: c.name_simple,
          translationId: c.translated_name?.name || "",
          translationEn: SURAH_LIST[c.id - 1]?.translationEn || "",
          numberOfAyahs: c.verses_count,
          revelationType: c.revelation_place === "makkah" ? "MAKKIYAH" : "MADANIYAH",
        }));
      }
    }
  } catch (error) {
    console.warn("Failed to fetch from Quran.com API, trying fallback...", error);
  }

  return SURAH_LIST;
}

/**
 * Mengambil detail 1 Surah & seluruh ayatnya
 */
export async function getSurahDetail(surahNumber: number): Promise<SurahDetail> {
  if (surahNumber < 1 || surahNumber > 114) {
    throw new Error("Nomor Surah harus antara 1 sampai 114");
  }

  const sbDetail = await getSurahDetailFromSupabase(surahNumber);
  if (sbDetail && sbDetail.ayahs && sbDetail.ayahs.length > 0) {
    return sbDetail;
  }

  const res = await fetch(`${EQURAN_BASE_URL}/surat/${surahNumber}`);
  if (!res.ok) {
    throw new Error(`Gagal mengambil detail Surah ${surahNumber} dari server.`);
  }

  const json = await res.json();
  const s = json.data;

  const ayahs: Ayah[] = s.ayat.map((a: any) => ({
    number: a.nomorAyat,
    numberInSurah: a.nomorAyat,
    textArabic: a.teksArab,
    textLatin: a.teksLatin || "",
    translationId: a.teksIndonesia,
    audioUrl: a.audio ? a.audio["05"] || a.audio["01"] : undefined,
  }));

  return {
    number: s.nomor,
    nameArabic: s.nama,
    nameLatin: s.namaLatin,
    translationId: s.arti,
    translationEn: SURAH_LIST[s.nomor - 1]?.translationEn || "",
    numberOfAyahs: s.jumlahAyat,
    revelationType: s.tempatTurun === "Mekah" ? "MAKKIYAH" : "MADANIYAH",
    audioFull: s.audioFull ? s.audioFull["05"] || s.audioFull["01"] : undefined,
    ayahs,
  };
}

/**
 * Mengambil seluruh ayat dalam 1 Juz
 */
export async function getJuz(juzNumber: number): Promise<(Ayah & { surahNumber: number })[]> {
  return await getJuzFromSupabase(juzNumber);
}

/**
 * Pencarian Kata Kunci Ayat
 */
export async function searchAyahs(keyword: string, limit: number = 50): Promise<(Ayah & { surahNumber: number })[]> {
  return await searchAyahsFromSupabase(keyword, limit);
}

/**
 * Mengambil Teks Ayat Lengkap untuk Taurat (Torah), Zabur (Psalms), & Injil (Gospels)
 */
export async function getScriptureChapterVerses(scriptureId: string, bookCode: string, chapterNum: number = 1, bookId?: number): Promise<ScriptureVerse[]> {
  // 1. Try local Supabase if bookId is known
  if (bookId !== undefined) {
    const sbVerses = await getScriptureVersesFromSupabase(scriptureId, bookId, chapterNum);
    if (sbVerses && sbVerses.length > 0) {
      return sbVerses;
    }
  }

  // 2. Fallback to API
  try {
    const res = await fetch(`https://bible-api.com/data/web/${bookCode}/${chapterNum}`);
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.verses)) {
        return json.verses.map((v: any) => ({
          id: v.verse,
          scriptureId,
          bookId,
          chapterNumber: chapterNum,
          verseNumber: v.verse,
          textOriginal: v.text.trim(),
          textTranslated: v.text.trim(),
          textTransliteration: "",
          footnote: `${json.translation?.name || "World English Text"} &middot; ${json.reference || ""}`,
        }));
      }
    }
  } catch (error: any) {
    console.warn(`Failed to fetch chapter ${chapterNum} for ${bookCode}:`, error);
  }

  return [];
}

/**
 * Pencarian Lintas Kitab Universal (Qur'an, Taurat, Zabur, Injil)
 */
export async function searchUniversalScriptures(query: string, scriptureIdFilter: string = "ALL"): Promise<{
  scriptureId: string;
  scriptureName: string;
  icon: string;
  reference: string;
  href: string;
  textOriginal?: string;
  textLatin?: string;
  translation: string;
}[]> {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const results: any[] = [];

  if (scriptureIdFilter === "ALL" || scriptureIdFilter === "quran") {
    const quranMatches = await searchAyahsFromSupabase(q, 30);
    quranMatches.forEach((m) => {
      const surahMeta = SURAH_LIST[m.surahNumber - 1];
      results.push({
        scriptureId: "quran",
        scriptureName: "Al-Qur'an Digital",
        icon: "📖",
        reference: `Surah ${surahMeta?.nameLatin || m.surahNumber} (${m.surahNumber}:${m.numberInSurah})`,
        href: `/kitab/quran/${m.surahNumber}`,
        textOriginal: m.textArabic,
        textLatin: m.textLatin,
        translation: m.translationId,
      });
    });
  }

  try {
    const res = await fetch(`https://bible-api.com/${encodeURIComponent(q)}`);
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.verses)) {
        json.verses.forEach((v: any) => {
          let sId = "taurat";
          let sName = "Kitab Taurat";
          let icon = "📜";
          let href = "/kitab/taurat";

          if (v.book_id === "PSA") {
            sId = "zabur";
            sName = "Kitab Zabur";
            icon = "🎶";
            href = "/kitab/zabur";
          } else if (["MAT", "MRK", "LUK", "JHN"].includes(v.book_id)) {
            sId = "injil";
            sName = "Kitab Injil";
            icon = "🕊️";
            href = "/kitab/injil";
          }

          if (scriptureIdFilter === "ALL" || scriptureIdFilter === sId) {
            results.push({
              scriptureId: sId,
              scriptureName: sName,
              icon,
              reference: `${v.book_name} ${v.chapter}:${v.verse}`,
              href,
              translation: v.text.trim(),
            });
          }
        });
      }
    }
  } catch (err) {
    console.warn("Failed to search Bible API:", err);
  }

  return results;
}

/* === HADITH KUTUBUT TIS'AH & TEMATIK REGISTRY === */

export interface HadithBook {
  slug: string;
  name: string;
  total: number;
  level: "SHAHIH" | "HASAN" | "DHAIF";
  levelBadge: string;
  description: string;
  category?: string;
}

export const HADITH_BOOKS_REGISTRY: HadithBook[] = [
  // KUTUBUT TIS'AH (9 KITAB UTAMA)
  { slug: "bukhari", name: "Shahih Al-Bukhari", total: 6638, level: "SHAHIH", levelBadge: "🟢 SHAHIH", description: "Kitab himpunan hadits paling shahih karya Imam Al-Bukhari r.a.", category: "Kutubut Tis'ah" },
  { slug: "muslim", name: "Shahih Muslim", total: 4930, level: "SHAHIH", levelBadge: "🟢 SHAHIH", description: "Kitab himpunan hadits shahih karya Imam Muslim r.a.", category: "Kutubut Tis'ah" },
  { slug: "tirmidzi", name: "Sunan At-Tirmidzi", total: 3625, level: "HASAN", levelBadge: "🟡 SHAHIH & HASAN", description: "Kitab hadits dilengkapi derajat perawian karya Imam At-Tirmidzi r.a.", category: "Kutubut Tis'ah" },
  { slug: "abudaud", name: "Sunan Abu Daud", total: 4419, level: "HASAN", levelBadge: "🟡 SHAHIH & HASAN", description: "Kitab hadits hukum fiqih karya Imam Abu Daud r.a.", category: "Kutubut Tis'ah" },
  { slug: "nasai", name: "Sunan An-Nasa'i", total: 5364, level: "HASAN", levelBadge: "🟡 SHAHIH & HASAN", description: "Kitab hadits hukum karya Imam An-Nasa'i r.a.", category: "Kutubut Tis'ah" },
  { slug: "ibnumajah", name: "Sunan Ibnu Majah", total: 4285, level: "DHAIF", levelBadge: "🟠 SHAHIH, HASAN & DHA'IF", description: "Kitab hadits sunan karya Imam Ibnu Majah r.a.", category: "Kutubut Tis'ah" },
  { slug: "malik", name: "Muwatta Malik", total: 1594, level: "SHAHIH", levelBadge: "🟢 SHAHIH", description: "Kitab hadits dan fiqih tertua karya Imam Malik bin Anas r.a.", category: "Kutubut Tis'ah" },
  { slug: "ahmad", name: "Musnad Ahmad", total: 4305, level: "HASAN", levelBadge: "🟡 SHAHIH & HASAN", description: "Kitab musnad hadits karya Imam Ahmad bin Hanbal r.a.", category: "Kutubut Tis'ah" },
  { slug: "darimi", name: "Sunan Ad-Darimi", total: 3367, level: "HASAN", levelBadge: "🟡 SHAHIH & HASAN", description: "Kitab sunan karya Imam Ad-Darimi r.a.", category: "Kutubut Tis'ah" },

  // KITAB HADITS TEMATIK & AKHLAK POPULER
  { slug: "riyadhus-shalihin", name: "Riyadhus Shalihin", total: 1896, level: "SHAHIH", levelBadge: "🟢 SHAHIH & HASAN", description: "Kitab taman orang-orang saleh karya Imam An-Nawawi r.a. (Akhlak, Adab, & Doa).", category: "Tematik & Akhlak" },
  { slug: "bulughul-maram", name: "Bulughul Maram", total: 1596, level: "HASAN", levelBadge: "🟡 SHAHIH & HASAN", description: "Himpunan hadits-hadits hukum fiqih karya Al-Hafiz Ibnu Hajar Al-Asqalani r.a.", category: "Fiqih Hukum" },
  { slug: "lulu-wal-marjan", name: "Al-Lu'lu' wal Marjan", total: 1906, level: "SHAHIH", levelBadge: "🟢 MUTTAFAQ 'ALAIH", description: "Himpunan hadits shahih yang disepakati bersama oleh Imam Al-Bukhari & Imam Muslim.", category: "Muttafaq 'Alaih" },
  { slug: "al-adab-al-mufrad", name: "Al-Adab Al-Mufrad", total: 1322, level: "HASAN", levelBadge: "🟢 SHAHIH & HASAN", description: "Kitab khusus etika dan akhlak mulia kemanusiaan karya Imam Al-Bukhari r.a.", category: "Akhlak & Etika" },
  { slug: "hisnul-muslim", name: "Hisnul Muslim", total: 267, level: "SHAHIH", levelBadge: "🟢 SHAHIH", description: "Himpunan doa dan zikir harian shahih dari Rasulullah SAW karya Syaikh Al-Qahtani.", category: "Doa & Zikir" },
];

export async function fetchHadithsByBook(bookSlug: string, page: number = 1): Promise<{
  name: string;
  total: number;
  items: { id: string; number: number; text: string }[];
}> {
  // 1. Try Supabase Cloud Database first
  const sbHadiths = await getHadithsFromSupabase(bookSlug, page);
  if (sbHadiths && sbHadiths.items.length > 0) {
    return sbHadiths;
  }

  // 2. Fallback to API if Supabase is still syncing
  try {
    const res = await fetch(`https://hadis-api-id.vercel.app/hadith/${bookSlug}?page=${page}`);
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.items)) {
        return {
          name: json.name || bookSlug,
          total: json.total || 0,
          items: json.items.map((item: any, index: number) => ({
            id: item.id || `${bookSlug}-${index + 1}`,
            number: (page - 1) * 20 + (index + 1),
            text: item.id || "",
          })),
        };
      }
    }
  } catch (err: any) {
    console.warn(`Failed to fetch Hadiths for ${bookSlug}:`, err);
  }

  return { name: bookSlug, total: 0, items: [] };
}
