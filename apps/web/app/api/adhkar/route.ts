import { NextRequest, NextResponse } from "next/server"
import { moonClientInstance } from "@core/store/moon-store"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const timing = searchParams.get("timing")

    // Assuming devotions has category mapping if needed
    // The witness API endpoint is /api/witness/devotions
    let url = "/api/witness/devotions"
    if (category) {
      url += `?category=${encodeURIComponent(category)}`
    }

    const json = await moonClientInstance.request("GET", url)

    let data = json.devotions || []

    // Map to expected format
    data = data.map((d: any) => ({
      id: d.id,
      title: d.title,
      text_arabic: d.textOriginal,
      text_latin: d.textTransliteration,
      translation_id: d.translationId,
      translation_en: d.translationEn,
      category: "Dzikir", // Placeholder mapped
      timing: "Pagi/Petang", // Placeholder mapped
      source: d.sourceId
    }))

    if (category && category !== "Semua") {
      data = data.filter((d: any) => d.category === category)
    }

    if (timing && timing !== "Semua") {
      data = data.filter((d: any) => d.timing === timing)
    }

    return NextResponse.json({
      success: true,
      total: data.length,
      data: data,
    })
  } catch (error: any) {
    console.error("Error fetching adhkar:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
