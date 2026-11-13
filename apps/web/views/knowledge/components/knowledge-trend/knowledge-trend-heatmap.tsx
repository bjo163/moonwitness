"use client"

import React from "react"

const TOP_REGIONS = [
  { name: "1 Indonesia", count: "14.2K" },
  { name: "3 United States", count: "8.6K" },
  { name: "2 India", count: "9.8K" },
  { name: "4 Malaysia", count: "6.3K" },
]

export function KnowledgeTrendHeatmap() {
  return (
    <div className="bg-background flex flex-col rounded-xl border border-border p-4 lg:col-span-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[9px] font-black tracking-widest text-primary uppercase">
          KNOWLEDGE HEATMAP
        </div>
        <div className="flex cursor-pointer items-center gap-1 rounded bg-muted/30 px-2 py-1 text-[8px] text-primary">
          View by: Mentions ∨
        </div>
      </div>

      <div className="bg-background relative mb-3 min-h-[150px] flex-1 overflow-hidden rounded-lg border border-border">
        {/* Heatmap Graphic Simulation */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMCIvPgo8Y2lyY2xlIGN4PSI0IiBjeT0iNCIgcj0iMC41IiBmaWxsPSIjMzBENDc0Ii8+Cjwvc3ZnPg==')] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)] opacity-30" />
        {/* Ambienting regions */}
        <div className="absolute top-[50%] left-[75%] h-8 w-12 rounded-full bg-rose-500/40 blur-xl" />
        <div className="absolute top-[45%] left-[65%] h-10 w-10 rounded-full bg-amber-500/30 blur-xl" />
        <div className="absolute top-[35%] left-[55%] h-8 w-12 rounded-full bg-rose-500/30 blur-xl" />
        <div className="absolute top-[25%] left-[20%] h-10 w-16 rounded-full bg-muted blur-xl" />
        <div className="absolute top-[30%] left-[45%] h-10 w-10 rounded-full bg-blue-500/20 blur-xl" />

        <div className="bg-background/80 absolute bottom-2 left-2 rounded border border-border p-1.5 backdrop-blur">
          <div className="mb-1 text-[6px] text-foreground uppercase">
            INTENSITY
          </div>
          <div className="h-16 w-2 rounded-full bg-gradient-to-t from-blue-500 via-amber-500 to-rose-500" />
          <div className="absolute top-[14px] left-4 flex h-16 flex-col justify-between text-[6px] text-primary">
            <span>High</span>
            <span>Low</span>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2 text-[8px] font-black tracking-widest text-primary uppercase">
          TOP REGIONS
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[9px]">
          {TOP_REGIONS.map((r, i) => (
            <div key={i} className="flex justify-between">
              <span>{r.name}</span>
              <span className="font-mono text-foreground">{r.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
