"use client"

import React from "react"
import {
  Globe,
  Moon,
  Sun,
  Target,
  Star,
  Sparkles,
  Calendar,
  Eye,
} from "lucide-react"
import { Button, resolveSemanticColor, type SemanticColorToken } from "@workspace/ui"

export function AstronomyEventsSidebar() {
  return (
    <div className="flex flex-col space-y-6 lg:col-span-3">
      {/* Celestial Objects Menu */}
      <div className="bg-background flex flex-col gap-1 overflow-hidden rounded-xl border border-border p-1 shadow-lg">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3 text-[10px] font-black tracking-widest text-blue-400 uppercase">
          <Globe className="h-3.5 w-3.5" /> CELESTIAL OBJECTS
        </div>

        <div className="space-y-1 p-2">
          {[
            {
              id: "Moon",
              sub: "Natural Satellite",
              icon: Moon,
              active: true,
              color: "info" as SemanticColorToken,
            },
            {
              id: "Sun",
              sub: "Star",
              icon: Sun,
              active: false,
              color: "warning" as SemanticColorToken,
            },
            {
              id: "Earth",
              sub: "Planet",
              icon: Globe,
              active: false,
              color: "primary" as SemanticColorToken,
            },
            {
              id: "Planets",
              sub: "Solar System",
              icon: Target,
              active: false,
              color: "info" as SemanticColorToken,
            },
            {
              id: "Constellations",
              sub: "Star Patterns",
              icon: Star,
              active: false,
              color: "primary" as SemanticColorToken,
            },
            {
              id: "Deep Sky",
              sub: "Galaxies & Nebula",
              icon: Sparkles,
              active: false,
              color: "success" as SemanticColorToken,
            },
          ].map((item, idx) => (
            <Button
              type="button"
              variant="ghost"
              key={idx}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
                item.active
                  ? "border border-primary bg-blue-900/30 shadow-sm"
                  : "border border-transparent hover:bg-muted/30"
              }`}
            >
              <div
                className={`rounded-full p-1.5 ${item.active ? "bg-primary/10" : "bg-muted/30"}`}
              >
                <item.icon
                  className="h-4 w-4"
                  style={{ color: resolveSemanticColor(item.active ? item.color : "muted") }}
                />
              </div>
              <div>
                <div
                  className={`text-xs font-black ${item.active ? "text-primary" : "text-foreground"}`}
                >
                  {item.id}
                </div>
                <div className="font-sans text-[9px] text-primary">
                  {item.sub}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Upcoming Events List */}
      <div className="bg-background flex-1 rounded-xl border border-blue-500/30 p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-[10px] font-black tracking-widest text-blue-300 uppercase">
          <Calendar className="h-3.5 w-3.5" /> UPCOMING EVENTS
        </div>

        <div className="space-y-1">
          {[
            {
              n: "Lunar Eclipse",
              d: "12 JUN 2025",
              i: Moon,
              c: "info" as SemanticColorToken,
            },
            {
              n: "Solar Eclipse",
              d: "21 SEP 2025",
              i: Sun,
              c: "warning" as SemanticColorToken,
            },
            {
              n: "Meteor Shower",
              d: "14 AUG 2025",
              i: Sparkles,
              c: "success" as SemanticColorToken,
            },
            {
              n: "Moon Visibility",
              d: "28 MAY 2025",
              i: Eye,
              c: "info" as SemanticColorToken,
            },
          ].map((ev, i) => (
            <div
              key={i}
              className="group flex cursor-pointer items-center justify-between rounded border-b border-border p-2.5 transition-colors hover:bg-muted/30"
            >
              <div className="flex items-center gap-2.5">
                <ev.i className="h-3.5 w-3.5" style={{ color: resolveSemanticColor(ev.c) }} />
                <span className="text-[10px] font-bold text-foreground transition-colors group-hover:text-blue-300">
                  {ev.n}
                </span>
              </div>
              <span className="font-mono text-[9px] text-primary">
                {ev.d}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
