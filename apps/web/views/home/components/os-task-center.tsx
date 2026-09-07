"use client"
import Image from "next/image"

import React, { useState, useEffect } from "react"
import {
  CheckSquare,
  Clock,
  Filter,
  Calendar,
  List,
  CheckCircle2,
  Moon,
  Activity,
} from "lucide-react"
import { Button, resolveVisualizationColor } from "@workspace/ui"
import { TaskCenterSidebar } from "./task-center-sidebar"
import { TaskCenterSummary } from "./task-center-summary"
import { TaskCenterTable } from "./task-center-table"
import { TaskCenterAnalytics } from "./task-center-analytics"

export function OSTaskCenter() {
  const [clockWIB, setClockWIB] = useState("07:13:45 WIB")

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setClockWIB(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          timeZone: "Asia/Jakarta",
        }) + " WIB"
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section
      id="tasks"
      className="bg-background relative z-10 overflow-hidden border-b border-primary/30 py-20 font-mono text-foreground"
    >
      {/* ═══ LAYER 1: DEEP SPACE BACKGROUND ══════════════════════════════════ */}
      <div className="pointer-events-none absolute inset-0">
        <div className="theme-grid-bg absolute inset-0 opacity-20" />
        <div className="bg-radial-gradient absolute top-1/4 right-1/4 h-[800px] w-[1200px] from-primary/10 via-blue-900/5 to-transparent blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1700px] space-y-4 px-4">
        {/* ═══ TOP HEADER (Blueprint 16) ══════════════════════════════════════ */}
        <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 xl:flex-row xl:items-center">
          <div className="flex items-center gap-4">
            <div className="bg-background inline-flex items-center gap-3 rounded-sm border-2 border-border px-3.5 py-1.5 text-xs font-black tracking-[0.25em] text-primary uppercase shadow-sm">
              <span className="rounded-xs bg-primary px-1.5 py-0.5 font-black text-foreground">
                16
              </span>
              <span>TASK CENTER</span>
            </div>
            <div>
              <h2 className="ml-2 font-mono text-sm font-black tracking-widest text-primary uppercase">
                Organize. Prioritize. Execute.
              </h2>
              <div className="ml-2 text-[9px] tracking-wide text-primary uppercase">
                Manage tasks, track progress, and achieve meaningful impact
                together.
              </div>
            </div>
          </div>
        </div>

        {/* ═══ LAYER 2: MAIN WORKSPACE (3 Columns) ════════════════════════════ */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          {/* LEFT COLUMN: Sidebar (Col 1-2) */}
          <TaskCenterSidebar />

          {/* CENTER COLUMN: Main Workspace (Col 3-9) */}
          <div className="flex flex-col gap-4 xl:col-span-7">
            {/* Task Overview Stats */}
            <div className="bg-background rounded-xl border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-primary uppercase">
                  <CheckSquare className="h-4 w-4" /> TASK OVERVIEW
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" className="bg-background flex items-center gap-1 rounded border border-border px-2 py-1 text-[8px] text-primary transition-colors hover:bg-muted/30">
                    <Filter className="h-3 w-3" /> Filters ∨
                  </Button>
                  <Button type="button" variant="ghost" className="bg-background flex items-center gap-1 rounded border border-border px-2 py-1 text-[8px] text-primary transition-colors hover:bg-muted/30">
                    Group by: <span className="text-primary">Status</span> ∨
                  </Button>
                  <Button type="button" variant="ghost" className="bg-background flex items-center gap-1 rounded border border-border px-2 py-1 text-[8px] text-primary transition-colors hover:bg-muted/30">
                    Sort by: <span className="text-primary">Priority</span> ∨
                  </Button>
                  <div className="bg-background ml-2 flex overflow-hidden rounded border border-border">
                    <Button type="button" variant="ghost" size="icon" aria-label="List view" className="bg-muted/30 px-2 py-1 text-foreground">
                      <List className="h-3 w-3" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" aria-label="Calendar view" className="px-2 py-1 text-primary hover:bg-muted/30">
                      <Calendar className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
                <div className="bg-background col-span-2 flex flex-col items-center justify-center rounded border-b-2 border-border p-3 text-center">
                  <div className="mb-1 text-[8px] font-bold tracking-widest text-primary uppercase">
                    TOTAL TASKS
                  </div>
                  <div className="mb-1 font-mono text-3xl leading-none font-black text-foreground">
                    238
                  </div>
                  <div className="text-[8px] font-bold text-primary">
                    +18 this week
                  </div>
                </div>
                {[
                  { n: "TO DO", v: 78, p: "32.8%", c: "#3B82F6", i: Clock },
                  {
                    n: "IN PROGRESS",
                    v: 96,
                    p: "40.3%",
                    c: "#F59E0B",
                    i: Clock,
                  },
                  {
                    n: "REVIEW",
                    v: 38,
                    p: "16.0%",
                    c: "#A855F7",
                    i: CheckSquare,
                  },
                  {
                    n: "DONE",
                    v: 26,
                    p: "10.9%",
                    c: "#10B981",
                    i: CheckCircle2,
                  },
                ].map((st, i) => (
                  <div
                    key={i}
                    className="bg-background flex flex-col items-center justify-center rounded border-b-2 p-3 text-center"
                    style={{ borderColor: resolveVisualizationColor(st.c) }}
                  >
                    <div
                      className="mb-1 text-[7px] font-bold tracking-widest uppercase"
                    style={{ color: resolveVisualizationColor(st.c) }}
                    >
                      {st.n}
                    </div>
                    <div className="mb-1 font-mono text-2xl leading-none font-black text-foreground">
                      {st.v}
                    </div>
                    <div className="font-mono text-[8px] text-primary">
                      {st.p}
                    </div>
                  </div>
                ))}
                <div className="flex flex-col items-center justify-center rounded border-b-2 border-rose-500 bg-rose-950/20 p-3 text-center">
                  <div className="mb-1 text-[7px] font-bold tracking-widest text-rose-500 uppercase">
                    OVERDUE
                  </div>
                  <div className="mb-1 font-mono text-2xl leading-none font-black text-foreground">
                    14
                  </div>
                  <div className="font-mono text-[8px] text-rose-500">5.9%</div>
                </div>
              </div>
            </div>

            {/* Task List Table */}
            <TaskCenterTable />

            {/* Bottom Analytics Row */}
            <TaskCenterAnalytics />
          </div>

          {/* RIGHT COLUMN: Summary & Deadlines (Col 10-12) */}
          <TaskCenterSummary />
        </div>

        {/* ═══ LAYER 3: FOOTER GRAPHIC ════════════════════════════════════════ */}
        <div className="bg-background relative mt-4 flex min-h-[150px] flex-1 flex-col items-center justify-center overflow-hidden rounded-xl border border-border text-center">
          <div className="absolute inset-0 bg-[url('/assets/landscape-temp.jpg')] bg-cover bg-center opacity-20 mix-blend-screen" />
          <div className="from-background via-background/60 absolute inset-0 z-10 bg-gradient-to-t to-transparent" />

          <div className="relative z-20 px-8">
            <div
              className="font-arabic mb-3 text-[20px] font-bold text-foreground"
              dir="rtl"
            >
              وَقُل رَّبِّ زِدْنِي عِلْمًا
            </div>
            <div className="mb-2 font-sans text-[11px] text-foreground italic">
              "And say, 'My Lord, increase me in knowledge.'"
            </div>
            <div className="font-mono text-[9px] font-bold tracking-widest text-primary uppercase">
              (Qur&apos;an 20:114)
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
