"use client"

import React from "react"
import { Bookmark, Link as LinkIcon, CheckCircle2, ShieldCheck, Quote, BookOpen } from "lucide-react"
import { Button } from "@workspace/ui"

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
        return "border-success/30 bg-success/10 text-success"
      case "blue":
        return "border-blue-500/30 bg-blue-500/10 text-blue-400"
      case "amber":
        return "border-warning/30 bg-warning/10 text-warning"
      default:
        return "border-destructive/30 bg-destructive/10 text-destructive"
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
          ? "border-primary/50 bg-primary/10 shadow-sm"
          : "border-border bg-card hover:border-border/80 hover:bg-accent/40"
      }`}
    >
      {/* Top Metadata Strip */}
      <div className="mb-4 flex items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="flex h-5 items-center justify-center rounded bg-muted/30 px-2 font-black text-primary">
            #{hadith.id}
          </span>
          <span className="text-foreground/60">{hadith.ref}</span>
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
          <Button type="button" variant="ghost" size="icon" aria-label={`Bookmark hadith ${hadith.id}`} className="text-foreground/30 transition-colors hover:text-foreground">
            <Bookmark className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Arabic Matan */}
      <div lang="ar" dir="rtl" className="font-arabic mb-4 text-right text-lg leading-relaxed text-foreground/95 drop-shadow-[0_0_8px_rgba(255,255,255,0.15)] sm:text-xl">
        {hadith.arabic}
      </div>

      {/* Translation / Interpretation */}
      <p className="mb-4 text-xs leading-relaxed text-foreground italic">
        &ldquo;{hadith.translation}&rdquo;
      </p>

      {/* Card Action Footnotes */}
      <div className="flex items-center justify-between border-t border-border pt-3 text-[10px] text-foreground/40">
        <div className="flex items-center gap-1 font-mono text-primary/80">
          <Quote className="h-3 w-3" />
          <span>Universal Wisdom Corpus</span>
        </div>
        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" className="flex items-center gap-1 font-mono hover:text-primary">
            <BookOpen className="h-3 w-3" />
            <span>Takhrij</span>
          </Button>
          <Button type="button" variant="ghost" className="flex items-center gap-1 font-mono hover:text-primary">
            <LinkIcon className="h-3 w-3" />
            <span>Sanad Graph</span>
          </Button>
        </div>
      </div>
    </article>
  )
}
