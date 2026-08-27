"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { apiGet } from "../api-client"

export interface ApodData {
  url: string
  hdurl?: string
  title: string
  explanation: string
  media_type: string
  date: string
}

export interface NeoData {
  element_count: number
  near_earth_objects: Record<string, any[]>
}

export interface QuakeData {
  count: number
  trend: string
}

export interface WeatherData {
  temp: number
  condition: string
}

export interface KpData {
  kp: number
  trend: string
}

export interface NasaFeedsState {
  apod: ApodData | null
  neo: NeoData | null
  quake: QuakeData | null
  weather: WeatherData | null
  kp: KpData | null
  loading: boolean
  error: string | null
  refresh: () => void
}

export const HIGH_QUAKE_THRESHOLD = 30
export const HOT_TEMP_THRESHOLD = 40
export const STORM_KP_THRESHOLD = 4

export function useNasaFeeds(): NasaFeedsState {
  const [apod, setApod] = useState<ApodData | null>(null)
  const [neo, setNeo] = useState<NeoData | null>(null)
  const [quake, setQuake] = useState<QuakeData | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [kp, setKp] = useState<KpData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const mountedRef = useRef(true)
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const fetchAll = useCallback(async () => {
    if (!mountedRef.current) return
    setLoading(true)
    setError(null)

    const todayStr = new Date().toISOString().split("T")[0] as string

    await Promise.allSettled([
      // NASA APOD
      apiGet<ApodData>("/api/external/nasa/apod")
        .then((data) => {
          if (mountedRef.current && data?.url && !data.url.includes("youtube")) {
            setApod(data)
          }
        })
        .catch(() => {}),

      // NASA NEO
      apiGet<NeoData>(
        `/api/external/nasa/neo?start_date=${todayStr}&end_date=${todayStr}`
      )
        .then((data) => {
          if (mountedRef.current && data?.element_count !== undefined) {
            setNeo(data)
          }
        })
        .catch(() => {}),

      // USGS earthquakes
      apiGet<any>("/api/external/usgs/earthquakes")
        .then((data) => {
          if (!mountedRef.current || !data?.features) return
          const count: number = data.features.length
          setQuake({
            count,
            trend: count > HIGH_QUAKE_THRESHOLD ? "▲ HIGH (24H)" : "▼ NORMAL",
          })
        })
        .catch(() => {}),

      // Weather
      apiGet<any>(
        "/api/external/weather?latitude=21.4225&longitude=39.8262&current_weather=true"
      )
        .then((data) => {
          if (!mountedRef.current || !data?.current_weather) return
          const temp: number = data.current_weather.temperature
          setWeather({
            temp,
            condition: temp > HOT_TEMP_THRESHOLD ? "▲ HOT" : "▼ CLEAR",
          })
        })
        .catch(() => {}),

      // NOAA K-index
      apiGet<any[]>("/api/external/noaa/kp-index")
        .then((data) => {
          if (!mountedRef.current || !Array.isArray(data)) return
          const validRows = data.filter(
            (row) => String(row[1]) !== "Kp" && !isNaN(parseFloat(String(row[1])))
          )
          const latestKp =
            validRows.length > 0
              ? parseFloat(String(validRows[validRows.length - 1][1]))
              : 0
          setKp({
            kp: latestKp,
            trend: latestKp >= STORM_KP_THRESHOLD ? "▲ STORM" : "▼ STABLE",
          })
        })
        .catch(() => {}),
    ])

    if (mountedRef.current) setLoading(false)
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  return { apod, neo, quake, weather, kp, loading, error, refresh: fetchAll }
}
