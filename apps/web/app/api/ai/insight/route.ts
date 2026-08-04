import { KhidraEngine } from '@moon/khidra'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const keys = [
      process.env.GOOGLE_GEMINI_API_KEY_007,
      process.env.GOOGLE_GEMINI_API_KEY_AGUS,
      process.env.GOOGLE_GEMINI_API_KEY_BJO,
      process.env.GOOGLE_GEMINI_API_KEY_MILEY,
      process.env.GOOGLE_GEMINI_API_KEY_PDD,
      process.env.GOOGLE_GEMINI_API_KEY_RAHMAN,
      process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    ].filter(Boolean) as string[]

    if (keys.length === 0) {
      return NextResponse.json({ error: "No Gemini API Keys configured" }, { status: 500 })
    }

    const { verseKey, arabicText, translation } = await req.json()

    if (!verseKey) {
      return NextResponse.json({ error: "Verse Key is required" }, { status: 400 })
    }

    const prompt = `Give a very short (max 2 sentences), profound, and poetic spiritual insight or relevant hadith connection for the following Quranic verse (Key: ${verseKey}):\n\nArabic: ${arabicText || ''}\nTranslation: ${translation || ''}\n\nMake it sound tactical yet divine.`

    const engine = new KhidraEngine({
      apiKeys: keys,
      model: process.env.GEMINI_MODEL_ID || 'gemini-2.5-flash',
    })

    // For a single completion, we can collect the stream or use a non-streaming method if available.
    // KhidraEngine.chat currently returns a stream of strings.
    let fullText = ""
    for await (const chunk of engine.chat(`insight_${verseKey}`, prompt)) {
      fullText += chunk
    }

    return NextResponse.json({ insight: fullText })
  } catch (error: any) {
    console.error("[Insight Engine Exception]", error)
    return NextResponse.json({ error: error.message || "Internal AI Server Error" }, { status: 500 })
  }
}
