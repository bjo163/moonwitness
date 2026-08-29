"use client"

import { useState, useEffect } from "react"
import { apiGet } from "@moon/client"
import { RadarHeroStats } from "../components/radar/radar-hero-stats"
import { RadarMapPanel } from "../components/radar/radar-map-panel"
import { RadarWarningFeed } from "../components/radar/radar-warning-feed"

export function AtmosphericRadarView() {
  const [mounted, setMounted] = useState(false)
  const [rainTimestamp, setRainTimestamp] = useState<number>(0)

  useEffect(() => {
    setMounted(true)
    apiGet<any>("/api/external/rainviewer")
      .then((data: any) => {
        if (data?.radar?.past?.length > 0) {
          setRainTimestamp(data.radar.past[data.radar.past.length - 1].time)
        }
      })
      .catch(() => {})
  }, [])

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-card font-mono text-sm tracking-widest text-primary">
        INITIALIZING ATMOSPHERIC RADAR...
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-card pb-12 font-sans text-white selection:bg-primary/10">
      <div className="mx-auto max-w-[1800px] space-y-6 px-4 pt-6 lg:px-6">
        {/* 1. Header Hero & Atmospheric Metrics */}
        <RadarHeroStats
          systemStatus="ONLINE • DOPPLER CALIBRATED"
          activeStations={48}
        />

        {/* 2. Main 2-Column Content Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT: Leaflet Radar Map Viewport */}
          <div className="lg:col-span-2">
            <RadarMapPanel rainTimestamp={rainTimestamp} />
          </div>

          {/* RIGHT: Extreme Alerts & Quranic Reflection */}
          <div>
            <RadarWarningFeed />
          </div>
        </div>
      </div>
    </div>
  )
}
