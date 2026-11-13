"use client"

import React from "react"
import { Plus, Minus, Target } from "lucide-react"
import { Button } from "@workspace/ui"

const MAP_LEGEND = [
  { n: "Prophets", c: "#F59E0B" },
  { n: "Civilizations", c: "#F97316" },
  { n: "Empires", c: "#A855F7" },
  { n: "Astronomy", c: "#3B82F6" },
  { n: "Present", c: "#10B981" },
  { n: "Future", c: "#D946EF" },
]

export function PropheticTimelineMapView() {
  return (
    <div className="bg-background relative flex flex-col overflow-hidden rounded-xl border border-border p-4 lg:col-span-6">
      <div className="relative z-20 mb-4 flex items-center justify-between">
        <div className="text-[9px] font-black tracking-widest text-primary uppercase">
          TIMELINE MAP VIEW
        </div>
        <div className="cursor-pointer text-[8px] text-primary hover:text-foreground">
          View Full Map
        </div>
      </div>

      <div className="bg-background relative min-h-[300px] flex-1 overflow-hidden rounded-lg border border-border">
        {/* Massive Map Graphic Simulation */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMCIvPgo8Y2lyY2xlIGN4PSI0IiBjeT0iNCIgcj0iMC41IiBmaWxsPSIjMzBENDc0Ii8+Cjwvc3ZnPg==')] [mask-image:radial-gradient(ellipse_at_center,white,transparent_90%)] opacity-30" />

        <svg
          className="absolute inset-0 h-full w-full overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Connecting lines */}
          <g
            stroke="#ffffff"
            strokeWidth="1"
            strokeOpacity="0.1"
            fill="none"
            strokeDasharray="3 3"
          >
            <path d="M 30 40 Q 40 30 50 45" />
            <path d="M 50 45 Q 60 50 70 35" />
            <path d="M 50 45 Q 55 60 65 55" />
            <path d="M 40 60 Q 45 50 50 45" />
            <path d="M 70 35 Q 80 40 85 50" />
          </g>

          {/* Map Nodes */}
          {/* Prophets (Yellow) */}
          <circle
            cx="50"
            cy="45"
            r="4"
            fill="#F59E0B"
            className="animate-pulse"
          />
          <circle
            cx="50"
            cy="45"
            r="12"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="1"
            strokeOpacity="0.5"
          />

          {/* Civilizations (Orange) */}
          <circle cx="40" cy="60" r="4" fill="#F97316" />
          <circle cx="30" cy="40" r="4" fill="#F97316" />

          {/* Empires (Purple) */}
          <circle cx="60" cy="50" r="4" fill="#A855F7" />
          <circle cx="70" cy="35" r="4" fill="#A855F7" />

          {/* Astronomy (Blue) */}
          <circle
            cx="65"
            cy="55"
            r="4"
            fill="#3B82F6"
            className="animate-pulse"
          />
          <circle cx="85" cy="50" r="4" fill="#3B82F6" />

          {/* Present (Green) */}
          <circle cx="20" cy="30" r="4" fill="#10B981" />
          <circle cx="45" cy="25" r="4" fill="#10B981" />
        </svg>

        {/* Zoom Controls */}
        <div className="bg-background absolute top-1/2 right-3 flex -translate-y-1/2 flex-col rounded border border-border text-primary">
          <Button type="button" variant="ghost" size="icon" aria-label="Zoom in" className="border-b border-border p-2 hover:bg-muted/30 hover:text-foreground">
            <Plus className="h-3 w-3" />
          </Button>
          <Button type="button" variant="ghost" size="icon" aria-label="Zoom out" className="border-b border-border p-2 hover:bg-muted/30 hover:text-foreground">
            <Minus className="h-3 w-3" />
          </Button>
          <Button type="button" variant="ghost" size="icon" aria-label="Recenter map" className="p-2 hover:bg-muted/30 hover:text-foreground">
            <Target className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Map Legend */}
      <div className="mt-4 flex items-center justify-between px-2">
        {MAP_LEGEND.map((lg, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 text-[8px] font-bold tracking-widest text-primary uppercase"
          >
            <span
              className="border-panel h-2 w-2 rounded-full border shadow-sm"
              style={{ backgroundColor: lg.c, color: lg.c }}
            />
            {lg.n}
          </div>
        ))}
      </div>
    </div>
  )
}
