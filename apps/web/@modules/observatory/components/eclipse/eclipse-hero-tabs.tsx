"use client"

import React from "react"
import { Sun, Moon, Clock, Radio, Activity } from "lucide-react"

export interface EclipseData {
  id: string
  date: string
  type: string
  location: string
  duration: string
  timestamp: number
  magnitude: string
  coverage: string
}

export const UPCOMING_ECLIPSES: {
  SOLAR: EclipseData
  LUNAR: EclipseData
} = {
  SOLAR: {
    id: "ecl-1",
    date: "AUGUST 12, 2026",
    type: "TOTAL SOLAR ECLIPSE",
    location: "Arctic, Greenland, Iceland, Spain",
    duration: "2m 17s",
    timestamp: new Date("2026-08-12T18:47:32Z").getTime(),
    magnitude: "1.044",
    coverage: "100%",
  },
  LUNAR: {
    id: "ecl-2",
    date: "MARCH 3, 2026",
    type: "TOTAL LUNAR ECLIPSE",
    location: "Americas, Europe, Africa, Asia",
    duration: "58m 19s",
    timestamp: new Date("2026-03-03T11:34:00Z").getTime(),
    magnitude: "1.15",
    coverage: "100%",
  },
}

interface EclipseHeroTabsProps {
  activeTab: "SOLAR" | "LUNAR"
  onTabChange: (tab: "SOLAR" | "LUNAR") => void
  timeRemaining: string
}

export function EclipseHeroTabs({
  activeTab,
  onTabChange,
  timeRemaining
}: EclipseHeroTabsProps) {
  return (
    <div className="space-y-4">
      {/* 1. Header Banner */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-4 md:flex-row md:items-center">
        <div>
          <div className="mb-1 flex items-center gap-3">
            <h1 className="font-mono text-2xl font-black tracking-widest text-white uppercase drop-shadow-md sm:text-3xl">
              CELESTIAL ECLIPSE CHRONOMETER
            </h1>
            <span className="rounded border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 font-mono text-[9px] font-bold text-yellow-400">
              SYZYGY TELEMETRY
            </span>
          </div>
          <p className="font-mono text-xs text-white/50">
            Global Umbra/Penumbra Path Calculation, Eclipse Geometry, and Solar/Lunar Alignment
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#080E1C] p-1 font-mono text-xs">
          <button
            onClick={() => onTabChange("SOLAR")}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 font-bold uppercase transition-all ${
              activeTab === "SOLAR"
                ? "border border-amber-500/50 bg-amber-500/20 text-amber-300 shadow-[0_0_10px_rgba(255,230,0,0.2)]"
                : "text-white/50 hover:text-white"
            }`}
          >
            <Sun className="h-4 w-4" />
            <span>Solar Eclipse</span>
          </button>
          <button
            onClick={() => onTabChange("LUNAR")}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 font-bold uppercase transition-all ${
              activeTab === "LUNAR"
                ? "border border-red-500/50 bg-red-500/20 text-red-300 shadow-[0_0_10px_rgba(255,0,85,0.2)]"
                : "text-white/50 hover:text-white"
            }`}
          >
            <Moon className="h-4 w-4" />
            <span>Lunar Eclipse</span>
          </button>
        </div>
      </div>

      {/* 2. Real-time Countdown Banner */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-yellow-500/30 bg-gradient-to-r from-[#141C36] via-[#0A1224] to-[#141C36] p-4 shadow-lg md:flex-row">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-400">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="font-mono text-xs font-black text-white uppercase">
              NEXT {UPCOMING_ECLIPSES[activeTab].type}
            </div>
            <div className="font-mono text-[10px] text-white/50">
              {UPCOMING_ECLIPSES[activeTab].date} • {UPCOMING_ECLIPSES[activeTab].location}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-sm font-black text-yellow-400">
          <Clock className="h-4 w-4" />
          <span>T-MINUS: {timeRemaining}</span>
        </div>
      </div>
    </div>
  )
}
