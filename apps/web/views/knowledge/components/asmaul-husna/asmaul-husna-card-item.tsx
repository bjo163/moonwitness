"use client"

import React from "react"
import { Sparkles, Star } from "lucide-react"

export interface FormattedAsmaulHusnaItem {
  id: string
  arabic: string
  transliteration: string
  meaning: string
  ref: string
  root: string
}

interface AsmaulHusnaCardItemProps {
  item: FormattedAsmaulHusnaItem
  isActive: boolean
  onClick: () => void
}

export function AsmaulHusnaCardItem({ item, isActive, onClick }: AsmaulHusnaCardItemProps) {
  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer rounded-xl border p-4 transition-all duration-300 ${
        isActive
          ? "border-indigo-500/50 bg-muted shadow-sm"
          : "border-white/5 bg-card hover:border-white/20 hover:bg-card"
      }`}
    >
      <div className="mb-2 flex items-center justify-between border-b border-white/5 pb-2">
        <span className="flex h-5 items-center justify-center rounded bg-white/5 px-2 font-mono text-[10px] font-black text-indigo-400">
          #{item.id}
        </span>
        <span className="font-mono text-[9px] text-white/40">{item.ref}</span>
      </div>

      <div className="font-arabic my-2 text-center text-2xl text-white/95 drop-shadow-sm">
        {item.arabic}
      </div>

      <div className="text-center">
        <div className="font-mono text-xs font-black text-indigo-300">
          {item.transliteration}
        </div>
        <div className="text-[11px] text-white/60">{item.meaning}</div>
      </div>
    </div>
  )
}
