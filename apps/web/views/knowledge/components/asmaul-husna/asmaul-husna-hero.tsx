"use client"

import React from "react"
import { Sparkles, Clock, Database, Search } from "lucide-react"

interface AsmaulHusnaHeroProps {
  totalCount: number
  timeString: string
  searchQuery: string
  onSearchChange: (val: string) => void
}

export function AsmaulHusnaHero({
  totalCount,
  timeString,
  searchQuery,
  onSearchChange
}: AsmaulHusnaHeroProps) {
  return (
    <div className="space-y-4">
      {/* 1. Flat Header Banner */}
      <div className="relative flex flex-col justify-between gap-4 border-b border-border pb-4 md:flex-row md:items-center">
        <div>
          <div className="mb-1 flex items-center gap-3">
            <h1 className="font-mono text-2xl font-black tracking-widest text-foreground uppercase drop-shadow-md sm:text-3xl">
              ASMAUL HUSNA MATRIX
            </h1>
            <span className="rounded border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 font-mono text-[9px] font-bold text-indigo-400">
              99 DIVINE ATTRIBUTES
            </span>
          </div>
          <p className="font-mono text-xs text-foreground/50">
            Systematic Ontology of Divine Names, Transcendence & Cosmic Reflection
          </p>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div className="hidden font-mono text-[10px] text-foreground/40 md:block">
            <div className="flex items-center gap-1.5 text-indigo-400">
              <Clock className="h-3 w-3" />
              <span>TELEMETRY: {timeString} UTC</span>
            </div>
            <div>STATUS: SYNCHRONIZED</div>
          </div>
          <div className="font-arabic text-xl text-indigo-300 drop-shadow-sm">
            وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا
          </div>
        </div>
      </div>

      {/* 2. Stats & Search Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-foreground/30" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search divine name in Arabic, transliteration, or meaning..."
            className="w-full rounded-xl border border-border bg-card py-2.5 pr-4 pl-10 text-xs text-foreground placeholder-white/30 transition-all outline-none focus:border-indigo-500/50 focus:bg-card"
          />
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-foreground/60">
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-[10px]">
            <Database className="h-3.5 w-3.5 text-indigo-400" />
            <span>TOTAL: <strong className="text-foreground">{totalCount} NAMES</strong></span>
          </div>
        </div>
      </div>
    </div>
  )
}
