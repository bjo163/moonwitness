"use client"

import React from "react"

const TIMELINE_EVENTS = [
  { d: "19 MAY", n: "New Moon\nObservation Surge", c: "#3B82F6" },
  { d: "21 MAY", n: "AI Research\nBreakthrough", c: "#A855F7" },
  { d: "23 MAY", n: "Qur'an Reflection\nCampaign", c: "#F59E0B" },
]

export function KnowledgeTrendTimelineChart() {
  return (
    <div className="bg-background flex flex-col rounded-xl border border-border p-4 lg:col-span-5">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[9px] font-black tracking-widest text-primary uppercase">
          TRENDING TIMELINE
        </div>
        <div className="flex overflow-hidden rounded bg-muted/30">
          <button className="border border-primary/30 bg-muted px-2 py-1 text-[8px] text-primary">
            Line
          </button>
          <button className="border border-transparent px-2 py-1 text-[8px] text-primary">
            Area
          </button>
        </div>
      </div>

      <div className="mb-4 flex justify-center gap-4 text-[8px] font-bold tracking-widest uppercase">
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Moon
        </span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-secondary" /> AI
        </span>
        <span className="flex items-center gap-1">
          <span className="bg-success h-1.5 w-1.5 rounded-full" /> History
        </span>
        <span className="flex items-center gap-1">
          <span className="bg-warning h-1.5 w-1.5 rounded-full" /> Qur'an
        </span>
      </div>

      {/* Chart Area Simulation */}
      <div className="relative mt-2 mb-8 ml-6 min-h-[120px] flex-1 border-b border-l border-border">
        {/* Grid lines */}
        <div className="absolute inset-x-0 bottom-[25%] border-t border-border" />
        <div className="absolute inset-x-0 bottom-[50%] border-t border-border" />
        <div className="absolute inset-x-0 bottom-[75%] border-t border-border" />
        <div className="absolute inset-x-0 top-0 border-t border-border" />

        {/* Y Axis */}
        <div className="absolute top-0 -left-6 -translate-y-1/2 text-[7px] text-primary">
          80K
        </div>
        <div className="absolute bottom-[75%] -left-6 -translate-y-1/2 text-[7px] text-primary">
          60K
        </div>
        <div className="absolute bottom-[50%] -left-6 -translate-y-1/2 text-[7px] text-primary">
          40K
        </div>
        <div className="absolute bottom-[25%] -left-6 -translate-y-1/2 text-[7px] text-primary">
          20K
        </div>
        <div className="absolute bottom-0 -left-6 translate-y-1/2 text-[7px] text-primary">
          0
        </div>

        {/* Lines */}
        <svg
          className="absolute inset-0 h-full w-full overflow-visible"
          preserveAspectRatio="none"
        >
          <polyline
            points="0,80 20,60 40,70 60,30 80,50 100,20 120,40 140,20"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="1.5"
          />
          <polyline
            points="0,50 20,40 40,45 60,20 80,30 100,40 120,50 140,45"
            fill="none"
            stroke="#A855F7"
            strokeWidth="1.5"
          />
          <polyline
            points="0,100 20,90 40,80 60,60 80,70 100,65 120,55 140,50"
            fill="none"
            stroke="#10B981"
            strokeWidth="1.5"
          />
          <polyline
            points="0,110 20,100 40,105 60,90 80,85 100,95 120,100 140,110"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="1.5"
          />
        </svg>

        {/* X Axis */}
        <div className="absolute inset-x-0 -bottom-4 flex justify-between font-mono text-[7px] text-primary">
          <span>19 MAY</span>
          <span>20 MAY</span>
          <span>21 MAY</span>
          <span>22 MAY</span>
          <span>23 MAY</span>
          <span>24 MAY</span>
          <span>25 MAY</span>
        </div>
      </div>

      {/* Timeline Events */}
      <div className="mt-auto grid grid-cols-3 gap-2">
        {TIMELINE_EVENTS.map((ev, i) => (
          <div
            key={i}
            className="border-l-2 pl-2"
            style={{ borderColor: ev.c }}
          >
            <div
              className="mb-0.5 text-[7px] font-black uppercase"
              style={{ color: ev.c }}
            >
              {ev.d}
            </div>
            <div className="text-[8px] leading-tight whitespace-pre-wrap text-foreground">
              {ev.n}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
