import { NextResponse } from "next/server"
import { apiGet } from "@moon/client"

export const dynamic = "force-dynamic"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url)
    const bookId = searchParams.get("book") || "1" // Default to book 1
    const { id } = await params

    const json = await apiGet<any>(
      `/api/witness/quran/surah?number=${bookId}`
    )

    if (json.error) throw new Error(json.error)

    const surah = json.surah
    const ayahs = json.ayahs || []

    const book = {
      id: surah.id,
      name: surah.name,
      original_name: surah.nameOriginal,
      chapters_count: surah.versesCount,
      summary: surah.description,
      meaning: '',
      audio_url: surah.audioUrl,
    }

    const verses = ayahs.map((a: any) => ({
      id: a.number ?? a.id,
      verse_number: a.number,
      text_original: a.textArabic,
      text_transliteration: a.textLatin,
      text_translated: a.translationId ? String(a.translationId) : undefined,
      text_tajweed: a.textArabic,
      audio_url: a.audioUrl,
      juz: a.juz,
    }))

    return NextResponse.json({
      success: true,
      data: {
        book,
        verses,
        current_chapter: bookId,
        scripture_name: surah.name,
        scripture_arabic: surah.nameOriginal,
        scripture_tag: 'QURAN',
        scripture_desc: surah.description,
        stats: {
          verses_count: surah.versesCount,
          revelation_type: surah.revelationType,
        },
        left_sidebar: {
          title: 'Surah',
          items: [],
        },
        right_sidebar: {
          quick_facts: [],
          insights: [],
        },
        bottom_panels: [],
      },
    })
  } catch (error: any) {
    console.error("Error reading scripture content:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
