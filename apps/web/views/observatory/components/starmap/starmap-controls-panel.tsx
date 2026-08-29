"use client"

import React from "react"
import { Telescope, Compass, BookOpen, Star, Sparkles } from "lucide-react"

interface StarmapControlsPanelProps {
  starMag: number
  onStarMagChange: (val: number) => void
  activeTab: string
  onTabChange: (tab: string) => void
}

export function StarmapControlsPanel({
  starMag,
  onStarMagChange,
  activeTab,
  onTabChange
}: StarmapControlsPanelProps) {
  return (
    <div className="space-y-4">
      {/* 1. Star Catalog Filters */}
      <div className="rounded-xl border border-white/10 bg-card p-5 shadow-xl font-mono text-xs">
        <div className="mb-3 flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-2">
            <Telescope className="h-4 w-4 text-indigo-400" />
            <span className="font-bold text-white uppercase">Star Catalog</span>
          </div>
          <span className="text-[10px] text-indigo-400">HIPPARCOS / GAIA</span>
        </div>

        <div className="mb-4 space-y-2">
          <div className="flex justify-between text-[10px]">
            <span className="text-white/40">Visual Magnitude Limit</span>
            <span className="text-white">≤ Mag {starMag}</span>
          </div>
          <input
            type="range"
            min={1}
            max={6}
            value={starMag}
            onChange={(e) => onStarMagChange(Number(e.target.value))}
            className="w-full accent-indigo-400"
          />
        </div>

        <div className="space-y-1.5 text-[10px]">
          {["ALL STARS", "BRIGHT STARS (MAG ≤ 2)", "ZODIACAL CONSTELLATIONS", "PULSARS & QUASARS"].map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`flex w-full items-center justify-between rounded p-2 text-left transition-all ${
                activeTab === tab
                  ? "border border-indigo-500/40 bg-indigo-500/10 text-indigo-300"
                  : "border border-transparent bg-white/[0.02] text-white/60 hover:text-white"
              }`}
            >
              <span>{tab}</span>
              <Star className="h-3 w-3" />
            </button>
          ))}
        </div>
      </div>

      {/* 2. Quranic Celestial Reflection */}
      <div className="rounded-xl border border-indigo-500/20 bg-gradient-to-b from-card -background p-5 shadow-lg">
        <div className="mb-2 flex items-center gap-2 text-indigo-400">
          <BookOpen className="h-4 w-4" />
          <span className="font-mono text-xs font-black uppercase">An-Najm (The Star)</span>
        </div>

        <p className="font-arabic my-2 text-right text-lg text-white/95">
          وَالنَّجْمِ إِذَا هَوَىٰ
        </p>

        <p className="text-[10px] leading-relaxed text-white/60 italic">
          &ldquo;By the star when it descends, your companion has not strayed, nor has he erred.&rdquo;
        </p>

        <div className="mt-3 font-mono text-[8px] text-indigo-400/60">
          QS. An-Najm 53:1-2
        </div>
      </div>
    </div>
  )
}
