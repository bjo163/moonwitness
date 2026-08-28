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
      color: "text-cyan-400",
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
      color: "text-amber-400",
    },
    {
      label: "RADAR ARRAY",
      val: `${activeStations} STATIONS`,
      sub: "Doppler Online",
      icon: Radio,
      color: "text-emerald-400",
    },
  ]

  return (
    <div className="space-y-4">
      {/* 1. Header Banner */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="mb-1 flex items-center gap-3">
              <h1 className="font-mono text-2xl font-black tracking-widest text-white uppercase drop-shadow-md sm:text-3xl">
                ATMOSPHERIC DOPPLER RADAR
              </h1>
              <span className="rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 font-mono text-[9px] font-bold text-cyan-400">
                SATELLITE TELEMETRY
              </span>
            </div>
            <p className="font-mono text-xs text-white/50">
              Real-time Global Weather, Precipitation Influx, Wind Vectors, and Storm Warning Radar
            </p>
          </div>
        </div>

        <div className="text-right font-mono text-[10px]">
          <div className="text-white/40">RADAR STATUS</div>
          <div className="font-bold text-emerald-400">{systemStatus}</div>
        </div>
      </div>

      {/* 2. Top Weather Metrics Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#080E1C] p-3 shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-white/[0.02]">
              <m.icon className={`h-5 w-5 ${m.color}`} />
            </div>
            <div className="font-mono">
              <div className="text-[9px] text-white/40">{m.label}</div>
              <div className="text-sm font-black text-white">{m.val}</div>
              <div className="text-[8px] text-white/30">{m.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
