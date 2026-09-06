"use client"

import React from "react"
import { Calendar } from "lucide-react"

export function KnowledgeTrendHeader() {
  return (
    <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 xl:flex-row xl:items-center">
      <div className="flex items-center gap-4">
        <div className="bg-background inline-flex items-center gap-3 rounded-sm border-2 border-border px-3.5 py-1.5 text-xs font-black tracking-[0.25em] text-primary uppercase shadow-sm">
          <span className="rounded-xs bg-primary px-1.5 py-0.5 font-black text-foreground">
            13
          </span>
          <span>KNOWLEDGE TREND ENGINE</span>
        </div>
        <h2 className="ml-2 font-mono text-sm font-black tracking-widest text-primary uppercase">
          Discover What Matters. Understand What's Next.
        </h2>
      </div>

      <div className="border-b-2 border-primary bg-gradient-to-t from-primary/10 to-transparent p-3 text-center xl:text-left">
        <div
          className="font-arabic mb-1 text-sm font-bold text-primary"
          dir="rtl"
        >
          قُلْ سِيرُوا فِي الْأَرْضِ فَانظُرُوا كَيْفَ بَدَأَ الْخَلْقَ
        </div>
        <div className="font-sans text-[9px] text-primary italic">
          Say, [O Muhammad], "Travel through the land and observe how was
          the creation..."{" "}
          <span className="ml-1 font-mono font-black text-primary not-italic">
            Qur'an 29:20
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-6">
        <div>
          <div className="mb-1 text-[8px] tracking-widest text-primary uppercase">
            TREND TIME RANGE
          </div>
          <div className="bg-background flex overflow-hidden rounded border border-border">
            <button className="px-3 py-1.5 text-[9px] font-bold text-primary transition-colors hover:bg-muted/30">
              24H
            </button>
            <button className="border-b-2 border-primary bg-primary/20 px-3 py-1.5 text-[9px] font-bold text-primary">
              7D
            </button>
            <button className="px-3 py-1.5 text-[9px] font-bold text-primary transition-colors hover:bg-muted/30">
              30D
            </button>
            <button className="px-3 py-1.5 text-[9px] font-bold text-primary transition-colors hover:bg-muted/30">
              90D
            </button>
            <button className="border-r border-border px-3 py-1.5 text-[9px] font-bold text-primary transition-colors hover:bg-muted/30">
              1Y
            </button>
            <button className="px-3 py-1.5 text-primary transition-colors hover:bg-muted/30">
              <Calendar className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
