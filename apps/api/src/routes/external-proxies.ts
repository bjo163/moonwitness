import type { NativeServer } from "@moon/server"

/**
 * ◈ External Third-Party APIs Proxy Registry
 *
 * Proxies requests to verified external data sources with TTL caching
 * and resilience timeouts.
 */
export function registerExternalProxies(server: NativeServer): void {
  // ── NASA (NEO, Space Weather CME, APOD) ───────────────────────────────────
  server.proxy(
    "GET",
    "/api/external/nasa/neo",
    "https://api.nasa.gov/neo/rest/v1/feed",
    {
      cache: "5m",
      query: ["start_date", "end_date"],
      apiKey: "DEMO_KEY",
      timeoutMs: 12000,
    },
    "none"
  )

  server.proxy(
    "GET",
    "/api/external/nasa/donki/cme",
    "https://api.nasa.gov/DONKI/CME",
    {
      cache: "30m",
      query: ["startDate"],
      apiKey: "DEMO_KEY",
      timeoutMs: 12000,
    },
    "none"
  )

  server.proxy(
    "GET",
    "/api/external/nasa/apod",
    "https://api.nasa.gov/planetary/apod",
    {
      cache: "1h",
      apiKey: "DEMO_KEY",
      timeoutMs: 12000,
    },
    "none"
  )

  // ── Weather (Open-Meteo) ─────────────────────────────────────────────────
  server.proxy(
    "GET",
    "/api/external/weather",
    "https://api.open-meteo.com/v1/forecast",
    {
      cache: "10m",
      query: ["latitude", "longitude", "current_weather"],
      timeoutMs: 10000,
    },
    "none"
  )

  // ── Geophysics (USGS & NOAA) ─────────────────────────────────────────────
  server.proxy(
    "GET",
    "/api/external/usgs/earthquakes",
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson",
    {
      cache: "5m",
      timeoutMs: 10000,
    },
    "none"
  )

  server.proxy(
    "GET",
    "/api/external/noaa/kp-index",
    "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json",
    {
      cache: "10m",
      timeoutMs: 10000,
    },
    "none"
  )

  // ── Space Tracking & Radar ───────────────────────────────────────────────
  server.proxy(
    "GET",
    "/api/external/iss",
    "https://api.wheretheiss.at/v1/satellites/25544",
    {
      cache: "10s",
      timeoutMs: 8000,
    },
    "none"
  )

  server.proxy(
    "GET",
    "/api/external/rainviewer",
    "https://api.rainviewer.com/public/weather-maps.json",
    {
      cache: "2m",
      timeoutMs: 10000,
    },
    "none"
  )

  // ── Aviation & Markets ───────────────────────────────────────────────────
  server.proxy(
    "GET",
    "/api/external/opensky",
    "https://opensky-network.org/api/states/all?lamin=35&lomin=-10&lamax=60&lomax=30",
    {
      cache: "1m",
      timeoutMs: 15000,
    },
    "none"
  )

  server.proxy(
    "GET",
    "/api/external/binance/ticker",
    "https://api.binance.com/api/v3/ticker/24hr",
    {
      cache: "30s",
      query: ["symbol"],
      timeoutMs: 8000,
    },
    "none"
  )

  // ── Trends (Google Trends RSS) ───────────────────────────────────────────
  server.proxy(
    "GET",
    "/api/external/trends",
    "https://trends.google.com/trending/rss?geo=US",
    {
      cache: "15m",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      timeoutMs: 10000,
    },
    "none"
  )
}
