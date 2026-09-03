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
    <div className="relative flex min-h-[450px] flex-col items-center justify-center overflow-hidden rounded-xl border border-border bg-muted p-6 shadow-2xl">
      {/* Background Star Canvas Emulation */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background" />

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
            <div className="absolute top-16 left-28 h-2 w-2 rounded-full bg-card shadow-sm" />
            <div className="absolute top-20 right-24 h-2.5 w-2.5 rounded-full bg-amber-300 shadow-sm" />
            <div className="absolute bottom-20 left-24 h-2 w-2 rounded-full bg-primary shadow-sm" />
            <div className="absolute bottom-16 right-28 h-2 w-2 rounded-full bg-card shadow-sm" />

            {/* Belt stars */}
            <div className="absolute top-36 left-36 h-1.5 w-1.5 rounded-full bg-card shadow-sm" />
            <div className="absolute top-38 left-40 h-1.5 w-1.5 rounded-full bg-card shadow-sm" />
            <div className="absolute top-40 left-44 h-1.5 w-1.5 rounded-full bg-card shadow-sm" />
          </div>
        )}
      </div>

      {/* Viewport Control Badges */}
      <div className="absolute top-4 left-4 flex gap-2 font-mono text-[9px]">
        <button
          onClick={onToggleViewMode}
          className="rounded border border-border bg-card px-2.5 py-1 text-foreground hover:border-indigo-500/40"
        >
          MODE: {viewMode}
        </button>
        <button
          onClick={onToggleAutoRotate}
          className={`rounded border px-2.5 py-1 ${
            autoRotate
              ? "border-emerald-500/40 bg-success/10 text-success"
              : "border-border bg-card text-foreground/50"
          }`}
        >
          ROTATE: {autoRotate ? "ACTIVE" : "PAUSED"}
        </button>
        <button
          onClick={onToggleConstellations}
          className={`rounded border px-2.5 py-1 ${
            showConstellations
              ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-300"
              : "border-border bg-card text-foreground/50"
          }`}
        >
          CONSTELLATIONS: {showConstellations ? "ON" : "OFF"}
        </button>
      </div>

      <div className="absolute bottom-4 right-4 font-mono text-[9px] text-foreground/40">
        LAT: +06°12′00″ • LON: +106°49′00″ • EQUATORIAL COORD
      </div>
    </div>
  )
}
