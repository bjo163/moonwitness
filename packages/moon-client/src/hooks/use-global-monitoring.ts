"use client"

import { useEffect, useState } from "react"
import { apiGet } from "../api-client"
import {
  resolveSourceStatus,
  sourceFailureMeta,
  type SourceMeta,
  type SourceStatus,
} from "../source-status"

export type { SourceMeta, SourceStatus } from "../source-status"

export type EarthquakeFeature = {
  id: string
  properties: {
    mag: number
    place: string
    time: number
    url: string
    sig: number
  }
  geometry: {
    coordinates: [number, number, number]
  }
}

export type GlobalCityPrayer = {
  city: string
  country: string
  prayerTimes: {
    Fajr: string
    Dhuhr: string
    Asr: string
    Maghrib: string
    Isha: string
  }
}

export type ISSPosition = {
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  timestamp: number
}

export type SpaceWeatherEvent = {
  activityID: string
  startTime: string
  note: string
  link: string
}

export type FlightInfo = {
  icao24: string
  callsign: string
  origin_country: string
  longitude: number
  latitude: number
  velocity: number
  true_track: number
  altitude: number
}

export type TrendingTopic = {
  title: string
  traffic: string
  pubDate: string
}

export type CyberAttack = {
  id: string
  source: [number, number]
  target: [number, number]
  type: "DDoS" | "Malware" | "Phishing" | "Exploit"
  timestamp: number
}

export type MaritimeShip = {
  id: string
  name: string
  type: "Cargo" | "Tanker" | "Passenger"
  lat: number
  lng: number
  heading: number
  speed: number
  destination: string
}

const PRAYER_CITIES = [
  { city: "Makkah", country: "Saudi Arabia" },
  { city: "Jakarta", country: "Indonesia" },
  { city: "London", country: "United Kingdom" },
  { city: "New York", country: "United States" },
  { city: "Tokyo", country: "Japan" },
] as const

const EMPTY_CYBER_ATTACKS: CyberAttack[] = []
const EMPTY_SHIPS: MaritimeShip[] = []

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

function requireRecord(value: unknown, source: string): Record<string, unknown> {
  if (!isRecord(value)) throw new Error(`${source} returned an invalid response`)
  return value
}

