import { NextResponse } from "next/server"
import { moonClientInstance } from "@core/store/moon-store"

export async function GET() {
  try {
    const json = await moonClientInstance.request(
      "GET",
      "/api/witness/asmaul-husna"
    )
    const data = json.data || []

    const processedData = data.map((item: any) => ({
      id: item.number,
      number: item.number,
      arabic: item.arabic,
      latin: item.latin,
      meaning: item.translationId,
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
