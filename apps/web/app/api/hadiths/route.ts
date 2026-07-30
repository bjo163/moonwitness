import { NextResponse } from "next/server"
import { getSupabaseClient } from "@workspace/quran-core"

function extractMatan(text: string) {
  if (!text) return "";
  
  const keywords = ['bersabda', 'berkata', 'mengatakan', 'berfirman'];
  let lastIndex = -1;
  let keywordUsed = '';
  
  for (const kw of keywords) {
    const idx = text.lastIndexOf(kw);
    const idxWithColon = text.lastIndexOf(kw + ':');
    const finalIdx = Math.max(idx, idxWithColon);
    
    if (finalIdx > lastIndex) {
      lastIndex = finalIdx;
      keywordUsed = text.substring(finalIdx, finalIdx + kw.length + 1);
    }
  }
  
  if (lastIndex !== -1) {
    let matan = text.substring(lastIndex + keywordUsed.length).trim();
    matan = matan.replace(/^[\s:;,"'“]+/, '');
    matan = matan.replace(/[\s,"'”]+$/, '');
    
    if (matan.length > 20) return matan;
  }
  
  return text;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit
    
    const sb = getSupabaseClient()
    
    const { data, count, error } = await sb
      .from("hadiths")
      .select("*", { count: 'exact' })
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    const processedData = data.map(item => ({
      ...item,
      matan_id: extractMatan(item.text_id || item.text_en || '')
    }))

    return NextResponse.json({
      success: true,
      total: count || 0,
      data: processedData
    })
  } catch (error: any) {
    console.error("Error fetching hadiths:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
