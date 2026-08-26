import { NextResponse } from "next/server"
import { moonClientInstance } from "@core/store/moon-store"

function extractMatan(text: string) {
  if (!text) return ""

  const keywords = ["bersabda", "berkata", "mengatakan", "berfirman"]
  let lastIndex = -1
  let keywordUsed = ""

  for (const kw of keywords) {
    const idx = text.lastIndexOf(kw)
    const idxWithColon = text.lastIndexOf(kw + ":")
    const finalIdx = Math.max(idx, idxWithColon)

    if (finalIdx > lastIndex) {
      lastIndex = finalIdx
      keywordUsed = text.substring(finalIdx, finalIdx + kw.length + 1)
    }
  }

  if (lastIndex !== -1) {
    let matan = text.substring(lastIndex + keywordUsed.length).trim()
    matan = matan.replace(/^[\s:;,"'“]+/, "")
    matan = matan.replace(/[\s,"'”]+$/, "")

    if (matan.length > 20) return matan
  }

  return text
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    // By default the old API just fetched random hadiths from a single table
    // For Witness API we will fetch bukhari or allow slug param
    const slug = searchParams.get("slug") || "bukhari"

    const json = await moonClientInstance.request(
      "GET",
      `/api/witness/hadith?slug=${slug}&page=${page}&limit=${limit}`
    )

    const processedData = json.hadiths.map((item: any) => ({
      id: item.number,
      number: item.number,
      text_arabic: item.textArabic,
      text_id: item.textId,
      text_en: item.textEn,
      matan_id: extractMatan(item.textId || item.textEn || ""),
    }))

    return NextResponse.json({
      success: true,
      total: json.total || 0,
      data: processedData,
    })
  } catch (error: any) {
    console.error("Error fetching hadiths:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
