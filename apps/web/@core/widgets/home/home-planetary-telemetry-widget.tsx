"use client"

import React, { useState, useEffect } from "react"
import { Globe } from "lucide-react"

const HIGH_QUAKE_THRESHOLD = 30
const HOT_TEMP_THRESHOLD = 40
const STORM_KP_THRESHOLD = 4
const HIGH_NEO_THRESHOLD = 15
const POPULATION_GROWTH_PER_SEC = 2.4

export function HomePlanetaryTelemetryWidget() {
  const [systemMetrics, setSystemMetrics] = useState([
    {
      label: "POPULATION",
      stat: "CALCULATING...",
      trend: "▲ +0.8% YR",
      trendColor: "text-emerald-400",
    },
    {
      label: "EARTHQUAKES",
      stat: "SCANNING...",
      trend: "...",
      trendColor: "text-primary",
    },
    {
      label: "MECCA TEMP",
      stat: "SCANNING...",
      trend: "...",
      trendColor: "text-primary",
    },
    {
      label: "SOLAR STORMS",
      stat: "SCANNING...",
      trend: "...",
      trendColor: "text-primary",
    },
    {
      label: "ASTEROIDS",
      stat: "SCANNING...",
      trend: "...",
      trendColor: "text-amber-400",
    },
  ])

  useEffect(() => {
    const updateMetrics = async () => {
      let quakeCount = "SCANNING..."
      let quakeTrend = "CALCULATING..."
      let meccaTemp = "SCANNING..."
      let meccaCondition = "UNKNOWN"
      let kpIndex = "SCANNING..."
      let kpTrend = "STABLE"
      let neoCount = "SCANNING..."
      let neoTrend = "SAFE"

      try {
        const quakeRes = await fetch(
          "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson"
        )
        const quakeData = await quakeRes.json()
        if (quakeData.features) {
          const count = quakeData.features.length
          quakeCount = `${count} DETECTED`
          quakeTrend = count > HIGH_QUAKE_THRESHOLD ? "▲ HIGH (24H)" : "▼ NORMAL"
        }
      } catch {
        /* ignore fallback network errors */
      }

      try {
        const weatherRes = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=21.4225&longitude=39.8262&current_weather=true"
        )
        const weatherData = await weatherRes.json()
        if (weatherData.current_weather) {
          const temp = weatherData.current_weather.temperature
          meccaTemp = `${temp} °C`
          meccaCondition = temp > HOT_TEMP_THRESHOLD ? "▲ HOT" : "▼ CLEAR"
        }
      } catch {
        /* ignore fallback network errors */
      }

      try {
        const kpRes = await fetch(
          "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json"
        )
        const kpData = await kpRes.json()
        const validRows = kpData.filter(
          (row: unknown[]) => String(row[1]) !== "Kp" && !isNaN(parseFloat(String(row[1])))
        )
        const latestKp =
          validRows.length > 0
            ? parseFloat(String(validRows[validRows.length - 1][1]))
            : 0
        kpIndex = `${latestKp.toFixed(1)} KP`
        kpTrend = latestKp >= STORM_KP_THRESHOLD ? "▲ STORM" : "▼ STABLE"
      } catch {
        /* ignore fallback network errors */
      }

      try {
        const todayStr = new Date().toISOString().split("T")[0]
        const neoRes = await fetch(
          `https://api.nasa.gov/neo/rest/v1/feed?start_date=${todayStr}&end_date=${todayStr}&api_key=DEMO_KEY`
        )
        const neoData = await neoRes.json()
        if (neoData.element_count !== undefined) {
          const neos = neoData.element_count
          neoCount = `${neos} ASTEROIDS`
          neoTrend = neos > HIGH_NEO_THRESHOLD ? "▲ ALERT" : "▼ SAFE"
        }
      } catch {
        /* ignore fallback network errors */
      }

      setSystemMetrics((prev) =>
        prev.map((m) => {
          if (m.label === "EARTHQUAKES")
            return {
              ...m,
              stat: quakeCount,
              trend: quakeTrend,
              trendColor: quakeTrend.includes("▲")
                ? "text-fuchsia-400"
                : "text-emerald-400",
            }
          if (m.label === "MECCA TEMP")
            return {
              ...m,
              stat: meccaTemp,
              trend: meccaCondition,
              trendColor: meccaCondition.includes("▲")
                ? "text-amber-400"
                : "text-emerald-400",
            }
          if (m.label === "SOLAR STORMS")
            return {
              ...m,
              stat: kpIndex,
              trend: kpTrend,
              trendColor: kpTrend.includes("STORM")
                ? "text-danger"
                : "text-emerald-400",
            }
          if (m.label === "ASTEROIDS")
            return {
              ...m,
              stat: neoCount,
              trend: neoTrend,
              trendColor: neoTrend.includes("ALERT")
                ? "text-amber-400"
                : "text-emerald-400",
            }
          return m
        })
      )
    }
    
    updateMetrics()

    const timer = setInterval(() => {
      const now = new Date()
      // Live Global Population Mock
      const basePop = 8118000000
      const baseDate = new Date("2024-01-01T00:00:00Z").getTime()
      const popGrowth = Math.floor(((now.getTime() - baseDate) / 1000) * POPULATION_GROWTH_PER_SEC)
      const currentPop = (basePop + popGrowth).toLocaleString()

      setSystemMetrics((prev) =>
        prev.map((m) =>
          m.label === "POPULATION" ? { ...m, stat: currentPop } : m
        )
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-space/10 flex flex-col justify-between rounded-xl border border-white/[0.08] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-2xl lg:col-span-3">
      <div>
        <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2.5 text-xs font-bold tracking-wider text-primary uppercase">
          <span>PLANETARY TELEMETRY</span>
          <Globe className="h-4 w-4 text-primary" />
        </div>
        <div className="space-y-0.5 font-sans text-[10px] font-medium text-primary">
          {systemMetrics.map((row, idx) => (
            <div
              key={idx}
              className="group -mx-2 flex items-center justify-between rounded border-b border-white/[0.02] px-2 py-1.5 transition-colors last:border-0 hover:bg-white/[0.02]"
            >
              <span className="w-[35%] truncate pr-2 tracking-widest text-primary uppercase">
                {row.label}
              </span>
              <span className="w-[40%] font-mono font-bold tracking-wide text-primary">
                {row.stat}
              </span>
              <span
                className={`w-[25%] text-right text-[9px] font-bold tracking-wider ${row.trendColor}`}
              >
                {row.trend}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 border-t border-primary/20 pt-3 font-sans text-[10px] font-medium tracking-[0.2em] text-primary/70 uppercase">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />{" "}
        SYSTEM ACTIVE
      </div>
    </div>
  )
}
