import { NextResponse } from "next/server"
import { moonClientInstance } from "@core/store/moon-store"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") || ""
  const filter = searchParams.get("filter") || "ALL"

  if (!query.trim()) {
    return NextResponse.json({ results: [] })
  }

  try {
    const json = await moonClientInstance.request(
      "GET",
      `/api/witness/quran/search?q=${encodeURIComponent(query)}`
    )

    const results = (json.ayahs || []).map((a: any) => ({
      type: "Qur'an",
      title: `Surah ${a.surahId}, Ayah ${a.number}`,
      link: `/scripture/1?book=${a.surahId}#ayah-${a.number}`,
      snippet: a.textId || a.textEn,
    }))

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Search API Error:", error)
    return NextResponse.json({ results: [] })
  }
}
