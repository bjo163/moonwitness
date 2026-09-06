import { defineRoute, type NativeServer } from "@moon/server"
import {
  calculateQiblaBearing,
  evaluateHilalVisibility,
  calculateDetailedPrayerTimes,
  calculateLunarPhaseCycle,
} from "@moon/compute"
import {
  computeBm25Similarity,
  computeHybridSearch,
} from "../services/semantic-search.js"

/**
 * ◈ Native Services Bridge (@moon/compute & @moon/witness)
 *
 * Runs all celestial astronomical ephemeris and AI semantic retrieval
 * in-process natively in Node.js, eliminating external Python microservice dependencies.
 */
export function registerPolyglotBridge(_server?: NativeServer): void {
  // ── Celestial Engine (@moon/compute) ──────────────────────────────────────
  defineRoute({
    method: "GET",
    path: "/api/services/celestial/health",
    auth: "none",
    tags: ["Celestial Engine"],
    summary: "Celestial Compute Service Health Check",
    handler: async () => ({
      status: "ok",
      service: "celestial-engine",
      version: "0.1.0",
      runtime: "node-in-process",
      package: "@moon/compute",
    }),
  })

  defineRoute({
    method: "POST",
    path: "/api/services/celestial/lunar-phase",
    auth: "none",
    tags: ["Celestial Engine"],
    summary: "Calculate Lunar Phase and Illumination Fraction",
    handler: async (ctx) => {
      const days = Number(ctx.body?.days_since_new_moon ?? 0.0)
      return calculateLunarPhaseCycle(days)
    },
  })

  const handleQibla = async (ctx: any) => {
    const lat = Number(ctx.query?.lat ?? ctx.query?.latitude ?? ctx.body?.latitude ?? ctx.body?.lat ?? 0.0)
    const lon = Number(ctx.query?.lon ?? ctx.query?.longitude ?? ctx.body?.longitude ?? ctx.body?.lon ?? 0.0)
    return calculateQiblaBearing(lat, lon)
  }

  defineRoute({
    method: "GET",
    path: "/api/services/celestial/qibla",
    auth: "none",
    tags: ["Celestial Engine"],
    summary: "Calculate Great Circle Qibla bearing and distance to Ka'bah",
    handler: handleQibla,
  })

  defineRoute({
    method: "POST",
    path: "/api/services/celestial/qibla",
    auth: "none",
    tags: ["Celestial Engine"],
    summary: "Calculate Great Circle Qibla bearing and distance to Ka'bah",
    handler: handleQibla,
  })

  const handleHilal = async (ctx: any) => {
    const alt = Number(ctx.query?.alt ?? ctx.query?.altitude_degrees ?? ctx.body?.altitude_degrees ?? ctx.body?.alt ?? 0.0)
    const elong = Number(ctx.query?.elong ?? ctx.query?.elongation_degrees ?? ctx.body?.elongation_degrees ?? ctx.body?.elong ?? 0.0)
    const width = Number(ctx.query?.width ?? ctx.query?.crescent_width_arcmin ?? ctx.body?.crescent_width_arcmin ?? ctx.body?.width ?? 0.5)
    return evaluateHilalVisibility(alt, elong, width)
  }

  defineRoute({
    method: "GET",
    path: "/api/services/celestial/hilal-visibility",
    auth: "none",
    tags: ["Celestial Engine"],
    summary: "Evaluate crescent moon visibility under MABIMS and Odeh criteria",
    handler: handleHilal,
  })

  defineRoute({
    method: "POST",
    path: "/api/services/celestial/hilal-visibility",
    auth: "none",
    tags: ["Celestial Engine"],
    summary: "Evaluate crescent moon visibility under MABIMS and Odeh criteria",
    handler: handleHilal,
  })

  const handlePrayerTimes = async (ctx: any) => {
    const lat = Number(ctx.query?.lat ?? ctx.query?.latitude ?? ctx.body?.latitude ?? ctx.body?.lat ?? -6.2088)
    const lon = Number(ctx.query?.lon ?? ctx.query?.longitude ?? ctx.body?.longitude ?? ctx.body?.lon ?? 106.8456)
    const date = String(ctx.query?.date ?? ctx.body?.date ?? "2026-09-06")
    const tz = Number(ctx.query?.tz ?? ctx.query?.timezone_offset ?? ctx.body?.timezone_offset ?? ctx.body?.tz ?? 7.0)
    const rawConv = String(ctx.query?.convention ?? ctx.body?.convention ?? "KEMENAG")
    const allowed = ["KEMENAG", "MWL", "ISNA", "UMM_AL_QURA"]
    const conv = (allowed.includes(rawConv) ? rawConv : "KEMENAG") as any
    return calculateDetailedPrayerTimes(lat, lon, date, tz, conv)
  }

  defineRoute({
    method: "GET",
    path: "/api/services/celestial/prayer-times",
    auth: "none",
    tags: ["Celestial Engine"],
    summary: "Calculate precise Islamic prayer times using solar declination and Spencer EqT formula",
    handler: handlePrayerTimes,
  })

  defineRoute({
    method: "POST",
    path: "/api/services/celestial/prayer-times",
    auth: "none",
    tags: ["Celestial Engine"],
    summary: "Calculate precise Islamic prayer times using solar declination and Spencer EqT formula",
    handler: handlePrayerTimes,
  })

  // ── AI Knowledge Agent (@moon/witness) ────────────────────────────────────
  defineRoute({
    method: "GET",
    path: "/api/services/ai/health",
    auth: "none",
    tags: ["AI Agent"],
    summary: "AI Knowledge Agent Service Health Check",
    handler: async () => ({
      status: "ok",
      service: "ai-agent",
      version: "0.1.0",
      runtime: "node-in-process",
      package: "@moon/witness",
    }),
  })

  defineRoute({
    method: "POST",
    path: "/api/services/ai/semantic/search",
    auth: "none",
    tags: ["AI Agent"],
    summary: "Perform BM25 search with Arabic text normalization across scriptures and hadiths",
    handler: async (ctx) => {
      const query = String(ctx.body?.query || "")
      const topK = Number(ctx.body?.top_k || 5)
      return computeBm25Similarity(query, topK)
    },
  })

  defineRoute({
    method: "POST",
    path: "/api/services/ai/semantic/hybrid-search",
    auth: "none",
    tags: ["AI Agent"],
    summary: "Execute hybrid search combining BM25 term matching with dense semantic concept embeddings",
    handler: async (ctx) => {
      const query = String(ctx.body?.query || "")
      const topK = Number(ctx.body?.top_k || 5)
      const alpha = Number(ctx.body?.alpha ?? 0.5)
      return computeHybridSearch(query, topK, alpha)
    },
  })
}
