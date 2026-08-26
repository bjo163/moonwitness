"use client"

import React from "react"
import { Sparkles, BookOpen, Layers, Star, Info } from "lucide-react"
import type { FormattedAsmaulHusnaItem } from "./asmaul-husna-card-item"

interface AsmaulHusnaActivePanelProps {
  item: FormattedAsmaulHusnaItem
}

export function AsmaulHusnaActivePanel({ item }: AsmaulHusnaActivePanelProps) {
  return (
    <div className="sticky top-6 space-y-4">
      {/* Active Focus Card */}
      <div className="relative overflow-hidden rounded-xl border border-indigo-500/30 bg-gradient-to-b from-[#101B42] to-[#080E1C] p-6 shadow-2xl">
        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl" />

        <div className="relative z-10 text-center">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 font-mono text-[9px] font-black text-indigo-400">
            <Sparkles className="h-3 w-3" />
            <span>SELECTED ATTRIBUTE #{item.id}</span>
          </div>

          <div className="font-arabic my-4 text-4xl text-white drop-shadow-[0_0_15px_rgba(161,0,255,0.4)]">
            {item.arabic}
          </div>

          <h2 className="font-mono text-xl font-black text-indigo-300 uppercase">
            {item.transliteration}
          </h2>
          <p className="mt-1 text-sm font-medium text-white/80">
            {item.meaning}
          </p>
        </div>

        <div className="relative z-10 mt-6 space-y-3 border-t border-white/10 pt-4 font-mono text-[10px]">
          <div className="flex justify-between">
            <span className="text-white/40">Qur&apos;anic Context:</span>
            <span className="text-white/80">{item.ref}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/40">Ontological Domain:</span>
            <span className="text-indigo-400">Divine Essence & Mercy</span>
          </div>
        </div>
      </div>

      {/* Reflection Guidance */}
      <div className="rounded-xl border border-white/10 bg-[#080E1C] p-4 font-mono text-xs shadow-lg">
        <div className="mb-2 flex items-center gap-2 text-indigo-400">
          <Info className="h-4 w-4" />
          <span className="font-bold uppercase">Spiritual Reflection</span>
        </div>
        <p className="text-[11px] leading-relaxed text-white/60">
          Contemplating on &ldquo;{item.transliteration}&rdquo; nurtures awareness of Divine omnipotence and aligns human actions toward mercy, justice, and devotion.
        </p>
      </div>
    </div>
  )
}
