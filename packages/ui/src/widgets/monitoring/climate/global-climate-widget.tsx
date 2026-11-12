"use client"

import { useEffect, useRef, useState } from "react"
import { CloudRain, Wind, CloudLightning } from "lucide-react"
import {
  apiGet,
  sourceFailureMeta,
  summarizeSourceStatus,
  type SourceMeta,
  type SourceStatus,
} from "@moon/client"

type WeatherCity = {
  name: string
  latitude: number
  longitude: number
}

type CityWeather = {
  name: string
  temperature: number
  windSpeed: number
}

const CITIES: readonly WeatherCity[] = [
  { name: "Jakarta", latitude: -6.2088, longitude: 106.8456 },
  { name: "New York", latitude: 40.7128, longitude: -74.006 },
  { name: "Tokyo", latitude: 35.6762, longitude: 139.6503 },
  { name: "London", latitude: 51.5074, longitude: -0.1278 },
  { name: "Makkah", latitude: 21.3891, longitude: 39.8579 },
]

const STATUS_CLASSES: Record<SourceStatus, string> = {
  LIVE: "border-success/30 bg-success/10 text-success",
  CACHED: "border-info/30 bg-info/10 text-info",
  STALE: "border-warning/30 bg-warning/10 text-warning",
  UNAVAILABLE: "border-destructive/30 bg-destructive/10 text-destructive",
  SIMULATED: "border-secondary/30 bg-secondary/10 text-secondary",
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

export function GlobalClimateWidget({
  onSourceMeta,
}: {
  onSourceMeta?: (source: SourceMeta) => void
}) {
  const [weatherByCity, setWeatherByCity] = useState<Record<string, CityWeather>>({})
  const [sourceMeta, setSourceMeta] = useState<SourceMeta[]>([])
  const successfulAt = useRef(new Map<string, number>())

  useEffect(() => {
    let isMounted = true
    const updateSource = (metadata: SourceMeta) => {
      if (!isMounted) return
      setSourceMeta((current) => [
        ...current.filter((entry) => entry.source !== metadata.source),
        metadata,
      ])
      onSourceMeta?.(metadata)
    }

    const loadCity = async (city: WeatherCity) => {
      const source = `weather-${city.name.toLowerCase().replaceAll(" ", "-")}`
      const checkedAt = Date.now()
      try {
        const payload = await apiGet<unknown>(
          `/api/external/weather?latitude=${city.latitude}&longitude=${city.longitude}&current_weather=true`
        )
        if (!isRecord(payload) || !isRecord(payload.current_weather)) {
          throw new Error("Weather response is missing current conditions")
        }
        const temperature = payload.current_weather.temperature
        const windSpeed = payload.current_weather.windspeed
        if (
          typeof temperature !== "number" ||
          !Number.isFinite(temperature) ||
          typeof windSpeed !== "number" ||
          !Number.isFinite(windSpeed)
        ) {
          throw new Error("Weather response contains invalid current conditions")
        }

        const timestamp = Date.now()
        successfulAt.current.set(source, timestamp)
        setWeatherByCity((current) => ({
          ...current,
          [city.name]: { name: city.name, temperature, windSpeed },
        }))
        updateSource({
          source,
          status: "LIVE",
          timestamp,
          checkedAt: timestamp,
        })
      } catch (error) {
        updateSource(
          sourceFailureMeta(
            source,
            successfulAt.current.get(source),
            error instanceof Error ? error.message : String(error),
            Date.now()
          )
        )
      }
    }

    const refresh = () => Promise.all(CITIES.map(loadCity))
    for (const city of CITIES) {
      updateSource({
        source: `weather-${city.name.toLowerCase().replaceAll(" ", "-")}`,
        status: "UNAVAILABLE",
        timestamp: Date.now(),
        error: "No successful source response has been received",
      })
    }
    void refresh()
    const interval = window.setInterval(() => void refresh(), 10 * 60 * 1000)

    return () => {
      isMounted = false
      window.clearInterval(interval)
    }
  }, [onSourceMeta])

  const summary = summarizeSourceStatus(sourceMeta)

  return (
    <section className="flex h-full flex-col rounded-md border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <CloudLightning className="size-4 text-muted-foreground" aria-hidden="true" />
          <h2>Current weather</h2>
        </div>
        <span
          className={`rounded-md border px-2 py-1 text-xs ${STATUS_CLASSES[summary.status]}`}
        >
          {summary.status}
        </span>
      </div>

      <div className="flex-1 space-y-2">
        {CITIES.map((city) => {
          const weather = weatherByCity[city.name]
          const source = sourceMeta.find(
            (entry) =>
              entry.source ===
              `weather-${city.name.toLowerCase().replaceAll(" ", "-")}`
          )
          const status = source?.status ?? "UNAVAILABLE"

          return (
            <div
              key={city.name}
              className="grid grid-cols-3 items-center gap-2 rounded border border-border px-3 py-2 text-xs"
            >
              <span className="font-medium">{city.name}</span>
              <span className="text-center font-mono">
                {weather ? `${weather.temperature}°C` : "—"}
              </span>
              <span className="flex items-center justify-end gap-2">
                {weather ? (
                  <>
                    <Wind className="size-3 text-muted-foreground" aria-hidden="true" />
                    <span className="font-mono">{weather.windSpeed} km/h</span>
                  </>
                ) : (
                  <CloudRain
                    className="size-3 text-muted-foreground"
                    aria-hidden="true"
                  />
                )}
                <span className={STATUS_CLASSES[status]}>{status}</span>
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
