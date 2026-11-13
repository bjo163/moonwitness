"use client"

import React from "react"
import { Activity, Star, BookOpen, Hexagon, ShieldCheck } from "lucide-react"

const LEARNING_STEPS = [
  { l: "Reading\nQur'an", color: "bg-success" },
  { l: "Analyzing\nPatterns", color: "bg-primary" },
  { l: "Connecting\nKnowledge", color: "bg-blue-400" },
  { l: "Generating\nInsights", color: "bg-warning" },
  { l: "Updating\nUnderstanding", color: "bg-success" },
]

export function KhidraBottomPanels() {
  return (
    <>
      <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2 lg:grid-cols-4">
        {/* Status */}
        <div className="bg-background flex items-center gap-6 rounded-xl border border-border p-5">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-muted shadow-xs">
            <div className="absolute inset-2 rounded-full border border-success/50" />
            <Activity className="h-4 w-4 text-success" />
          </div>
          <div className="flex-1 space-y-1.5 font-mono text-[9px] font-bold uppercase">
            <div className="mb-2 text-[10px] text-success">KHIDRA STATUS</div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">UPTIME</span>
              <span className="text-foreground">99.98%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">LEARNING</span>
              <span className="text-primary">Continuous</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">MEMORY</span>
              <span className="text-foreground">∞</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">MODE</span>
              <span className="text-foreground">Adaptive</span>
            </div>
          </div>
        </div>

        {/* Active Learning Flow */}
        <div className="bg-background relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl border border-border p-5 md:col-span-2">
          <div className="mb-4 text-[10px] font-black tracking-widest text-primary uppercase">
            ACTIVE LEARNING
          </div>

          <div className="relative z-10 flex h-full items-end justify-between pb-2">
            {LEARNING_STEPS.map((n, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${n.color}`} />
                <div className="text-center font-sans text-[8px] leading-tight whitespace-pre-wrap text-foreground">
                  {n.l}
                </div>
              </div>
            ))}
            <div className="absolute top-[3px] right-4 left-4 -z-10 h-[2px] bg-muted/30" />
          </div>
        </div>

        {/* Hologram & Voice Mode */}
        <div className="bg-background flex items-center justify-between rounded-xl border border-border p-5">
          <div className="space-y-4">
            <div>
              <div className="mb-1 text-[9px] font-black tracking-widest text-muted-foreground uppercase">
                HOLOGRAM MODE
              </div>
              <div className="font-mono text-xs font-black text-success">
                ACTIVE
              </div>
            </div>
            <div>
              <div className="mb-1 text-[9px] font-black tracking-widest text-muted-foreground uppercase">
                VOICE MODE
              </div>
              <span className="font-mono text-xs font-black text-success">
                ON
              </span>
            </div>
          </div>

          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
            <Star className="h-8 w-8 animate-pulse text-success drop-shadow-sm" />
          </div>
        </div>
      </div>

      {/* Footer Strip */}
      <div className="mt-6 flex flex-col items-center justify-between gap-6 border-t border-border px-2 pt-4 font-mono text-[9px] font-bold tracking-widest text-muted-foreground uppercase md:flex-row">
        <div className="flex items-center gap-4">
          <BookOpen className="h-6 w-6 text-primary" />
          <div className="font-sans text-muted-foreground normal-case italic">
            &quot;Knowledge is a light that guides to truth.
            <br />
            Khidra is here to walk with you.&quot;
          </div>
        </div>

        <div className="flex items-center gap-2 text-success">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />{" "}
          SYSTEM SYNCHRONIZED
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-muted-foreground">KNOWLEDGE CORE</div>
            <div className="text-success">CONNECTED</div>
          </div>
          <Hexagon className="h-8 w-8 text-success/30" />
        </div>

        <div className="flex w-full items-center gap-4 md:w-auto">
          <ShieldCheck className="h-4 w-4 shrink-0 text-success" />
        </div>
      </div>
    </>
  )
}
