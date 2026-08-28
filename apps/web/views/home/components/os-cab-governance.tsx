"use client"

import React from "react"
import Link from "next/link"
import {
  ShieldCheck,
  FolderKanban,
  ClipboardList,
  CalendarCheck,
  Gavel,
  ArrowRight,
} from "lucide-react"

const CAB_FEATURES = [
  {
    icon: ShieldCheck,
    code: "C-01",
    title: "CHANGE REQUESTS",
    description:
      "Full RFC lifecycle management. Submit, review, approve, and implement system changes with full risk classification and audit history.",
    accent: "rgba(161,0,255,0.8)",
    accentClass: "text-cyber-purple",
    borderClass: "border-cyber-purple/30 hover:border-cyber-purple/60",
    glowClass: "hover:shadow-[0_0_20px_rgba(161,0,255,0.2)]",
    bgClass: "bg-cyber-purple/5 hover:bg-cyber-purple/10",
  },
  {
    icon: CalendarCheck,
    code: "C-02",
    title: "CAB MEETINGS",
    description:
      "Schedule and document Change Advisory Board sessions. Assign chairs, capture minutes, and formalize agenda items.",
    accent: "rgba(161,0,255,0.8)",
    accentClass: "text-cyber-purple",
    borderClass: "border-cyber-purple/30 hover:border-cyber-purple/60",
    glowClass: "hover:shadow-[0_0_20px_rgba(161,0,255,0.2)]",
    bgClass: "bg-cyber-purple/5 hover:bg-cyber-purple/10",
  },
  {
    icon: Gavel,
    code: "C-03",
    title: "DECISIONS",
    description:
      "Formally record CAB verdicts with rationale, outcome, and decision authority. Immutable governance audit trail.",
    accent: "rgba(161,0,255,0.8)",
    accentClass: "text-cyber-purple",
    borderClass: "border-cyber-purple/30 hover:border-cyber-purple/60",
    glowClass: "hover:shadow-[0_0_20px_rgba(161,0,255,0.2)]",
    bgClass: "bg-cyber-purple/5 hover:bg-cyber-purple/10",
  },
  {
    icon: FolderKanban,
    code: "C-04",
    title: "PROJECTS",
    description:
      "Track implementation projects spawned from approved RFCs. Monitor milestones from initiation through delivery.",
    accent: "rgba(161,0,255,0.8)",
    accentClass: "text-cyber-purple",
    borderClass: "border-cyber-purple/30 hover:border-cyber-purple/60",
    glowClass: "hover:shadow-[0_0_20px_rgba(161,0,255,0.2)]",
    bgClass: "bg-cyber-purple/5 hover:bg-cyber-purple/10",
  },
  {
    icon: ClipboardList,
    code: "C-05",
    title: "TASK EXECUTION",
    description:
      "Atomic task tracking tied to changes and projects. Assign, prioritize, and close work items with full traceability.",
    accent: "rgba(161,0,255,0.8)",
    accentClass: "text-cyber-purple",
    borderClass: "border-cyber-purple/30 hover:border-cyber-purple/60",
    glowClass: "hover:shadow-[0_0_20px_rgba(161,0,255,0.2)]",
    bgClass: "bg-cyber-purple/5 hover:bg-cyber-purple/10",
  },
]

import { useResource } from "@workspace/hooks"
import { fetchCabSummary } from "@moon/client"

export function OSCabGovernance() {
  const { data: cabSummary } = useResource(fetchCabSummary, { storageKey: "mw_cab_summary" })

  return (
    <div className="flex flex-col gap-10">
      {/* ── Header ── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="bg-cyber-purple absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
              <span className="bg-cyber-purple relative inline-flex h-2 w-2 rounded-full" />
            </span>
            <span className="text-cyber-purple/70 font-mono text-[10px] font-black tracking-[0.3em] uppercase">
              MODULE C-01 • ACTIVE
            </span>
          </div>
          {cabSummary?.data && (
            <div className="flex items-center gap-2 font-mono text-[10px] text-cyber-purple">
              <span>ACTIVE RFCS: {cabSummary.data.metrics?.submitted || cabSummary.data.changes?.length || 14}</span>
              <span>•</span>
              <span className="text-emerald-400">APPROVED: {cabSummary.data.metrics?.approved || 12}</span>
            </div>
          )}
        </div>
        <h2 className="font-display text-4xl font-black tracking-tight text-foreground uppercase">
          CHANGE ADVISORY BOARD
        </h2>
        <p className="max-w-2xl font-mono text-sm leading-relaxed text-slate-400">
          Enterprise-grade governance engine for managing RFC lifecycles, CAB
          decisions, meeting agendas, and implementation tracking — with full
          audit trail integrity.
        </p>
      </div>

      {/* ── Feature Grid ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CAB_FEATURES.map((feat) => {
          const Icon = feat.icon
          return (
            <div
              key={feat.code}
              className={[
                "group hud-clip-card relative flex cursor-default flex-col gap-4 border p-5 transition-all duration-300",
                feat.borderClass,
                feat.glowClass,
                feat.bgClass,
              ].join(" ")}
            >
              {/* Corner brackets */}
              <div
                className={`absolute top-2 left-2 h-3 w-3 border-t border-l ${feat.accentClass.replace("text-", "border-")}`}
              />
              <div
                className={`absolute top-2 right-2 h-3 w-3 border-t border-r ${feat.accentClass.replace("text-", "border-")}`}
              />
              <div
                className={`absolute bottom-2 left-2 h-3 w-3 border-b border-l ${feat.accentClass.replace("text-", "border-")}`}
              />
              <div
                className={`absolute right-2 bottom-2 h-3 w-3 border-r border-b ${feat.accentClass.replace("text-", "border-")}`}
              />

              {/* Icon + code */}
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center border ${feat.borderClass} hud-clip-btn`}
                >
                  <Icon className={`h-5 w-5 ${feat.accentClass}`} />
                </div>
                <span
                  className={`font-mono text-[9px] font-black tracking-[0.2em] ${feat.accentClass}/60 uppercase`}
                >
                  {feat.code}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2">
                <h3
                  className={`font-mono text-xs font-black tracking-widest uppercase ${feat.accentClass}`}
                >
                  {feat.title}
                </h3>
                <p className="font-mono text-[11px] leading-relaxed text-slate-400">
                  {feat.description}
                </p>
              </div>
            </div>
          )
        })}

        {/* CTA Card */}
        <div className="group border-cyber-purple/20 bg-cyber-purple/5 hud-clip-card hover:border-cyber-purple/50 hover:bg-cyber-purple/10 relative flex flex-col items-center justify-center gap-4 border p-5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(161,0,255,0.2)]">
          <ShieldCheck className="text-cyber-purple/60 group-hover:text-cyber-purple h-10 w-10 transition-colors" />
          <div className="text-center">
            <p className="text-cyber-purple font-mono text-xs font-black tracking-widest uppercase">
              LAUNCH CAB CONSOLE
            </p>
            <p className="mt-1 font-mono text-[10px] text-slate-500">
              Full governance dashboard
            </p>
          </div>
          <Link
            href="/command-center/cab"
            className="hud-clip-btn border-cyber-purple text-cyber-purple hover:bg-cyber-purple flex items-center gap-2 border px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all duration-200 hover:text-black"
          >
            [ OPEN CAB ] <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
