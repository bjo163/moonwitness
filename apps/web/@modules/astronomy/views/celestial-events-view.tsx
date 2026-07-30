"use client"

import React from "react"
import { Telescope, Sun, Moon, Compass, Sparkles } from "lucide-react"

export function CelestialEventsView() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-widest text-white uppercase flex items-center gap-3">
          <Telescope className="h-8 w-8 text-cyan-400" />
          Celestial Events & Telemetry
        </h1>
        <p className="text-sm font-mono text-cyan-500/70">
          Real-time astronomical calculations, lunar phase analytics, and solar cycle telemetry.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-cyan-500/20 bg-black/40 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs font-bold text-cyan-400 tracking-wider uppercase">Moon Phase</h3>
            <Moon className="h-5 w-5 text-cyan-300" />
          </div>
          <div className="text-2xl font-black text-white font-mono">WAXING CRESCENT</div>
          <p className="text-xs text-zinc-400 font-mono">Illumination: 18.4% | Age: 3.2 Days</p>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-black/40 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs font-bold text-amber-400 tracking-wider uppercase">Solar Altitude</h3>
            <Sun className="h-5 w-5 text-amber-300" />
          </div>
          <div className="text-2xl font-black text-white font-mono">+42.15°</div>
          <p className="text-xs text-zinc-400 font-mono">Azimuth: 284.10° NW | Solar Declination: +19.3°</p>
        </div>

        <div className="rounded-2xl border border-purple-500/20 bg-black/40 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs font-bold text-purple-400 tracking-wider uppercase">Next Lunar Eclipse</h3>
            <Compass className="h-5 w-5 text-purple-300" />
          </div>
          <div className="text-2xl font-black text-white font-mono">TOTAL ECLIPSE</div>
          <p className="text-xs text-zinc-400 font-mono">Countdown: 142d 08h 12m</p>
        </div>
      </div>
    </div>
  )
}
