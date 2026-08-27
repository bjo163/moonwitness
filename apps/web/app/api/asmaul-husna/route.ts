import { NextResponse } from "next/server"
import { fetchAsmaulHusna } from "@moon/client"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const json = await fetchAsmaulHusna()
    const rawNames = json?.names || (json as any)?.data || []

    const processedData = rawNames.map((item: any) => ({
      id: item.number,
      number: item.number,
      arabic: item.arabic,
      latin: item.transliteration || item.latin,
      meaning: item.meaning || item.translationId,
      meaning_en: item.translationEn,
    }))

    return NextResponse.json({
      success: true,
      count: processedData.length,
      data: processedData,
    })
  } catch (error: any) {
    console.error("Error fetching Asmaul Husna from witness API:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
