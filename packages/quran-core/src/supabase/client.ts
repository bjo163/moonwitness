import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { SurahMeta, SurahDetail, Ayah, DivineScripture, ScriptureBook, ScriptureVerse } from "../types/index";

const DEFAULT_SUPABASE_URL = "https://ixclyaugedwwptbqsozv.supabase.co";
const DEFAULT_SUPABASE_KEY = "sb_publishable_pqogdf6i4z_UtWM7bswrOg_IINAj6bk";

export function getSupabaseClient(url?: string, key?: string): SupabaseClient {
  const supabaseUrl = url || (typeof process !== "undefined" ? process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL : undefined) || DEFAULT_SUPABASE_URL;
  const supabaseKey = key || (typeof process !== "undefined" ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY : undefined) || DEFAULT_SUPABASE_KEY;
  return createClient(supabaseUrl, supabaseKey);
}

/**
 * Mengambil daftar 114 Surah dari Supabase Cloud Database
 */
export async function getSurahListFromSupabase(client?: SupabaseClient): Promise<SurahMeta[] | null> {
  const sb = client || getSupabaseClient();
  try {
    const { data, error } = await sb
      .from("surahs")
      .select("number, name_arabic, name_latin, translation_id, translation_en, number_of_ayahs, revelation_type")
      .order("number", { ascending: true });

    if (error || !data) return null;

    return data.map((s: any) => ({
      number: s.number,
      nameArabic: s.name_arabic,
      nameLatin: s.name_latin,
      translationId: s.translation_id,
      translationEn: s.translation_en || "",
      numberOfAyahs: s.number_of_ayahs,
      revelationType: s.revelation_type,
    }));
  } catch (err) {
    console.warn("Failed to fetch surah list from Supabase:", err);
    return null;
  }
}

/**
 * Mengambil detail 1 Surah & seluruh ayatnya
 */
export async function getSurahDetailFromSupabase(surahNumber: number, client?: SupabaseClient): Promise<SurahDetail | null> {
  const sb = client || getSupabaseClient();
  try {
    const { data: surah, error: surahErr } = await sb
      .from("surahs")
      .select("*")
      .eq("number", surahNumber)
      .single();

    if (surahErr || !surah) return null;

    const { data: ayahs, error: ayahsErr } = await sb
      .from("ayahs")
      .select("id, ayah_number, text_arabic, text_tajweed, text_latin, translation_id, translation_en, audio_url, juz, page")
      .eq("surah_number", surahNumber)
      .order("ayah_number", { ascending: true });

    if (ayahsErr || !ayahs) return null;

    return {
      number: surah.number,
      nameArabic: surah.name_arabic,
      nameLatin: surah.name_latin,
      translationId: surah.translation_id,
      translationEn: surah.translation_en || "",
      numberOfAyahs: surah.number_of_ayahs,
      revelationType: surah.revelation_type,
      audioFull: surah.audio_full || undefined,
      ayahs: ayahs.map((a: any) => ({
        number: a.id,
        numberInSurah: a.ayah_number,
        textArabic: a.text_arabic,
        textTajweed: a.text_tajweed || "",
        textLatin: a.text_latin || "",
        translationId: a.translation_id,
        translationEn: a.translation_en,
        audioUrl: a.audio_url || undefined,
        juz: a.juz,
        page: a.page,
      })),
    };
  } catch (err: any) {console.warn(`Failed to fetch surah ${surahNumber} from Supabase:`, err);
    return null;
  }
}

/**
 * Mengambil seluruh ayat dalam 1 Juz dari Supabase Cloud Database
 */
export async function getJuzFromSupabase(juzNumber: number, client?: SupabaseClient): Promise<(Ayah & { surahNumber: number })[]> {
  if (juzNumber < 1 || juzNumber > 30) return [];
  const sb = client || getSupabaseClient();
  try {
    const { data, error } = await sb
      .from("ayahs")
      .select("id, surah_number, ayah_number, text_arabic, text_tajweed, text_latin, translation_id, translation_en, audio_url, juz, page")
      .eq("juz", juzNumber)
      .order("id", { ascending: true });

    if (error || !data) return [];

    return data.map((a: any) => ({
      number: a.id,
      surahNumber: a.surah_number,
      numberInSurah: a.ayah_number,
      textArabic: a.text_arabic,
      textTajweed: a.text_tajweed || "",
      textLatin: a.text_latin || "",
      translationId: a.translation_id,
      translationEn: a.translation_en,
      audioUrl: a.audio_url || undefined,
      juz: a.juz,
      page: a.page,
    }));
  } catch (err: any) {console.warn(`Failed to fetch Juz ${juzNumber} from Supabase:`, err);
    return [];
  }
}

/**
 * Pencarian Kata Kunci Ayat di Supabase Cloud
 */
export async function searchAyahsFromSupabase(keyword: string, limit: number = 50, client?: SupabaseClient): Promise<(Ayah & { surahNumber: number })[]> {
  const sb = client || getSupabaseClient();
  try {
    const { data, error } = await sb
      .from("ayahs")
      .select("id, surah_number, ayah_number, text_arabic, text_tajweed, text_latin, translation_id, translation_en, audio_url, juz, page")
      .ilike("translation_id", `%${keyword}%`)
      .limit(limit);

    if (error || !data) return [];

    return data.map((a: any) => ({
      number: a.id,
      surahNumber: a.surah_number,
      numberInSurah: a.ayah_number,
      textArabic: a.text_arabic,
      textTajweed: a.text_tajweed || "",
      textLatin: a.text_latin || "",
      translationId: a.translation_id,
      translationEn: a.translation_en,
      audioUrl: a.audio_url || undefined,
      juz: a.juz,
      page: a.page,
    }));
  } catch (err) {
    console.warn("Failed to search ayahs in Supabase:", err);
    return [];
  }
}

