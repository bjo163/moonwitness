"use client"

import React from "react"
import { Info } from "lucide-react"

export interface ReaderInsightsSidebarProps {
  quickFacts?: Array<{ label: string; value: string | React.ReactNode }>
  insights?: Array<{ label: string; value: string | React.ReactNode }>
}

export function ReaderInsightsSidebar({
  quickFacts,
  insights,
}: ReaderInsightsSidebarProps) {
  return (
    <div className="space-y-6 md:col-span-3 lg:col-span-3">
      {quickFacts && quickFacts.length > 0 && (
        <div className="rounded-xl border border-border bg-transparent p-5">
          <h3 className="mb-4 text-[10px] font-black tracking-widest text-blue-400 uppercase">
            QUICK FACTS
          </h3>
          <div className="space-y-3">
            {quickFacts.map((f, i) => (
              <div
                key={i}
                className="flex items-start justify-between border-b border-border pb-2 text-xs"
              >
                <span className="text-foreground/40">{f.label}</span>
                <span className="w-1/2 text-right font-medium text-foreground">
                  {f.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {insights && insights.length > 0 && (
        <div className="rounded-xl border border-blue-500/20 bg-blue-900/10 p-5">
          <h3 className="mb-4 flex items-center gap-2 text-[10px] font-black tracking-widest text-blue-400 uppercase">
            <Info className="h-3 w-3" /> INSIGHTS
          </h3>
          <div className="space-y-4">
            {insights.map((f, i) => (
              <div key={i}>
                <span className="mb-1 block text-[10px] font-bold text-warning">
                  {f.label}
                </span>
                <span className="text-xs leading-relaxed text-foreground">
                  {f.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
