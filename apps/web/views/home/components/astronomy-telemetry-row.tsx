"use client"

import React from "react"
import Image from "next/image"
import {
  Activity,
  Navigation,
  Compass,
  Sun,
  Eye,
  Cloudy,
  BookOpen,
} from "lucide-react"

export function AstronomyTelemetryRow() {
  return (
    <div className="grid grid-cols-1 items-stretch gap-6 pt-2 md:grid-cols-12">
      {/* Live Telemetry Stats (Col 1-4) */}
      <div className="bg-background flex flex-col justify-between rounded-xl border border-blue-500/30 p-5 md:col-span-4">
        <div className="mb-4 flex items-center gap-2 text-[10px] font-black tracking-widest text-blue-400 uppercase">
          <Activity className="h-3.5 w-3.5" /> LIVE TELEMETRY
        </div>
        <div className="grid grid-cols-2 gap-3 text-center lg:grid-cols-4">
          <div>
            <div className="mb-1.5 flex justify-center">
              <Navigation className="h-4 w-4 text-blue-400" />
            </div>
            <div className="text-[8px] font-bold text-primary uppercase">
              Moon Altitude
            </div>
            <div className="mt-0.5 font-mono text-sm font-black text-primary">
              54.2°
            </div>
          </div>
          <div>
            <div className="mb-1.5 flex justify-center">
              <Compass className="h-4 w-4 text-blue-400" />
            </div>
            <div className="text-[8px] font-bold text-primary uppercase">
              Moon Azimuth
            </div>
            <div className="mt-0.5 font-mono text-sm font-black text-primary">
              186.4°
            </div>
          </div>
          <div>
            <div className="mb-1.5 flex justify-center">
              <Sun className="h-4 w-4 text-warning" />
            </div>
            <div className="text-[8px] font-bold text-primary uppercase">
              Sun Altitude
            </div>
            <div className="mt-0.5 font-mono text-sm font-black text-amber-300">
              52.3°
            </div>
          </div>
          <div>
            <div className="mb-1.5 flex justify-center">
              <Eye className="h-4 w-4 text-success" />
            </div>
            <div className="text-[8px] font-bold text-primary uppercase">
              Visibility
            </div>
            <div className="mt-0.5 font-mono text-sm font-black text-success">
              Excellent
            </div>
          </div>
        </div>
      </div>

      {/* Current Sky Status (Col 5-8) */}
      <div className="bg-background relative flex flex-col justify-between overflow-hidden rounded-xl border border-blue-500/30 p-5 md:col-span-4">
        <div className="absolute inset-0 bg-[url('/assets/hero_bg.png')] object-cover opacity-20" />
        <div className="relative z-10 mb-4 flex items-center gap-2 text-[10px] font-black tracking-widest text-foreground uppercase">
          <Cloudy className="h-3.5 w-3.5" /> CURRENT SKY
        </div>

        <div className="relative z-10 grid grid-cols-4 items-end gap-3">
          <div>
            <div className="mb-1 text-[8px] font-bold text-primary uppercase">
              Moon Phase
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-4 w-4 shrink-0 overflow-hidden rounded-full">
                <Image
                  unoptimized
                  width={120}
                  height={120}
                  alt="User avatar"
                  src="/assets/cam_moon.png"
                  className="h-full w-full"
                />
              </div>
              <div className="text-[10px] leading-tight font-bold text-foreground">
                Waning
                <br />
                Gibbous
              </div>
            </div>
          </div>
          <div>
            <div className="mb-1 text-[8px] font-bold text-primary uppercase">
              Sky Brightness
            </div>
            <div className="font-mono text-xs font-black text-primary">
              78%
            </div>
          </div>
          <div>
            <div className="mb-1 text-[8px] font-bold text-primary uppercase">
              Milky Way
            </div>
            <div className="font-mono text-xs font-black text-primary">
              Visible
            </div>
          </div>
          <div>
            <div className="mb-1 text-[8px] font-bold text-primary uppercase">
              Constellation
            </div>
            <div className="font-mono text-xs font-black text-primary">
              Orion
            </div>
          </div>
        </div>
      </div>

      {/* Astronomical Insight (Col 9-12) */}
      <div className="bg-background flex flex-col justify-center rounded-xl border-2 border-border p-5 shadow-sm md:col-span-4">
        <div className="mb-2 flex items-center justify-between text-[10px] font-black tracking-widest text-primary uppercase">
          <span>ASTRONOMICAL INSIGHT</span>
          <BookOpen className="h-4 w-4 text-primary/50" />
        </div>
        <div className="border-l-2 border-border pl-3 font-serif text-xs leading-relaxed text-blue-100/90 italic lg:text-sm">
          &ldquo;The heavens declare the glory of God; and the firmament shows his handiwork.&rdquo;
        </div>
        <div className="mt-2 text-right font-mono text-[10px] font-black text-primary">
          — Psalm 19:1
        </div>
      </div>
    </div>
  )
}
