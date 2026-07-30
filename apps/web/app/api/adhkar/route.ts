import { NextResponse } from "next/server"
import { getSupabaseClient } from "@workspace/quran-core"



export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const timing = searchParams.get('timing')
    
    const sb = getSupabaseClient()
    let query = sb.from("adhkar").select("*", { count: 'exact' })
    
    if (category && category !== 'Semua') {
      query = query.eq('category', category)
    }
    
    if (timing && timing !== 'Semua') {
      query = query.eq('timing', timing)
    }
    
    // Order by ID so it's consistent
    query = query.order('id', { ascending: true })

    const { data, count, error } = await query

    if (error) throw error

    return NextResponse.json({
      success: true,
      total: count || 0,
      data: data
    })
  } catch (error: any) {
    console.error("Error fetching adhkar:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
