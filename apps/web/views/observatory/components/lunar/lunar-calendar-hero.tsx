"use client"

import React from "react"
import { Moon, Sparkles, ChevronLeft, ChevronRight, Compass } from "lucide-react"

interface LunarCalendarHeroProps {
  currentMonth: string
  currentYear: string
  hilalStatus: string
}

export function LunarCalendarHero({
  currentMonth,
  currentYear,
  hilalStatus
}: LunarCalendarHeroProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 border-b border-border pb-4 md:flex-row md:items-center">
      <div>
        <div className="mb-1 flex items-center gap-3">
          <h1 className="font-mono text-2xl font-black tracking-widest text-foreground uppercase drop-shadow-md sm:text-3xl">
            LUNAR & HIJRI OBSERVATORY
          </h1>
          <span className="rounded border border-warning/30 bg-warning/10 px-2 py-0.5 font-mono text-[9px] font-bold text-warning">
            HILAL TELEMETRY
          </span>
        </div>
        <p className="font-mono text-xs text-foreground/50">
          Precision Lunar Ephemeris, Moon Phase Illumination, and Celestial Calendar Synchronization
        </p>
      </div>

      <div className="flex items-center gap-4 text-right">
        <div className="font-mono text-xs">
          <div className="font-bold text-warning">{currentMonth} {currentYear} AH</div>
          <div className="text-[10px] text-foreground/40">{hilalStatus}</div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-warning/30 bg-warning/10 text-warning">
          <Moon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}
