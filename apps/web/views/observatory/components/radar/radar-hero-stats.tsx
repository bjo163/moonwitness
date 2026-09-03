"use client"

import React from "react"
import { Radio, Wind, Droplets, ThermometerSun, AlertTriangle } from "lucide-react"
import { useResource } from "@workspace/hooks"
import { fetchExternalWeather } from "@moon/client"

interface RadarHeroStatsProps {
  systemStatus: string
  activeStations: number
}

export function RadarHeroStats({
  systemStatus,
  activeStations
}: RadarHeroStatsProps) {
  const { data: weatherData } = useResource(
    () => fetchExternalWeather(-6.2, 106.8),
    { storageKey: "mw_radar_weather" }
  )

  const currentTemp = weatherData?.current_weather?.temperature ?? 28.4
  const windSpeed = weatherData?.current_weather?.windspeed ?? 14.2
  const windDirection = weatherData?.current_weather?.winddirection ?? 210

  const metrics = [
    {
      label: "WIND SPEED",
      val: `${windSpeed} km/h`,
      sub: `Vector ${windDirection}° • Calibrated`,
      icon: Wind,
      color: "text-primary",
    },
    {
      label: "TEMPERATURE",
      val: `${currentTemp}°C`,
      sub: "Surface Heat Telemetry",
      icon: Droplets,
      color: "text-blue-400",
    },
    {
      label: "UV INDEX",
      val: "8.4 UV",
      sub: "Solar Influx • Active",
      icon: ThermometerSun,
      color: "text-warning",
    },
    {
      label: "RADAR ARRAY",
      val: `${activeStations} STATIONS`,
      sub: "Doppler Online",
      icon: Radio,
      color: "text-success",
    },
  ]

  return (
    <div className="space-y-4">
      {/* 1. Header Banner */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-border pb-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-primary/10 text-primary">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="mb-1 flex items-center gap-3">
              <h1 className="font-mono text-2xl font-black tracking-widest text-foreground uppercase drop-shadow-md sm:text-3xl">
                ATMOSPHERIC DOPPLER RADAR
              </h1>
              <span className="rounded border border-border bg-primary/10 px-2 py-0.5 font-mono text-[9px] font-bold text-primary">
                SATELLITE TELEMETRY
              </span>
            </div>
            <p className="font-mono text-xs text-foreground/50">
              Real-time Global Weather, Precipitation Influx, Wind Vectors, and Storm Warning Radar
            </p>
          </div>
        </div>

        <div className="text-right font-mono text-[10px]">
          <div className="text-foreground/40">RADAR STATUS</div>
          <div className="font-bold text-success">{systemStatus}</div>
        </div>
      </div>

      {/* 2. Top Weather Metrics Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card/[0.02]">
              <m.icon className={`h-5 w-5 ${m.color}`} />
            </div>
            <div className="font-mono">
              <div className="text-[9px] text-foreground/40">{m.label}</div>
              <div className="text-sm font-black text-foreground">{m.val}</div>
              <div className="text-[8px] text-foreground/30">{m.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
