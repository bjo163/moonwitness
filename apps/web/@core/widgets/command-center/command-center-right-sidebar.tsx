"use client"

import React, { useState } from "react"
import {
  Hexagon,
  Activity,
  Sun,
  Orbit,
  Cloud,
  Globe2,
  Trophy,
  Navigation,
  Target,
  PenTool,
  Image as ImageIcon,
  Menu,
  X,
} from "lucide-react"
import { PrayerTimesWidget } from "./prayer-times-widget"
import { HijriCalendarWidget } from "./hijri-calendar-widget"
import { AsmaulHusnaWidget } from "./asmaul-husna-widget"
import { TacticalSettingsWidget } from "./tactical-settings-widget"
import {
  AchievementWidget,
  RamadanModeWidget,
  GuildLeaderboardWidget,
  QuestWidget,
} from "@core/widgets"

type GlobalMonitorItem = { name: string; value: string; status: string }
type MissionStatus = {
  title: string
  level: number
  xp: number
  maxXp: number
  knowledgePoints: number
  researchScore: number
  missionRank: string
  globalRank: string
}
type MoonData = {
  phase: string
  illumination: string
  moonAge: string
  nextFullMoon: string
  visibility: string
}

type RightSidebarProps = {
  moon: MoonData
  monitoring: GlobalMonitorItem[]
  status: MissionStatus
}

function MoonPhaseWidget({ moon }: { moon: MoonData }) {
  return (
    <div className="bg-space/60 rounded-2xl border border-cyan-500/20 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-sans text-xs font-bold tracking-wider text-cyan-400 uppercase">
          Moon Phase
        </h3>
        <Activity className="h-4 w-4 text-primary/50" />
      </div>
      <div className="flex gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          <img
            src="https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?q=80&w=400&auto=format&fit=crop"
            alt="Moon Phase"
            className="h-full w-full object-cover mix-blend-screen grayscale"
          />
        </div>
        <div className="flex-1 space-y-1">
          <h4 className="font-sans text-sm font-bold text-white">
            {moon.phase}
          </h4>
          <p className="font-mono text-xs text-cyan-400">
            {moon.illumination} Illuminated
          </p>
          <div className="mt-2 space-y-1 font-mono text-[9px]">
            <div className="flex justify-between">
              <span className="text-primary/60">Moon Age</span>
              <span className="text-white">{moon.moonAge}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary/60">Next Full Moon</span>
              <span className="text-white">{moon.nextFullMoon}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary/60">Visibility</span>
              <span className="text-emerald-400">{moon.visibility}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function GlobalMonitoringWidget({
  monitoring,
}: {
  monitoring: GlobalMonitorItem[]
}) {
  const getIcon = (name: string) => {
    if (name.includes("Earthquake"))
      return <Activity className="h-4 w-4 text-red-400" />
    if (name.includes("Solar"))
      return <Sun className="h-4 w-4 text-amber-400" />
    if (name.includes("ISS")) return <Orbit className="h-4 w-4 text-cyan-400" />
    if (name.includes("Space"))
      return <Cloud className="h-4 w-4 text-emerald-400" />
    return <Globe2 className="h-4 w-4 text-amber-400" />
  }

  return (
    <div className="bg-space/60 rounded-2xl border border-cyan-500/20 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-sans text-xs font-bold tracking-wider text-cyan-400 uppercase">
          Global Monitoring
        </h3>
        <span className="font-mono text-[10px] text-primary/60">
          Live Updates
        </span>
      </div>
      <div className="space-y-3">
        {monitoring.map((m) => (
          <div
            key={m.name}
            className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-black/20"
          >
            <div className="flex items-center gap-3">
              {getIcon(m.name)}
              <span className="font-sans text-xs text-white">{m.name}</span>
            </div>
            <span
              className={`font-mono text-[10px] ${m.status === "warning" ? "text-amber-400" : "text-emerald-400"}`}
            >
              {m.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MissionStatusWidget({ status }: { status: MissionStatus }) {
  const progress = (status.xp / status.maxXp) * 100
  return (
    <div className="bg-space/60 rounded-2xl border border-cyan-500/20 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-sans text-xs font-bold tracking-wider text-cyan-400 uppercase">
          Mission Status
        </h3>
        <Trophy className="h-4 w-4 text-primary/50" />
      </div>
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400">
          <Hexagon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h4 className="font-sans text-sm font-bold text-white">
            {status.title}
          </h4>
          <p className="font-mono text-[10px] text-primary/60">
            Level {status.level}
          </p>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-black/60">
            <div
              className="h-full bg-amber-400"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-right font-mono text-[9px] text-amber-400">
            {status.xp.toLocaleString()} / {status.maxXp.toLocaleString()} XP
          </p>
        </div>
      </div>
      <div className="space-y-2 font-mono text-[10px]">
        <div className="flex justify-between">
          <span className="text-primary/60">Knowledge Points</span>
          <span className="text-white">
            {status.knowledgePoints.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-primary/60">Research Score</span>
          <span className="text-white">
            {status.researchScore.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-primary/60">Mission Rank</span>
          <span className="text-cyan-400">{status.missionRank}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-primary/60">Global Rank</span>
          <span className="text-emerald-400">{status.globalRank}</span>
        </div>
      </div>
    </div>
  )
}

function QuickActionsWidget() {
  const actions = [
    { icon: <Navigation className="h-5 w-5" />, label: "Start Observation" },
    { icon: <Target className="h-5 w-5" />, label: "Ask KHIDRA" },
    { icon: <PenTool className="h-5 w-5" />, label: "Add Note" },
    { icon: <ImageIcon className="h-5 w-5" />, label: "Upload Research" },
  ]
  return (
    <div className="bg-space/60 rounded-2xl border border-cyan-500/20 p-5 backdrop-blur-xl">
      <h3 className="mb-4 font-sans text-xs font-bold tracking-wider text-cyan-400 uppercase">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((a, i) => (
          <button
            key={i}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-cyan-500/10 bg-black/20 p-4 text-primary/70 transition-colors hover:border-cyan-500/30 hover:bg-black/40 hover:text-cyan-400"
          >
            {a.icon}
            <span className="text-center font-sans text-[10px] font-medium">
              {a.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function ErpRightSidebar({
  moon,
  monitoring,
  status,
}: RightSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 bottom-20 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-cyan-500/50 bg-cyan-950 text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)] xl:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm xl:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`hide-scrollbar fixed inset-y-0 right-0 z-50 w-[300px] overflow-y-auto border-l border-cyan-500/20 bg-[#020813] p-4 shadow-2xl transition-transform duration-300 ease-in-out sm:w-[350px] ${isOpen ? "translate-x-0" : "translate-x-full"} xl:relative xl:z-0 xl:w-auto xl:translate-x-0 xl:overflow-visible xl:border-none xl:bg-transparent xl:p-0 xl:shadow-none`}
      >
        {/* Close Button Mobile */}
        <div className="mb-4 flex justify-end xl:hidden">
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-red-500/50 bg-red-950/50 text-red-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <RamadanModeWidget />
          <MoonPhaseWidget moon={moon} />
          <HijriCalendarWidget />
          <AsmaulHusnaWidget />
          <PrayerTimesWidget />
          <GlobalMonitoringWidget monitoring={monitoring} />
          <MissionStatusWidget status={status} />
          <QuestWidget />
          <AchievementWidget />
          <GuildLeaderboardWidget />
          <QuickActionsWidget />
          <TacticalSettingsWidget />
        </div>
      </div>
    </>
  )
}
