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
          ? "border-indigo-500/50 bg-[#0E1736] shadow-[0_0_20px_rgba(161,0,255,0.15)]"
          : "border-white/5 bg-[#080E1C] hover:border-white/20 hover:bg-[#0A1224]"
      }`}
    >
      <div className="mb-2 flex items-center justify-between border-b border-white/5 pb-2">
        <span className="flex h-5 items-center justify-center rounded bg-white/5 px-2 font-mono text-[10px] font-black text-indigo-400">
          #{item.id}
        </span>
        <span className="font-mono text-[9px] text-white/40">{item.ref}</span>
      </div>

      <div className="font-arabic my-2 text-center text-2xl text-white/95 drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]">
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
