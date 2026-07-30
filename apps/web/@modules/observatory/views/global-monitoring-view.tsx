"use client"

import React, { useEffect } from "react"
import Image from "next/image"
/* eslint-disable-next-line no-restricted-imports -- Standard icons for global intelligence dashboard */
import {
  Globe2,
  Moon,
  Activity,
  Bot,
  CheckCircle2,
  Hexagon,
  MessageSquare,
} from "lucide-react"

import { useOSStore } from "@core/store/os-store"

// Monitoring Widgets
import { GlobalStatusWidget } from "@core/widgets/monitoring/global-status-widget"
import { LiveWorldMapWidget } from "@core/widgets/monitoring/live-world-map-widget"
import { GlobalIssuesWidget } from "@core/widgets/monitoring/global-issues-widget"
import { RootCauseWidget } from "@core/widgets/monitoring/root-cause-widget"

// Intelligence Widgets
import { KnowledgeSignalsWidget } from "@core/widgets/intelligence/knowledge-signals-widget"
import { MissionAlertsWidget } from "@core/widgets/intelligence/mission-alerts-widget"
import { LiveEventsWidget } from "@core/widgets/intelligence/live-events-widget"
import { RecommendationEngineWidget } from "@core/widgets/intelligence/recommendation-engine-widget"

// Management Widgets
import { ActionCenterWidget } from "@core/widgets/management/action-center-widget"
import { ProjectPortfolioWidget } from "@core/widgets/management/project-portfolio-widget"
import { TaskCenterWidget } from "@core/widgets/management/task-center-widget"
import { MissionCommandWidget } from "@core/widgets/management/mission-command-widget"
const PROGRESS_SEGMENTS = 20

function SystemStatusIndicator({ systemStatus }: { systemStatus: string }) {
  return (
    <div className="flex items-center gap-3">
      <div>
        <div className="mb-0.5 text-[9px] font-black tracking-widest text-primary uppercase">
          SYSTEM STATUS
        </div>
        <div className="text-success flex items-center gap-1.5 text-[10px] font-black">
          <span className="bg-success h-1.5 w-1.5 animate-pulse rounded-full" />{" "}
          {systemStatus}
        </div>
      </div>
      <div className="border-success/30 relative flex h-10 w-10 items-center justify-center rounded-full border">
        <Globe2 className="text-success/50 h-5 w-5" />
        <div
          className="animate-spin-slow border-success/50 absolute inset-0 rounded-full border"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)" }}
        />
      </div>
    </div>
  )
}