function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Response is missing ${field}`)
  }
  return value
}

function parseTrendFeed(xmlText: string): TrendingTopic[] {
  const items: TrendingTopic[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match: RegExpExecArray | null

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemContent = match[1]
    if (!itemContent) continue

    const title = /<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/.exec(itemContent)
    if (!title?.[1]) continue
    const traffic = /<ht:approx_traffic>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/ht:approx_traffic>/.exec(itemContent)
    const pubDate = /<pubDate>(.*?)<\/pubDate>/.exec(itemContent)

    items.push({
      title: title[1],
      traffic: traffic?.[1] || "Unknown",
      pubDate: pubDate?.[1] || "",
    })
  }

  return items.slice(0, 10)
}

function parseFlights(states: unknown[]): FlightInfo[] {
  return states.flatMap((state) => {
    if (!Array.isArray(state)) return []

    const [icao24, callsign, originCountry, , , longitude, latitude, altitude, , velocity, trueTrack] =
      state
    if (
      typeof icao24 !== "string" ||
      typeof originCountry !== "string" ||
      typeof longitude !== "number" ||
      typeof latitude !== "number" ||
      !Number.isFinite(longitude) ||
      !Number.isFinite(latitude)
    ) {
      return []
    }

    return [{
      icao24,
      callsign: typeof callsign === "string" ? callsign.trim() || "UNKNOWN" : "UNKNOWN",
      origin_country: originCountry,
      longitude,
      latitude,
      altitude: typeof altitude === "number" ? altitude : 0,
      velocity: typeof velocity === "number" ? velocity : 0,
      true_track: typeof trueTrack === "number" ? trueTrack : 0,
    }]
  }).slice(0, 150)
}

export function useGlobalMonitoring() {
  const [earthquakes, setEarthquakes] = useState<EarthquakeFeature[]>([])
  const [globalPrayers, setGlobalPrayers] = useState<GlobalCityPrayer[]>([])
  const [issPosition, setIssPosition] = useState<ISSPosition | null>(null)
  const [spaceWeather, setSpaceWeather] = useState<SpaceWeatherEvent[]>([])
  const [flights, setFlights] = useState<FlightInfo[]>([])
  const [trends, setTrends] = useState<TrendingTopic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sourceMeta, setSourceMeta] = useState<SourceMeta[]>([])

  useEffect(() => {
    let isMounted = true
    let initialLoadComplete = false
    const sourceMetadata = new Map<string, SourceMeta>()
    const successfulAt = new Map<string, number>()
    const prayerCache = new Map<string, GlobalCityPrayer>()

    const publishSourceMetadata = () => {
      if (isMounted) setSourceMeta(Array.from(sourceMetadata.values()))
    }

    const recordSuccess = (
      source: string,
      latencyMs: number,
      timestamp = Date.now()
    ) => {
      successfulAt.set(source, timestamp)
      sourceMetadata.set(source, {
        source,
        status: "LIVE",
        timestamp,
        checkedAt: Date.now(),
        latencyMs,
      })
      publishSourceMetadata()
    }

    const recordFailure = (
      source: string,
      error: unknown,
      latencyMs?: number
    ) => {
      const checkedAt = Date.now()
      sourceMetadata.set(
        source,
        sourceFailureMeta(
          source,
          successfulAt.get(source),
          errorMessage(error),
          checkedAt,
          latencyMs
        )
      )
      publishSourceMetadata()
    }

    const loadSource = async <Value>(
      source: string,
      fetchValue: () => Promise<Value>,
      applyValue: (value: Value) => void
    ) => {
      const startedAt = Date.now()
      try {
        const value = await fetchValue()
        if (!isMounted) return
        applyValue(value)
        recordSuccess(source, Date.now() - startedAt)
      } catch (error) {
        if (isMounted) {
          recordFailure(source, error, Date.now() - startedAt)
        }
      }
    }

    const loadPrayers = async () => {
      await Promise.all(PRAYER_CITIES.map(async ({ city, country }) => {
        const source = `prayer-${city}`
        await loadSource(source, async () => {
          const response = await fetch(
            `/api/prayer-times?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`
          )
          if (!response.ok) throw new Error(`HTTP ${response.status}`)
          const payload = requireRecord(await response.json(), source)
          const schedule = requireRecord(payload.schedule, `${source} schedule`)
          return {
            city,
            country,
            prayerTimes: {
              Fajr: requireString(schedule.subuh, "subuh"),
              Dhuhr: requireString(schedule.dzuhur, "dzuhur"),
              Asr: requireString(schedule.ashar, "ashar"),
              Maghrib: requireString(schedule.maghrib, "maghrib"),
              Isha: requireString(schedule.isya, "isya"),
            },
          }
        }, (prayer) => {
          prayerCache.set(city, prayer)
          setGlobalPrayers(Array.from(prayerCache.values()))
        })
      }))
    }

    const loadIss = () => loadSource("iss-tracker", async () => {
      const payload = requireRecord(await apiGet<unknown>("/api/external/iss"), "ISS tracker")
      const latitude = payload.latitude
      const longitude = payload.longitude
      const altitude = payload.altitude
      const velocity = payload.velocity
      const timestamp = payload.timestamp
      if (![latitude, longitude, altitude, velocity, timestamp].every(
        (value) => typeof value === "number" && Number.isFinite(value)
      )) {
        throw new Error("ISS tracker returned incomplete position data")
      }
      return {
        latitude: latitude as number,
        longitude: longitude as number,
        altitude: altitude as number,
        velocity: velocity as number,
        timestamp: timestamp as number,
      }
    }, setIssPosition)

    const refreshAll = async () => {
      const date = new Date()
      date.setDate(date.getDate() - 30)
      const startDate = date.toISOString().slice(0, 10)

      await Promise.all([
        loadSource("usgs-earthquakes", async () => {
          const payload = requireRecord(
            await apiGet<unknown>("/api/external/usgs/earthquakes"),
            "USGS earthquakes"
          )
          if (!Array.isArray(payload.features)) {
            throw new Error("USGS response is missing event features")
          }
          return payload.features as EarthquakeFeature[]
        }, setEarthquakes),
        loadPrayers(),
        loadIss(),
        loadSource("nasa-donki", async () => {
          const payload = await apiGet<unknown[]>(
            `/api/external/nasa/donki/cme?startDate=${startDate}`
          )
          if (!Array.isArray(payload)) {
            throw new Error("NASA DONKI response is not an event list")
          }
          return payload.slice(0, 5) as SpaceWeatherEvent[]
        }, setSpaceWeather),
        loadSource("opensky-flights", async () => {
          const payload = requireRecord(
            await apiGet<unknown>("/api/external/opensky"),
            "OpenSky"
          )
          if (!("states" in payload) || (
            payload.states !== null && !Array.isArray(payload.states)
          )) {
            throw new Error("OpenSky response is missing state records")
          }
          return parseFlights((payload.states ?? []) as unknown[])
        }, setFlights),
        loadSource("google-trends", async () => {
          const response = await apiGet<unknown>("/api/external/trends")
          if (typeof response !== "string") {
            throw new Error("Trends response is not an RSS document")
          }
          return parseTrendFeed(response)
        }, setTrends),
      ])

      if (isMounted && !initialLoadComplete) {
        initialLoadComplete = true
        setIsLoading(false)
      }
    }

    const expectedSources = [
      "usgs-earthquakes",
      "iss-tracker",
      "nasa-donki",
      "opensky-flights",
      "google-trends",
      "social-media",
      "cyber-attacks",
      "maritime-ships",
      ...PRAYER_CITIES.map(({ city }) => `prayer-${city}`),
    ]
    for (const source of expectedSources) {
      recordFailure(
        source,
        new Error(
          source === "social-media"
            ? "No production social media source is configured"
            : source === "cyber-attacks"
              ? "No production SIEM source is configured"
              : source === "maritime-ships"
                ? "No production AIS source is configured"
                : "No successful source response has been received"
        )
      )
    }

    void refreshAll()
    const refreshInterval = window.setInterval(() => void refreshAll(), 5 * 60 * 1000)
    const issInterval = window.setInterval(() => void loadIss(), 10 * 1000)
    const freshnessInterval = window.setInterval(() => {
      if (!isMounted) return
      const now = Date.now()
      for (const [source, meta] of sourceMetadata) {
        sourceMetadata.set(source, {
          ...meta,
          status: resolveSourceStatus(meta.status, meta.timestamp, { now }),
        })
      }
      publishSourceMetadata()
    }, 60 * 1000)

    return () => {
      isMounted = false
      window.clearInterval(refreshInterval)
      window.clearInterval(issInterval)
      window.clearInterval(freshnessInterval)
    }
  }, [])

  return {
    earthquakes,
    globalPrayers,
    issPosition,
    spaceWeather,
    flights,
    trends,
    cyberAttacks: EMPTY_CYBER_ATTACKS,
    ships: EMPTY_SHIPS,
    isLoading,
    sourceMeta,
  }
}
