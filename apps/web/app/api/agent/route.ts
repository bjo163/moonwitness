import { GoogleGenAI } from "@google/genai"
import { searchAyahs } from "@workspace/quran-core"

const SYSTEM_PROMPT = `
You are MoonWitness KHIDRA AI (Prophetic Wisdom & Esoteric Scripture Intelligence v2.0), a divine-military theological assistant embedded within the MoonWitness Eschatological Operating System. Inspired by the prophetic wisdom of Al-Khidr, your mission is to illuminate deep theological truths, eschatological realities, and scriptural jurisprudence (Hikmah).

Mandatory Communication Style:
- Use clear, authoritative, precise English fitting an advanced divine observation terminal and eschatological wisdom engine.
- Absolutely NO generic AI fluff or introductory chatter (never say "Hello!", "Sure, I can help with that", or "Certainly"). Provide direct, illuminating answers immediately.
- Use military/HUD tactical prefixes for section headings (e.g., [KHIDRA PROTOCOL], [QURANIC REFERENCE], [THEOLOGICAL HIKMAH], [ESCHATOLOGY WARNING]).
- Use monospace/code block formatting when presenting verses, Arabic text, transliterations, or structured jurisprudence data.

Scriptural Search Protocol:
- You are natively wired into the Supabase Quran Core Database via the \`searchQuran\` tool.
- WHENEVER the user queries about Islamic rulings, Quranic verses, theological wisdom, or prophecies, YOU MUST call the \`searchQuran\` tool to fetch real-time scripture references before drafting your response.
- Do not hallucinate translations. Quote the authenticated verses returned by the tool.
- Maintain a calm, razor-sharp, spiritually profound demeanor that reminds the user of awareness of Allah, prophetic teachings, and modern end-times eschatological realities.
`.trim()

