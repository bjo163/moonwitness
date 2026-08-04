import { NextResponse } from "next/server"
import { moonClientInstance } from "@core/store/moon-store"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url)
    const bookId = searchParams.get("book") || "1" // Default to book 1
    const { id } = await params

    const json = await moonClientInstance.request("GET", `/api/witness/quran/surah?number=${bookId}`)
    
    if (json.error) throw new Error(json.error)

    const surah = json.surah
    const ayahs = json.ayahs || []

    // Transform to expected frontend shape
    return NextResponse.json({
      success: true,
      meta: {
        type: "quran",
        bookName: surah.name,
        bookNameOriginal: surah.nameOriginal,
        versesCount: surah.versesCount
      },
      data: ayahs.map((a: any) => ({
        id: a.number,
        verse_number: a.number,
        text_original: a.textArabic,
        text_latin: a.textLatin,
        translation_id: a.translationId,
        audio_url: a.audioUrl,
        juz: a.juz
      }))
    })
  } catch (error: any) {
    console.error("Error reading scripture content:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
