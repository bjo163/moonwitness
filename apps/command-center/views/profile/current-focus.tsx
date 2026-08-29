"use client"

import React from "react"
import { Target, ArrowRight } from "lucide-react"

export function CurrentFocus() {
  return (
    <div className="rounded-xl border border-border bg-black/40 p-6 backdrop-blur-md">
      <h3 className="mb-6 font-sans text-[10px] font-bold tracking-widest text-primary/70 uppercase">
        Current Focus
      </h3>

      <div className="flex flex-col items-center gap-6 md:flex-row">
        {/* Radar Graphic */}
        <div className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full border border-border bg-muted">
          {/* Concentric Circles */}
          <div className="absolute inset-4 rounded-full border border-border" />
          <div className="absolute inset-8 rounded-full border border-border" />
          <div className="absolute inset-12 rounded-full border border-border" />
          <Target className="z-10 h-4 w-4 text-primary" />

          {/* Radar Sweep */}
          <div className="absolute top-1/2 left-1/2 h-16 w-16 origin-top-left animate-[spin_3s_linear_infinite] border-l-2 border-border bg-gradient-to-br from-primary/10 to-transparent" />

          {/* Blips */}
          <div className="absolute top-1/4 right-1/4 h-2 w-2 animate-pulse rounded-full bg-primary shadow-sm" />
          <div className="absolute bottom-1/3 left-1/4 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-sm" />
        </div>

        {/* Details */}
        <div className="flex-1 space-y-4">
          <p className="font-sans text-sm leading-relaxed text-slate-300">
            Researching the connection between Qur'anic verses and astronomical
            phenomena.
          </p>

          <div>
            <div className="mb-2 flex justify-between font-mono text-[10px] text-primary">
              <span>Progress</span>
              <span>72% Complete</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div className="relative h-full w-[72%] rounded-full bg-primary">
                <div className="absolute top-0 right-0 bottom-0 w-10 animate-[translateX_2s_infinite] bg-white/20 blur-[2px]"></div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <button className="inline-flex items-center gap-2 font-sans text-[10px] text-primary transition-colors hover:text-primary">
              View Details <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