export function GlobalMonitoringView() {
  const { clockWIB, tickClock, systemStatus } = useOSStore()

  // Centralized clock ticking logic synced to the store
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      tickClock(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          timeZone: "Asia/Jakarta",
        }) + " WIB"
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [tickClock])

  return (
    <section
      id="monitoring"
      className="bg-space border-success/30 relative z-10 overflow-hidden border-b py-20 font-mono text-foreground"
    >
      {/* ═══ LAYER 1: DEEP SPACE BACKGROUND ══════════════════════════════════ */}
      <div className="pointer-events-none absolute inset-0">
        <div className="theme-grid-bg absolute inset-0 opacity-30" />
        <div className="bg-radial-gradient from-success/10 absolute top-1/2 left-1/2 h-[1000px] w-[1500px] -translate-x-1/2 -translate-y-1/2 via-primary/5 to-transparent blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] space-y-4 px-4">
        {/* ═══ TOP HEADER (Blueprint 12) ══════════════════════════════════════ */}
        <div className="flex flex-col items-center justify-between gap-4 border-b border-white/10 pb-4 xl:flex-row">
          <div className="flex items-center gap-4">
            <div className="bg-space inline-flex items-center gap-3 rounded-sm border-2 border-primary/60 px-3.5 py-1.5 text-xs font-black tracking-[0.25em] text-primary uppercase shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <span className="rounded-xs bg-primary px-1.5 py-0.5 font-black text-black">
                12
              </span>
              <span>GLOBAL MONITORING CENTER</span>
            </div>
            <h2 className="ml-2 font-mono text-sm font-black tracking-widest text-primary uppercase">
              Observe Humanity Through Knowledge
            </h2>
          </div>

          <div className="hidden items-center gap-6 px-8 text-[9px] font-bold tracking-widest text-primary uppercase xl:flex">
            <span className="flex cursor-pointer flex-col items-center gap-1 transition-colors hover:text-white">
              <span className="rounded bg-white/5 p-1.5">
                <Globe2 className="h-3.5 w-3.5" />
              </span>{" "}
              HOME
            </span>
            <span className="flex cursor-pointer flex-col items-center gap-1 transition-colors hover:text-white">
              <span className="rounded bg-white/5 p-1.5">
                <Moon className="h-3.5 w-3.5" />
              </span>{" "}
              OBSERVATORY
            </span>
            <span className="flex flex-col items-center gap-1 border-b-2 border-primary pb-1 text-primary">
              <span className="rounded border border-primary/50 bg-primary/10 p-1.5">
                <Activity className="h-3.5 w-3.5" />
              </span>{" "}
              GLOBAL INTELLIGENCE
            </span>
            <span className="flex cursor-pointer flex-col items-center gap-1 transition-colors hover:text-white">
              <span className="rounded bg-white/5 p-1.5">
                <Bot className="h-3.5 w-3.5" />
              </span>{" "}
              KHIDRA AI
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-6">
            <div className="text-right">
              <div className="font-mono text-xl font-black tracking-widest text-white drop-shadow-[0_0_8px_#FFF]">
                {clockWIB}
              </div>
              <div className="mt-0.5 text-[9px] font-bold text-primary uppercase">
                26 MAY 2025 // MONDAY
              </div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <SystemStatusIndicator systemStatus={systemStatus} />
          </div>
        </div>

        {/* ═══ LAYER 2: TOP ROW (Status + Map + Alerts) ═══════════════════════ */}
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-3 xl:col-span-2">
            <GlobalStatusWidget />
          </div>
          <LiveWorldMapWidget />
          <KnowledgeSignalsWidget />
          <MissionAlertsWidget />
        </div>

        {/* ═══ LAYER 3: MIDDLE ROW (Feed + Issues + Root Cause) ═══════════════ */}
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12">
          <LiveEventsWidget />
          <GlobalIssuesWidget />
          <RootCauseWidget />
        </div>

        {/* ═══ LAYER 4: BOTTOM ROW (Actions + Projects + Tasks) ═══════════════ */}
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12">
          <RecommendationEngineWidget />
          <ActionCenterWidget />
          <ProjectPortfolioWidget />
          <TaskCenterWidget />
        </div>

        {/* ═══ LAYER 5: LOWEST COMMAND ROW ════════════════════════════════════ */}
        <div className="grid grid-cols-1 items-stretch gap-4 pt-2 lg:grid-cols-12">
          {/* AI Advisor Khidra */}
          <div className="bg-space border-success/30 flex items-center gap-4 rounded-xl border-2 p-4 shadow-[0_0_20px_rgba(0,255,102,0.1)] lg:col-span-5">
            <div className="bg-space border-success/50 relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border">
              <Image
                alt="Media"
                unoptimized
                width={120}
                height={120}
                src="/assets/mod_khidra.png"
                className="h-full w-full object-cover opacity-90 mix-blend-screen"
              />
              <div className="from-space absolute inset-0 bg-gradient-to-t to-transparent opacity-50" />
            </div>

            <div className="flex-1">
              <div className="mb-1 text-[10px] font-black tracking-widest text-white uppercase">
                AI ADVISOR <span className="text-success">KHIDRA</span>
              </div>
              <div className="text-success/70 mb-2 text-[8px] uppercase">
                Your Knowledge Intelligence Companion
              </div>

              <div className="mb-3 font-sans text-[9px] leading-relaxed text-white/80">
                Based on current data analysis, I recommend prioritizing{" "}
                <span className="text-success font-bold">
                  Moon Observation Coverage
                </span>{" "}
                in West Indonesia. The impact will be significant for upcoming
                hilal confirmation.
              </div>

              <button className="border-success/50 text-success hover:bg-success/20 flex items-center gap-1.5 rounded border px-3 py-1.5 text-[9px] font-bold tracking-widest uppercase transition-colors">
                <MessageSquare className="h-3 w-3" /> ASK KHIDRA
              </button>
            </div>
          </div>

          <MissionCommandWidget />
        </div>

        {/* ═══ FOOTER ═════════════════════════════════════════════════════════ */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-4 font-mono text-[9px] text-primary md:flex-row">
          <div className="flex items-center gap-3">
            <span className="font-bold tracking-widest text-primary uppercase">
              GLOBAL INTELLIGENCE CENTER
            </span>
            <div className="hidden border-l border-white/10 pl-3 font-sans text-white/50 normal-case italic lg:block">
              &quot;Knowledge without action is potential. Action without knowledge
              is risk. Together, they create a better world.&quot;
            </div>
          </div>

          <div className="flex items-center gap-6 font-bold tracking-widest uppercase">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-success h-4 w-4" />
              <span>
                DATA INTEGRITY <span className="text-success">100%</span>
              </span>
              {/* Progress bar */}
              <div className="bg-space ml-2 flex h-1.5 w-20 gap-0.5">
                {[...Array(PROGRESS_SEGMENTS)].map((_, i) => (
                  <div key={i} className="bg-success h-full flex-1" />
                ))}
              </div>
            </div>

            <div className="hidden xl:block">
              <span>LAST UPDATED</span>
              <br />
              <span className="text-white">26 May 2025 {clockWIB}</span>
            </div>

            <div>
              <span className="text-white">SYSTEM {systemStatus}</span>
              <br />
              <span className="text-success mt-0.5 flex items-center gap-1.5">
                <span className="bg-success h-1.5 w-1.5 animate-pulse rounded-full" />{" "}
                All systems operational
              </span>
            </div>

            <div className="text-right">
              <span className="font-black text-primary">MoonWitness OS</span>
              <br />
              <span className="text-[7px]">
                Global Divine Observatory System
              </span>
            </div>
            <Hexagon className="h-6 w-6 text-primary/50" />
          </div>
        </div>
      </div>
    </section>
  )
}
