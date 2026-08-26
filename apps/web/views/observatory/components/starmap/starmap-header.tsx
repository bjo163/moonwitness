"use client"

import React from "react"
import { Globe, Clock, Crosshair, Compass } from "lucide-react"

interface StarmapHeaderProps {
  raFormatted: string
  decFormatted: string
  timeUtc: string
  timeLocal: string
}

export function StarmapHeader({
  raFormatted,
  decFormatted,
  timeUtc,
  timeLocal
}: StarmapHeaderProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-4 md:flex-row md:items-center">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
          <Globe className="h-5 w-5" />
        </div>
        <div>
          <div className="mb-1 flex items-center gap-3">
            <h1 className="font-mono text-2xl font-black tracking-widest text-white uppercase drop-shadow-md sm:text-3xl">
              CELESTIAL SPHERE & STAR MAP
            </h1>
            <span className="rounded border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 font-mono text-[9px] font-bold text-indigo-400">
              EQUATORIAL DOME
            </span>
          </div>
          <p className="font-mono text-xs text-white/50">
            Interactive 3D Celestial Mechanics, Constellations, Stellar Cartography, and Ephemeris
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-right font-mono text-[10px]">
        <div className="rounded-lg border border-white/5 bg-[#080E1C] px-3 py-2">
          <div className="text-white/40">RIGHT ASCENSION (RA)</div>
          <div className="font-bold text-indigo-400">{raFormatted}</div>
        </div>
        <div className="rounded-lg border border-white/5 bg-[#080E1C] px-3 py-2">
          <div className="text-white/40">DECLINATION (DEC)</div>
          <div className="font-bold text-indigo-400">{decFormatted}</div>
        </div>
      </div>
    </div>
  )
}
