"use client"

import React from "react"
import { Activity, Radio, Sun, Shield, BookOpen } from "lucide-react"

export interface AstroLiveTelemetry {
  flux: number
  kp: number
  sunspot: number
  speed: number
  bz: number
}

interface EclipseTelemetrySidebarProps {
  astro: AstroLiveTelemetry
  isSolar: boolean
}

export function EclipseTelemetrySidebar({ astro, isSolar }: EclipseTelemetrySidebarProps) {
  return (
    <div className="space-y-4">
      {/* 1. Solar & Space Weather Telemetry */}
      <div className="rounded-xl border border-white/10 bg-[#080E1C] p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-yellow-400" />
            <span className="font-mono text-xs font-black tracking-wider text-white uppercase">
              Solar Telemetry
            </span>
          </div>
          <span className="font-mono text-[9px] text-emerald-400 animate-pulse">LIVE</span>
        </div>

        <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
          <div className="rounded bg-white/[0.02] p-2.5">
            <div className="text-white/40">10.7cm Solar Flux</div>
            <div className="text-sm font-black text-yellow-400">{astro.flux} sfu</div>
          </div>

          <div className="rounded bg-white/[0.02] p-2.5">
            <div className="text-white/40">Planetary Kp Index</div>
            <div className="text-sm font-black text-emerald-400">{astro.kp} (Quiet)</div>
          </div>

          <div className="rounded bg-white/[0.02] p-2.5">
            <div className="text-white/40">Sunspot Number</div>
            <div className="text-sm font-black text-amber-400">{astro.sunspot}</div>
          </div>

          <div className="rounded bg-white/[0.02] p-2.5">
            <div className="text-white/40">Solar Wind Speed</div>
            <div className="text-sm font-black text-cyan-400">{astro.speed} km/s</div>
          </div>
        </div>
      </div>

      {/* 2. Islamic Prophetic Eclipse Guidance (Shalat Kusuf / Khusuf) */}
      <div className="rounded-xl border border-yellow-500/20 bg-gradient-to-b from-[#141C36] to-[#080E1C] p-5 shadow-lg">
        <div className="mb-2 flex items-center gap-2 text-yellow-400">
          <BookOpen className="h-4 w-4" />
          <span className="font-mono text-xs font-black uppercase">
            {isSolar ? "Shalat Kusuf (Solar)" : "Shalat Khusuf (Lunar)"}
          </span>
        </div>

        <p className="font-arabic my-2 text-right text-base text-white/95">
          إِنَّ الشَّمْسَ وَالْقَمَرَ آيَتَانِ مِنْ آيَاتِ اللَّهِ
        </p>

        <p className="text-[10px] leading-relaxed text-white/60 italic">
          &ldquo;The sun and the moon are two of Allah&apos;s signs; they do not eclipse for the death or life of anyone. When you see them, remember Allah, glorify Him, pray, and give charity.&rdquo;
        </p>

        <div className="mt-3 font-mono text-[8px] text-yellow-400/60">
          Sahih Bukhari #1044 • Sahih Muslim #901
        </div>
      </div>
    </div>
  )
}
