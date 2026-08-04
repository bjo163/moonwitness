import { KhidraEngine } from '@moon/khidra'

// Simplified for now
function getUserIdFromRequest(req: Request): number | undefined {
  return undefined
}

export async function POST(req: Request) {
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
      return new Response(JSON.stringify({ error: "No Gemini API Keys configured" }), { status: 500 })
    }

    const { messages } = await req.json()
    
    // Extracted from messages payload typical for ai/react
    const userMessage = [...messages].reverse().find((m: any) => m.role === 'user')?.content || ''
    const sessionId = messages[0]?.id || 'default_session'
    const userId = getUserIdFromRequest(req)

    const engine = new KhidraEngine({
      apiKeys: keys,
      model: process.env.GEMINI_MODEL_ID || 'gemini-2.5-flash',
    })

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Wrap with standard Vercel AI SDK text stream format `0:"text"\n`
          for await (const chunk of engine.chat(sessionId, userMessage, userId)) {
            const formatted = `0:${JSON.stringify(chunk)}\n`
            controller.enqueue(new TextEncoder().encode(formatted))
          }
          controller.close()
        } catch (err: any) {
          console.error('[Khidra Streaming Error]', err)
          controller.error(err)
        }
      }
    })

    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Vercel-AI-Data-Stream': 'v1',
        'Cache-Control': 'no-cache, no-transform'
      }
    })

  } catch (error: any) {
    console.error("[Prophetic AI Route Exception]", error)
    return new Response(
      JSON.stringify({ error: error.message || "Internal AI Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
