"use client"

import React from "react"
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  FileText,
  AlertTriangle,
  History,
  Moon,
} from "lucide-react"

// Types
type Mission = {
  id: string
  title: string
  subtitle: string
  status: string
  progress?: string
}
type Prayer = { name: string; time: string; status: string; countdown?: string }
type Briefing = {
  id: string
  icon: string
  title: string
  subtitle: string
  color: string
}
type MoonData = {
  phase: string
  illumination: string
  azimuth: string
  altitude: string
  distance: string
  visibility: string
}

type DailyMetricsProps = {
  missions: Mission[]
  prayers: Prayer[]
  briefings: Briefing[]
  moon: MoonData
}

// Icon mapper for Briefing
const getBriefingIcon = (iconName: string, colorClass: string) => {
  const props = { className: `h-5 w-5 ${colorClass}` }
  switch (iconName) {
    case "file":
      return <FileText {...props} />
    case "alert":
      return <AlertTriangle {...props} />
    case "history":
      return <History {...props} />
    case "moon":
      return <Moon {...props} />
    default:
      return <FileText {...props} />
  }
}

// Subcomponents
function MissionCard({ missions }: { missions: Mission[] }) {
  return (
    <div className="bg-space/60 flex h-full flex-col rounded-2xl border border-cyan-500/20 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-sans text-xs font-bold tracking-wider text-cyan-400 uppercase">
          Today&apos;s Mission
        </h3>
      </div>
      <div className="flex-1 space-y-3">
        {missions.map((m) => (
          <div key={m.id} className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/40">
              {m.status === "done" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <Circle className="h-5 w-5 text-primary/40" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-sans text-sm font-medium text-white">
                {m.title}
              </p>
              <p className="truncate font-sans text-xs text-primary/60">
                {m.subtitle}
              </p>
            </div>
            {m.progress && (
              <span className="font-mono text-xs text-white">{m.progress}</span>
            )}
          </div>
        ))}
      </div>
      <button className="mt-4 flex items-center justify-center gap-2 font-mono text-[10px] font-medium text-cyan-400 uppercase hover:text-cyan-300">
        View All Missions <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  )
}

function PrayerCard({ prayers }: { prayers: Prayer[] }) {
  return (
    <div className="bg-space/60 flex h-full flex-col rounded-2xl border border-cyan-500/20 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-sans text-xs font-bold tracking-wider text-cyan-400 uppercase">
          Today&apos;s Prayer
        </h3>
        <span className="font-mono text-[10px] text-primary/50">
          Jakarta, Indonesia
        </span>
      </div>
      <div className="flex-1 space-y-3">
        {prayers.map((p) => (
          <div
            key={p.name}
            className={`flex items-center justify-between rounded-lg p-2 ${p.status === "next" ? "border border-cyan-500/30 bg-cyan-500/10" : ""}`}
          >
            <div className="flex items-center gap-3">
              <Moon
                className={`h-4 w-4 ${p.status === "next" ? "text-cyan-400" : "text-primary/50"}`}
              />
              <span
                className={`font-sans text-sm ${p.status === "next" ? "font-bold text-cyan-400" : "text-white"}`}
              >
                {p.name}
              </span>
            </div>
            <div className="flex items-center gap-3 font-mono text-sm">
              <span
                className={p.status === "next" ? "text-cyan-400" : "text-white"}
              >
                {p.time}
              </span>
              {p.countdown && (
                <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-xs text-cyan-400">
                  {p.countdown}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-cyan-500/20 pt-4">
        <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-400">
          <Circle className="h-2 w-2 fill-emerald-400" /> Prayer Sync: Online
        </span>
        <button className="flex items-center gap-2 font-mono text-[10px] font-medium text-cyan-400 uppercase hover:text-cyan-300">
          View Prayer Times <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}

function AIBriefingCard({ briefings }: { briefings: Briefing[] }) {
  const getColorClass = (c: string) => {
    switch (c) {
      case "cyan":
        return "text-cyan-400"
      case "danger":
        return "text-red-400"
      case "amber":
        return "text-amber-400"
      case "success":
        return "text-emerald-400"
      default:
        return "text-cyan-400"
    }
  }

  return (
    <div className="bg-space/60 flex h-full flex-col rounded-2xl border border-cyan-500/20 p-5 backdrop-blur-xl">
      <div className="mb-4">
        <h3 className="font-sans text-xs font-bold tracking-wider text-cyan-400 uppercase">
          AI Briefing
        </h3>
        <p className="font-sans text-[10px] text-primary/60">
          KHIDRA Daily Briefing
        </p>
      </div>
      <div className="flex-1 space-y-4">
        {briefings.map((b) => (
          <div key={b.id} className="flex gap-3">
            <div className="mt-0.5 shrink-0">
              {getBriefingIcon(b.icon, getColorClass(b.color))}
            </div>
            <div>
              <p
                className={`font-sans text-sm font-medium ${getColorClass(b.color)}`}
              >
                {b.title}
              </p>
              <p className="font-sans text-xs text-primary/60">{b.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 flex items-center justify-center gap-2 font-mono text-[10px] font-medium text-cyan-400 uppercase hover:text-cyan-300">
        Open KHIDRA AI <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  )
}

function MoonObservatoryCard({ moon }: { moon: MoonData }) {
  return (
    <div className="bg-space/60 flex h-full flex-col rounded-2xl border border-cyan-500/20 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-sans text-xs font-bold tracking-wider text-cyan-400 uppercase">
          Moon Observatory
        </h3>
        <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-400">
          <Circle className="h-2 w-2 fill-emerald-400" /> Live
        </span>
      </div>
      <div className="relative mb-4 flex justify-center">
        {/* Render a simple glowing moon visual */}
        <div className="relative h-24 w-24 overflow-hidden rounded-full bg-slate-200 shadow-[0_0_30px_rgba(255,255,255,0.4)]">
          <div
            className="absolute inset-0 bg-black opacity-30"
            style={{ clipPath: "polygon(0 0, 40% 0, 70% 100%, 0 100%)" }}
          />
        </div>
      </div>
      <div className="flex-1 space-y-2 font-mono text-xs">
        <div className="flex justify-between">
          <span className="text-primary/60">Azimuth</span>
          <span className="text-white">{moon.azimuth}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-primary/60">Altitude</span>
          <span className="text-white">{moon.altitude}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-primary/60">Distance</span>
          <span className="text-white">{moon.distance}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-primary/60">Illumination</span>
          <span className="text-white">{moon.illumination}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-primary/60">Visibility</span>
          <span className="text-emerald-400">{moon.visibility}</span>
        </div>
      </div>
      <button className="mt-4 flex items-center justify-center gap-2 font-mono text-[10px] font-medium text-cyan-400 uppercase hover:text-cyan-300">
        Open Observatory <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  )
}

export function ErpDailyMetrics({
  missions,
  prayers,
  briefings,
  moon,
}: DailyMetricsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      <MissionCard missions={missions} />
      <PrayerCard prayers={prayers} />
      <AIBriefingCard briefings={briefings} />
      <MoonObservatoryCard moon={moon} />
    </div>
  )
}
