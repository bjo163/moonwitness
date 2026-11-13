"use client"

import React from "react"
import { Hexagon, ArrowRight } from "lucide-react"
import { Button } from "@workspace/ui"

const PROGRESS_ITEMS = [
  { n: "QUR'AN", p: 76, lvl: "Advanced", colorClass: "text-primary", bgClass: "bg-primary" },
  { n: "HADITH", p: 62, lvl: "Intermediate", colorClass: "text-warning", bgClass: "bg-warning" },
  { n: "TAFSIR", p: 54, lvl: "Intermediate", colorClass: "text-purple-400", bgClass: "bg-purple-400" },
  { n: "SIRAH", p: 48, lvl: "Beginner", colorClass: "text-pink-400", bgClass: "bg-pink-400" },
  { n: "ASTRONOMY", p: 71, lvl: "Advanced", colorClass: "text-blue-400", bgClass: "bg-blue-400" },
  { n: "HISTORY", p: 65, lvl: "Intermediate", colorClass: "text-success", bgClass: "bg-success" },
  { n: "LANGUAGE", p: 49, lvl: "Beginner", colorClass: "text-muted-foreground", bgClass: "bg-muted-foreground" },
  { n: "TOPICS", p: 58, lvl: "Intermediate", colorClass: "text-foreground", bgClass: "bg-foreground" },
]

export function KnowledgeProgressPanel() {
  return (
    <div className="bg-background flex flex-col justify-between rounded-xl border-2 border-primary/30 p-6 shadow-sm lg:col-span-5">
      <div className="mb-4 text-[10px] font-black tracking-widest text-primary uppercase">
        KNOWLEDGE PROGRESS
      </div>

      <div className="flex flex-col items-center gap-8 py-4 md:flex-row">
        {/* Radial Progress Simulation */}
        <div className="relative flex h-48 w-48 shrink-0 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-[8px] border-primary" />
          <div
            className="absolute inset-0 rounded-full border-[8px] border-primary border-t-transparent border-l-transparent shadow-xs"
            style={{ transform: "rotate(45deg)" }}
          />
          <div
            className="absolute inset-2 rounded-full border-[6px] border-border border-b-transparent border-l-transparent"
            style={{ transform: "rotate(-20deg)" }}
          />
          <div
            className="absolute inset-4 rounded-full border-[4px] border-warning border-t-transparent border-r-transparent"
            style={{ transform: "rotate(10deg)" }}
          />
          <div className="animate-spin-slow absolute inset-0 rounded-full border border-dashed border-border" />

          <div className="text-center">
            <div className="mb-1 text-[9px] font-bold tracking-widest text-foreground uppercase">
              OVERALL
              <br />
              PROGRESS
            </div>
            <div className="text-4xl font-black text-primary drop-shadow-sm">
              68%
            </div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="w-full flex-1 space-y-3.5">
          {PROGRESS_ITEMS.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <Hexagon className={`h-3.5 w-3.5 shrink-0 ${item.colorClass}`} />
              <div className="w-20 text-[9px] font-black text-foreground">
                {item.n}
              </div>
              <div className="bg-background h-1 flex-1 overflow-hidden rounded-full border border-border">
                <div
                  className={`h-full rounded-full ${item.bgClass}`}
                  style={{ width: `${item.p}%` }}
                />
              </div>
              <div className="w-24 text-right">
                <div className={`text-[10px] font-black ${item.colorClass}`}>
                  {item.p}%
                </div>
                <div className="text-[7px] leading-none text-muted-foreground uppercase">
                  {item.lvl}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button type="button" variant="ghost" className="mt-4 flex w-full items-center justify-center gap-2 rounded border border-border bg-transparent py-3 text-[10px] font-black tracking-widest text-primary uppercase transition-colors hover:bg-primary/10">
        VIEW DETAILED ANALYTICS <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
