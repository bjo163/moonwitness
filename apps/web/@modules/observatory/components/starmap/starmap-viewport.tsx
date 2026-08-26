"use client"

import React from "react"
import { Maximize2, Compass, Crosshair, Telescope } from "lucide-react"

interface StarmapViewportProps {
  viewMode: string
  onToggleViewMode: () => void
  autoRotate: boolean
  onToggleAutoRotate: () => void
  showConstellations: boolean
  onToggleConstellations: () => void
}

export function StarmapViewport({
  viewMode,
  onToggleViewMode,
  autoRotate,
  onToggleAutoRotate,
  showConstellations,
  onToggleConstellations
}: StarmapViewportProps) {
  return (
    <div className="relative flex min-h-[450px] flex-col items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#050B16] p-6 shadow-2xl">
      {/* Background Star Canvas Emulation */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#050B16] to-[#050B16]" />

      {/* Grid Overlay Rings */}
      <div className="relative flex h-80 w-80 items-center justify-center rounded-full border border-dashed border-indigo-500/20">
        <div className="absolute h-60 w-60 rounded-full border border-indigo-500/10" />
        <div className="absolute h-40 w-40 rounded-full border border-indigo-500/10" />
        <div className="absolute h-20 w-20 rounded-full border border-indigo-500/20" />

        {/* Central Crosshair */}
        <Crosshair className="h-6 w-6 text-indigo-400/40" />

        {/* Constellation Lines & Stars */}
        {showConstellations && (
          <div className="pointer-events-none absolute inset-0">
            {/* Orion-like sample stars */}
            <div className="absolute top-16 left-28 h-2 w-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
            <div className="absolute top-20 right-24 h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_10px_#fde047]" />
            <div className="absolute bottom-20 left-24 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_8px_#67e8f9]" />
            <div className="absolute bottom-16 right-28 h-2 w-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />

            {/* Belt stars */}
            <div className="absolute top-36 left-36 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
            <div className="absolute top-38 left-40 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
            <div className="absolute top-40 left-44 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
          </div>
        )}
      </div>

      {/* Viewport Control Badges */}
      <div className="absolute top-4 left-4 flex gap-2 font-mono text-[9px]">
        <button
          onClick={onToggleViewMode}
          className="rounded border border-white/10 bg-[#080E1C] px-2.5 py-1 text-white hover:border-indigo-500/40"
        >
          MODE: {viewMode}
        </button>
        <button
          onClick={onToggleAutoRotate}
          className={`rounded border px-2.5 py-1 ${
            autoRotate
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
              : "border-white/10 bg-[#080E1C] text-white/50"
          }`}
        >
          ROTATE: {autoRotate ? "ACTIVE" : "PAUSED"}
        </button>
        <button
          onClick={onToggleConstellations}
          className={`rounded border px-2.5 py-1 ${
            showConstellations
              ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-300"
              : "border-white/10 bg-[#080E1C] text-white/50"
          }`}
        >
          CONSTELLATIONS: {showConstellations ? "ON" : "OFF"}
        </button>
      </div>

      <div className="absolute bottom-4 right-4 font-mono text-[9px] text-white/40">
        LAT: +06°12′00″ • LON: +106°49′00″ • EQUATORIAL COORD
      </div>
    </div>
  )
}