/* === Universal Scriptures API Helper Functions === */

export async function getDivineScripturesFromSupabase(client?: SupabaseClient): Promise<DivineScripture[]> {
  const sb = client || getSupabaseClient();
  try {
    const { data, error } = await sb.from("divine_scriptures").select("*");
    if (error || !data) return [];

    return data.map((s: any) => ({
      id: s.id,
      name: s.name,
      originalName: s.original_name,
      religion: s.religion,
      type: s.type,
      booksCount: s.books_count,
      chaptersCount: s.chapters_count,
      versesCount: s.verses_count,
      authenticityStatus: s.authenticity_status,
      revelationEra: s.revelation_era,
      prophet: s.prophet,
      description: s.description,
      coverImageUrl: s.cover_image_url,
      themeColor: s.theme_color,
    }));
  } catch (error: any) {return [];
  }
}

export async function getScriptureBooksFromSupabase(scriptureId: string, client?: SupabaseClient): Promise<ScriptureBook[]> {
  const sb = client || getSupabaseClient();
  try {
    const { data, error } = await sb
      .from("scripture_books")
      .select("*")
      .eq("scripture_id", scriptureId)
      .order("book_number", { ascending: true });

    if (error || !data) return [];

    return data.map((b: any) => ({
      id: b.id,
      scriptureId: b.scripture_id,
      bookNumber: b.book_number,
      name: b.name,
      originalName: b.original_name,
      chaptersCount: b.chapters_count,
      description: b.description,
      summary: b.summary,
      audioUrl: b.audio_url,
    }));
  } catch (error: any) {return [];
  }
}

export async function getScriptureVersesFromSupabase(scriptureId: string, bookId?: number, chapterNumber: number = 1, client?: SupabaseClient): Promise<ScriptureVerse[]> {
  const sb = client || getSupabaseClient();
  try {
    let query = sb
      .from("scripture_verses")
      .select("*")
      .eq("scripture_id", scriptureId)
      .eq("chapter_number", chapterNumber);
      
    if (bookId !== undefined) {
      query = query.eq("book_id", bookId);
    }
    
    const { data, error } = await query.order("verse_number", { ascending: true });

    if (error || !data || data.length === 0) return [];

    return data.map((v: any) => ({
      id: v.id,
      scriptureId: v.scripture_id,
      bookId: v.book_id,
      chapterNumber: v.chapter_number,
      verseNumber: v.verse_number,
      textOriginal: v.text_original,
      textTranslated: v.text_translated,
      tafsir: v.tafsir,
      audioUrl: v.audio_url,
      footnote: v.footnote,
      crossReferences: v.cross_references,
      textTransliteration: v.text_transliteration,
      topicTags: v.topic_tags,
    }));
  } catch (error: any) {return [];
  }
}

/* === HADITH SUPABASE CLOUD QUERIES === */

export async function getHadithsFromSupabase(bookSlug: string, page: number = 1, limit: number = 20, client?: SupabaseClient): Promise<{
  name: string;
  total: number;
  items: { id: string; number: number; text: string }[];
} | null> {
  const sb = client || getSupabaseClient();
  try {
    const offset = (page - 1) * limit;
    const { data, error, count } = await sb
      .from("hadiths")
      .select("*", { count: "exact" })
      .eq("book_slug", bookSlug)
      .range(offset, offset + limit - 1)
      .order("number", { ascending: true });

    if (error || !data || data.length === 0) return null;

    return {
      name: bookSlug.toUpperCase(),
      total: count || data.length,
      items: data.map((h: any) => ({
        id: h.text_id,
        number: h.number,
        text: h.text_id,
      })),
    };
  } catch (error: any) {return null;
  }
}

/* === PROPHETIC TRADITIONS EQUIVALENT TO HADITH FOR TAURAT, ZABUR, INJIL === */

export async function getPropheticTraditionsFromSupabase(scriptureId?: string, client?: SupabaseClient): Promise<{
  id: number;
  scriptureId: string;
  collectionName: string;
  chapterNumber: number;
  itemNumber: number;
  title: string;
  textOriginal: string;
  textTransliteration: string;
  translationId: string;
  historicalNotes: string;
}[]> {
  const sb = client || getSupabaseClient();
  try {
    let query = sb.from("prophetic_traditions").select("*");
    if (scriptureId) {
      query = query.eq("scripture_id", scriptureId);
    }

    const { data, error } = await query.order("id", { ascending: true });

    if (error || !data) return [];

    return data.map((t: any) => ({
      id: t.id,
      scriptureId: t.scripture_id,
      collectionName: t.collection_name,
      chapterNumber: t.chapter_number,
      itemNumber: t.item_number,
      title: t.title,
      textOriginal: t.text_original || "",
      textTransliteration: t.text_transliteration || "",
      translationId: t.translation_id,
      historicalNotes: t.historical_notes || "",
    }));
  } catch (error: any) {return [];
  }
}

/* === ASMAUL HUSNA (99 NAMA ALLAH SWT) SUPABASE CLOUD QUERIES === */

export async function getAsmaulHusnaFromSupabase(client?: SupabaseClient): Promise<{
  number: number;
  nameArabic: string;
  nameLatin: string;
  translationId: string;
  quranReference: string;
}[]> {
  const sb = client || getSupabaseClient();
  try {
    const { data, error } = await sb
      .from("asmaul_husna")
      .select("*")
      .order("number", { ascending: true });

    if (error || !data) return [];

    return data.map((item: any) => ({
      number: item.number,
      nameArabic: item.name_arabic,
      nameLatin: item.name_latin,
      translationId: item.translation_id,
      quranReference: item.quran_reference || "",
    }));
  } catch {
    return [];
  }
}
