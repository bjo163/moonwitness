"use client"

import React from "react"
import { Target, ArrowRight } from "lucide-react"

export function CurrentFocus() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm text-card-foreground">
      <h3 className="mb-4 font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Current Focus
      </h3>

      <div className="flex flex-col items-center gap-6 md:flex-row">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary shadow-sm">
          <Target className="h-8 w-8" />
        </div>

        <div className="flex-1 space-y-3">
          <p className="font-sans text-xs leading-relaxed text-foreground">
            Researching the connection between Qur&apos;anic verses and celestial
            phenomena across historical observatory datasets.
          </p>

          <div>
            <div className="mb-1.5 flex justify-between font-mono text-[11px] text-muted-foreground">
              <span>Progress</span>
              <span className="font-semibold text-foreground">72% Complete</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[72%] rounded-full bg-primary" />
            </div>
          </div>

          <div className="text-right">
            <button className="inline-flex items-center gap-1.5 font-sans text-xs font-medium text-primary hover:underline">
              View Details <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
