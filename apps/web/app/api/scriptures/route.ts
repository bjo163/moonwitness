import { NextResponse } from "next/server"
import { moonClientInstance } from "@core/store/moon-store"

export async function GET(request: Request) {
  try {
    // Fetch all scriptures from the Witness API Gateway
    const json = await moonClientInstance.request("GET", "/api/witness/scriptures")

    // Map new API shape to what the frontend expects
    return NextResponse.json({
      success: true,
      total: json.scriptures?.length || 0,
      data: json.scriptures,
    })
  } catch (error: any) {
    console.error("Error fetching universal scriptures:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
