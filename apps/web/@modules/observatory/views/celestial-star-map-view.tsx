"use client"

import React, { useState } from "react"
import { Sparkles, Moon, Sun, Compass, Maximize2 } from "lucide-react"

export function CelestialStarMapView() {
  const [activeConstellation, setActiveConstellation] = useState<string | null>(null)

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden font-mono text-foreground">
      {/* Deep Space Background Matrix */}
      <div className="pointer-events-none absolute inset-0 bg-[#0a0a0f]">
        <div className="absolute inset-0 bg-[url('/assets/hero_bg.png')] opacity-30 contrast-125 mix-blend-screen" style={{ backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="theme-grid-bg absolute inset-0 opacity-10" />
        <div className="bg-radial-gradient absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 from-purple-900/20 via-transparent to-transparent blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-8 p-6 md:p-10">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-purple-500/30 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-purple-400">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <span className="text-sm font-black tracking-widest uppercase">
                OBSERVATORY SUB-SYSTEM
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-black tracking-wider text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] md:text-5xl">
              CELESTIAL STAR MAP
            </h1>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="rounded border border-purple-500/30 bg-purple-900/40 px-3 py-1.5 text-purple-300 backdrop-blur-md">
              RA: 05h 35m 17s
            </div>
            <div className="rounded border border-purple-500/30 bg-purple-900/40 px-3 py-1.5 text-purple-300 backdrop-blur-md">
              DEC: -05° 23′ 28″
            </div>
          </div>
        </div>

        {/* Main Star Map Viewport */}
        <div className="bg-space/40 backdrop-blur-xl relative flex min-h-[600px] w-full items-center justify-center overflow-hidden rounded-2xl border border-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.1)]">
          
          {/* Overlay Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.1)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />

          {/* Ecliptic Line */}
          <div className="absolute top-1/2 left-0 h-[1px] w-full bg-amber-500/30 -rotate-12 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
          
          {/* Constellation Nodes (Mock UI) */}
          <div className="absolute inset-0">
            {/* Orion */}
            <div 
              className={`absolute top-1/3 left-1/3 transition-all ${activeConstellation === 'orion' ? 'scale-125' : 'hover:scale-110'}`}
              onMouseEnter={() => setActiveConstellation('orion')}
              onMouseLeave={() => setActiveConstellation(null)}
            >
              <div className="h-3 w-3 animate-pulse rounded-full bg-blue-300 shadow-[0_0_15px_#93C5FD]" />
              <div className="absolute top-4 left-4 whitespace-nowrap text-[10px] font-black text-purple-300">
                ORION (Al-Jabbar)
              </div>
            </div>

            {/* Pleiades */}
            <div 
              className={`absolute top-1/4 right-1/3 transition-all ${activeConstellation === 'pleiades' ? 'scale-125' : 'hover:scale-110'}`}
              onMouseEnter={() => setActiveConstellation('pleiades')}
              onMouseLeave={() => setActiveConstellation(null)}
            >
              <div className="flex gap-1">
                <div className="h-2 w-2 rounded-full bg-white shadow-[0_0_10px_#FFF]" />
                <div className="h-1.5 w-1.5 rounded-full bg-blue-200" />
                <div className="h-2 w-2 rounded-full bg-white shadow-[0_0_10px_#FFF]" />
              </div>
              <div className="absolute top-4 left-0 whitespace-nowrap text-[10px] font-black text-purple-300">
                PLEIADES (Ath-Thurayya)
              </div>
            </div>

            {/* Moon Position */}
            <div className="absolute top-[45%] left-[45%] flex flex-col items-center">
              <Moon className="h-8 w-8 text-white drop-shadow-[0_0_15px_#FFF]" />
              <div className="mt-2 rounded border border-cyan-500/50 bg-cyan-950/80 px-2 py-0.5 text-[9px] font-black tracking-widest text-cyan-400">
                LUNAR POSITION
              </div>
            </div>

            {/* Sun Position */}
            <div className="absolute bottom-[20%] left-[20%] flex flex-col items-center">
              <Sun className="h-10 w-10 animate-spin-slow text-amber-400 drop-shadow-[0_0_20px_#F59E0B]" />
              <div className="mt-2 rounded border border-amber-500/50 bg-amber-950/80 px-2 py-0.5 text-[9px] font-black tracking-widest text-amber-400">
                SOLAR VECTOR
              </div>
            </div>
          </div>

          {/* Controls UI */}
          <div className="absolute right-6 bottom-6 flex flex-col gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-purple-500/40 bg-purple-950/60 text-purple-300 backdrop-blur-md hover:bg-purple-900/80 hover:text-white transition-colors">
              <Compass className="h-5 w-5" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-purple-500/40 bg-purple-950/60 text-purple-300 backdrop-blur-md hover:bg-purple-900/80 hover:text-white transition-colors">
              <Maximize2 className="h-5 w-5" />
            </button>
          </div>
          
          <div className="absolute left-6 bottom-6 text-[10px] font-mono text-purple-400/60">
            EPOCH: J2000.0 // FOV: 60°
          </div>
        </div>
      </div>
    </div>
  )
}
