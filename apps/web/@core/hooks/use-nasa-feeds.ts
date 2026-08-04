import { useState, useEffect, useCallback, useRef } from 'react'
import { useMoonStore } from '../store/moon-store'

// ─── Types ────────────────────────────────────────────────────────────────────

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

const HIGH_QUAKE_THRESHOLD = 30
const HOT_TEMP_THRESHOLD = 40
const STORM_KP_THRESHOLD = 4

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Single source of truth for all external space/planetary feeds.
 * All calls go through the moon API server (apps/api) which handles
 * caching and hides external API keys from the browser.
 */
export function useNasaFeeds(): NasaFeedsState {
  const { request } = useMoonStore()

  const [apod, setApod]       = useState<ApodData | null>(null)
  const [neo, setNeo]         = useState<NeoData | null>(null)
  const [quake, setQuake]     = useState<QuakeData | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [kp, setKp]           = useState<KpData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const mountedRef = useRef(true)
  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const fetchAll = useCallback(async () => {
    if (!mountedRef.current) return
    setLoading(true)
    setError(null)

    const todayStr = new Date().toISOString().split('T')[0] as string

    await Promise.allSettled([
      // NASA APOD — cached 1h on api server
      request('GET', '/api/external/nasa/apod').then((data: ApodData) => {
        if (mountedRef.current && data?.url && !data.url.includes('youtube')) {
          setApod(data)
        }
      }),

      // NASA NEO — cached 5m on api server
      request('GET', `/api/external/nasa/neo?start_date=${todayStr}&end_date=${todayStr}`)
        .then((data: NeoData) => {
          if (mountedRef.current && data?.element_count !== undefined) setNeo(data)
        }),

      // USGS earthquakes — cached 5m on api server
      request('GET', '/api/external/usgs/earthquakes').then((data: any) => {
        if (!mountedRef.current || !data?.features) return
        const count: number = data.features.length
        setQuake({ count, trend: count > HIGH_QUAKE_THRESHOLD ? '▲ HIGH (24H)' : '▼ NORMAL' })
      }),

      // Open-Meteo Mecca weather — cached 10m on api server
      request('GET', '/api/external/weather?latitude=21.4225&longitude=39.8262&current_weather=true')
        .then((data: any) => {
          if (!mountedRef.current || !data?.current_weather) return
          const temp: number = data.current_weather.temperature
          setWeather({ temp, condition: temp > HOT_TEMP_THRESHOLD ? '▲ HOT' : '▼ CLEAR' })
        }),

      // NOAA K-index — cached 10m on api server
      request('GET', '/api/external/noaa/kp-index').then((data: any[]) => {
        if (!mountedRef.current) return
        const validRows = data.filter(
          (row) => String(row[1]) !== 'Kp' && !isNaN(parseFloat(String(row[1])))
        )
        const latestKp = validRows.length > 0
          ? parseFloat(String(validRows[validRows.length - 1][1]))
          : 0
        setKp({ kp: latestKp, trend: latestKp >= STORM_KP_THRESHOLD ? '▲ STORM' : '▼ STABLE' })
      }),
    ])

    if (mountedRef.current) setLoading(false)
  }, [request])

  useEffect(() => { fetchAll() }, [fetchAll])

  return { apod, neo, quake, weather, kp, loading, error, refresh: fetchAll }
}

export { HIGH_QUAKE_THRESHOLD, HOT_TEMP_THRESHOLD, STORM_KP_THRESHOLD }
