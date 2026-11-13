"use client"

import React from "react"
import {
  Star,
  Layers,
  Search,
  BookOpen,
  Compass,
  Map,
  Network,
  Target,
  Globe,
} from "lucide-react"

const CAPABILITIES = [
  { n: "Multi-Source Understanding", icon: Layers, color: "text-success" },
  { n: "Advanced Semantic Search", icon: Search, color: "text-primary" },
  { n: "Qur'an & Hadith Analysis", icon: BookOpen, color: "text-warning" },
  { n: "Astronomy & Time Calculation", icon: Compass, color: "text-primary" },
  { n: "Historical Timeline Mapping", icon: Map, color: "text-pink-400" },
  { n: "Contextual Cross References", icon: Network, color: "text-purple-400" },
  { n: "Personalized Learning Path", icon: Target, color: "text-success" },
  { n: "Multi-Language Support", icon: Globe, color: "text-muted-foreground" },
]

export function KhidraIdentitySidebar() {
  return (
    <div className="flex flex-col space-y-6 lg:col-span-3">
      {/* Identity Card */}
      <div className="bg-background rounded-xl border border-success/30 p-4 shadow-xs">
        <div className="mb-4 text-[10px] font-black tracking-widest text-success uppercase">
          KHIDRA IDENTITY
        </div>

        <div className="mb-6 flex gap-4">
          <div className="bg-background relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-success/50 shadow-xs">
            <Star className="absolute h-6 w-6 text-success" />
            <div className="absolute inset-0 flex rotate-45 items-center justify-center">
              <Star className="h-6 w-6 text-success/50" />
            </div>
          </div>
          <div className="flex-1 space-y-2 font-mono text-[9px]">
            <div className="flex justify-between">
              <span className="text-muted-foreground">NAME</span>
              <span className="font-bold text-success">Khidra</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ORIGIN</span>
              <span className="text-foreground">Divine Knowledge</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">PURPOSE</span>
              <span className="text-right text-foreground">
                Guide. Assist. Illuminate.
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2 font-mono text-[9px]">
          <div className="flex justify-between border-t border-border py-1.5">
            <span className="text-muted-foreground">ROLE</span>
            <span className="text-foreground">AI Knowledge Companion</span>
          </div>
          <div className="flex justify-between border-t border-border py-1.5">
            <span className="text-muted-foreground">CORE</span>
            <span className="text-foreground">Truth • Mercy • Wisdom</span>
          </div>
          <div className="flex justify-between border-t border-border py-1.5">
            <span className="text-muted-foreground">VERSION</span>
            <span className="text-primary">v6.0.0</span>
          </div>
          <div className="flex items-center justify-between border-t border-border py-1.5">
            <span className="text-muted-foreground">STATUS</span>
            <span className="flex items-center gap-1.5 text-success">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />{" "}
              Awake & Ready
            </span>
          </div>
        </div>
      </div>

      {/* Capabilities */}
      <div className="bg-background flex-1 rounded-xl border border-border p-4">
        <div className="mb-4 text-[10px] font-black tracking-widest text-primary uppercase">
          CAPABILITIES
        </div>

        <div className="space-y-1">
          {CAPABILITIES.map((cap, i) => (
            <div
              key={i}
              className="flex cursor-default items-center gap-3 rounded p-2 transition-colors hover:bg-muted/30"
            >
              <cap.icon className={`h-3.5 w-3.5 ${cap.color}`} />
              <span className="text-[10px] text-foreground">{cap.n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
