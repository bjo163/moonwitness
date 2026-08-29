"use client"
import Image from "next/image"

import React, { useState, useEffect } from "react"
import {
  Globe,
  Activity,
  Radio,
  Users,
  Cpu,
  Sparkles,
  ShieldCheck,
} from "lucide-react"
import { Section, SectionBadge } from "@workspace/ui"

export function OSMissionControlOverview() {
  const [clockWIB, setClockWIB] = useState("06:50:16 WIB")

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
    <Section
      id="mission-control-overview"
      borderColor="cyan"
      className="relative"
    >
      {/* ═══ LAYER 1: DEEP SPACE modern GRADIENT & NEBULA BACKGROUND ═════════ */}
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-radial-gradient absolute top-1/3 left-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 from-blue-900/20 via-transparent to-transparent blur-[140px]" />
      </div>

      <div className="relative z-10 space-y-10">
        {/* Top Header Badge */}
        {/* Top Header Badge */}
        <SectionBadge number="03" label="operations overview OVERVIEW" />

        {/* ═══ LAYER 3 & 4: MAIN operations overview COMMAND DECK (From Image 4) ══ */}
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          {/* LEFT: operations overview TITLE & DOCTRINE PANEL (Col 1-3) */}
          <div className="bg-background flex flex-col justify-between space-y-6 rounded-xl border-2 border-primary/50 p-6 shadow-sm sm:p-7 lg:col-span-3">
            <div>
              <h2 className="font-mono text-4xl leading-tight font-black tracking-widest uppercase sm:text-5xl">
                <span className="text-white drop-shadow-sm">
                  MISSION
                </span>
                <br />
                <span className="text-primary drop-shadow-sm">
                  CONTROL
                </span>
              </h2>
              <p className="mt-5 border-l-2 border-primary pl-3.5 font-sans text-xs leading-relaxed text-primary">
                MoonWitness OS exists to connect humanity, creation, and wisdom
                into one living observatory.
              </p>
            </div>

            {/* 3 Mission Pillars (From Image 4) */}
            <div className="space-y-4 border-t border-white/15 pt-5">
              {[
                {
                  label: "Observe the Universe",
                  sub: "See the Signs",
                  color: "#00F0FF",
                },
                {
                  label: "Understand the Truth",
                  sub: "Reveal the Meaning",
                  color: "#10B981",
                },
                {
                  label: "Reflect with Wisdom",
                  sub: "Transform into Light",
                  color: "#FBBF24",
                },
              ].map((item, idx) => (
                <div key={idx} className="group flex items-start gap-3.5">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary/60 transition-transform group-hover:scale-110">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor: item.color,
                        boxShadow: `0 0 8px ${item.color}`,
                      }}
                    />
                  </div>
                  <div>
                    <div className="text-xs font-black tracking-wider text-white uppercase">
                      {item.label}
                    </div>
                    <div
                      className="mt-0.5 font-mono text-[11px] font-bold"
                      style={{ color: item.color }}
                    >
                      • {item.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CENTER: 3D HOLO-GLOBE MATRIX & 8 CALLOUT NODES (Col 4-7) */}
          <div className="bg-background relative flex min-h-[460px] flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-primary shadow-sm lg:col-span-4">
            {/* Real space galaxy background */}
            <div className="absolute inset-0">
              <img
                src="/assets/galaxy_milkyway_bg.png"
                alt="Milky Way space background"
                className="h-full w-full object-cover opacity-40"
              />
              <div className="from-space to-space/50 absolute inset-0 bg-gradient-to-t via-transparent" />
            </div>

            {/* Spinning digital Earth Globe Illusion (Using generated studio art /assets/holo_globe.png) */}
            <div className="relative my-auto flex h-72 w-full items-center justify-center">
              {/* Animated orbital rings */}
              <div
                className="animate-spin-slow pointer-events-none absolute h-64 w-64 rounded-full border border-dashed border-primary/40"
                style={{ animationDuration: "50s" }}
              />
              <div
                className="animate-spin-slow pointer-events-none absolute h-72 w-72 rounded-full border border-border"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "80s",
                }}
              />
              <div className="bg-radial-gradient pointer-events-none absolute bottom-1 h-8 w-56 animate-pulse rounded-[50%] from-primary/10 via-blue-600/20 to-transparent blur-md" />

              {/* Real Earth Photo */}
              <div className="relative flex h-64 w-64 items-center justify-center overflow-hidden rounded-full border border-primary/30 drop-shadow-sm">
                <Image
                  unoptimized
                  width={120}
                  height={120}
                  src="/assets/earth_from_space.png"
                  alt="Earth from Space"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/10 to-transparent mix-blend-screen" />
              </div>
            </div>

            {/* 8 Satellite Knowledge Nodes (Flanking Left & Right in Image 4) */}
            <div className="pointer-events-none absolute inset-x-3 inset-y-8 flex items-center justify-between font-mono text-[11px] font-bold">
              {/* Left Column Nodes */}
              <div className="pointer-events-auto space-y-7 text-left">
                <div className="bg-background/90 rounded-r-sm border-l-2 border-primary py-1 pl-2.5 shadow-sm">
                  <div className="text-xs font-black text-white">
                    QUR&apos;AN
                  </div>
                  <div className="text-primary">• 6,236 Ayat</div>
                </div>
                <div className="bg-background/90 rounded-r-sm border-l-2 border-border py-1 pl-2.5 shadow-sm">
                  <div className="text-xs font-black text-white">HADITH</div>
                  <div className="text-primary">• 75,000+</div>
                </div>
                <div className="bg-background/90 border-danger rounded-r-sm border-l-2 py-1 pl-2.5 shadow-sm">
                  <div className="text-xs font-black text-white">HISTORY</div>
                  <div className="text-warning">• Timelines</div>
                </div>
                <div className="bg-background/90 rounded-r-sm border-l-2 border-emerald-400 py-1 pl-2.5 shadow-sm">
                  <div className="text-xs font-black text-white">ASTRONOMY</div>
                  <div className="text-emerald-300">• Celestial</div>
                </div>
              </div>

              {/* Right Column Nodes */}
              <div className="pointer-events-auto space-y-7 text-right">
                <div className="bg-background/90 rounded-l-sm border-r-2 border-emerald-400 py-1 pr-2.5 shadow-sm">
                  <div className="text-xs font-black text-white">HUMANITY</div>
                  <div className="text-emerald-300">One Family •</div>
                </div>
                <div className="bg-background/90 rounded-l-sm border-r-2 border-primary py-1 pr-2.5 shadow-sm">
                  <div className="text-xs font-black text-white">CREATION</div>
                  <div className="text-primary">Signs •</div>
                </div>
                <div className="bg-background/90 rounded-l-sm border-r-2 border-amber-400 py-1 pr-2.5 shadow-sm">
                  <div className="text-xs font-black text-white">WISDOM</div>
                  <div className="text-amber-300">Reflection •</div>
                </div>
                <div className="bg-background/90 rounded-l-sm border-r-2 border-blue-400 py-1 pr-2.5 shadow-sm">
                  <div className="text-xs font-black text-white">FUTURE</div>
                  <div className="text-blue-300">Guidance •</div>
                </div>
              </div>
            </div>

            {/* Bottom radar projection plate */}
            <div className="absolute bottom-3 rounded-full border border-primary bg-primary/30 px-4 py-1 text-[10px] font-black tracking-widest text-primary uppercase shadow-sm">
              // HOLO-GLOBE MATRIX : ONLINE //
            </div>
          </div>

          {/* RIGHT: TOP TELEMETRY CARDS & GLOBAL ACTIVITIES LIVE FEED (Col 8-12) */}
          <div className="flex flex-col justify-between space-y-4 lg:col-span-5">
            {/* 4 Top Diagnostic Telemetry Badges (From Image 4 top right) */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                {
                  icon: ShieldCheck,
                  title: "SYSTEM ONLINE",
                  val: "100%",
                  sub: "OPERATIONAL",
                  color: "#10B981",
                },
                {
                  icon: Cpu,
                  title: "KNOWLEDGE CORE",
                  val: "2.7K+",
                  sub: "DATA POINTS",
                  color: "#A855F7",
                },
                {
                  icon: Users,
                  title: "GLOBAL USERS",
                  val: "4.8K+",
                  sub: "ACTIVE NOW",
                  color: "#00F0FF",
                },
                {
                  icon: Activity,
                  title: "MISSION TIME",
                  val: clockWIB.split(" ")[0],
                  sub: "WIB ATOMIC",
                  color: "#E2E8F0",
                },
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="bg-background flex flex-col justify-between rounded-lg border border-border p-3 text-center shadow-inner transition-colors hover:border-border"
                >
                  <div className="flex items-center justify-center gap-1.5 truncate text-[9px] font-black tracking-wider text-primary uppercase">
                    <card.icon
                      className="h-3.5 w-3.5 shrink-0"
                      style={{ color: card.color }}
                    />
                    <span className="truncate">{card.title}</span>
                  </div>
                  <div
                    className="my-1.5 font-mono text-xl font-black tracking-wider text-white drop-shadow-sm"
                    style={{ color: idx === 3 ? "var(--primary)" : card.color }}
                  >
                    {card.val}
                  </div>
                  <div className="text-[9px] font-black tracking-widest text-primary uppercase">
                    {card.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* GLOBAL ACTIVITIES LIVE FEED (From Image 4 right world map radar & chronological log) */}
            <div className="bg-background flex flex-1 flex-col justify-between rounded-xl border-2 border-primary/50 p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-border pb-3.5 text-xs font-black uppercase">
                <div className="flex items-center gap-2.5 tracking-wider text-primary">
                  <Radio className="h-4 w-4 animate-pulse text-emerald-400" />
                  <span>GLOBAL ACTIVITIES LIVE FEED</span>
                </div>
                <span className="animate-pulse rounded-xs border border-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 shadow-sm">
                  ● LIVE
                </span>
              </div>

              <div className="my-auto grid grid-cols-1 items-center gap-5 sm:grid-cols-12">
                {/* Cyan Dot-Matrix World Map Illustration */}
                <div className="bg-background relative flex h-44 w-full items-center justify-center overflow-hidden rounded-lg border border-primary/30 shadow-sm sm:col-span-6">
                  <div className="theme-grid-bg absolute inset-0 opacity-50" />
                  <Globe className="h-28 w-28 animate-pulse text-primary/40" />
                  {/* Live observation pins */}
                  <span className="absolute top-1/3 left-1/3 h-2.5 w-2.5 animate-ping rounded-full bg-emerald-400 shadow-sm" />
                  <span
                    className="absolute right-1/3 bottom-1/3 h-2.5 w-2.5 animate-ping rounded-full bg-primary shadow-sm"
                    style={{ animationDelay: "500ms" }}
                  />
                  <span
                    className="absolute top-1/2 right-1/4 h-2.5 w-2.5 animate-ping rounded-full bg-primary shadow-sm"
                    style={{ animationDelay: "1s" }}
                  />
                </div>

                {/* Chronological Activity Log (From Image 4 far right column) */}
                <div className="space-y-3 border-l border-white/10 pl-4 font-mono text-[11px] sm:col-span-6">
                  {[
                    {
                      title: "New Observation",
                      time: "2m ago",
                      color: "#00F0FF",
                    },
                    {
                      title: "Lunar Transit",
                      time: "14m ago",
                      color: "#10B981",
                    },
                    {
                      title: "New Knowledge",
                      time: "23m ago",
                      color: "#A855F7",
                    },
                    {
                      title: "Scripture Update",
                      time: "35m ago",
                      color: "#FBBF24",
                    },
                    {
                      title: "Historical Event",
                      time: "1h ago",
                      color: "#FF3355",
                    },
                  ].map((log, i) => (
                    <div
                      key={i}
                      className="group flex cursor-pointer items-center justify-between rounded-xs px-1.5 py-1 transition-colors hover:bg-white/5"
                    >
                      <span className="mr-2 flex items-center gap-2 truncate font-bold text-foreground">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{
                            backgroundColor: log.color,
                            boxShadow: `0 0 8px ${log.color}`,
                          }}
                        />
                        <span className="truncate transition-colors group-hover:text-primary">
                          {log.title}
                        </span>
                      </span>
                      <span className="shrink-0 font-mono text-[10px] text-primary">
                        {log.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ LAYER 5 & 3: SCRIPTURE TICKER RIBBON (From Image 4 middle strip) ══ */}
        <div className="mt-10 flex items-center justify-center gap-4 rounded-sm border-y-2 border-primary bg-gradient-to-r from-blue-950/70 via-transparent to-blue-950/70 px-8 py-5 text-center font-mono text-xs font-bold tracking-wider text-primary shadow-sm sm:text-sm md:text-base">
          <Sparkles className="h-5 w-5 shrink-0 animate-pulse text-primary drop-shadow-sm" />
          <span className="italic drop-shadow-sm">
            &ldquo;Indeed, in the creation of the heavens and the earth, and the
            alternation of the night and the day, are signs for people of
            understanding.&rdquo;{" "}
            <span className="ml-2 font-black text-emerald-400 not-italic drop-shadow-sm">
              (Qur&apos;an 3:190)
            </span>
          </span>
          <Sparkles className="h-5 w-5 shrink-0 animate-pulse text-primary drop-shadow-sm" />
        </div>
      </div>
    </Section>
  )
}
