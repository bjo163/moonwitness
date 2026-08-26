"use client"

import React, { useState } from "react"
import {
  Globe,
  Search,
  ChevronRight,
  Map,
  Database,
  Clock,
  Book,
  BookOpen,
  Scroll,
  Milestone,
} from "lucide-react"
import { Panel } from "@core/ui"

export function OSHistoricalIntelligence() {
  const [timelineSearch, setTimelineSearch] = useState("")

  const prophets = [
    {
      num: "01",
      name: "ĀDAM AS",
      era: "-4000 BCE",
      title: "FIRST HUMAN",
      sub: "FIRST PROPHET",
      icon: Globe,
      color: "#10B981",
      img: "/assets/history_adam.png",
    },
    {
      num: "02",
      name: "NUH AS",
      era: "-3100 BCE",
      title: "THE FLOOD",
      sub: "THE GREAT ARK",
      icon: DropletsIcon,
      color: "#00F0FF",
      img: "/assets/history_nuh.png",
    },
    {
      num: "03",
      name: "IBRAHIM AS",
      era: "-2000 BCE",
      title: "FATHER OF",
      sub: "MONOTHEISM",
      icon: BoxIcon,
      color: "#F59E0B",
      img: "/assets/history_ibrahim.png",
    },
    {
      num: "04",
      name: "MUSA AS",
      era: "-1300 BCE",
      title: "DELIVERER FROM",
      sub: "TYRANNY",
      icon: Scroll,
      color: "#3B82F6",
      img: "/assets/history_musa.png",
    },
    {
      num: "05",
      name: "ISA AS",
      era: "~30 CE",
      title: "SPIRIT & WORD",
      sub: "FROM ALLAH",
      icon: WindIcon,
      color: "#A855F7",
      img: "/assets/history_isa.png",
    },
    {
      num: "06",
      name: "MUHAMMAD ﷺ",
      era: "610 CE",
      title: "THE SEAL OF",
      sub: "PROPHETS",
      icon: BookOpen,
      color: "#10B981",
      img: "/assets/history_muhammad.png",
    },
    {
      num: "07",
      name: "RIGHTLY GUIDED",
      era: "632 - 661 CE",
      title: "JUST LEADERSHIP",
      sub: "& EXPANSION",
      icon: Milestone,
      color: "#F59E0B",
      img: "/assets/history_caliphs.png",
    },
  ]

  const civilizations = [
    { name: "ANCIENT EGYPT", era: "-3100 - 30 BCE", color: "#F59E0B" },
    { name: "BABYLONIAN", era: "-1894 - 539 BCE", color: "#F59E0B" },
    { name: "PERSIAN", era: "-550 - 330 BCE", color: "#F59E0B" },
    { name: "ROMAN", era: "-27 BCE - 476 CE", color: "#3B82F6" },
    { name: "BYZANTINE", era: "330 - 1453 CE", color: "#3B82F6" },
    { name: "UMAYYAD", era: "661 - 750 CE", color: "#10B981" },
    { name: "ABBASID", era: "750 - 1258 CE", color: "#10B981" },
    { name: "OTTOMAN", era: "1299 - 1922 CE", color: "#10B981" },
  ]

  const keyEvents = [
    { title: "The Creation of Ādam AS", date: "-4000 BCE" },
    { title: "The Great Flood (Nuh AS)", date: "-3100 BCE" },
    { title: "Prophet Ibrahim AS Born", date: "-2000 BCE" },
    { title: "The Exodus (Musa AS)", date: "-1250 BCE" },
    { title: "The Birth of Isa AS", date: "~0 CE" },
    { title: "The First Revelation", date: "610 CE" },
    { title: "The Hijrah to Madinah", date: "622 CE" },
    { title: "Conquest of Makkah", date: "630 CE" },
    { title: "The Farewell Hajj", date: "632 CE" },
    { title: "End of Prophethood", date: "632 CE" },
  ]

  return (
    <section
      id="historical-intelligence"
      className="bg-space relative z-10 overflow-hidden border-b border-primary/30 py-20 font-mono text-foreground"
    >
      {/* ═══ LAYER 1: DEEP SPACE SCI-FI GRADIENT ═════════════════════════════ */}
      <div className="pointer-events-none absolute inset-0">
        <div className="theme-grid-bg absolute inset-0 opacity-25" />
        <div className="bg-radial-gradient absolute top-1/2 left-1/4 h-[800px] w-[800px] from-teal-900/15 via-transparent to-transparent blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,240,255,0.01)_1px,transparent_1px)] bg-[size:100%_4px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-8 px-6 sm:px-10">
        {/* ═══ SECTION HEADER: MATCHING BLUEPRINT 06 ═════════════════════════ */}
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-6 xl:flex-row xl:items-end">
          <div className="max-w-3xl space-y-4">
            <div className="bg-space inline-flex items-center gap-3 rounded-sm border-2 border-teal-500/60 px-3.5 py-1.5 text-xs font-black tracking-[0.25em] text-teal-300 uppercase shadow-[0_0_15px_rgba(20,184,166,0.3)]">
              <span className="rounded-xs bg-teal-500 px-1.5 py-0.5 font-black text-black">
                06
              </span>
              <span>HISTORICAL INTELLIGENCE</span>
            </div>
            <h2 className="font-mono text-2xl font-black tracking-wider text-white uppercase drop-shadow-[0_0_12px_rgba(255,255,255,0.7)] sm:text-4xl">
              Timeline of Prophets, Civilizations, and Divine Events
            </h2>
          </div>

          <div className="flex w-full shrink-0 flex-col items-center gap-4 md:flex-row xl:w-auto">
            <div className="hide-scrollbar flex w-full items-center gap-2 overflow-x-auto pb-2 text-[10px] font-bold tracking-wider text-white uppercase md:w-auto md:pb-0">
              <span className="mr-2 text-primary">FILTER BY:</span>
              {[
                "ALL",
                "PROPHET",
                "CIVILIZATION",
                "ASTRONOMY",
                "SCRIPTURE",
                "EVENT",
              ].map((f, i) => (
                <button
                  key={i}
                  className={`border px-3 py-1.5 ${i === 0 ? "border-teal-400 bg-teal-900/40 text-teal-300 shadow-[0_0_10px_rgba(20,184,166,0.3)]" : "border-white/15 hover:border-teal-500/50"} shrink-0 rounded transition-all`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative w-full shrink-0 md:w-64">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-primary" />
              <input
                type="text"
                placeholder="Search timeline..."
                className="bg-space w-full rounded-md border border-white/20 py-1.5 pr-4 pl-9 font-mono text-xs text-white focus:border-teal-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* ═══ LAYER 2 & 3: MAIN DASHBOARD MATRIX ════════════════════════════ */}
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          {/* LEFT SIDEBAR (Col 1-3) */}
          <div className="flex flex-col space-y-6 lg:col-span-3">
            {/* Timeline Overview & Hologram */}
            <Panel
              accentColor="secondary"
              className="bg-space/80 group flex cursor-pointer flex-col p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/50 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              <div className="mb-4 text-xs font-black tracking-wider text-teal-400 uppercase">
                TIMELINE OVERVIEW
              </div>

              <div className="bg-radial-gradient relative mb-4 flex h-40 w-full items-center justify-center overflow-hidden rounded-full border border-teal-500/20 from-teal-900/40 to-transparent shadow-inner">
                <div className="theme-grid-bg absolute inset-0 opacity-40 mix-blend-overlay" />
                <Globe className="animate-spin-slow h-24 w-24 text-teal-400/50 drop-shadow-[0_0_12px_#14B8A6] filter" />
                <div className="absolute top-1/2 left-0 h-px w-full bg-teal-400/30 shadow-[0_0_8px_#14B8A6]" />
                <div className="absolute top-0 left-1/2 h-full w-px bg-teal-400/30 shadow-[0_0_8px_#14B8A6]" />
              </div>

              <div className="grid grid-cols-4 gap-2 border-t border-white/10 pt-4 text-center">
                <div>
                  <div className="text-lg font-black text-white">7</div>
                  <div className="text-[7px] text-primary uppercase">
                    PROPHETS
                  </div>
                </div>
                <div>
                  <div className="text-lg font-black text-teal-400">24</div>
                  <div className="text-[7px] text-primary uppercase">
                    CIVILIZATIONS
                  </div>
                </div>
                <div>
                  <div className="text-lg font-black text-amber-400">152</div>
                  <div className="text-[7px] text-primary uppercase">
                    KEY EVENTS
                  </div>
                </div>
                <div>
                  <div className="text-lg font-black text-primary">89</div>
                  <div className="text-[7px] text-primary uppercase">
                    ASTRO EVENTS
                  </div>
                </div>
              </div>
            </Panel>

            {/* Time Range Slider */}
            <Panel
              accentColor="secondary"
              className="bg-space/80 p-5 backdrop-blur-xl"
            >
              <div className="mb-4 text-xs font-black tracking-wider text-white uppercase">
                TIME RANGE
              </div>
              <div className="mb-2 flex items-end justify-between">
                <div>
                  <div className="text-[9px] text-primary">FROM</div>
                  <div className="text-lg font-black text-teal-400">-4000</div>
                  <div className="text-[9px] text-white">BEFORE CE</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-primary">TO</div>
                  <div className="text-lg font-black text-primary">2025</div>
                  <div className="text-[9px] text-white">CE</div>
                </div>
              </div>
              <div className="relative mt-4 h-1 w-full rounded-full bg-white/10">
                <div className="absolute right-[5%] left-[10%] h-full bg-gradient-to-r from-teal-400 to-cyan-400 shadow-[0_0_8px_rgba(20,184,166,0.6)]" />
                <div className="absolute top-1/2 left-[10%] h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_#FFF]" />
                <div className="absolute top-1/2 right-[5%] h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_#FFF]" />
              </div>
            </Panel>

            {/* Scripture References List */}
            <Panel
              accentColor="secondary"
              className="bg-space/80 flex flex-1 flex-col p-5 backdrop-blur-xl"
            >
              <div className="mb-4 text-xs font-black tracking-wider text-white uppercase">
                SCRIPTURE REFERENCES
              </div>
              <div className="flex-1 space-y-3 font-mono text-xs">
                {[
                  { n: "QUR'AN", v: "632", c: "#10B981" },
                  { n: "HADITH", v: "1,284", c: "#A855F7" },
                  { n: "TAURAH", v: "578", c: "#3B82F6" },
                  { n: "INJIL", v: "427", c: "#F59E0B" },
                  { n: "ZABUR", v: "73", c: "#EC4899" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="group flex cursor-pointer items-center justify-between"
                  >
                    <span className="flex items-center gap-2 font-bold text-primary transition-colors group-hover:text-white">
                      <Book className="h-3.5 w-3.5" style={{ color: s.c }} />
                      {s.n}
                    </span>
                    <span className="font-black text-white">{s.v}</span>
                  </div>
                ))}
              </div>
              <button className="mt-2 flex items-center justify-end gap-1 border-t border-white/10 pt-4 text-right text-[10px] font-bold text-teal-400 uppercase transition-colors hover:text-white">
                VIEW ALL REFERENCES <ChevronRight className="h-3 w-3" />
              </button>
            </Panel>
          </div>

          {/* RIGHT MAIN CAROUSELS (Col 4-12) */}
          <div className="space-y-6 lg:col-span-9">
            {/* TOP CAROUSEL: THE JOURNEY OF GUIDANCE */}
            <div className="bg-space relative rounded-xl border-2 border-white/10 p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              <div className="mb-4 flex items-center justify-between text-xs font-black tracking-widest text-primary uppercase">
                <span>--- THE JOURNEY OF GUIDANCE ---</span>
              </div>

              <div className="hide-scrollbar relative z-10 flex snap-x gap-4 overflow-x-auto pb-6">
                {prophets.map((p, i) => (
                  <div
                    key={i}
                    className="min-w-[180px] flex-shrink-0 snap-start sm:min-w-[220px]"
                  >
                    <div className="bg-space group relative flex h-64 flex-col justify-between overflow-hidden rounded-xl border border-white/15 shadow-lg">
                      {/* Gradient Fallback Art Background */}
                      <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/80 via-black/40 to-transparent" />
                      <div
                        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${p.img})` }}
                      />

                      <div className="from-space absolute inset-0 z-10 bg-gradient-to-t via-transparent to-transparent" />

                      {/* Header */}
                      <div className="relative z-20 p-4">
                        <div className="mb-2 flex h-6 w-6 items-center justify-center rounded-sm border border-white/20 bg-black/50 text-[10px] font-black text-white/70 backdrop-blur-sm">
                          {p.num}
                        </div>
                        <div className="text-lg font-black text-white drop-shadow-md">
                          {p.name}
                        </div>
                        <div className="mt-1 font-mono text-[10px] text-primary">
                          {p.era}
                        </div>
                      </div>

                      {/* Footer Badge */}
                      <div className="relative z-20 p-3 pt-0">
                        <div className="flex items-start gap-2">
                          <p.icon
                            className="mt-0.5 h-4 w-4 shrink-0"
                            style={{ color: p.color }}
                          />
                          <div className="text-[10px] leading-tight font-bold tracking-wider text-white/90 uppercase">
                            {p.title}
                            <br />
                            <span style={{ color: p.color }}>{p.sub}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Connected Timeline Dots below carousel */}
              <div className="absolute right-6 bottom-6 left-6 z-0 flex h-0.5 justify-between bg-white/10">
                {prophets.map((p, i) => (
                  <div
                    key={i}
                    className="bg-space relative h-3 w-3 -translate-y-[5px] rounded-full border-2"
                    style={{
                      borderColor: p.color,
                      boxShadow: `0 0 10px ${p.color}`,
                    }}
                  >
                    <div className="absolute -top-6 left-1/2 h-6 w-px -translate-x-1/2 bg-white/10" />
                  </div>
                ))}
              </div>

              {/* Right Chevron Overlay */}
              <button className="from-space absolute top-1/2 right-0 z-20 flex h-full w-12 -translate-y-1/2 items-center justify-end bg-gradient-to-l to-transparent pr-2 opacity-0 transition-opacity hover:opacity-100">
                <ChevronRight className="h-8 w-8 text-white drop-shadow-lg" />
              </button>
            </div>

            {/* MIDDLE CAROUSEL: MAJOR CIVILIZATIONS */}
            <div className="bg-space relative rounded-xl border-2 border-white/10 p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              <div className="mb-4 text-xs font-black tracking-widest text-primary uppercase">
                --- MAJOR CIVILIZATIONS & KINGDOMS ---
              </div>

              <div className="hide-scrollbar relative z-10 flex snap-x gap-4 overflow-x-auto pb-2">
                {civilizations.map((c, i) => (
                  <div
                    key={i}
                    className="min-w-[150px] flex-shrink-0 snap-start sm:min-w-[180px]"
                  >
                    <div className="bg-space group relative flex h-44 flex-col justify-between overflow-hidden rounded-lg border border-white/15 shadow-lg">
                      {/* Gradient Fallback Art */}
                      <div className="from-space to-space absolute inset-0 z-10 bg-gradient-to-b via-transparent opacity-80" />
                      <div className="absolute inset-0 bg-[url('/assets/hero_bg.png')] bg-cover bg-center opacity-40 mix-blend-color-dodge sepia transition-transform duration-700 group-hover:scale-110" />

                      <div className="relative z-20 p-3">
                        <div className="text-sm leading-tight font-black text-white drop-shadow-md">
                          {c.name}
                          <br />
                          EMPIRE
                        </div>
                        <div className="mt-1.5 font-mono text-[9px] text-primary">
                          {c.era}
                        </div>
                      </div>

                      <div className="relative z-20 flex justify-center border-t border-white/10 p-3 pb-2">
                        <Map
                          className="h-4 w-4 opacity-50"
                          style={{ color: c.color }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="from-space absolute top-1/2 right-0 z-20 flex h-full w-12 -translate-y-1/2 items-center justify-end bg-gradient-to-l to-transparent pr-2 opacity-0 transition-opacity hover:opacity-100">
                <ChevronRight className="h-8 w-8 text-white drop-shadow-lg" />
              </button>
            </div>
          </div>
        </div>

        {/* ═══ BOTTOM LAYER: EVENTS LIST & INSIGHTS (Blueprint 06) ═══════════ */}
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          {/* LEFT: GLOBAL MAP DOTS */}
          <div className="bg-space flex flex-col items-center justify-between rounded-xl border border-white/10 p-5 opacity-80 lg:col-span-3">
            <div className="mb-4 w-full text-xs font-black tracking-widest text-primary uppercase">
              --- GLOBAL MAP ---
            </div>
            <div className="relative flex min-h-[140px] w-full flex-1 items-center justify-center rounded-lg border border-dashed border-teal-500/20 p-2">
              <Globe className="h-full w-full text-teal-900/30" />
              <div className="absolute top-1/2 left-1/2 h-2 w-2 animate-ping rounded-full bg-amber-400 shadow-[0_0_10px_#F59E0B]" />
              <div
                className="absolute top-1/3 left-1/3 h-1.5 w-1.5 animate-ping rounded-full bg-teal-400 shadow-[0_0_10px_#14B8A6]"
                style={{ animationDelay: "500ms" }}
              />
            </div>
          </div>

          {/* CENTER: KEY HISTORICAL EVENTS */}
          <Panel
            accentColor="primary"
            className="bg-space/90 border border-primary/30 p-8 shadow-[0_0_50px_rgba(0,200,255,0.15)] backdrop-blur-xl"
          >
            <div className="mb-4 text-xs font-black tracking-widest text-primary uppercase">
              --- KEY HISTORICAL EVENTS ---
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-3 font-mono text-[10px] sm:grid-cols-2 md:text-[11px]">
              {keyEvents.map((evt, i) => (
                <div
                  key={i}
                  className="group flex cursor-pointer items-center justify-between rounded px-1.5 py-1 transition-colors hover:bg-white/5"
                >
                  <div className="flex items-center gap-2 text-white/90">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_#14B8A6] group-hover:animate-ping" />
                    <span className="truncate transition-colors group-hover:text-teal-300">
                      {evt.title}
                    </span>
                  </div>
                  <div className="shrink-0 font-bold text-teal-400">
                    {evt.date}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-white/10 pt-4 text-right">
              <button className="ml-auto flex items-center justify-end gap-1 text-[10px] font-bold text-teal-400 uppercase transition-colors hover:text-white">
                VIEW FULL TIMELINE <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </Panel>

          {/* RIGHT: HISTORICAL INSIGHTS & QUR'AN HOLOGRAM */}
          <Panel
            accentColor="primary"
            className="bg-space/80 group relative col-span-1 flex h-full flex-col justify-between overflow-hidden p-6 backdrop-blur-xl lg:col-span-3"
          >
            <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4">
              <BookOpen className="h-48 w-48 -rotate-12 transform text-teal-900/40 transition-all duration-1000 group-hover:scale-110 group-hover:text-teal-800/60" />
            </div>

            <div className="relative z-10">
              <div className="mb-6 text-xs font-black tracking-widest text-teal-400 uppercase">
                HISTORICAL INSIGHTS
              </div>

              <div className="relative border-l-2 border-teal-400 py-1 pl-4 font-serif text-sm leading-relaxed text-white/90 italic md:text-base">
                <span className="bg-space absolute -top-2 -left-[11px] flex h-4 items-center text-3xl leading-none text-teal-500">
                  "
                </span>
                Indeed in the stories of the past there is a lesson for those of
                understanding.
              </div>
              <div className="mt-4 font-mono text-[11px] font-black text-teal-400 drop-shadow-[0_0_8px_#14B8A6]">
                Qur&apos;an 12:111
              </div>
            </div>
          </Panel>
        </div>

        {/* ═══ FOOTER STATUS STRIP (Blueprint 06 Bottom) ═════════════════════ */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 px-2 pt-4 font-mono text-[9px] font-bold tracking-widest text-primary uppercase sm:flex-row">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" /> CHRONO SYNC
            </span>
            <span>LAST UPDATED: 25 MAY 2025 06:50 WIB</span>
          </div>
          <div className="flex items-center gap-2">
            HISTORY DATABASE STATUS{" "}
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />{" "}
              SYNCHRONIZED
            </span>
          </div>
          <div className="hidden text-right text-white/50 lg:block">
            DATA SOURCES: QUR&apos;AN | HADITH | HISTORICAL RECORDS |
            ASTRONOMICAL DATA
          </div>
        </div>
      </div>
    </section>
  )
}

function DropletsIcon(props: any) {
  return <Droplets {...props} />
}
function BoxIcon(props: any) {
  return <Database {...props} />
}
function WindIcon(props: any) {
  return <Wind {...props} />
}
import { Droplets, Wind } from "lucide-react"
