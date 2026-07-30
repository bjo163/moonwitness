import { NextResponse } from "next/server"
import { searchUniversalScriptures } from "@workspace/quran-core"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") || ""
  const filter = searchParams.get("filter") || "ALL"

  if (!query.trim()) {
    return NextResponse.json({ results: [] })
  }

  const results = await searchUniversalScriptures(query, filter)
  return NextResponse.json({ results })
}
