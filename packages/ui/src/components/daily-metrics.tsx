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
import { Button } from "./button"

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
  const props = { className: `h-4 w-4 ${colorClass}` }
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
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Today&apos;s Tasks
        </h3>
      </div>
      <div className="flex-1 space-y-3">
        {missions.map((m) => (
          <div key={m.id} className="flex items-center gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
              {m.status === "done" ? (
                <CheckCircle2 className="h-4 w-4 text-success" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-sans text-xs font-medium text-foreground">
                {m.title}
              </p>
              <p className="truncate font-sans text-[11px] text-muted-foreground">
                {m.subtitle}
              </p>
            </div>
            {m.progress && (
              <span className="font-mono text-xs text-muted-foreground">{m.progress}</span>
            )}
          </div>
        ))}
      </div>
      <Button type="button" variant="ghost" className="mt-4 flex items-center justify-center gap-1.5 font-sans text-xs font-medium text-primary hover:underline">
        View All Tasks <ArrowRight className="h-3 w-3" />
      </Button>
    </div>
  )
}

function PrayerCard({ prayers }: { prayers: Prayer[] }) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Prayer Schedule
        </h3>
        <span className="font-mono text-[10px] text-muted-foreground">
          Jakarta
        </span>
      </div>
      <div className="flex-1 space-y-2">
        {prayers.map((p) => (
          <div
            key={p.name}
            className={`flex items-center justify-between rounded-lg p-2 transition-colors ${
              p.status === "next"
                ? "border border-border bg-accent text-accent-foreground font-semibold"
                : "text-foreground hover:bg-muted/40"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Moon
                className={`h-3.5 w-3.5 ${p.status === "next" ? "text-primary" : "text-muted-foreground"}`}
              />
              <span className="font-sans text-xs">{p.name}</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span>{p.time}</span>
              {p.countdown && (
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
                  {p.countdown}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <span className="flex items-center gap-1 font-mono text-[10px] text-success">
          <Circle className="h-2 w-2 fill-success" /> Sync: Online
        </span>
        <Button type="button" variant="ghost" className="flex items-center gap-1.5 font-sans text-xs font-medium text-primary hover:underline">
          View Schedule <ArrowRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

function AIBriefingCard({ briefings }: { briefings: Briefing[] }) {
  const getColorClass = (c: string) => {
    switch (c) {
      case "danger":
        return "text-destructive"
      case "amber":
      case "warning":
        return "text-warning"
      case "success":
        return "text-success"
      default:
        return "text-primary"
    }
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div className="mb-4">
        <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          System Briefing
        </h3>
        <p className="font-sans text-[11px] text-muted-foreground">
          Knowledge Engine Updates
        </p>
      </div>
      <div className="flex-1 space-y-3.5">
        {briefings.map((b) => (
          <div key={b.id} className="flex gap-2.5">
            <div className="mt-0.5 shrink-0">
              {getBriefingIcon(b.icon, getColorClass(b.color))}
            </div>
            <div>
              <p className={`font-sans text-xs font-semibold ${getColorClass(b.color)}`}>
                {b.title}
              </p>
              <p className="font-sans text-[11px] text-muted-foreground">{b.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
      <Button type="button" variant="ghost" className="mt-4 flex items-center justify-center gap-1.5 font-sans text-xs font-medium text-primary hover:underline">
        Open Knowledge Feed <ArrowRight className="h-3 w-3" />
      </Button>
    </div>
  )
}

function MoonObservatoryCard({ moon }: { moon: MoonData }) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Observatory
        </h3>
        <span className="flex items-center gap-1 font-mono text-[10px] text-success">
          <Circle className="h-2 w-2 fill-success" /> Live
        </span>
      </div>
      <div className="relative mb-3 flex justify-center">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
          <Moon className="h-7 w-7" />
        </div>
      </div>
      <div className="flex-1 space-y-1.5 font-mono text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Azimuth</span>
          <span className="text-foreground">{moon.azimuth}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Altitude</span>
          <span className="text-foreground">{moon.altitude}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Distance</span>
          <span className="text-foreground">{moon.distance}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Illumination</span>
          <span className="text-foreground">{moon.illumination}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Visibility</span>
          <span className="text-success font-semibold">{moon.visibility}</span>
        </div>
      </div>
      <Button type="button" variant="ghost" className="mt-4 flex items-center justify-center gap-1.5 font-sans text-xs font-medium text-primary hover:underline">
        Open Observatory <ArrowRight className="h-3 w-3" />
      </Button>
    </div>
  )
}

export function DailyMetrics({
  missions,
  prayers,
  briefings,
  moon,
}: DailyMetricsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 font-sans">
      <MissionCard missions={missions} />
      <PrayerCard prayers={prayers} />
      <AIBriefingCard briefings={briefings} />
      <MoonObservatoryCard moon={moon} />
    </div>
  )
}

export { DailyMetrics as ErpDailyMetrics }
