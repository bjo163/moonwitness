"use client"

import { useState, useEffect } from "react"
import {
  EclipseHeroTabs,
  UPCOMING_ECLIPSES,
  type EclipseData
} from "../components/eclipse/eclipse-hero-tabs"
import { EclipseMainVisualizer } from "../components/eclipse/eclipse-main-visualizer"
import {
  EclipseTelemetrySidebar,
  type AstroLiveTelemetry
} from "../components/eclipse/eclipse-telemetry-sidebar"

export function EclipseTrackerView() {
  const [activeTab, setActiveTab] = useState<"SOLAR" | "LUNAR">("SOLAR")
  const [now, setNow] = useState<number>(Date.now())
  const [astroData, setAstroData] = useState<AstroLiveTelemetry>({
    flux: 143,
    kp: 1.33,
    sunspot: 78,
    speed: 402,
    bz: -1.8,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now())
      setAstroData((prev) => ({
        flux: prev.flux + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3),
        kp: +(prev.kp + (Math.random() > 0.5 ? 0.02 : -0.02)).toFixed(2),
        sunspot: Math.max(0, prev.sunspot + (Math.random() > 0.8 ? 1 : Math.random() < 0.2 ? -1 : 0)),
        speed: prev.speed + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 4),
        bz: +(prev.bz + (Math.random() > 0.5 ? 0.1 : -0.1)).toFixed(1),
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const currentEclipse: EclipseData = UPCOMING_ECLIPSES[activeTab]
  const diffMs = Math.max(0, currentEclipse.timestamp - now)
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)
  const timeRemaining = `${days}D ${hours}H ${minutes}M ${seconds}S`

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#040814] pb-12 font-sans text-white selection:bg-yellow-500/30">
      <div className="mx-auto max-w-[1800px] space-y-6 px-4 pt-6 lg:px-6">
        {/* 1. Hero & Tabs */}
        <EclipseHeroTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          timeRemaining={timeRemaining}
        />

        {/* 2. Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT: Alignment Visualizer & Geographic Map */}
          <div className="lg:col-span-2">
            <EclipseMainVisualizer
              eclipse={currentEclipse}
              isSolar={activeTab === "SOLAR"}
            />
          </div>

          {/* RIGHT: Live Solar Weather & Prophetic Kusuf Guidelines */}
          <div>
            <EclipseTelemetrySidebar
              astro={astroData}
              isSolar={activeTab === "SOLAR"}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
