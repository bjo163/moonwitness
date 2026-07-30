import { NextResponse } from "next/server"
import { getSupabaseClient } from "@workspace/quran-core"



export async function GET() {
  try {
    const sb = getSupabaseClient()
    
    // Mengambil seluruh 99 data dari Supabase
    const { data, error } = await sb
      .from("asmaul_husna")
      .select("*")
      .order("number", { ascending: true })

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      data: data
    })
  } catch (error: any) {
    console.error("Error fetching Asmaul Husna from Supabase:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
