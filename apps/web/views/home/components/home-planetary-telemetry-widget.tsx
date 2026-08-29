"use client"

import React, { useState, useEffect } from "react"
import { Globe } from "lucide-react"
import { useNasaFeeds } from "@moon/client"

const POPULATION_GROWTH_PER_SEC = 2.4

export function HomePlanetaryTelemetryWidget() {
  const { quake, weather, kp, neo } = useNasaFeeds()

  const [population, setPopulation] = useState("CALCULATING...")

  // Live population counter — ticks every second, independent of feed data
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const basePop = 8118000000
      const baseDate = new Date("2024-01-01T00:00:00Z").getTime()
      const popGrowth = Math.floor(
        ((now.getTime() - baseDate) / 1000) * POPULATION_GROWTH_PER_SEC
      )
      setPopulation((basePop + popGrowth).toLocaleString())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const neoCount = neo?.element_count
  const neoStat =
    neoCount !== undefined ? `${neoCount} ASTEROIDS` : "SCANNING..."
  const neoTrend =
    neoCount !== undefined ? (neoCount > 15 ? "▲ ALERT" : "▼ SAFE") : "..."
  const neoColor = neoTrend.includes("ALERT")
    ? "text-amber-400"
    : "text-emerald-400"

  const quakeStat = quake ? `${quake.count} DETECTED` : "SCANNING..."
  const quakeTrend = quake?.trend ?? "..."
  const quakeColor = quakeTrend.includes("▲")
    ? "text-fuchsia-400"
    : "text-emerald-400"

  const weatherStat = weather ? `${weather.temp} °C` : "SCANNING..."
  const weatherTrend = weather?.condition ?? "..."
  const weatherColor = weatherTrend.includes("▲")
    ? "text-amber-400"
    : "text-emerald-400"

  const kpStat = kp ? `${kp.kp.toFixed(1)} KP` : "SCANNING..."
  const kpTrend = kp?.trend ?? "..."
  const kpColor = kpTrend.includes("STORM") ? "text-danger" : "text-emerald-400"

  const metrics = [
    {
      label: "POPULATION",
      stat: population,
      trend: "▲ +0.8% YR",
      trendColor: "text-emerald-400",
    },
    {
      label: "EARTHQUAKES",
      stat: quakeStat,
      trend: quakeTrend,
      trendColor: quakeColor,
    },
    {
      label: "MECCA TEMP",
      stat: weatherStat,
      trend: weatherTrend,
      trendColor: weatherColor,
    },
    {
      label: "SOLAR STORMS",
      stat: kpStat,
      trend: kpTrend,
      trendColor: kpColor,
    },
    {
      label: "ASTEROIDS",
      stat: neoStat,
      trend: neoTrend,
      trendColor: neoColor,
    },
  ]

  return (
    <div className="bg-background/10 flex flex-col justify-between rounded-xl border border-white/[0.08] p-5 shadow-sm backdrop-blur-2xl lg:col-span-3">
      <div>
        <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2.5 text-xs font-bold tracking-wider text-primary uppercase">
          <span>PLANETARY TELEMETRY</span>
          <Globe className="h-4 w-4 text-primary" />
        </div>
        <div className="space-y-0.5 font-sans text-[10px] font-medium text-primary">
          {metrics.map((row) => (
            <div
              key={row.label}
              className="group -mx-2 flex flex-wrap items-center justify-between rounded border-b border-white/[0.02] px-2 py-2 transition-colors last:border-0 hover:bg-white/[0.02] sm:flex-nowrap sm:py-1.5"
            >
              <span className="w-1/2 truncate pr-2 tracking-widest text-primary uppercase sm:w-[35%]">
                {row.label}
              </span>
              <span className="w-1/2 text-right font-mono font-bold tracking-wide text-primary sm:w-[40%] sm:text-left">
                {row.stat}
              </span>
              <span
                className={`mt-1 w-full text-right text-[9px] font-bold tracking-wider sm:mt-0 sm:w-[25%] ${row.trendColor}`}
              >
                {row.trend}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 border-t border-primary/20 pt-3 font-sans text-[10px] font-medium tracking-[0.2em] text-primary/70 uppercase">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />{" "}
        SYSTEM ACTIVE
      </div>
    </div>
  )
}
