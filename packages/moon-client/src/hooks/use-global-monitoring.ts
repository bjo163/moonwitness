"use client"

import { useEffect, useState } from "react"
import { apiGet } from "../api-client"
import {
  resolveSourceStatus,
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
  currentPrayer: string
  nextPrayer: string
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

const SOURCE_REQUEST_TIMEOUT_MS = 15_000

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "The source request failed."
}

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
  timeoutMs = SOURCE_REQUEST_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(input, { ...init, signal: controller.signal })
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(`Source request timed out after ${timeoutMs}ms.`)
    }
    throw error
  } finally {
    clearTimeout(timeout)
  }
}

export function useGlobalMonitoring() {
  const [earthquakes, setEarthquakes] = useState<EarthquakeFeature[]>([])
  const [globalPrayers, setGlobalPrayers] = useState<GlobalCityPrayer[]>([])
  const [issPosition, setIssPosition] = useState<ISSPosition | null>(null)
  const [spaceWeather, setSpaceWeather] = useState<SpaceWeatherEvent[]>([])
  const [flights, setFlights] = useState<FlightInfo[]>([])
  const [trends, setTrends] = useState<TrendingTopic[]>([])
  const [cyberAttacks] = useState<CyberAttack[]>([])
  const [ships] = useState<MaritimeShip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sourceMeta, setSourceMeta] = useState<SourceMeta[]>([])

  useEffect(() => {
    let isActive = true

    const recordSource = (
      source: string,
      responseStatus: SourceStatus,
      error?: string,
      latencyMs?: number
    ) => {
      if (!isActive) return

      setSourceMeta((current) => {
        const index = current.findIndex((entry) => entry.source === source)
        const previous = index >= 0 ? current[index] : undefined
        const hasCachedResult =
          previous !== undefined && previous.status !== "UNAVAILABLE"
        const timestamp =
          responseStatus === "UNAVAILABLE" && hasCachedResult
            ? previous.timestamp
            : Date.now()
        const status: SourceStatus =
          responseStatus === "UNAVAILABLE" && hasCachedResult
            ? "STALE"
            : resolveSourceStatus(responseStatus, timestamp)
        const next: SourceMeta = {
          source,
          status,
          timestamp,
          latencyMs,
          error,
        }

        if (index >= 0) {
          const updated = [...current]
          updated[index] = next
          return updated
        }

        return [...current, next]
      })
    }

    const captureSource = async <T,>(
      source: string,
      request: () => Promise<T>
    ): Promise<T | undefined> => {
      const startedAt = Date.now()

      try {
        const result = await request()
        recordSource(source, "LIVE", undefined, Date.now() - startedAt)
        return result
      } catch (error) {
        recordSource(source, "UNAVAILABLE", getErrorMessage(error))
        return undefined
      }
    }

    const fetchAllData = async () => {
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10)

      const earthquakePromise = captureSource(
        "usgs-earthquakes",
        async () => {
          const response = await apiGet<{ features?: EarthquakeFeature[] }>(
            "/api/external/usgs/earthquakes"
          )
          if (!Array.isArray(response.features)) {
            throw new Error("Earthquake source returned an invalid response.")
          }
          return response.features
        }
      )

      const prayerPromises: Array<Promise<GlobalCityPrayer | undefined>> =
        PRAYER_CITIES.map(({ city, country }) =>
          captureSource(`prayer-${city}`, async () => {
            const response = await fetchWithTimeout(
              `/api/prayer-times?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`
            )
            const body = await response.json()
            if (!response.ok || !body?.schedule) {
              throw new Error(
                `Prayer schedule unavailable (HTTP ${response.status}).`
              )
            }

            return {
              city,
              country,
              prayerTimes: {
                Fajr: body.schedule.subuh,
                Dhuhr: body.schedule.dzuhur,
                Asr: body.schedule.ashar,
                Maghrib: body.schedule.maghrib,
                Isha: body.schedule.isya,
              },
              currentPrayer: "Checking...",
              nextPrayer: "Checking...",
            } satisfies GlobalCityPrayer
          })
        )

      const issPromise = captureSource("iss-tracker", async () => {
        const response = await apiGet<ISSPosition & { error?: string }>(
          "/api/external/iss"
        )
        if (response.error) throw new Error(response.error)
        return response
      })

      const spaceWeatherPromise = captureSource("nasa-donki", async () => {
        const response = await apiGet<SpaceWeatherEvent[]>(
          `/api/external/nasa/donki/cme?startDate=${startDate}`
        )
        if (!Array.isArray(response)) {
          throw new Error("Space weather source returned an invalid response.")
        }
        return response
      })

      const flightsPromise = captureSource("opensky-flights", async () => {
        const response = await apiGet<{
          states?: Array<Array<string | number | null>> | null
        }>("/api/external/opensky")
        if (!("states" in response)) {
          throw new Error("Flight source returned an invalid response.")
        }

        return (response.states ?? [])
          .slice(0, 150)
          .map((state) => ({
            icao24: String(state[0] ?? ""),
            callsign:
              typeof state[1] === "string"
                ? state[1].trim() || "UNKNOWN"
                : "UNKNOWN",
            origin_country: String(state[2] ?? ""),
            longitude: state[5] as number,
            latitude: state[6] as number,
            altitude: state[7] as number,
            velocity: state[9] as number,
            true_track: state[10] as number,
          }))
          .filter(
            (flight) =>
              Number.isFinite(flight.longitude) &&
              Number.isFinite(flight.latitude)
          )
      })

      const trendsPromise = captureSource("google-trends", async () => {
        const xmlText = await apiGet<string>("/api/external/trends")
        const items: TrendingTopic[] = []
        const itemRegex = /<item>([\s\S]*?)<\/item>/g
        let match: RegExpExecArray | null

        while ((match = itemRegex.exec(xmlText)) !== null) {
          const itemContent = match[1]
          if (!itemContent) continue

          const titleMatch =
            /<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/.exec(itemContent)
          if (!titleMatch) continue

          const trafficMatch =
            /<ht:approx_traffic>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/ht:approx_traffic>/.exec(
              itemContent
            )
          const pubDateMatch = /<pubDate>(.*?)<\/pubDate>/.exec(itemContent)

          items.push({
            title: titleMatch[1] || "Unknown",
            traffic: trafficMatch?.[1] || "Unknown",
            pubDate: pubDateMatch?.[1] || "",
          })
        }

        return items.slice(0, 10)
      })

      const [
        earthquakeData,
        prayerData,
        issData,
        spaceWeatherData,
        flightData,
        trendsData,
      ] = await Promise.all([
        earthquakePromise,
        Promise.all(prayerPromises),
        issPromise,
        spaceWeatherPromise,
        flightsPromise,
        trendsPromise,
      ])

      if (!isActive) return

      if (earthquakeData !== undefined) setEarthquakes(earthquakeData)
      const availablePrayerData = prayerData.filter(
        (entry): entry is GlobalCityPrayer => entry !== undefined
      )
      if (availablePrayerData.length > 0) {
        setGlobalPrayers((current) => {
          const prayersByCity = new Map(
            current.map((prayer) => [prayer.city, prayer])
          )
          for (const prayer of availablePrayerData) {
            prayersByCity.set(prayer.city, prayer)
          }
          return PRAYER_CITIES.flatMap(({ city }) => {
            const prayer = prayersByCity.get(city)
            if (!prayer) return []
            return [prayer]
          })
        })
      }
      if (issData !== undefined) setIssPosition(issData)
      if (spaceWeatherData !== undefined) {
        setSpaceWeather(spaceWeatherData.slice(0, 5))
      }
      if (flightData !== undefined) setFlights(flightData)
      if (trendsData !== undefined) setTrends(trendsData)

      setIsLoading(false)
    }

    void fetchAllData()
    const refreshInterval = setInterval(() => void fetchAllData(), 5 * 60 * 1000)
    const issInterval = setInterval(() => {
      void captureSource("iss-tracker", async () => {
        const response = await apiGet<ISSPosition & { error?: string }>(
          "/api/external/iss"
        )
        if (response.error) throw new Error(response.error)
        return response
      }).then((position) => {
        if (isActive && position !== undefined) setIssPosition(position)
      })
    }, 10_000)

    recordSource(
      "cyber-attacks",
      "UNAVAILABLE",
      "No live security-event source is configured."
    )
    recordSource(
      "maritime-ships",
      "UNAVAILABLE",
      "No live AIS source is configured."
    )

    return () => {
      isActive = false
      clearInterval(refreshInterval)
      clearInterval(issInterval)
    }
  }, [])

  return {
    earthquakes,
    globalPrayers,
    issPosition,
    spaceWeather,
    flights,
    trends,
    cyberAttacks,
    ships,
    isLoading,
    sourceMeta,
  }
}
