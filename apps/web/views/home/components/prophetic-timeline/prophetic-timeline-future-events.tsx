"use client"

import React from "react"
import { Clock, Hexagon, Users, AlertTriangle, ArrowRight } from "lucide-react"
import { Button, resolveSemanticColor, type SemanticColorToken } from "@workspace/ui"

const FUTURE_EVENTS = [
  {
    n: "Minor Signs Appear",
    d: "Beginning of end times minor signs",
    t: "~ Any Time",
    icon: Clock,
    c: "primary" as SemanticColorToken,
  },
  {
    n: "Dajjal Emergence",
    d: "The emergence of Dajjal",
    t: "~ Unknown",
    icon: Hexagon,
    c: "info" as SemanticColorToken,
  },
  {
    n: "Gog & Magog Release",
    d: "The wall will be breached",
    t: "~ Unknown",
    icon: Hexagon,
    c: "info" as SemanticColorToken,
  },
  {
    n: "Second Coming of Jesus (AS)",
    d: "Prophet Jesus (AS) will return",
    t: "~ Unknown",
    icon: Users,
    c: "info" as SemanticColorToken,
  },
  {
    n: "The Final Hour",
    d: "The Day of Resurrection",
    t: "~ Unknown",
    icon: AlertTriangle,
    c: "warning" as SemanticColorToken,
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
              style={{ borderColor: resolveSemanticColor(ev.c) }}
            >
              <ev.icon className="h-4 w-4" style={{ color: resolveSemanticColor(ev.c) }} />
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

      <Button type="button" variant="outline" size="sm" className="mt-2 w-full text-[8px] font-bold tracking-widest uppercase">
        VIEW ALL FUTURE EVENTS <ArrowRight className="h-2.5 w-2.5" />
      </Button>
    </div>
  )
}
