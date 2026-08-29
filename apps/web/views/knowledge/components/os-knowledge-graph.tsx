"use client"

import React from "react"
import { useOSStore } from "@workspace/state"

import { GraphSidebarWidget } from "@workspace/ui"
import { GraphCanvasWidget } from "@workspace/ui"
import { GraphEntityPanelWidget } from "@workspace/ui"
import { GraphAnalyticsWidget } from "@workspace/ui"

export function OSKnowledgeGraph() {
  // Using global Zustand store instead of local useState/useEffect
  const { clockWIB } = useOSStore()

  return (
    <section
      id="knowledge-graph"
      className="bg-background border-knowledge/30 relative z-10 overflow-hidden border-b py-20 font-mono text-foreground"
    >
      {/* ═══ LAYER 1: DEEP SPACE BACKGROUND ══════════════════════════════════ */}
      <div className="pointer-events-none absolute inset-0">
        <div className="theme-grid-bg absolute inset-0 opacity-20" />
        <div className="bg-radial-gradient from-success/10 via-knowledge/10 absolute top-1/2 left-1/2 h-[1000px] w-[1600px] -translate-x-1/2 -translate-y-1/2 to-transparent blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1700px] space-y-4 px-4">
        {/* ═══ TOP HEADER (Blueprint 14) ══════════════════════════════════════ */}
        <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-4 xl:flex-row xl:items-center">
          <div className="flex items-center gap-4">
            <div className="bg-background inline-flex items-center gap-3 rounded-sm border-2 border-primary/60 px-3.5 py-1.5 text-xs font-black tracking-[0.25em] text-primary uppercase shadow-sm">
              <span className="rounded-xs bg-primary px-1.5 py-0.5 font-black text-black">
                14
              </span>
              <span>KNOWLEDGE GRAPH</span>
            </div>
            <div>
              <h2 className="ml-2 font-mono text-sm font-black tracking-widest text-primary uppercase">
                Everything is Connected
              </h2>
              <div className="ml-2 text-[9px] tracking-wide text-primary uppercase">
                Explore the interconnectedness of Divine Knowledge.
              </div>
            </div>
          </div>

          <div className="border-success from-success/20 border-b-2 bg-gradient-to-t to-transparent p-3 text-center xl:text-left">
            <div
              className="font-arabic text-success mb-1 text-sm font-bold"
              dir="rtl"
            >
              وَتِلْكَ الْأَمْثَالُ نَضْرِبُهَا لِلنَّاسِ ۖ وَمَا يَعْقِلُهَا
              إِلَّا الْعَالِمُونَ
            </div>
            <div className="text-success/70 font-sans text-[9px] italic">
              "And We present these examples to the people, but none will
              understand them except those of knowledge."{" "}
              <span className="text-success ml-1 font-mono font-black not-italic">
                Qur'an 29:43
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-6">
            <div>
              <div className="mb-1.5 text-[8px] tracking-widest text-primary uppercase">
                RELATION TYPES
              </div>
              <div className="bg-background flex items-center gap-3 rounded border border-white/10 px-3 py-1.5 text-[8px] font-bold text-primary uppercase">
                <span className="flex items-center gap-1">
                  <span className="bg-danger h-1.5 w-1.5 rounded-full" />{" "}
                  Revealed In
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary" />{" "}
                  Spoken By
                </span>
                <span className="flex items-center gap-1">
                  <span className="bg-success h-1.5 w-1.5 rounded-full" />{" "}
                  Occurred In
                </span>
                <span className="flex items-center gap-1">
                  <span className="bg-warning h-1.5 w-1.5 rounded-full" />{" "}
                  Related To
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />{" "}
                  Described In
                </span>
                <span className="flex items-center gap-1">
                  <span className="bg-knowledge h-1.5 w-1.5 rounded-full" />{" "}
                  Influenced By
                </span>
                <span className="ml-2 cursor-pointer text-primary hover:text-white">
                  View All
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ LAYER 2: MAIN WORKSPACE (3 Columns) ════════════════════════════ */}
        <div className="flex h-[700px] flex-col gap-4 lg:flex-row">
          <GraphSidebarWidget />
          <GraphCanvasWidget />
          <GraphEntityPanelWidget />
        </div>

        {/* ═══ LAYER 3: BOTTOM ANALYTICS ROW ══════════════════════════════════ */}
        <GraphAnalyticsWidget />
      </div>
    </section>
  )
}
