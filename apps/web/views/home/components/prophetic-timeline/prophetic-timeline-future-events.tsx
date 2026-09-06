"use client"

import React from "react"
import { Clock, Hexagon, Users, AlertTriangle, ArrowRight } from "lucide-react"

const FUTURE_EVENTS = [
  {
    n: "Minor Signs Appear",
    d: "Beginning of end times minor signs",
    t: "~ Any Time",
    icon: Clock,
    c: "#3B82F6",
  },
  {
    n: "Dajjal Emergence",
    d: "The emergence of Dajjal",
    t: "~ Unknown",
    icon: Hexagon,
    c: "#D946EF",
  },
  {
    n: "Gog & Magog Release",
    d: "The wall will be breached",
    t: "~ Unknown",
    icon: Hexagon,
    c: "#D946EF",
  },
  {
    n: "Second Coming of Jesus (AS)",
    d: "Prophet Jesus (AS) will return",
    t: "~ Unknown",
    icon: Users,
    c: "#00F0FF",
  },
  {
    n: "The Final Hour",
    d: "The Day of Resurrection",
    t: "~ Unknown",
    icon: AlertTriangle,
    c: "#F59E0B",
  },
]

export function PropheticTimelineFutureEvents() {
  return (
    <div className="bg-background flex flex-col rounded-xl border border-border p-4 lg:col-span-3">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[9px] font-black tracking-widest text-primary uppercase">
          UPCOMING FUTURE EVENTS
        </div>
        <div className="cursor-pointer text-[8px] text-primary hover:text-foreground">
          View All
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {FUTURE_EVENTS.map((ev, i) => (
          <div key={i} className="group flex cursor-pointer gap-3">
            <div
              className="bg-background flex h-8 w-8 shrink-0 items-center justify-center rounded-full border"
              style={{ borderColor: `${ev.c}50` }}
            >
              <ev.icon className="h-4 w-4" style={{ color: ev.c }} />
            </div>
            <div className="flex-1 border-b border-border pb-3">
              <div className="mb-0.5 flex items-start justify-between">
                <div className="text-[10px] font-bold text-foreground transition-colors group-hover:text-primary">
                  {ev.n}
                </div>
                <div className="font-mono text-[8px] whitespace-nowrap text-primary">
                  {ev.t}
                </div>
              </div>
              <div className="font-sans text-[9px] text-primary">
                {ev.d}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-2 flex w-full items-center justify-center gap-1 rounded border border-border py-2 text-center text-[8px] font-bold tracking-widest text-primary uppercase transition-colors hover:bg-muted/30 hover:text-foreground">
        VIEW ALL FUTURE EVENTS <ArrowRight className="h-2.5 w-2.5" />
      </button>
    </div>
  )
}
