import type { NativeServer } from "@moon/server"
import { config } from "../config/index.js"

/**
 * ◈ Polyglot Services Bridge
 *
 * Proxies requests to high-performance Python microservices:
 * - Celestial Engine (FastAPI on port 8001): astronomical and ephemeris calculations.
 * - AI Knowledge Agent (FastAPI on port 8002): semantic BM25/vector retrieval.
 */
export function registerPolyglotBridge(server: NativeServer): void {
  const celestialEngineUrl = config.celestialEngineUrl
  const aiAgentUrl = config.aiAgentUrl

  // ── Celestial Engine ──────────────────────────────────────────────────────
  server.proxy(
    "GET",
    "/api/services/celestial/health",
    `${celestialEngineUrl}/health`,
    { cache: "5s", timeoutMs: 5000 },
    "none"
  )

  server.proxy(
    "POST",
    "/api/services/celestial/lunar-phase",
    `${celestialEngineUrl}/ephemeris/lunar-phase`,
    { cache: "1m", timeoutMs: 8000 },
    "none"
  )

  server.proxy(
    "GET",
    "/api/services/celestial/qibla",
    `${celestialEngineUrl}/ephemeris/qibla`,
    { cache: "10m", query: ["lat", "lon"], timeoutMs: 8000 },
    "none"
  )

  server.proxy(
    "POST",
    "/api/services/celestial/qibla",
    `${celestialEngineUrl}/ephemeris/qibla`,
    { cache: "10m", timeoutMs: 8000 },
    "none"
  )

  server.proxy(
    "GET",
    "/api/services/celestial/hilal-visibility",
    `${celestialEngineUrl}/ephemeris/hilal-visibility`,
    { cache: "1m", query: ["alt", "elong", "width"], timeoutMs: 8000 },
    "none"
  )

  server.proxy(
    "POST",
    "/api/services/celestial/hilal-visibility",
    `${celestialEngineUrl}/ephemeris/hilal-visibility`,
    { cache: "1m", timeoutMs: 8000 },
    "none"
  )

  server.proxy(
    "GET",
    "/api/services/celestial/prayer-times",
    `${celestialEngineUrl}/ephemeris/prayer-times`,
    { cache: "5m", query: ["lat", "lon", "date", "tz", "convention"], timeoutMs: 8000 },
    "none"
  )

  server.proxy(
    "POST",
    "/api/services/celestial/prayer-times",
    `${celestialEngineUrl}/ephemeris/prayer-times`,
    { cache: "5m", timeoutMs: 8000 },
    "none"
  )

  // ── AI Knowledge Agent ────────────────────────────────────────────────────
  server.proxy(
    "GET",
    "/api/services/ai/health",
    `${aiAgentUrl}/health`,
    { cache: "5s", timeoutMs: 5000 },
    "none"
  )

  server.proxy(
    "POST",
    "/api/services/ai/semantic/search",
    `${aiAgentUrl}/semantic/search`,
    { cache: "30s", timeoutMs: 10000 },
    "none"
  )

  server.proxy(
    "POST",
    "/api/services/ai/semantic/hybrid-search",
    `${aiAgentUrl}/semantic/hybrid-search`,
    { cache: "30s", timeoutMs: 10000 },
    "none"
  )
}
