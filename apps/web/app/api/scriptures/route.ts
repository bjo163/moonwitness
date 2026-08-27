import { NextResponse } from "next/server"
import { apiGet } from "@moon/client"
import type { ScriptureListResponse } from "@workspace/types"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const json = await apiGet<ScriptureListResponse>("/api/witness/scriptures")

    return NextResponse.json({
      success: true,
      total: json.scriptures?.length || 0,
      data: json.scriptures || [],
    })
  } catch (error: any) {
    console.error("Error fetching universal scriptures:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
