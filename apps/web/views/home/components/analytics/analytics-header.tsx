"use client"

import React from "react"
import { Target } from "lucide-react"

export function AnalyticsHeader({ clockWIB }: { clockWIB: string }) {
  return (
    <div className="flex flex-col justify-between gap-6 border-b border-border pb-6 lg:flex-row lg:items-end">
      <div className="max-w-xl space-y-4">
        <div className="bg-background inline-flex items-center gap-3 rounded-sm border-2 border-border px-3.5 py-1.5 text-xs font-black tracking-[0.25em] text-primary uppercase shadow-xs">
          <span className="rounded-xs bg-primary px-1.5 py-0.5 font-black text-foreground">
            09
          </span>
          <span>ANALYTICS & INSIGHTS</span>
        </div>
        <h2 className="font-mono text-xl font-black tracking-widest text-foreground uppercase drop-shadow-sm sm:text-3xl">
          Knowledge. Progress. Impact.
        </h2>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center p-4">
        <div
          className="font-arabic mb-2 text-sm font-bold text-primary drop-shadow-sm md:text-base"
          dir="rtl"
        >
          وَقُل رَّبِّ زِدْنِي عِلْمًا
        </div>
        <div className="font-sans text-[10px] text-primary italic md:text-[11px]">
          &quot;And say, My Lord, increase me in knowledge.&quot;{" "}
          <span className="ml-1 font-mono font-black text-primary not-italic">
            Qur&apos;an 20:114
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-6">
        <div className="text-right">
          <div className="font-mono text-2xl font-black tracking-widest text-foreground drop-shadow-sm">
            {clockWIB}
          </div>
          <div className="mt-1 text-[9px] font-bold text-primary uppercase">
            25 MAY 2025 // 27 DHU AL-QI&apos;DAH 1446
          </div>
          <div className="mt-0.5 text-[9px] tracking-widest text-primary uppercase">
            SYSTEM TIME UTC+7
          </div>
        </div>

        <div className="h-14 w-px bg-muted/30" />

        <div className="flex items-center gap-3">
          <div>
            <div className="mb-1 text-[9px] font-black tracking-widest text-primary uppercase">
              KNOWLEDGE CYCLE
            </div>
            <div className="text-sm font-black tracking-wider text-success">
              ACTIVE
            </div>
          </div>
          <div className="bg-background relative flex h-10 w-10 items-center justify-center rounded-full border border-success/40">
            <Target className="h-5 w-5 animate-pulse text-success" />
            <div className="animate-spin-slow absolute inset-0 rounded-full border-t border-success" />
          </div>
        </div>
      </div>
    </div>
  )
}
