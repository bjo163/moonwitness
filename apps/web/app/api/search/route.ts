import { NextResponse } from "next/server"
import { moonClientInstance } from "@moon/client"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") || ""
  const filter = searchParams.get("filter") || "ALL"
  const page = parseInt(searchParams.get("page") || "1", 10)
  const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100)

  if (!query.trim()) {
    return NextResponse.json({ results: [], total: 0, page: 1, limit: 20 })
  }

  try {
    const json = await moonClientInstance.request(
      "GET",
      `/api/witness/search?q=${encodeURIComponent(query)}&filter=${encodeURIComponent(filter)}&page=${page}&limit=${limit}`
    )

    if (json.results && Array.isArray(json.results)) {
      return NextResponse.json({
        results: json.results,
        total: json.total || json.results.length,
        page: json.page || page,
        limit: json.limit || limit
      })
    }

    // Fallback if legacy shape returned
    const legacyResults = (json.ayahs || json.results || []).map((a: any) => ({
      id: `quran:${a.surahId || 1}:${a.number || a.verseNumber || 1}`,
      type: "SCRIPTURE",
      title: `Surah ${a.surahId || 1}, Ayah ${a.number || a.verseNumber || 1}`,
      reference: `quran:${a.surahId || 1}:${a.number || a.verseNumber || 1}`,
      link: `/scripture/1?book=${a.surahId || 1}#ayah-${a.number || a.verseNumber || 1}`,
      snippet: a.translationId || a.textId || a.textEn || a.textOriginal || "",
    }))

    return NextResponse.json({
      results: legacyResults,
      total: legacyResults.length,
      page: 1,
      limit: 20
    })
  } catch (error) {
    console.error("Search API Error:", error)
    return NextResponse.json({ results: [], total: 0, page: 1, limit: 20 })
  }
}
