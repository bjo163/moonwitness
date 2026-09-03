"use client"

import React from "react"
import { Telescope, Sun, Moon, Compass, Sparkles } from "lucide-react"

export function CelestialEventsView() {
  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-col gap-2">
        <h1 className="flex items-center gap-3 text-3xl font-black tracking-widest text-white uppercase">
          <Telescope className="h-8 w-8 text-primary" />
          Celestial Events & Telemetry
        </h1>
        <p className="font-mono text-sm text-primary/70">
          Real-time astronomical calculations, lunar phase analytics, and solar
          cycle telemetry.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-4 rounded-2xl border border-border bg-black/40 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs font-bold tracking-wider text-primary uppercase">
              Moon Phase
            </h3>
            <Moon className="h-5 w-5 text-primary" />
          </div>
          <div className="font-mono text-2xl font-black text-white">
            WAXING CRESCENT
          </div>
          <p className="font-mono text-xs text-zinc-400">
            Illumination: 18.4% | Age: 3.2 Days
          </p>
        </div>

        <div className="space-y-4 rounded-2xl border border-amber-500/20 bg-black/40 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs font-bold tracking-wider text-amber-400 uppercase">
              Solar Altitude
            </h3>
            <Sun className="h-5 w-5 text-amber-300" />
          </div>
          <div className="font-mono text-2xl font-black text-white">
            +42.15°
          </div>
          <p className="font-mono text-xs text-zinc-400">
            Azimuth: 284.10° NW | Solar Declination: +19.3°
          </p>
        </div>

        <div className="space-y-4 rounded-2xl border border-border bg-black/40 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs font-bold tracking-wider text-primary uppercase">
              Next Lunar Eclipse
            </h3>
            <Compass className="h-5 w-5 text-primary" />
          </div>
          <div className="font-mono text-2xl font-black text-white">
            TOTAL ECLIPSE
          </div>
          <p className="font-mono text-xs text-zinc-400">
            Countdown: 142d 08h 12m
          </p>
        </div>
      </div>
    </div>
  )
}
