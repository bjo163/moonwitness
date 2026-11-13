"use client"

import { useEffect, useState } from "react"
import { AstronomyEventsSidebar } from "./astronomy-events-sidebar"
import { AstronomyOrreryCanvas } from "./astronomy-orrery-canvas"
import { AstronomyOverviewSidebar } from "./astronomy-overview-sidebar"
import { AstronomySectionHeader } from "./astronomy-section-header"
import { AstronomyTelemetryRow } from "./astronomy-telemetry-row"

export function OSDivineAstronomy() {
  const [clockWIB, setClockWIB] = useState("06:50:16 WIB")

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setClockWIB(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          timeZone: "Asia/Jakarta",
        }) + " WIB"
      )
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section
      id="astronomy"
      className="bg-background relative z-10 overflow-hidden border-b border-blue-500/30 py-20 font-mono text-foreground"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="theme-grid-bg absolute inset-0 opacity-30" />
        <div className="bg-radial-gradient absolute top-1/4 left-1/2 h-[600px] w-[1200px] -translate-x-1/2 from-blue-900/20 via-indigo-900/10 to-transparent blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:100%_4px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-6 sm:px-10">
        <AstronomySectionHeader clock={clockWIB} />

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          <AstronomyEventsSidebar />
          <AstronomyOrreryCanvas />
          <AstronomyOverviewSidebar />
        </div>

        <AstronomyTelemetryRow />
      </div>
    </section>
  )
}
