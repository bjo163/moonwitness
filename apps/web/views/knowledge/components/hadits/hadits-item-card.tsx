"use client"

import React from "react"
import { Bookmark, Link as LinkIcon, CheckCircle2, ShieldCheck, Quote, BookOpen } from "lucide-react"

export interface FormattedHadithItem {
  id: string
  grade: string
  arabic: string
  translation: string
  ref: string
  topic: string
  quran: string
  color: string
  raw: any
}

interface HaditsItemCardProps {
  hadith: FormattedHadithItem
  isActive: boolean
  onClick: () => void
}

export function HaditsItemCard({ hadith, isActive, onClick }: HaditsItemCardProps) {
  const getBadgeStyle = (color: string) => {
    switch (color) {
      case "emerald":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
      case "blue":
        return "border-blue-500/30 bg-blue-500/10 text-blue-400"
      case "amber":
        return "border-amber-500/30 bg-amber-500/10 text-amber-400"
      default:
        return "border-red-500/30 bg-red-500/10 text-red-400"
    }
  }

  return (
    <article
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onClick()
      }}
      aria-label={`Hadith ${hadith.id}, ${hadith.grade}`}
      className={`group relative cursor-pointer rounded-xl border p-5 transition-all duration-300 ${
        isActive
          ? "border-cyan-500/50 bg-[#0B1528] shadow-[0_0_20px_rgba(0,240,255,0.15)]"
          : "border-white/5 bg-[#080E1C] hover:border-white/20 hover:bg-[#0A1224]"
      }`}
    >
      {/* Top Metadata Strip */}
      <div className="mb-4 flex items-center justify-between gap-2 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="flex h-5 items-center justify-center rounded bg-white/5 px-2 font-black text-cyan-400">
            #{hadith.id}
          </span>
          <span className="text-white/60">{hadith.ref}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[9px] font-black uppercase ${getBadgeStyle(
              hadith.color
            )}`}
          >
            <ShieldCheck className="h-2.5 w-2.5" />
            {hadith.grade}
          </span>
          <button className="text-white/30 transition-colors hover:text-white">
            <Bookmark className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Arabic Matan */}
      <div lang="ar" dir="rtl" className="font-arabic mb-4 text-right text-lg leading-relaxed text-white/95 drop-shadow-[0_0_8px_rgba(255,255,255,0.15)] sm:text-xl">
        {hadith.arabic}
      </div>

      {/* Translation / Interpretation */}
      <p className="mb-4 text-xs leading-relaxed text-white/70 italic">
        &ldquo;{hadith.translation}&rdquo;
      </p>

      {/* Card Action Footnotes */}
      <div className="flex items-center justify-between border-t border-white/5 pt-3 text-[10px] text-white/40">
        <div className="flex items-center gap-1 font-mono text-cyan-400/80">
          <Quote className="h-3 w-3" />
          <span>Universal Wisdom Corpus</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 font-mono hover:text-cyan-400">
            <BookOpen className="h-3 w-3" />
            <span>Takhrij</span>
          </button>
          <button className="flex items-center gap-1 font-mono hover:text-cyan-400">
            <LinkIcon className="h-3 w-3" />
            <span>Sanad Graph</span>
          </button>
        </div>
      </div>
    </article>
  )
}
