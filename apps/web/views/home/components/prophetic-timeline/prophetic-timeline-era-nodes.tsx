"use client"

import React from "react"
import {
  ArrowRight,
  Star,
  Users,
  Map,
  Swords,
  Telescope,
  Globe2,
  AlertTriangle,
} from "lucide-react"

const ERA_ITEMS = [
  {
    id: "creation",
    n: "CREATION",
    s: "The Beginning",
    y: "∞ - 4000 BCE",
    c: "#00F0FF",
    icon: Star,
  },
  {
    id: "prophets",
    n: "PROPHETS",
    s: "Divine Guidance",
    y: "4000 BCE - 610 CE",
    c: "#F59E0B",
    icon: Users,
  },
  {
    id: "civs",
    n: "CIVILIZATIONS",
    s: "Rise of Civilizations",
    y: "610 - 1500 CE",
    c: "#F97316",
    icon: Map,
  },
  {
    id: "empires",
    n: "EMPIRES",
    s: "Great Empires",
    y: "1500 - 1800 CE",
    c: "#A855F7",
    icon: Swords,
  },
  {
    id: "astronomy",
    n: "ASTRONOMY",
    s: "Exploration of Universe",
    y: "1800 - 2000 CE",
    c: "#3B82F6",
    icon: Telescope,
  },
  {
    id: "present",
    n: "PRESENT",
    s: "Modern Era",
    y: "2000 CE - Now",
    c: "#10B981",
    icon: Globe2,
    isNow: true,
  },
  {
    id: "future",
    n: "FUTURE EVENTS",
    s: "What is to Come",
    y: "Beyond Now",
    c: "#D946EF",
    icon: AlertTriangle,
    isDashed: true,
  },
]

export function PropheticTimelineEraNodes() {
  return (
    <div className="bg-background relative flex flex-col items-center overflow-hidden rounded-xl border border-primary/20 p-6 shadow-sm">
      {/* Era Nodes */}
      <div className="relative z-10 flex w-full max-w-[1500px] items-start justify-between pt-4 pb-12">
        {/* The Line */}
        <div className="absolute top-12 right-12 left-12 h-1 rounded-full bg-gradient-to-r from-primary/10 via-amber-500 to-transparent opacity-50" />
        <div className="absolute top-12 right-0 h-1 w-24 border-t border-b border-dashed border-border bg-gradient-to-r from-primary/10 to-transparent" />

        {ERA_ITEMS.map((era, i) => (
          <div
            key={i}
            className="group relative flex w-40 cursor-pointer flex-col items-center"
          >
            {/* Node Icon Graphic */}
            <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-transform group-hover:scale-110">
              <div className="absolute inset-0 rounded-full border border-border bg-gradient-to-b from-primary/20 to-transparent opacity-50" />
              <div
                className="animate-spin-slow absolute inset-2 rounded-full border border-dashed opacity-70"
                style={{ borderColor: era.c }}
              />
              <era.icon
                className="h-6 w-6 drop-shadow-sm"
                style={{ color: era.c }}
              />
              {/* The dot on the line */}
              <div
                className={`border-panel absolute -bottom-[22px] z-20 h-4 w-4 rounded-full border-4 ${era.isDashed ? "border-dashed" : ""}`}
                style={{
                  backgroundColor: era.c,
                  borderColor: "var(--background)",
                }}
              />
              {era.isNow && (
                <div className="absolute -bottom-[42px] flex flex-col items-center">
                  <div className="h-4 w-px bg-emerald-500" />
                  <div className="rounded border border-emerald-500/50 bg-emerald-950/50 px-2 py-0.5 text-[8px] font-bold whitespace-nowrap text-success">
                    You are here
                  </div>
                </div>
              )}
            </div>

            {/* Text Labels */}
            <div className="mt-2 text-center">
              <div
                className="mb-0.5 text-[10px] font-black tracking-widest uppercase"
                style={{ color: era.c }}
              >
                {era.n}
              </div>
              <div className="mb-1 font-sans text-[9px] text-foreground">
                {era.s}
              </div>
              <div className="font-mono text-[8px] text-primary">
                {era.y}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="bg-background flex items-center gap-2 rounded-full border border-border px-6 py-2 text-[9px] font-bold tracking-widest text-primary uppercase transition-colors hover:bg-muted/30 hover:text-foreground">
        VIEW FULL TIMELINE <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  )
}
