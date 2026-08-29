"use client"
import Image from "next/image"

import React from "react"
import {
  Users,
  Activity,
  FolderGit2,
  Globe2,
  MessageSquare,
  Eye,
  BookOpen,
  Languages,
  Telescope,
  Code,
  Heart,
  Calendar,
  Hexagon,
  ArrowRight,
  Moon,
} from "lucide-react"

export function OSGlobalKnowledgeNetwork() {
  return (
    <section
      id="network"
      className="bg-background relative z-10 overflow-hidden border-b border-blue-500/30 py-20 font-mono text-foreground"
    >
      {/* ═══ LAYER 1: DEEP SPACE MATRIX BACKGROUND ═══════════════════════════ */}
      <div className="pointer-events-none absolute inset-0">
        <div className="theme-grid-bg absolute inset-0 opacity-30" />
        <div className="bg-radial-gradient via-space/10 absolute top-1/2 left-1/2 h-[800px] w-[1200px] -translate-x-1/2 -translate-y-1/2 from-blue-900/15 to-transparent blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:100%_4px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-6 sm:px-10">
        {/* ═══ TOP HEADER (Blueprint 11) ══════════════════════════════════════ */}
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-6 xl:flex-row xl:items-center">
          <div className="max-w-2xl space-y-4">
            <div className="bg-background inline-flex items-center gap-3 rounded-sm border-2 border-blue-500/60 px-3.5 py-1.5 text-xs font-black tracking-[0.25em] text-blue-300 uppercase shadow-sm">
              <span className="rounded-xs bg-blue-500 px-1.5 py-0.5 font-black text-black">
                11
              </span>
              <span>GLOBAL KNOWLEDGE NETWORK</span>
            </div>
            <h2 className="font-mono text-xl font-black tracking-widest text-white uppercase drop-shadow-sm sm:text-2xl">
              TOGETHER, WE PRESERVE. TOGETHER, WE DISCOVER.
            </h2>
          </div>

          <div className="border-l-2 border-blue-400 bg-gradient-to-r from-primary to-transparent p-4 text-center xl:text-left">
            <div
              className="font-arabic mb-2 text-sm font-bold text-blue-400"
              dir="rtl"
            >
              وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ
            </div>
            <div className="font-sans text-[11px] text-blue-100 italic">
              "And cooperate in righteousness and piety."{" "}
              <span className="mt-1 ml-1 block font-mono font-black text-blue-400 not-italic xl:mt-0 xl:inline">
                Qur'an 5:2
              </span>
            </div>
          </div>

          <div className="relative hidden h-20 flex-1 opacity-60 lg:block">
            {/* Visual simulation of a network graph in the header */}
            <svg
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
            >
              <path
                d="M0,50 Q100,20 200,50 T400,50"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <circle cx="200" cy="50" r="4" fill="#3B82F6" />
              <circle cx="100" cy="20" r="3" fill="#00F0FF" />
              <circle cx="300" cy="80" r="5" fill="#10B981" />
              <circle cx="50" cy="70" r="3" fill="#EC4899" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />
          </div>
        </div>

        {/* ═══ LAYER 2: THREE-COLUMN MAIN LAYOUT ══════════════════════════════ */}
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          {/* LEFT SIDEBAR: COMMUNITY & ACTIVITY (Col 1-3) */}
          <div className="flex flex-col space-y-6 lg:col-span-3">
            {/* Community Overview */}
            <div className="bg-background rounded-xl border border-blue-500/30 p-4 shadow-sm">
              <div className="mb-4 text-[10px] font-black tracking-widest text-blue-400 uppercase">
                COMMUNITY OVERVIEW
              </div>

              <div className="space-y-3">
                {[
                  {
                    l: "GLOBAL MEMBERS",
                    v: "12,842",
                    d: "+342 this month",
                    icon: Users,
                    c: "#00F0FF",
                  },
                  {
                    l: "ACTIVE TODAY",
                    v: "1,827",
                    d: "+18.6%",
                    icon: Activity,
                    c: "#10B981",
                  },
                  {
                    l: "PROJECTS",
                    v: "158",
                    d: "+12 new",
                    icon: FolderGit2,
                    c: "#F59E0B",
                  },
                  {
                    l: "COUNTRIES",
                    v: "87",
                    d: "+5 new",
                    icon: Globe2,
                    c: "#3B82F6",
                  },
                  {
                    l: "LANGUAGES",
                    v: "23",
                    d: "+2 new",
                    icon: MessageSquare,
                    c: "#A855F7",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-background flex items-center gap-3 rounded border border-white/5 p-2 transition-colors hover:border-white/10"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-white/5">
                      <stat.icon
                        className="h-4 w-4"
                        style={{ color: stat.c }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-[8px] tracking-wider text-primary uppercase">
                        {stat.l}
                      </div>
                      <div
                        className="text-sm font-black"
                        style={{ color: stat.c }}
                      >
                        {stat.v}
                      </div>
                    </div>
                    <div className="w-16 text-right text-[8px] text-emerald-400">
                      {stat.d}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Network Activity Live Feed */}
            <div className="bg-background flex flex-1 flex-col rounded-xl border border-white/10 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-[10px] font-black tracking-widest text-primary uppercase">
                  NETWORK ACTIVITY
                </div>
                <div className="cursor-pointer text-[9px] font-bold text-primary transition-colors hover:text-white">
                  View All
                </div>
              </div>
              <div className="mb-3 flex items-center gap-2 text-[9px] font-black tracking-widest text-emerald-400 uppercase">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />{" "}
                LIVE FEED
              </div>

              <div className="space-y-4 font-mono">
                {[
                  {
                    n: "New moon sighting reported",
                    s: "Indonesia - West Java",
                    icon: Eye,
                    c: "#00F0FF",
                    t: "2 min ago",
                  },
                  {
                    n: "New research published",
                    s: "The Signs in the Heavens",
                    icon: BookOpen,
                    c: "#F59E0B",
                    t: "15 min ago",
                  },
                  {
                    n: "Qur'an translation updated",
                    s: "Español - Surah Al-Furqan",
                    icon: Languages,
                    c: "#A855F7",
                    t: "1 hour ago",
                  },
                  {
                    n: "New contributor joined",
                    s: "Canada",
                    icon: Users,
                    c: "#10B981",
                    t: "2 hours ago",
                  },
                  {
                    n: "Eclipse observation added",
                    s: "14 May 2026",
                    icon: Moon,
                    c: "#3B82F6",
                    t: "3 hours ago",
                  },
                ].map((act, i) => (
                  <div key={i} className="relative flex items-start gap-3">
                    {/* Vertical connecting line */}
                    {i !== 4 && (
                      <div className="absolute top-[26px] bottom-[-16px] left-[13px] w-px bg-white/10" />
                    )}

                    <div
                      className="bg-background z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10"
                      style={{ borderColor: `${act.c}40` }}
                    >
                      <act.icon
                        className="h-3.5 w-3.5"
                        style={{ color: act.c }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="mb-0.5 text-[10px] leading-tight font-bold text-white">
                        {act.n}
                      </div>
                      <div className="truncate text-[9px] text-primary">
                        {act.s}
                      </div>
                    </div>
                    <div className="text-[8px] whitespace-nowrap text-primary">
                      {act.t}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER CANVAS: GLOBAL RESEARCH MAP (Col 4-9) */}
          <div className="flex flex-col gap-6 lg:col-span-6">
            {/* The World Map */}
            <div className="bg-background relative flex min-h-[350px] flex-col overflow-hidden rounded-2xl border-2 border-primary/20 p-4">
              <div className="relative z-10 mb-2 flex items-center justify-between">
                <div className="text-[10px] font-black tracking-widest text-primary uppercase">
                  GLOBAL RESEARCH MAP
                </div>
                <div className="flex items-center gap-1 rounded-full border border-emerald-500/50 bg-emerald-500/20 px-2 py-1 text-[9px] font-bold text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />{" "}
                  LIVE
                </div>
              </div>

              {/* Map Graphic Simulation */}
              <div className="absolute inset-0 mt-10 opacity-70">
                {/* We use a dotted background as a stand-in for the world map, but realistically the user would put an SVG here */}
                <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.1)_0%,transparent_70%)]" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMCIvPgo8Y2lyY2xlIGN4PSI0IiBjeT0iNCIgcj0iMC41IiBmaWxsPSIjMzBENDc0Ii8+Cjwvc3ZnPg==')] opacity-50" />

                {/* Glowing Nodes representing activity across the world */}
                <div className="absolute top-[40%] left-[20%] h-3 w-3 animate-pulse rounded-full bg-cyan-400 shadow-sm" />
                <div className="absolute top-[30%] left-[45%] h-2 w-2 rounded-full bg-emerald-400 shadow-sm" />
                <div className="absolute top-[25%] left-[55%] h-5 w-5 animate-pulse rounded-full bg-purple-500 shadow-sm" />
                <div className="absolute top-[50%] left-[75%] h-3 w-3 rounded-full bg-amber-400 shadow-sm" />
                <div className="absolute top-[60%] left-[80%] h-2 w-2 rounded-full bg-blue-400 shadow-sm" />

                {/* Connecting paths */}
                <svg
                  className="absolute inset-0 z-0 h-full w-full opacity-40"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 20 40 Q 30 30 45 30"
                    fill="none"
                    stroke="#00F0FF"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <path
                    d="M 45 30 Q 50 20 55 25"
                    fill="none"
                    stroke="#A855F7"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <path
                    d="M 55 25 Q 65 30 75 50"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                </svg>
              </div>

              {/* Map Footer Stats */}
              <div className="relative z-10 mt-auto grid grid-cols-5 gap-2 border-t border-white/10 pt-4">
                {[
                  { l: "Observations", v: "3,248", icon: Eye, c: "#00F0FF" },
                  {
                    l: "Research Papers",
                    v: "732",
                    icon: BookOpen,
                    c: "#A855F7",
                  },
                  {
                    l: "Translations",
                    v: "1,923",
                    icon: Languages,
                    c: "#10B981",
                  },
                  {
                    l: "Discussions",
                    v: "5,112",
                    icon: MessageSquare,
                    c: "#F59E0B",
                  },
                  { l: "Contributors", v: "12,842", icon: Users, c: "#3B82F6" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="bg-background/80 rounded border border-white/5 p-2 text-center backdrop-blur"
                  >
                    <div className="mb-1 flex justify-center">
                      <s.icon className="h-3 w-3" style={{ color: s.c }} />
                    </div>
                    <div className="text-[7px] tracking-widest text-primary uppercase">
                      {s.l}
                    </div>
                    <div
                      className="mt-0.5 font-mono text-[11px] font-black"
                      style={{ color: s.c }}
                    >
                      {s.v}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Row of 3 Panels */}
            <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-3">
              {/* Community Observations */}
              <div className="bg-background flex flex-col rounded-xl border border-white/10 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-[9px] font-black tracking-widest text-primary uppercase">
                    COMMUNITY OBSERVATIONS
                  </div>
                  <div className="cursor-pointer text-[8px] text-primary hover:text-white">
                    View All
                  </div>
                </div>

                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <div className="mb-3 h-16 w-16 overflow-hidden rounded-full shadow-sm">
                    <img
                      src="/assets/cam_moon.png"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="mb-0.5 text-[10px] font-bold text-white">
                    New Moon Sighting
                  </div>
                  <div className="mb-2 text-[9px] text-primary">
                    Hilal Shawwal 1447 H
                  </div>
                  <div className="mb-0.5 font-mono text-[9px] text-primary">
                    Indonesia - Aceh
                  </div>
                  <div className="text-[8px] text-primary">12 May 2026</div>
                </div>

                <div className="mt-3 flex justify-center border-t border-white/10 pt-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border border-black bg-slate-700 text-[8px]"
                      >
                        👤
                      </div>
                    ))}
                    <div className="z-10 flex h-6 w-6 items-center justify-center rounded-full border border-black bg-cyan-900 text-[8px] font-bold text-primary">
                      +124
                    </div>
                  </div>
                </div>
              </div>

              {/* Open Projects */}
              <div className="bg-background flex flex-col rounded-xl border border-white/10 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-[9px] font-black tracking-widest text-primary uppercase">
                    OPEN PROJECTS
                  </div>
                  <div className="cursor-pointer text-[8px] text-primary hover:text-white">
                    View All
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  {[
                    { n: "Qur'an Multilingual Project", p: 72 },
                    { n: "Hadith Visualization Project", p: 58 },
                    { n: "Islamic Timeline Project", p: 65 },
                    { n: "Astronomy Atlas Project", p: 41 },
                    { n: "Knowledge Graph AI", p: 33 },
                  ].map((proj, i) => (
                    <div key={i}>
                      <div className="mb-1 flex justify-between text-[9px]">
                        <span className="text-white/80">{proj.n}</span>
                        <span className="font-mono text-primary">
                          {proj.p}%
                        </span>
                      </div>
                      <div className="bg-background h-1 overflow-hidden rounded-full">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${proj.p}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Translation Network */}
              <div className="bg-background flex flex-col items-center justify-between rounded-xl border border-white/10 p-4 text-center">
                <div className="mb-2 flex w-full items-center justify-between">
                  <div className="text-[9px] font-black tracking-widest text-emerald-400 uppercase">
                    TRANSLATION NETWORK
                  </div>
                </div>

                <div className="relative my-2 h-24 w-24">
                  <Globe2 className="h-full w-full text-emerald-500/20" />
                  <div className="absolute inset-0 rounded-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMCIvPgo8Y2lyY2xlIGN4PSI0IiBjeT0iNCIgcj0iMC41IiBmaWxsPSIjMzBENDc0Ii8+Cjwvc3ZnPg==')] [mask-image:radial-gradient(circle,white,transparent)] opacity-60" />
                </div>

                <div>
                  <div className="text-sm font-black text-emerald-400">
                    23 Languages
                  </div>
                  <div className="mt-1 text-[9px] text-primary">
                    1,923 Verses Translated
                  </div>
                </div>

                <button className="mt-3 flex w-full items-center justify-center gap-1 rounded border border-emerald-500/40 bg-transparent py-2 text-[9px] font-black tracking-widest text-emerald-400 uppercase transition-colors hover:bg-emerald-500/10">
                  JOIN TRANSLATION <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: LATEST RESEARCH & CONTRIBUTORS (Col 10-12) */}
          <div className="flex flex-col gap-6 lg:col-span-3">
            {/* Latest Research */}
            <div className="bg-background rounded-xl border border-white/10 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-[10px] font-black tracking-widest text-primary uppercase">
                  LATEST RESEARCH
                </div>
                <div className="cursor-pointer text-[9px] text-primary hover:text-white">
                  View All
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    n: "The Moon as a Sign in the Night Journey",
                    a: "Aisha Rahman",
                    cat: "ASTRONOMY",
                    t: "2h ago",
                    c: "#00F0FF",
                    img: "/assets/cam_moon.png",
                  },
                  {
                    n: "Mercy in the Qur'an: A Thematic Study",
                    a: "Yusuf Al-Hakim",
                    cat: "QUR'AN",
                    t: "4h ago",
                    c: "#10B981",
                    img: "/assets/hero_bg.png",
                  },
                  {
                    n: "The Treaty of Hudaybiyyah Lessons for Today",
                    a: "Omar Faruq",
                    cat: "HISTORY",
                    t: "6h ago",
                    c: "#F59E0B",
                    img: "/assets/mod_history.png",
                  },
                  {
                    n: "The Names of Allah and Their Universe",
                    a: "Fatimah Zahra",
                    cat: "TAFSIR",
                    t: "8h ago",
                    c: "#3B82F6",
                    img: "/assets/hero_bg.png",
                  },
                ].map((res, i) => (
                  <div
                    key={i}
                    className="group flex cursor-pointer items-center gap-3 rounded p-2 transition-colors hover:bg-white/5"
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded border border-white/10 bg-primary group-hover:border-primary/50">
                      <Image
                        unoptimized
                        width={120}
                        height={120}
                        alt="Avatar"
                        src={res.img}
                        className="h-full w-full object-cover opacity-80"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 text-[10px] leading-tight font-bold text-white group-hover:text-primary">
                        {res.n}
                      </div>
                      <div className="text-[8px] text-primary">{res.a}</div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div
                        className="mb-1 inline-block rounded border border-current px-1.5 py-0.5 text-[8px] font-bold uppercase"
                        style={{ color: res.c }}
                      >
                        {res.cat}
                      </div>
                      <div className="block font-mono text-[7px] text-primary">
                        {res.t}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Contributors */}
            <div className="bg-background flex flex-1 flex-col rounded-xl border border-white/10 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-[10px] font-black tracking-widest text-primary uppercase">
                  TOP CONTRIBUTORS
                </div>
                <div className="cursor-pointer text-[9px] text-primary hover:text-white">
                  View All
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    i: "01",
                    n: "Aisha Rahman",
                    r: "Researcher",
                    pts: "12,540 pts",
                  },
                  {
                    i: "02",
                    n: "Yusuf Al-Hakim",
                    r: "Translator",
                    pts: "9,820 pts",
                  },
                  {
                    i: "03",
                    n: "Omar Faruq",
                    r: "Historian",
                    pts: "8,410 pts",
                  },
                  {
                    i: "04",
                    n: "Fatimah Zahra",
                    r: "Researcher",
                    pts: "7,230 pts",
                  },
                  {
                    i: "05",
                    n: "Iman Al-Fatih",
                    r: "Developer",
                    pts: "6,780 pts",
                  },
                ].map((usr, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="font-mono text-[10px] font-black text-amber-500">
                        {usr.i}
                      </div>
                      <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-slate-700 text-[10px]">
                        👤
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-white">
                          {usr.n}
                        </div>
                        <div className="text-[8px] text-primary">{usr.r}</div>
                      </div>
                    </div>
                    <div className="font-mono text-[9px] text-primary">
                      {usr.pts}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ LAYER 3: HOW YOU CAN CONTRIBUTE ════════════════════════════════ */}
        <div className="grid grid-cols-1 items-stretch gap-6 pt-2 lg:grid-cols-12">
          <div className="bg-background rounded-xl border border-white/10 p-6 lg:col-span-8">
            <div className="mb-6 flex items-center gap-2 text-[10px] font-black tracking-widest text-primary uppercase">
              <span className="text-lg leading-none text-blue-500">“</span> HOW
              YOU CAN CONTRIBUTE
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {[
                {
                  n: "REPORT OBSERVATION",
                  d: "Share your moon sighting and sky observations.",
                  icon: Telescope,
                  c: "#00F0FF",
                },
                {
                  n: "WRITE & RESEARCH",
                  d: "Publish articles, papers, and knowledge for the ummah.",
                  icon: BookOpen,
                  c: "#10B981",
                },
                {
                  n: "TRANSLATE",
                  d: "Help translate Qur'an, and knowledge into more languages.",
                  icon: Languages,
                  c: "#3B82F6",
                },
                {
                  n: "DEVELOP",
                  d: "Build tools, features, and open source solutions.",
                  icon: Code,
                  c: "#F59E0B",
                },
                {
                  n: "SUPPORT",
                  d: "Support the mission through dua, time, or resources.",
                  icon: Heart,
                  c: "#EC4899",
                },
              ].map((c, i) => (
                <div
                  key={i}
                  className="group flex cursor-pointer flex-col items-center rounded p-2 text-center transition-colors hover:bg-white/5"
                >
                  <c.icon className="mb-3 h-8 w-8" style={{ color: c.c }} />
                  <div className="mb-1.5 line-clamp-2 text-[9px] font-bold text-white uppercase">
                    {c.n}
                  </div>
                  <div className="text-[8px] leading-relaxed text-primary">
                    {c.d}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-background relative flex flex-col justify-center overflow-hidden rounded-xl border-2 border-blue-500/40 p-6 shadow-sm lg:col-span-4">
            <div className="absolute inset-0 opacity-40">
              <div className="absolute bottom-[-50%] left-1/2 h-full w-[200%] -translate-x-1/2 rounded-[100%] border border-blue-500/30" />
              <div className="absolute bottom-[-40%] left-1/2 h-full w-[180%] -translate-x-1/2 rounded-[100%] border border-primary/20" />
            </div>

            <div className="relative z-10 text-center">
              <div className="mb-3 text-sm font-black tracking-widest text-white uppercase">
                TOGETHER WE LIGHT THE PATH OF KNOWLEDGE
              </div>
              <div className="mb-6 font-sans text-[10px] text-blue-100/70">
                Join thousands of seekers, researchers, and observers around the
                world.
              </div>

              <button className="bg-background flex w-full items-center justify-center gap-2 rounded border border-blue-500/50 py-3 text-[10px] font-black tracking-widest text-blue-400 uppercase transition-colors hover:bg-blue-500/20">
                BECOME A CONTRIBUTOR <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ═══ FOOTER STATUS STRIP (Blueprint 11 Footer) ══════════════════════ */}
        <div className="mt-6 flex flex-col items-center justify-between gap-6 border-t border-white/10 px-2 pt-4 font-mono text-[9px] font-bold tracking-widest text-primary uppercase lg:flex-row">
          <div className="flex items-center gap-4">
            <Hexagon className="h-6 w-6 text-blue-500/50" />
            <div>
              <div className="text-white">GLOBAL SYNC</div>
              <div>All nodes connected</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-primary">NETWORK STATUS</div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />{" "}
                STABLE
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-0.5 opacity-50 md:flex">
            {/* Audio Wave Visualizer Simulation */}
            {[
              8, 14, 5, 12, 18, 6, 9, 15, 7, 11, 4, 16, 10, 13, 5, 17, 8, 12, 6,
              14, 7, 9, 15, 5, 11, 13, 6, 18, 4, 10,
            ].map((h, i) => (
              <div
                key={i}
                className="w-[1px] bg-blue-400"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <div className="text-primary">NEXT COMMUNITY MEETUP</div>
              <div className="text-white">14 June 2026 • 20:00 WIB</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div className="max-w-[200px] font-sans text-white/60 normal-case italic">
              "Indeed, the believers are but brothers."
              <br />
              <span className="font-mono text-[8px] font-bold text-primary uppercase not-italic">
                Qur&apos;an 49:10
              </span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded border border-white/10">
              <Hexagon className="h-4 w-4 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
