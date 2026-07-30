import { NextResponse } from "next/server"
import { getSupabaseClient } from "@workspace/quran-core"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { searchParams } = new URL(request.url)
    const bookId = searchParams.get('book') || "1" // Default to book 1 (e.g., Genesis, Al-Fatihah)

    const sb = getSupabaseClient()
    const { id } = await params
    
    // Fetch scripture metadata first
    const { data: scripture, error: scErr } = await sb
      .from("divine_scriptures")
      .select("name, id")
      .eq("id", parseInt(id))
      .single()
    
    if (scErr) throw scErr

    const isQuran = scripture.name.includes("Qur'an")

    // If it's Al-Qur'an, use the Smart API Adapter
    if (isQuran) {
      // Fetch Surah info
      const { data: surah, error: surahErr } = await sb
        .from("surahs")
        .select("*")
        .eq("number", parseInt(bookId))
        .single()

      if (surahErr) throw surahErr

      // Fetch Ayahs
      const { data: ayahs, error: ayahsErr } = await sb
        .from("ayahs")
        .select("*")
        .eq("surah_number", parseInt(bookId))
        .order("ayah_number", { ascending: true })

      if (ayahsErr) throw ayahsErr

      // Fetch all Surahs for sidebar
      const { data: allSurahs, error: allErr } = await sb
        .from("surahs")
        .select("number, name_latin")
        .order("number", { ascending: true })

      if (allErr) throw allErr

      // Transform Quran to Advanced Format
      return NextResponse.json({
        success: true,
        data: {
          scripture_name: "AL-QUR'AN AL-KARIM",
          scripture_arabic: "القرآن الكريم",
          scripture_tag: "FINAL & PRESERVED CODEX",
          scripture_desc: "The final revelation to Prophet Muhammad (PBUH) and the eternal guidance for all humanity.",
          stats: {
            position: "1 of 4 Primary Sources",
            period: "23 Years (610 - 632 CE)",
            chapters: "114 Surahs",
            verses: "6,236 Ayat",
            words: "77,439 Approx.",
            language: "Arabic (Original)"
          },
          left_sidebar: {
             type: "chapters",
             title: "CHAPTERS (114)",
             items: allSurahs.map(s => ({
               id: s.number,
               book_number: s.number,
               name: s.name_latin,
               subname: "Surah"
             }))
          },
          right_sidebar: {
             quick_facts: [
               { label: "Revealed To", value: "Prophet Muhammad (PBUH)" },
               { label: "Language", value: "Arabic" },
               { label: "Script", value: "Uthmani" },
               { label: "Compilation", value: "Abu Bakr (r.a.)" },
               { label: "Standardization", value: "Uthman (r.a.)" },
               { label: "Codex Status", value: "Final & Preserved" }
             ],
             insights: [
               { label: "Core Message", value: "Worship, Guidance, Mercy" },
               { label: "Key Theme", value: "Tawhid & Guidance" }
             ],
             benefits: [
               "Foundation of the Qur'an and every act of worship.",
               "Recited in every rak'ah of Salah.",
               "Seeks guidance from Allah alone."
             ]
          },
          bottom_panels: {
             themes: ["Tawhid", "Praise & Gratitude", "Mercy", "Guidance", "Worship", "Dependence on Allah", "Accountability"],
             related: [
               { ref: "2:1-2", desc: "Connection with Al-Baqarah" },
               { ref: "17:23", desc: "Supplication for Guidance" }
             ],
             tafsir_highlight: { author: "Ibn Kathir", text: "Al-Fatihah is the mother of the Book and the seven repeated verses. It is the greatest Surah in the Qur'an..." },
             recitation: ["Mishary Rashid Alafasy", "Abdul Rahman Al-Sudais", "Saad Al-Ghamdi"],
             science: ["Perfect structure: 7 verses summarizing the purposes of revelation.", "Linguistic miracle: unmatched eloquence."]
          },
          book: {
            id: surah.number,
            name: surah.name_latin,
            original_name: surah.name_arabic,
            summary: `${surah.revelation_type} • ${surah.number_of_ayahs} Ayat`,
            meaning: surah.translation_id,
            chapters_count: 1,
            audio_url: surah.audio_full
          },
          verses: ayahs.map(a => ({
            id: a.id,
            chapter_number: a.surah_number,
            verse_number: a.ayah_number,
            text_original: a.text_arabic,
            text_transliteration: a.text_latin || "",
            text_translated: a.translation_id,
            text_tajweed: a.text_tajweed || a.text_arabic,
            audio_url: a.audio_url,
            tafsir: "Tafsir Kemenag akan muncul di sini (jika ada)."
          })),
          current_chapter: 1
        }
      })
    }

    // For other Universal Scriptures (Taurat, Zabur, Injil, etc.)
    // Scripture metadata is already fetched above.

    // Fetch all books for TOC
    const { data: allBooks, error: allBkErr } = await sb
      .from("scripture_books")
      .select("id, book_number, name")
      .eq("scripture_id", parseInt(id))
      .order("book_number", { ascending: true })
    
    if (allBkErr) throw allBkErr

    // Determine which book to fetch
    let bookToFetch;
    const bookIdParam = searchParams.get('book');
    if (bookIdParam) {
      // Fetch the specifically requested book
      const { data: b, error: bkErr } = await sb
        .from("scripture_books")
        .select("*")
        .eq("scripture_id", parseInt(id))
        .eq("book_number", parseInt(bookIdParam))
        .single()
      
      if (!bkErr && b) {
         bookToFetch = b;
      }
    }

    // If requested book not found or not specified, fallback to the first available book
    if (!bookToFetch && allBooks && allBooks.length > 0) {
       const firstBookNum = allBooks[0].book_number;
       const { data: fallbackB } = await sb
         .from("scripture_books")
         .select("*")
         .eq("scripture_id", parseInt(id))
         .eq("book_number", firstBookNum)
         .single()
       bookToFetch = fallbackB;
    }

    if (!bookToFetch) {
       return NextResponse.json({
         success: false,
         error: "Buku/Pasal ini belum tersedia di Codex untuk diuji coba."
       }, { status: 404 })
    }

    // Fetch verses for the specific chapter
    const currentChapter = parseInt(searchParams.get('chapter') || "1")

    let versesQuery = sb
      .from("scripture_verses")
      .select("*")
      .eq("scripture_id", parseInt(id))
      .eq("book_id", bookToFetch.id)

    versesQuery = versesQuery
      .eq("chapter_number", currentChapter)
      .order("verse_number", { ascending: true })

    const { data: verses, error: vrErr } = await versesQuery
    
    if (vrErr) throw vrErr

    const isTaurat = scripture.name.toLowerCase().includes("taurat");

    return NextResponse.json({
      success: true,
      data: {
        scripture_name: isTaurat ? "TAURAT (TORAH)" : scripture.name.toUpperCase(),
        scripture_arabic: isTaurat ? "תּוֹרָה" : "",
        scripture_tag: "PRIMARY CANONICAL SCRIPTURE",
        scripture_desc: isTaurat ? "The divine scripture revealed to Prophet Moses (Musa a.s) as guidance, law, and light for the Children of Israel." : "Divine scripture mapped to Universal Reader.",
        stats: {
          position: isTaurat ? "5 Books of Moses" : "-",
          period: isTaurat ? "~13th Century BCE (Sinai Peninsula)" : "-",
          chapters: `${allBooks.length} Total Books`,
          verses: isTaurat ? "6,053 Total Verses" : "-",
          words: "-",
          language: isTaurat ? "Hebrew (Original)" : "Unknown"
        },
        left_sidebar: {
           type: "scriptures",
           title: "SACRED SCRIPTURES",
           items: allBooks.map(b => ({
             id: b.id,
             book_number: b.book_number,
             name: b.name,
             subname: "Chapter"
           }))
        },
        right_sidebar: {
           quick_facts: isTaurat ? [
             { label: "Revealed To", value: "Prophet Moses (Musa a.s)" },
             { label: "Audience", value: "Children of Israel" },
             { label: "Location", value: "Mount Sinai" },
             { label: "Approx. Date", value: "~13th Century BCE" },
             { label: "Purpose", value: "Guidance, Law, Covenant" }
           ] : [],
           insights: isTaurat ? [
             { label: "Foundation", value: "Foundation of monotheistic belief and divine law." },
             { label: "Commandments", value: "Contains 613 commandments (Mitzvot)." }
           ] : [],
           benefits: []
        },
        bottom_panels: {
           themes: isTaurat ? ["One God", "Covenant & Obedience", "Law & Righteousness", "Justice & Mercy"] : [],
           related: isTaurat ? [
             { ref: "Al-Qur'an", desc: "Surah Al-Baqarah (2:47-49)" },
             { ref: "Zabur", desc: "Psalm 78, Psalm 105" }
           ] : [],
           tafsir_highlight: { author: "Core Teachings", text: "Worship the One God alone. Keep the covenant and be faithful. Do justice and love kindness." },
           recitation: [],
           science: isTaurat ? ["Creation (Genesis 1-2)", "The Flood (Genesis 6-9)", "Abraham's Covenant (Genesis 12)"] : []
        },
        all_books: allBooks,
        book: {
          id: bookToFetch.id,
          name: bookToFetch.name,
          original_name: bookToFetch.original_name,
          summary: bookToFetch.summary,
          chapters_count: bookToFetch.chapters_count,
          audio_url: bookToFetch.audio_url
        },
        verses: verses,
        current_chapter: currentChapter
      }
    })

  } catch (error: any) {
    console.error("Error in Reader API:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
