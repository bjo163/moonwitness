"use client"

import React, { useState, useEffect } from "react"
import { Activity, CloudRain, Wind, Thermometer, Radio } from "lucide-react"

export function AtmosphericRadarView() {
  const [scanAngle, setScanAngle] = useState(0)

  useEffect(() => {
    let frame: number
    const animate = () => {
      setScanAngle((prev) => (prev + 2) % 360)
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden font-mono text-foreground">
      {/* Background Matrix */}
      <div className="pointer-events-none absolute inset-0 bg-black/90">
        <div className="theme-grid-bg absolute inset-0 opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent_70%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-8 p-6 md:p-10">
        {/* Header */}
        <div className="flex flex-col gap-2 border-b border-blue-500/30 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-400">
              <Radio className="h-5 w-5 animate-pulse" />
              <span className="text-sm font-black tracking-widest uppercase">
                OBSERVATORY SUB-SYSTEM
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-black tracking-wider text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] md:text-5xl">
              ATMOSPHERIC RADAR
            </h1>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-blue-300">
              STATUS: <span className="animate-pulse text-emerald-400">ACTIVE SCANNING</span>
            </div>
            <div className="text-[10px] text-blue-500">
              WAVELENGTH: 3.2cm (X-BAND) // TILT: 0.5°
            </div>
          </div>
        </div>

        {/* Main Radar Display & Side Stats */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main Radar Circular Display */}
          <div className="bg-space/40 backdrop-blur-xl relative flex min-h-[500px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-blue-500/40 p-6 shadow-[0_0_40px_rgba(59,130,246,0.1)] lg:col-span-8">
            {/* The Radar Circle */}
            <div className="relative flex h-80 w-80 items-center justify-center rounded-full border border-blue-500/50 shadow-[inset_0_0_40px_rgba(59,130,246,0.2)] md:h-[450px] md:w-[450px]">
              {/* Concentric rings */}
              <div className="absolute inset-4 rounded-full border border-blue-400/20" />
              <div className="absolute inset-12 rounded-full border border-blue-400/20" />
              <div className="absolute inset-24 rounded-full border border-blue-400/20" />
              <div className="absolute inset-36 rounded-full border border-blue-400/20" />
              
              {/* Crosshairs */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-full w-[1px] bg-blue-500/30" />
                <div className="absolute h-[1px] w-full bg-blue-500/30" />
              </div>

              {/* Scanning Beam Sweep */}
              <div
                className="absolute inset-0 origin-center"
                style={{ transform: `rotate(${scanAngle}deg)` }}
              >
                <div className="h-1/2 w-full bg-[conic-gradient(from_270deg_at_50%_100%,rgba(59,130,246,0)_0deg,rgba(59,130,246,0.1)_70deg,rgba(59,130,246,0.6)_90deg)] opacity-70 clip-path-polygon-[50%_100%,0_0,100%_0]" />
              </div>

              {/* Blips (Simulated Clouds / Storms) */}
              <div className="absolute top-1/4 left-1/3 h-8 w-12 animate-pulse rounded-full bg-emerald-500/40 blur-md" />
              <div className="absolute top-1/2 right-1/4 h-16 w-20 rounded-[40%] bg-blue-400/30 blur-lg" />
              <div className="absolute bottom-1/4 left-1/2 h-10 w-10 animate-ping rounded-full bg-rose-500/20 blur-md" />
            </div>

            {/* Radar Coordinates Overlay */}
            <div className="absolute top-4 left-4 text-[10px] font-bold text-blue-400">
              RANGE: 250 KM<br/>
              ELEV: 2.4°<br/>
              AZIMUTH: {scanAngle.toFixed(1)}°
            </div>
          </div>

          {/* Side Telemetry Panels */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            <div className="bg-space/40 backdrop-blur-xl rounded-xl border border-blue-500/30 p-5">
              <div className="mb-4 flex items-center gap-2 border-b border-blue-500/20 pb-2 text-xs font-black tracking-wider text-blue-300 uppercase">
                <CloudRain className="h-4 w-4" /> PRECIPITATION
              </div>
              <div className="font-mono text-3xl font-black text-white">
                0.0 <span className="text-sm text-blue-400">mm/h</span>
              </div>
              <div className="mt-1 text-[10px] text-blue-500">NO RAIN DETECTED IN 50KM RADIUS</div>
            </div>

            <div className="bg-space/40 backdrop-blur-xl rounded-xl border border-blue-500/30 p-5">
              <div className="mb-4 flex items-center gap-2 border-b border-blue-500/20 pb-2 text-xs font-black tracking-wider text-blue-300 uppercase">
                <Wind className="h-4 w-4" /> WIND VECTOR
              </div>
              <div className="font-mono text-3xl font-black text-white">
                12 <span className="text-sm text-blue-400">km/h</span>
              </div>
              <div className="mt-1 text-[10px] text-blue-500">DIRECTION: NW (315°)</div>
            </div>

            <div className="bg-space/40 backdrop-blur-xl rounded-xl border border-blue-500/30 p-5">
              <div className="mb-4 flex items-center gap-2 border-b border-blue-500/20 pb-2 text-xs font-black tracking-wider text-blue-300 uppercase">
                <Thermometer className="h-4 w-4" /> ATMOSPHERIC TEMP
              </div>
              <div className="font-mono text-3xl font-black text-white">
                28.5 <span className="text-sm text-rose-400">°C</span>
              </div>
              <div className="mt-1 text-[10px] text-blue-500">DEW POINT: 22°C // HUMIDITY: 65%</div>
            </div>

            <div className="bg-blue-950/40 backdrop-blur-xl rounded-xl border border-blue-500/30 p-5 text-center">
              <Activity className="mx-auto mb-2 h-6 w-6 animate-pulse text-emerald-400" />
              <div className="text-[10px] font-black tracking-widest text-emerald-400">VISIBILITY EXCELLENT FOR LUNAR SIGHTING</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
