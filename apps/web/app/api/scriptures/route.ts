import { NextResponse } from "next/server"
import { getSupabaseClient } from "@workspace/quran-core"

export async function GET(request: Request) {
  try {
    const sb = getSupabaseClient()
    
    // Fetch all scriptures ordered by id
    const { data: scriptures, error } = await sb
      .from("divine_scriptures")
      .select("*")
      .order("id", { ascending: true })

    if (error) throw error

    // Optionally we can also aggregate total books, chapters, verses here or just use the pre-computed ones
    
    return NextResponse.json({
      success: true,
      total: scriptures?.length || 0,
      data: scriptures
    })
  } catch (error: any) {
    console.error("Error fetching universal scriptures:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
