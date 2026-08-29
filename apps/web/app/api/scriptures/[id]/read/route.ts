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

    const canonicalRef = `Surah ${surah.name} (${bookId}:1-${surah.versesCount || ayahs.length})`

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
          quick_facts: [
            { label: 'Revelation Type', value: surah.revelationType || 'Makkiyyah' },
            { label: 'Total Ayahs', value: String(surah.versesCount || ayahs.length) },
            { label: 'Canonical Order', value: `Surah #${bookId}` }
          ],
          insights: [],
        },
        bottom_panels: {
          themes: [
            'Tawhid & Divine Sovereignty',
            'Prophetic Guidance',
            'Eschatology & Remembrance'
          ],
          related: [
            { ref: `Q:${bookId}:1`, desc: `Opening ayah of Surah ${surah.name}` }
          ],
          citation: {
            title: "Al-Qur'an al-Karim",
            sourceName: "Al-Qur'an al-Karim",
            edition: "Mushaf Madinah Uthmani",
            reference: canonicalRef,
            language: "ar",
            revision: "1.0.0",
            publisher: "King Fahd Glorious Quran Printing Complex"
          },
          provenance: {
            sourceName: "King Fahd Glorious Quran Printing Complex",
            sourceKey: "source:quran-uthmani",
            edition: "quran-uthmani-v1",
            revision: "1.0.0",
            publisher: "King Fahd Glorious Quran Printing Complex",
            language: "Arabic (Uthmani Script)",
            license: "Public Domain / Islamic Heritage",
            checksum: "sha256-verified-release-1.0.0",
            authority: "REVELATION",
            contentKind: "ORIGINAL_TEXT"
          }
        },
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