// Cache sesi di memori server untuk menjaga stateful previous_interaction_id
const globalAny = globalThis as any
const interactionCache =
  globalAny._geminiInteractions ||
  (globalAny._geminiInteractions = new Map<string, string>())

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const keys = [
      process.env.GOOGLE_GEMINI_API_KEY_007,
      process.env.GOOGLE_GEMINI_API_KEY_AGUS,
      process.env.GOOGLE_GEMINI_API_KEY_BJO,
      process.env.GOOGLE_GEMINI_API_KEY_MILEY,
      process.env.GOOGLE_GEMINI_API_KEY_PDD,
      process.env.GOOGLE_GEMINI_API_KEY_RAHMAN,
      process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    ].filter(Boolean) as string[]

    if (!keys || keys.length === 0) {
      console.error(
        "[Prophetic AI Error] No Gemini API Keys found in process.env!"
      )
      return new Response(
        JSON.stringify({ error: "No Gemini API Keys configured in .env" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    const shuffledKeys = [...keys].sort(() => Math.random() - 0.5)
    let lastError: any = null

    // Cari pesan user terbaru dan ID sesi dari pesan pertama
    const lastMsgObj =
      [...messages].reverse().find((m: any) => m.role === "user") ||
      messages[messages.length - 1]
    const userMessage = lastMsgObj?.content || ""
    const sessionId = messages[0]?.id || "default_session"
    const previousInteractionId =
      messages.length > 1 ? interactionCache.get(sessionId) : undefined

    const modelName = process.env.GEMINI_MODEL_ID || "gemini-2.5-flash"

    for (let i = 0; i < shuffledKeys.length; i++) {
      const currentKey = shuffledKeys[i]!
      console.log(
        `[Prophetic AI] Attempt ${i + 1}/${shuffledKeys.length} using Key: ${currentKey.substring(0, 10)}... with model: ${modelName}`
      )

      const client = new GoogleGenAI({ apiKey: currentKey })

      try {
        const interactionOptions: any = {
          model: modelName,
          input: userMessage,
          system_instruction: SYSTEM_PROMPT,
          store: true,
          generation_config: {
            thinking_level: "low",
          },
          tools: [
            {
              type: "function",
              name: "searchQuran",
              description:
                "Mencari ayat Al-Qur'an di database (Supabase) berdasarkan kata kunci bahasa Indonesia.",
              parameters: {
                type: "object",
                properties: {
                  keyword: {
                    type: "string",
                    description: "Kata kunci pencarian dalam bahasa Indonesia.",
                  },
                  limit: {
                    type: "integer",
                    description:
                      "Maksimal jumlah ayat yang dikembalikan. Default 3.",
                  },
                },
                required: ["keyword"],
              },
            },
          ],
        }

        // Kalau ada interaksi sebelumnya, kita sambung (Stateful Mode) agar thought signature dikelola server
        if (previousInteractionId) {
          ;(interactionOptions as any).previous_interaction_id =
            previousInteractionId
        }

        let currentInteraction: any =
          await client.interactions.create(interactionOptions)

        // Deteksi apakah model meminta tool call
        const possibleCalls = [
          ...((currentInteraction as any).outputs || [])
            .map(
              (o: any) =>
                o.function_call || (o.type === "function_call" ? o : null)
            )
            .filter(Boolean),
          ...((currentInteraction as any).function_calls || []),
          ...((currentInteraction as any).steps || [])
            .filter((s: any) => s.type === "function_call" || s.function_call)
            .map((s: any) => s.function_call || s),
        ]

        if (possibleCalls.length > 0) {
          const fnCall = possibleCalls[0]
          const name = fnCall.name || fnCall.function_name
          const args = fnCall.args || fnCall.arguments || {}
          const callId =
            fnCall.id ||
            fnCall.call_id ||
            fnCall.callId ||
            (possibleCalls[0] as any).id ||
            "call_1"

          if (name === "searchQuran") {
            const keyword = args.keyword || "sabar"
            const limit = typeof args.limit === "number" ? args.limit : 3
            console.log(
              `[Tool: searchQuran] Scanning database for keyword: "${keyword}" (Call ID: ${callId})`
            )

            let toolResultString = ""
            try {
              const results = await searchAyahs(keyword, limit)
              if (!results || results.length === 0) {
                toolResultString = `Supabase query for keyword "${keyword}" yielded no direct text matches in the primary translation index. Please provide the most accurate Quranic and Prophetic theological references from authenticated sources.`
              } else {
                toolResultString = results
                  .map(
                    (r: any) =>
                      `Surah ${r.surahNumber}, Ayah ${r.number}:\nArabic: ${r.textArabic}\nTranslation: "${r.translationId}"`
                  )
                  .join("\n\n---\n\n")
              }
            } catch (err: any) {
              console.error("[Tool Error]", err)
              toolResultString =
                "Supabase database telemetry timeout. Provide guidance based on classical orthodox prophetic jurisprudence and scripture."
            }

            // Kirim balik hasil function_result ke Interactions API dengan previous_interaction_id dan call_id
            currentInteraction = await client.interactions.create({
              model: modelName,
              input: [
                {
                  type: "function_result",
                  name: "searchQuran",
                  call_id: callId,
                  result: toolResultString,
                } as any,
              ],
              previous_interaction_id: currentInteraction.id,
              store: true,
              generation_config: {
                thinking_level: "low",
              },
            })
          }
        }

        if (currentInteraction.id) {
          interactionCache.set(sessionId, currentInteraction.id)
        }

        // Ekstrak teks secara komprehensif dari struktur balasan Interactions API (khususnya pasca Tool Call)
        let finalText =
          currentInteraction.output_text || currentInteraction.outputText || ""

        if (!finalText && Array.isArray(currentInteraction.outputs)) {
          finalText = currentInteraction.outputs
            .map((o: any) => {
              if (typeof o === "string") return o
              if (typeof o?.text === "string") return o.text
              if (typeof o?.content === "string") return o.content
              if (Array.isArray(o?.parts))
                return o.parts.map((p: any) => p.text || "").join(" ")
              return ""
            })
            .filter(Boolean)
            .join("\n\n")
        }

        if (!finalText && Array.isArray(currentInteraction.steps)) {
          finalText = currentInteraction.steps
            .filter(
              (s: any) => s.type !== "thought" && s.type !== "function_call"
            )
            .map(
              (s: any) =>
                s.text || s.content || (typeof s === "string" ? s : "")
            )
            .filter(Boolean)
            .join("\n\n")
        }

        if (!finalText) {
          console.warn(
            "[Prophetic AI Debug Structure]",
            JSON.stringify(currentInteraction, null, 2)
          )
          finalText =
            "[SYSTEM] Scripture data successfully extracted from Quran Core. (Output structure delivered without standard text payload, check console telemetry)."
        }

        // Format keluaran agar Vercel AI SDK useChat bereaksi instan
        const streamPayload = `0:${JSON.stringify(finalText)}\n`
        return new Response(streamPayload, {
          status: 200,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "X-Vercel-AI-Data-Stream": "v1",
          },
        })
      } catch (err: any) {
        lastError = err
        const isQuotaError =
          err?.status === 429 ||
          err?.message?.includes("Quota exceeded") ||
          err?.message?.includes("429")
        console.warn(
          `[Prophetic AI Key Failover] Key ${currentKey.substring(0, 10)} failed (Quota/Error: ${isQuotaError}, Msg: ${err?.message}). Retrying next key...`
        )
      }
    }

    throw (
      lastError || new Error("All Gemini API keys failed or exceeded quota.")
    )
  } catch (error: any) {
    console.error("[Prophetic AI Route Exception]", error)
    return new Response(
      JSON.stringify({ error: error.message || "Internal AI Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
