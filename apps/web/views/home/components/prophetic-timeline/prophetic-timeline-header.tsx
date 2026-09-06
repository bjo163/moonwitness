"use client"

import React from "react"
import { Calendar } from "lucide-react"

export function PropheticTimelineHeader() {
  return (
    <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 xl:flex-row xl:items-center">
      <div className="flex items-center gap-4">
        <div className="bg-background inline-flex items-center gap-3 rounded-sm border-2 border-border px-3.5 py-1.5 text-xs font-black tracking-[0.25em] text-primary uppercase shadow-sm">
          <span className="rounded-xs bg-primary px-1.5 py-0.5 font-black text-foreground">
            15
          </span>
          <span>MOONWITNESS TIMELINE</span>
        </div>
        <div>
          <h2 className="ml-2 font-mono text-sm font-black tracking-widest text-primary uppercase">
            From Creation to Future
          </h2>
          <div className="ml-2 text-[9px] tracking-wide text-primary uppercase">
            Journey through time. Understand the past, live the present,
            prepare for the future.
          </div>
        </div>
      </div>

      <div className="border-b-2 border-orange-400 bg-gradient-to-t from-orange-950/40 to-transparent p-3 text-center xl:text-left">
        <div
          className="font-arabic mb-1 text-sm font-bold text-orange-400"
          dir="rtl"
        >
          وَتِلْكَ الْأَمْثَالُ نَضْرِبُهَا لِلنَّاسِ ۖ وَمَا يَعْقِلُهَا
          إِلَّا الْعَالِمُونَ
        </div>
        <div className="font-sans text-[9px] text-orange-100/70 italic">
          "And We present these examples to the people, but none will
          understand them except those of knowledge."{" "}
          <span className="ml-1 font-mono font-black text-orange-400 not-italic">
            Qur'an 29:43
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-6">
        <div>
          <div className="mb-1.5 text-[8px] tracking-widest text-primary uppercase">
            TIMELINE VIEW
          </div>
          <div className="bg-background flex overflow-hidden rounded border border-border">
            <button className="border-b-2 border-primary bg-primary/20 px-3 py-1.5 text-[9px] font-bold text-primary">
              Linear
            </button>
            <button className="px-3 py-1.5 text-[9px] font-bold text-primary transition-colors hover:bg-muted/30">
              Galaxy
            </button>
            <button className="px-3 py-1.5 text-[9px] font-bold text-primary transition-colors hover:bg-muted/30">
              Map
            </button>
            <button className="px-3 py-1.5 text-[9px] font-bold text-primary transition-colors hover:bg-muted/30">
              Tree
            </button>
          </div>
        </div>

        <div>
          <div className="mb-1.5 text-[8px] tracking-widest text-primary uppercase">
            TIME SCALE
          </div>
          <div className="bg-background flex overflow-hidden rounded border border-border">
            <button className="border-b-2 border-primary bg-primary/20 px-3 py-1.5 text-[9px] font-bold text-primary">
              All Time
            </button>
            <button className="px-3 py-1.5 text-[9px] font-bold text-primary transition-colors hover:bg-muted/30">
              Century
            </button>
            <button className="px-3 py-1.5 text-[9px] font-bold text-primary transition-colors hover:bg-muted/30">
              Decade
            </button>
            <button className="border-r border-border px-3 py-1.5 text-[9px] font-bold text-primary transition-colors hover:bg-muted/30">
              Year
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
