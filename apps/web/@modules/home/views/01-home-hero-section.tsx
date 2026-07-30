"use client"

import React, { useState, useEffect } from "react"
import { HomeHeroTitleWidget } from "@core/widgets/home/home-hero-title-widget"
import { HomeTelemetrySidebarWidget } from "@core/widgets/home/home-telemetry-sidebar-widget"
import { HomePlanetaryTelemetryWidget } from "@core/widgets/home/home-planetary-telemetry-widget"
import { HomeCelestialFeedWidget } from "@core/widgets/home/home-celestial-feed-widget"
import { HomeGlobalCoordinatesWidget } from "@core/widgets/home/home-global-coordinates-widget"
import { SYSTEM_CONSTANTS } from "@core/tokens/constants"
import { getWidgetsForDashboard } from "@modules/index"

type DailyTransmissionData = {
  ayah?: {
    surahNumber: number | string
    ayahNumber: number | string
  }
}

export function HomeHeroSection() {
  const [bgIndex, setBgIndex] = useState(0)
  const [dailyData, setDailyData] = useState<DailyTransmissionData | null>(null)

  const backgrounds = [
    "/blueprint/BG-HERO-01.png",
    "/blueprint/BG-HERO-02.png",
    "/blueprint/BG-HERO-03.png",
    "/blueprint/BG-HERO-04.png",
    "/blueprint/BG-HERO-05.png",
    "/blueprint/BG-HERO-06.png",
    "/blueprint/BG-HERO-07.png",
    "/blueprint/BG-HERO-08.png",
  ]

  useEffect(() => {
    fetch("/api/daily")
      .then((res) => res.json())
      .then((data) => setDailyData(data))
      .catch(() => {
        // Ignore fallback fetch error
      })

    const bgInterval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length)
    }, SYSTEM_CONSTANTS.POLL_INTERVAL)
    return () => clearInterval(bgInterval)
  }, [backgrounds.length])

  return (
    <section id="hero" className="bg-space relative flex min-h-screen w-full flex-col justify-center overflow-hidden pt-20 pb-10 font-sans text-white select-none">
      {/* Background layer */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        style={{
          maskImage: "linear-gradient(to bottom, black 75%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 75%, transparent 100%)"
        }}
      >
        {backgrounds.map((bg, idx) => (
          <div
            key={bg}
            className={`absolute inset-0 bg-cover bg-[center_top] bg-no-repeat transition-opacity duration-[2000ms] ease-in-out ${
              idx === bgIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url('${bg}')` }}
          />
        ))}
        <div className="pointer-events-none absolute top-[140px] right-[220px] z-10 font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase">
          LUNA
        </div>
        <div className="pointer-events-none absolute top-[400px] right-[140px] z-10 font-mono text-[9px] tracking-[0.2em] text-primary/50 uppercase">
          ORBIT-7
        </div>
        <div className="from-space via-space/75 absolute inset-0 w-full bg-gradient-to-r to-transparent sm:w-2/3" />
        <div className="from-space absolute inset-0 bg-gradient-to-t via-transparent to-black/50" />
        
        <div className="theme-grid-bg absolute inset-0 opacity-15" />
      </div>

      {/* Foreground Content */}
      <main className="relative z-20 mx-auto my-8 flex w-full max-w-7xl flex-1 flex-col justify-center px-6 sm:my-16 sm:px-10">
        <div className="mb-4">
          <h2 className="font-mono text-[10px] font-black tracking-[0.3em] text-cyan-500/50 uppercase">
            [ SECTION 01 : HERO COMMAND ]
          </h2>
        </div>
        <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-8">
            <HomeHeroTitleWidget dailyData={dailyData as any} />
          </div>
          <div className="hidden flex-col items-end justify-center lg:col-span-4 lg:flex">
            <HomeTelemetrySidebarWidget />
          </div>
        </div>
      </main>

      {/* Restored Widgets Footer */}
      <footer className="relative z-20 mx-auto mt-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-6 pb-10 sm:px-10 lg:grid-cols-12">
        <HomePlanetaryTelemetryWidget />
        
        <div className="flex h-full flex-col gap-5 lg:col-span-5">
           <HomeCelestialFeedWidget />
        </div>

        <HomeGlobalCoordinatesWidget />
      </footer>

      {/* DYNAMIC WIDGET INJECTION */}
      {getWidgetsForDashboard("HOME").length > 0 && (
        <div className="relative z-20 mx-auto mt-4 w-full max-w-7xl px-6 sm:px-10 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getWidgetsForDashboard("HOME").map((widget) => {
              const WidgetComponent = widget.component
              return <WidgetComponent key={widget.id} />
            })}
          </div>
        </div>
      )}
    </section>
  )
}
