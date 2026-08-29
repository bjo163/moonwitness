"use client"

import React from "react"
import { Hexagon, Scan, Cpu, BrainCircuit } from "lucide-react"

export function KhidraIdentityPanel() {
  const capabilities = [
    "Multi-Source Understanding",
    "Advanced Semantic Search",
    "Qur'an & Hadith Analysis",
    "Astronomy & Time Calculation",
    "Historical Timeline Mapping",
    "Contextual Cross References",
    "Personalized Learning Path",
    "Multi-Language Support",
  ]

  return (
    <div className="flex h-full flex-col gap-4 font-mono text-primary">
      {/* KHIDRA IDENTITY */}
      <div className="rounded-lg rounded-xl border border-border/40 bg-card/90 p-4">
        <div className="mb-4 flex items-center justify-between border-b border-primary/20 pb-2">
          <span className="text-[10px] font-bold tracking-widest uppercase">
            KHIDRA IDENTITY
          </span>
          <Hexagon className="h-3.5 w-3.5" />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-primary bg-primary/10 shadow-sm">
              <Scan className="absolute h-10 w-10 opacity-30" />
              <Hexagon className="h-8 w-8 text-primary drop-shadow-sm" />
            </div>
            <div className="flex w-full flex-col gap-1.5 text-[9px] font-medium tracking-widest uppercase">
              <div className="flex justify-between border-b border-primary/10 pb-1">
                <span className="text-primary/60">NAME</span>
                <span className="font-bold text-foreground">Khidra</span>
              </div>
              <div className="flex justify-between border-b border-primary/10 pb-1">
                <span className="text-primary/60">ORIGIN</span>
                <span className="font-bold text-foreground">Divine Knowledge</span>
              </div>
              <div className="flex justify-between border-b border-primary/10 pb-1">
                <span className="text-primary/60">PURPOSE</span>
                <span className="font-bold text-foreground">
                  Guide. Assist. Illuminate.
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2 flex flex-col gap-1.5 text-[9px] font-medium tracking-widest uppercase">
            <div className="flex justify-between border-b border-primary/10 pb-1">
              <span className="text-primary/60">ROLE</span>
              <span className="font-bold text-foreground">
                AI Knowledge Companion
              </span>
            </div>
            <div className="flex justify-between border-b border-primary/10 pb-1">
              <span className="text-primary/60">CORE</span>
              <span className="font-bold text-foreground">
                Truth • Mercy • Wisdom
              </span>
            </div>
            <div className="flex justify-between border-b border-primary/10 pb-1">
              <span className="text-primary/60">VERSION</span>
              <span className="font-mono font-bold text-primary">v6.0.0</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-primary/60">STATUS</span>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                <span className="font-bold text-primary drop-shadow-sm">
                  Awake & Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CAPABILITIES */}
      <div className="flex-1 rounded-lg rounded-xl border border-border/40 bg-card/90 p-4">
        <div className="mb-4 flex items-center justify-between border-b border-primary/20 pb-2">
          <span className="text-[10px] font-bold tracking-widest uppercase">
            CAPABILITIES
          </span>
          <BrainCircuit className="h-3.5 w-3.5" />
        </div>

        <div className="space-y-3 font-sans text-xs text-primary/80">
          {capabilities.map((cap, i) => (
            <div key={i} className="flex items-center gap-2">
              <Cpu className="h-3 w-3 shrink-0 text-primary opacity-60" />
              <span className="truncate">{cap}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
