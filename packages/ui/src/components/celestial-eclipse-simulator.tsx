"use client"

import React, { useState, useEffect } from "react"
import { Play, Pause, RotateCcw, Sparkles, Sun, Moon } from "lucide-react"

export interface CelestialEclipseSimulatorProps {
  initialProgress?: number
  eclipseType?: "TOTAL_SOLAR" | "ANNULAR" | "TOTAL_LUNAR"
  className?: string
}

export function CelestialEclipseSimulator({
  initialProgress = 0.5,
  eclipseType = "TOTAL_SOLAR",
  className = "",
}: CelestialEclipseSimulatorProps) {
  const [progress, setProgress] = useState<number>(initialProgress)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) return 0
        return +(prev + 0.005).toFixed(4)
      })
    }, 50)
    return () => clearInterval(interval)
  }, [isPlaying])

  // Calculate position offset for Moon relative to Sun
  const xOffset = (progress - 0.5) * 220
  const yOffset = (progress - 0.5) * 40
  const coveragePercent = Math.max(
    0,
    Math.round((1 - Math.abs(progress - 0.5) * 2) * 100)
  )

  const isTotality = coveragePercent >= 98

  const getContactPhase = (p: number) => {
    if (p < 0.15) return "PRE-ECLIPSE (STANDBY)"
    if (p < 0.35) return "FIRST CONTACT (C1 — INGRESS)"
    if (p < 0.48) return "PARTIAL ECLIPSE (DIAMOND RING APPROACH)"
    if (p <= 0.52) return "TOTALITY (MAXIMUM CORONA OBSERVED)"
    if (p < 0.65) return "THIRD CONTACT (C3 — BAILY'S BEADS)"
    if (p < 0.85) return "FOURTH CONTACT (C4 — EGRESS)"
    return "POST-ECLIPSE (RESTORED)"
  }

  return (
    <div className={`flex flex-col items-center justify-center font-mono ${className}`}>
      {/* Simulation Viewport */}
      <div className="relative h-72 w-full max-w-lg overflow-hidden rounded-2xl border border-cyan-500/30 bg-[#03060A] shadow-[0_0_50px_rgba(0,240,255,0.15)] flex items-center justify-center">
        {/* Background Starfield */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Solar Corona Flares (Prominent during totality) */}
        {isTotality && (
          <div className="absolute h-48 w-48 rounded-full bg-gradient-to-r from-amber-400 via-cyan-400 to-indigo-500 blur-2xl opacity-80 animate-pulse" />
        )}

        {/* Sun Sphere (Fixed at Center) */}
        <div className="relative z-10 h-36 w-36 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-white shadow-[0_0_60px_rgba(255,200,0,0.8)] flex items-center justify-center">
          <div className="h-full w-full rounded-full bg-amber-400/20 blur-sm" />
        </div>

        {/* Moon Disk (Moving along orbital trajectory) */}
        <div
          className="absolute z-20 h-36 w-36 rounded-full bg-[#05080E] border border-cyan-500/20 shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] transition-transform duration-75 ease-out"
          style={{
            transform: `translate(${xOffset}px, ${yOffset}px)`,
          }}
        />

        {/* Totality Diamond Ring Flare */}
        {coveragePercent >= 92 && coveragePercent < 98 && (
          <div
            className="absolute z-30 h-4 w-4 rounded-full bg-white shadow-[0_0_25px_#ffffff,0_0_50px_#00F0FF] animate-ping"
            style={{
              transform: `translate(${xOffset * 0.8}px, ${yOffset * 0.8}px)`,
            }}
          />
        )}

        {/* Telemetry In-Viewport Watermark */}
        <div className="absolute bottom-3 left-4 z-30 text-[10px] text-cyan-400">
          CHRONO • {getContactPhase(progress)}
        </div>
        <div className="absolute bottom-3 right-4 z-30 text-[10px] font-bold text-amber-400">
          {coveragePercent}% COVERAGE
        </div>
      </div>

      {/* Control Deck */}
      <div className="mt-4 w-full max-w-lg space-y-3 bg-card/80 p-4 rounded-xl border border-cyan-500/20 backdrop-blur-md">
        {/* Timeline Scrubber */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-zinc-500">C1</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={progress}
            onChange={(e) => {
              setIsPlaying(false)
              setProgress(parseFloat(e.target.value))
            }}
            className="h-1.5 flex-1 appearance-none rounded-lg bg-cyan-950 accent-cyan-400 cursor-pointer"
          />
          <span className="text-[10px] text-zinc-500">C4</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-500/20 transition-colors"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{isPlaying ? "PAUSE" : "SIMULATE"}</span>
            </button>
            <button
              onClick={() => {
                setIsPlaying(false)
                setProgress(0.5)
              }}
              className="px-2.5 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
            >
              TOTALITY
            </button>
            <button
              onClick={() => {
                setIsPlaying(false)
                setProgress(0)
              }}
              className="p-1.5 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="text-[10px] text-zinc-400">
            MODE: <span className="text-cyan-300">{eclipseType.replace("_", " ")}</span>
          </div>
        </div>
      </div>
    </div>
  )
}