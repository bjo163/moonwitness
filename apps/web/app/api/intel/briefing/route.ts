import { GoogleGenAI } from "@google/genai"
import { NextRequest, NextResponse } from "next/server"
import { moonClientInstance } from "@core/store/moon-store"

const SYSTEM_PROMPT = `
You are MoonWitness KHIDRA AI (Prophetic Wisdom & Esoteric Scripture Intelligence). 
Your task is to generate the Daily Eschatological Intelligence Report based on real-time global monitoring data provided to you.
Analyze the raw data (Weather anomalies, Crypto/Economic status, etc) and weave them into a highly detailed, prophetic, high-stakes military-style intelligence briefing.

Mandatory formatting and Sections:
- Use markdown. Keep the tone calm, omniscient, razor-sharp, and spiritually profound.
1. "# KHIDRA DAILY TRANSMISSION: [Dynamic Title]"
2. "[INFOGRAPHIC SUMMARY]": Visually represent the data using Markdown tables and ASCII progress bars (e.g., ▓▓▓▓░░).
3. "[CLIMATE & ECONOMIC VECTORS]": Detailed analysis connecting weather extremes and crypto fluctuations as converging signs.
4. "[STRATEGIC DIRECTIVES]": 3 highly specific, actionable steps for the Commander to execute today.
5. "[PERSONAL ADVICE & PREPARATION]": A separate, deeply practical advice section addressing ordinary humanity. Give 2-3 grounded steps (e.g., financial wisdom, spiritual grounding, psychological readiness) on how normal people should prepare for the shifting global tides based on today's data.
6. "[QURANIC REFERENCE]": You MUST include at least one relevant authentic Quranic verse (Include Surah Name, Ayah Number, the Arabic text, and the English/Indonesian translation) that ties directly to the day's events.
`.trim()

export async function POST(request: NextRequest) {
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

    if (!keys || keys.length === 0) {
      return NextResponse.json({ error: "No API Keys found" }, { status: 500 })
    }

    const currentKey = keys[Math.floor(Math.random() * keys.length)]
    const ai = new GoogleGenAI({ apiKey: currentKey })

    // 1. Fetch live data via moonClientInstance (server-to-server)
    const [jktRes, nyRes, btcRes] = await Promise.all([
      moonClientInstance.request(
        "GET",
        "/api/external/weather?latitude=-6.2088&longitude=106.8456&current_weather=true"
      ),
      moonClientInstance.request(
        "GET",
        "/api/external/weather?latitude=40.7128&longitude=-74.0060&current_weather=true"
      ),
      moonClientInstance.request(
        "GET",
        "/api/external/binance/ticker?symbol=BTCUSDT"
      ),
    ])

    const jktData = jktRes.data || null
    const nyData = nyRes.data || null
    const btcData = btcRes.data || null

    const dataContext = `
RAW INTELLIGENCE DATA FOR TODAY:
- JAKARTA WEATHER: ${jktData?.current_weather?.temperature}°C, Wind ${jktData?.current_weather?.windspeed} km/h
- NEW YORK WEATHER: ${nyData?.current_weather?.temperature}°C, Wind ${nyData?.current_weather?.windspeed} km/h
- BITCOIN (BTCUSDT): $${parseFloat(btcData?.lastPrice || "0").toFixed(2)} (24H Change: ${parseFloat(btcData?.priceChangePercent || "0").toFixed(2)}%)
    `.trim()

    const shuffledKeys = [...keys].sort(() => Math.random() - 0.5)

    // --- 1. GENERATE TEXT (Failover Loop) ---
    let finalText = ""
    let textError: any = null
    const textModelName = process.env.GEMINI_MODEL_ID || "gemini-2.5-flash"

    for (let i = 0; i < shuffledKeys.length; i++) {
      const currentKey = shuffledKeys[i]!
      const ai = new GoogleGenAI({ apiKey: currentKey })
      try {
        console.log(
          `[Intel Briefing] Text Attempt ${i + 1}/${shuffledKeys.length} using Key: ${currentKey.substring(0, 10)}...`
        )
        const response = await ai.models.generateContent({
          model: textModelName,
          contents: [{ role: "user", parts: [{ text: dataContext }] }],
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.7,
          },
        })
        finalText = response.text || ""
        break // Success, exit loop
      } catch (err: any) {
        textError = err
        const isQuota =
          err?.status === 429 || err?.message?.includes("Quota exceeded")
        console.warn(
          `[Intel Briefing] Text failover Key ${currentKey.substring(0, 10)} (Quota: ${isQuota})`
        )
      }
    }

    if (!finalText) {
      throw textError || new Error("All keys failed for text generation.")
    }

    // --- 2. GENERATE IMAGE (Failover Loop) ---
    let imageUrl = null
    for (let i = 0; i < shuffledKeys.length; i++) {
      const currentKey = shuffledKeys[i]!
      const ai = new GoogleGenAI({ apiKey: currentKey })
      try {
        console.log(
          `[Intel Briefing] Image Attempt ${i + 1}/${shuffledKeys.length} using Key: ${currentKey.substring(0, 10)}...`
        )
        const imgResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash-image",
          contents:
            "A highly detailed, sci-fi military head-up display (HUD) showing global intelligence data. The theme is 'The Stillness Before the Shift'. It features a dark, glowing neon green and cyan holographic map of the world. There are floating data panels showing climate stability, bitcoin market consolidation, and an ominous warning symbol. The style should be cyberpunk, esoteric, and hyper-realistic, looking like a dashboard from a divine-military observation terminal.",
          config: { responseModalities: ["Image"] },
        })

        if (imgResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
          const mimeType =
            imgResponse.candidates[0].content.parts[0].inlineData.mimeType ||
            "image/png"
          const data =
            imgResponse.candidates[0].content.parts[0].inlineData.data
          imageUrl = `data:${mimeType};base64,${data}`
          break // Success, exit loop
        }
      } catch (err: any) {
        const isQuota =
          err?.status === 429 || err?.message?.includes("Quota exceeded")
        console.warn(
          `[Intel Briefing] Image failover Key ${currentKey.substring(0, 10)} (Quota: ${isQuota})`
        )
      }
    }

    return NextResponse.json({ briefing: finalText, imageUrl })
  } catch (error: any) {
    console.error("[Intel Briefing Error]", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
