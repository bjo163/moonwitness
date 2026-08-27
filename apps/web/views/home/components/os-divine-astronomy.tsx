"use client"
import Image from "next/image"

import React, { useState, useEffect } from "react"
import {
  Moon,
  Sun,
  Globe,
  Compass,
  Star,
  Eye,
  Calendar,
  Clock,
  Activity,
  Navigation,
  Sparkles,
  Cloudy,
  Target,
} from "lucide-react"
import { QiblaRadarWidget } from "@workspace/ui"

export function OSDivineAstronomy() {
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
    <section
      id="astronomy"
      className="bg-space relative z-10 overflow-hidden border-b border-blue-500/30 py-20 font-mono text-foreground"
    >
      {/* ═══ LAYER 1: DEEP SPACE BACKGROUND ═══════════════════════════════════ */}
      <div className="pointer-events-none absolute inset-0">
        <div className="theme-grid-bg absolute inset-0 opacity-30" />
        <div className="bg-radial-gradient absolute top-1/4 left-1/2 h-[600px] w-[1200px] -translate-x-1/2 from-blue-900/20 via-indigo-900/10 to-transparent blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:100%_4px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-6 sm:px-10">
        {/* ═══ TOP HEADER (Blueprint 07) ══════════════════════════════════════ */}
        <div className="flex flex-col items-center justify-between gap-6 border-b border-white/10 pb-6 xl:flex-row">
          <div className="flex w-full items-center gap-6 xl:w-auto">
            <div className="flex flex-col gap-2">
              <div className="bg-space inline-flex w-fit items-center gap-3 rounded-sm border-2 border-blue-500/60 px-3.5 py-1.5 text-xs font-black tracking-[0.25em] text-blue-300 uppercase shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <span className="rounded-xs bg-blue-500 px-1.5 py-0.5 font-black text-black">
                  07
                </span>
                <span>DIVINE ASTRONOMY</span>
              </div>
              <h2 className="pl-1 font-mono text-xl font-black tracking-widest text-white uppercase drop-shadow-[0_0_12px_rgba(255,255,255,0.7)] sm:text-3xl">
                Signs in the Heavens
              </h2>
            </div>
          </div>

          <div className="bg-space max-w-xl flex-1 rounded-lg border border-blue-500/30 p-4 text-center font-sans text-xs leading-relaxed text-blue-100 shadow-inner xl:text-left">
            Observe the celestial order through the Moon, Sun, stars, eclipses,
            and planetary motion. Explore creation through scientific
            observation and historical records.
          </div>

          <div className="bg-space flex min-w-[280px] shrink-0 items-center justify-end gap-4 rounded-xl border-2 border-blue-500/50 p-4 shadow-[0_0_25px_rgba(59,130,246,0.15)]">
            <div className="text-right">
              <div className="font-mono text-2xl font-black tracking-widest text-white drop-shadow-[0_0_8px_#FFF]">
                {clockWIB}
              </div>
              <div className="mt-1 text-[10px] font-bold text-blue-300 uppercase">
                25 MAY 2025 // 27 DHU AL-QIDAH 1446
              </div>
            </div>
            <Clock className="h-8 w-8 shrink-0 animate-pulse text-blue-400 drop-shadow-[0_0_8px_#3B82F6]" />
          </div>
        </div>

        {/* ═══ LAYER 2: THREE-COLUMN MAIN GRID ════════════════════════════════ */}
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          {/* LEFT SIDEBAR: MENU & EVENTS (Col 1-3) */}
          <div className="flex flex-col space-y-6 lg:col-span-3">
            {/* Celestial Objects Menu */}
            <div className="bg-space flex flex-col gap-1 overflow-hidden rounded-xl border border-white/10 p-1 shadow-lg">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3 text-[10px] font-black tracking-widest text-blue-400 uppercase">
                <Globe className="h-3.5 w-3.5" /> CELESTIAL OBJECTS
              </div>

              <div className="space-y-1 p-2">
                {[
                  {
                    id: "Moon",
                    sub: "Natural Satellite",
                    icon: Moon,
                    active: true,
                    color: "#00F0FF",
                  },
                  {
                    id: "Sun",
                    sub: "Star",
                    icon: Sun,
                    active: false,
                    color: "#F59E0B",
                  },
                  {
                    id: "Earth",
                    sub: "Planet",
                    icon: Globe,
                    active: false,
                    color: "#3B82F6",
                  },
                  {
                    id: "Planets",
                    sub: "Solar System",
                    icon: Target,
                    active: false,
                    color: "#A855F7",
                  },
                  {
                    id: "Constellations",
                    sub: "Star Patterns",
                    icon: Star,
                    active: false,
                    color: "#EC4899",
                  },
                  {
                    id: "Deep Sky",
                    sub: "Galaxies & Nebula",
                    icon: Sparkles,
                    active: false,
                    color: "#10B981",
                  },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
                      item.active
                        ? "border border-primary bg-blue-900/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                        : "border border-transparent hover:bg-white/5"
                    }`}
                  >
                    <div
                      className={`rounded-full p-1.5 ${item.active ? "bg-cyan-500/20" : "bg-white/5"}`}
                    >
                      <item.icon
                        className="h-4 w-4"
                        style={{ color: item.active ? item.color : "var(--color-muted)" }}
                      />
                    </div>
                    <div>
                      <div
                        className={`text-xs font-black ${item.active ? "text-primary" : "text-white/80"}`}
                      >
                        {item.id}
                      </div>
                      <div className="font-sans text-[9px] text-primary">
                        {item.sub}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Upcoming Events List */}
            <div className="bg-space flex-1 rounded-xl border border-blue-500/30 p-4 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
              <div className="mb-4 flex items-center gap-2 text-[10px] font-black tracking-widest text-blue-300 uppercase">
                <Calendar className="h-3.5 w-3.5" /> UPCOMING EVENTS
              </div>

              <div className="space-y-1">
                {[
                  {
                    n: "Lunar Eclipse",
                    d: "12 JUN 2025",
                    i: Moon,
                    c: "#A855F7",
                  },
                  {
                    n: "Solar Eclipse",
                    d: "21 SEP 2025",
                    i: Sun,
                    c: "#F59E0B",
                  },
                  {
                    n: "Meteor Shower",
                    d: "14 AUG 2025",
                    i: Sparkles,
                    c: "#10B981",
                  },
                  {
                    n: "Moon Visibility",
                    d: "28 MAY 2025",
                    i: Eye,
                    c: "#00F0FF",
                  },
                ].map((ev, i) => (
                  <div
                    key={i}
                    className="group flex cursor-pointer items-center justify-between rounded border-b border-white/5 p-2.5 transition-colors hover:bg-white/5"
                  >
                    <div className="flex items-center gap-2.5">
                      <ev.i className="h-3.5 w-3.5" style={{ color: ev.c }} />
                      <span className="text-[10px] font-bold text-white transition-colors group-hover:text-blue-300">
                        {ev.n}
                      </span>
                    </div>
                    <span className="font-mono text-[9px] text-primary">
                      {ev.d}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER CANVAS: 3D CELESTIAL ORRERY (Col 4-9) */}
          <div className="bg-space relative flex min-h-[500px] flex-col overflow-hidden rounded-2xl border-2 border-cyan-500/40 p-1 shadow-[0_0_50px_rgba(0,240,255,0.15)] lg:col-span-6">
            {/* Deep Space Background image */}
            <div className="absolute inset-0 z-0">
              <img
                src="/assets/hero_bg.png"
                alt="Deep Space"
                className="h-full w-full object-cover opacity-60 mix-blend-screen"
              />
              <div className="from-space/80 to-space/80 absolute inset-0 bg-gradient-to-b via-transparent" />
            </div>

            {/* Orbital Rings */}
            <div className="absolute top-1/2 left-1/2 z-0 h-[60%] w-[110%] -translate-x-1/2 -translate-y-1/2 -rotate-12 transform rounded-[50%] border border-primary/20" />
            <div className="absolute top-1/2 left-1/2 z-0 h-[40%] w-[80%] -translate-x-1/2 -translate-y-1/2 rotate-12 transform rounded-[50%] border border-blue-400/20" />

            {/* HUD OVERLAYS (Z-10) */}
            <div className="pointer-events-none relative z-10 flex h-full w-full flex-col justify-between p-4">
              {/* TOP PANELS: Moon & Sun Stats */}
              <div className="flex w-full items-start justify-between">
                {/* MOON PANEL */}
                <div className="bg-space/80 pointer-events-auto w-48 rounded-lg border border-primary/50 p-3 shadow-[0_0_20px_rgba(0,240,255,0.2)] backdrop-blur">
                  <div className="mb-2 flex items-center gap-2 border-b border-white/10 pb-2">
                    <Moon className="h-4 w-4 text-primary" />
                    <span className="text-[11px] font-black tracking-wider text-primary">
                      MOON
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-1.5 font-mono text-[9px]">
                    <span className="text-primary">Illumination</span>
                    <span className="text-right text-white">78.4%</span>
                    <span className="text-primary">Age</span>
                    <span className="text-right text-primary">12.6 Days</span>
                    <span className="text-primary">Distance</span>
                    <span className="text-right text-primary">384,400 KM</span>
                    <span className="text-primary">Phase</span>
                    <span className="text-right text-white">
                      Waning Gibbous
                    </span>
                  </div>
                </div>

                {/* SUN PANEL */}
                <div className="bg-space/80 pointer-events-auto w-44 rounded-lg border border-amber-500/50 p-3 shadow-[0_0_20px_rgba(245,158,11,0.2)] backdrop-blur">
                  <div className="mb-2 flex items-center gap-2 border-b border-white/10 pb-2">
                    <Sun className="h-4 w-4 text-amber-400" />
                    <span className="text-[11px] font-black tracking-wider text-amber-400">
                      SUN
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-1.5 font-mono text-[9px]">
                    <span className="text-primary">Altitude</span>
                    <span className="text-right text-white">52.3°</span>
                    <span className="text-primary">Azimuth</span>
                    <span className="text-right text-white">182.4°</span>
                    <span className="text-primary">Distance</span>
                    <span className="text-right text-amber-300">
                      149.6 M KM
                    </span>
                    <span className="text-primary">Status</span>
                    <span className="text-right text-white">Active</span>
                  </div>
                </div>
              </div>

              {/* CELESTIAL BODIES (Z-20) */}
              <div className="pointer-events-auto absolute top-1/2 left-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                {/* Center Massive Moon */}
                <div className="relative z-20 h-64 w-64 cursor-pointer rounded-full shadow-[0_0_80px_rgba(0,240,255,0.3)] transition-transform duration-1000 hover:scale-105 sm:h-80 sm:w-80">
                  <img
                    src="/assets/moon_photorealistic.png"
                    alt="Moon"
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>

                {/* Sun (Right Background) */}
                <div className="absolute top-[30%] right-[-20px] z-10 h-32 w-32 animate-pulse rounded-full opacity-90 shadow-[0_0_100px_rgba(245,158,11,0.8)]">
                  <img
                    src="/assets/sun_photorealistic.png"
                    alt="Sun"
                    className="h-full w-full rounded-full object-cover mix-blend-screen"
                  />
                </div>

                {/* Earth (Bottom Left) */}
                <div className="absolute bottom-[10%] left-6 z-30 h-28 w-28 rounded-full shadow-[0_0_40px_rgba(59,130,246,0.5)]">
                  <img
                    src="/assets/earth_from_space.png"
                    alt="Earth"
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
              </div>

              {/* BOTTOM PANELS: Earth, Qibla, Constellations */}
              <div className="flex w-full items-end justify-between">
                {/* EARTH PANEL */}
                <div className="bg-space/80 pointer-events-auto w-44 rounded-lg border border-blue-500/50 p-3 shadow-[0_0_20px_rgba(59,130,246,0.2)] backdrop-blur">
                  <div className="mb-2 border-b border-white/10 pb-2 text-[11px] font-black tracking-wider text-blue-400 uppercase">
                    EARTH
                  </div>
                  <div className="grid grid-cols-2 gap-y-1.5 font-mono text-[9px]">
                    <span className="text-primary">Latitude</span>
                    <span className="text-right text-white">6.200° S</span>
                    <span className="text-primary">Longitude</span>
                    <span className="text-right text-white">106.816° E</span>
                    <span className="text-primary">Altitude</span>
                    <span className="text-right text-white">32.0 KM</span>
                    <span className="text-primary">Status</span>
                    <span className="text-right text-blue-300">Day</span>
                  </div>
                </div>

                {/* QIBLA DIRECTION (CENTER BOTTOM) */}
                <QiblaRadarWidget />

                {/* CONSTELLATIONS PANEL */}
                <div className="pointer-events-auto text-right">
                  <div className="mb-1 text-[10px] font-black tracking-widest text-white uppercase">
                    CONSTELLATIONS
                  </div>
                  <div className="font-mono text-xs text-primary">Orion</div>
                  <div className="text-[9px] text-primary">Visible Now</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: SOLAR SYSTEM & CALENDAR (Col 10-12) */}
          <div className="flex flex-col space-y-6 lg:col-span-3">
            {/* Solar System View */}
            <div className="bg-space rounded-xl border border-blue-500/30 p-4 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
              <div className="mb-3 flex items-center gap-2 text-[10px] font-black tracking-widest text-blue-300 uppercase">
                <Target className="h-3.5 w-3.5" /> SOLAR SYSTEM VIEW
              </div>

              <div className="relative mb-4 flex h-20 w-full items-center justify-between overflow-hidden rounded-lg border border-white/10 bg-black/60 px-2">
                <div className="absolute top-1/2 left-[-20px] h-16 w-16 -translate-y-1/2 rounded-full bg-amber-500 opacity-60 blur-[10px]" />
                <div className="z-10 flex w-full items-center justify-between px-4">
                  {/* Fake planets */}
                  {[4, 6, 8, 5, 14, 12, 10, 8].map((size, i) => (
                    <div
                      key={i}
                      className="rounded-full bg-slate-300 shadow-[0_0_5px_#FFF]"
                      style={{
                        width: size,
                        height: size,
                        opacity: 0.4 + i * 0.1,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-[9px]">
                <div>
                  <span className="text-blue-400">8</span>{" "}
                  <span className="text-white">Planets</span>
                </div>
                <div>
                  <span className="text-blue-400">5</span>{" "}
                  <span className="text-white">Dwarf Planets</span>
                </div>
                <div>
                  <span className="text-blue-400">200+</span>{" "}
                  <span className="text-white">Moons</span>
                </div>
                <div>
                  <span className="text-primary">Millions of Asteroids</span>
                </div>
              </div>
            </div>

            {/* Moon Phase Calendar */}
            <div className="bg-space rounded-xl border border-primary/30 p-4 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
              <div className="mb-3 flex items-center gap-2 text-[10px] font-black tracking-widest text-primary uppercase">
                <Moon className="h-3.5 w-3.5" /> MOON PHASE CALENDAR
              </div>

              <div className="mb-3 flex items-center justify-between border-b border-white/10 py-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-black ${i === 3 ? "mx-2 scale-125 border-primary shadow-[0_0_10px_#00F0FF]" : "opacity-60"}`}
                  >
                    <img
                      src="/assets/cam_moon.png"
                      alt="Phase"
                      className="h-full w-full object-cover"
                      style={{ transform: `rotate(${i * 45}deg)` }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-end justify-between text-[9px]">
                <div>
                  <div className="text-primary uppercase">Current Phase</div>
                  <div className="font-mono text-xs font-black text-primary">
                    Waning Gibbous
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-primary uppercase">Next Full Moon</div>
                  <div className="font-mono font-bold text-white">
                    11 JUN 2025
                  </div>
                </div>
              </div>
            </div>

            {/* Celestial Timeline */}
            <div className="bg-space flex-1 rounded-xl border border-blue-500/30 p-4 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
              <div className="mb-4 flex items-center gap-2 text-[10px] font-black tracking-widest text-blue-300 uppercase">
                <Clock className="h-3.5 w-3.5" /> CELESTIAL TIMELINE
              </div>

              <div className="relative space-y-4 before:absolute before:inset-0 before:ml-2 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-blue-500/30 before:to-transparent md:before:mx-auto md:before:translate-x-0">
                {[
                  { n: "New Moon", d: "26 MAY 2025", c: "#00F0FF" },
                  { n: "First Quarter", d: "03 JUN 2025", c: "#A0B0C0" },
                  { n: "Full Moon", d: "11 JUN 2025", c: "#A0B0C0" },
                  { n: "Last Quarter", d: "18 JUN 2025", c: "#A0B0C0" },
                ].map((ev, i) => (
                  <div
                    key={i}
                    className="group is-active relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse"
                  >
                    {/* Timeline Dot */}
                    <div
                      className="bg-space flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"
                      style={{
                        borderColor: ev.c,
                        boxShadow: `0 0 8px ${ev.c}40`,
                      }}
                    >
                      <div
                        className="h-1 w-1 rounded-full"
                        style={{ backgroundColor: ev.c }}
                      />
                    </div>
                    {/* Timeline Content */}
                    <div className="w-[calc(100%-2rem)] rounded border border-white/10 bg-white/5 p-2 text-left transition-colors group-hover:bg-white/10 md:w-[calc(50%-1.5rem)] md:group-odd:text-right">
                      <div className="text-[10px] leading-tight font-bold text-white">
                        {ev.n}
                      </div>
                      <div className="mt-0.5 font-mono text-[9px] text-primary">
                        {ev.d}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ LAYER 3: BOTTOM TELEMETRY ROW (Blueprint 07 Footer) ════════════ */}
        <div className="grid grid-cols-1 items-stretch gap-6 pt-2 md:grid-cols-12">
          {/* Live Telemetry Stats (Col 1-4) */}
          <div className="bg-space flex flex-col justify-between rounded-xl border border-blue-500/30 p-5 md:col-span-4">
            <div className="mb-4 flex items-center gap-2 text-[10px] font-black tracking-widest text-blue-400 uppercase">
              <Activity className="h-3.5 w-3.5" /> LIVE TELEMETRY
            </div>
            <div className="grid grid-cols-2 gap-3 text-center lg:grid-cols-4">
              <div>
                <div className="mb-1.5 flex justify-center">
                  <Navigation className="h-4 w-4 text-blue-400" />
                </div>
                <div className="text-[8px] font-bold text-primary uppercase">
                  Moon Altitude
                </div>
                <div className="mt-0.5 font-mono text-sm font-black text-primary">
                  54.2°
                </div>
              </div>
              <div>
                <div className="mb-1.5 flex justify-center">
                  <Compass className="h-4 w-4 text-blue-400" />
                </div>
                <div className="text-[8px] font-bold text-primary uppercase">
                  Moon Azimuth
                </div>
                <div className="mt-0.5 font-mono text-sm font-black text-primary">
                  186.4°
                </div>
              </div>
              <div>
                <div className="mb-1.5 flex justify-center">
                  <Sun className="h-4 w-4 text-amber-400" />
                </div>
                <div className="text-[8px] font-bold text-primary uppercase">
                  Sun Altitude
                </div>
                <div className="mt-0.5 font-mono text-sm font-black text-amber-300">
                  52.3°
                </div>
              </div>
              <div>
                <div className="mb-1.5 flex justify-center">
                  <Eye className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-[8px] font-bold text-primary uppercase">
                  Visibility
                </div>
                <div className="mt-0.5 font-mono text-sm font-black text-emerald-400">
                  Excellent
                </div>
              </div>
            </div>
          </div>

          {/* Current Sky Status (Col 5-8) */}
          <div className="bg-space relative flex flex-col justify-between overflow-hidden rounded-xl border border-blue-500/30 p-5 md:col-span-4">
            <div className="absolute inset-0 bg-[url('/assets/hero_bg.png')] object-cover opacity-20" />
            <div className="relative z-10 mb-4 flex items-center gap-2 text-[10px] font-black tracking-widest text-white uppercase">
              <Cloudy className="h-3.5 w-3.5" /> CURRENT SKY
            </div>

            <div className="relative z-10 grid grid-cols-4 items-end gap-3">
              <div>
                <div className="mb-1 text-[8px] font-bold text-primary uppercase">
                  Moon Phase
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-4 shrink-0 overflow-hidden rounded-full">
                    <Image
                      unoptimized
                      width={120}
                      height={120}
                      alt="User avatar"
                      src="/assets/cam_moon.png"
                      className="h-full w-full"
                    />
                  </div>
                  <div className="text-[10px] leading-tight font-bold text-white">
                    Waning
                    <br />
                    Gibbous
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-1 text-[8px] font-bold text-primary uppercase">
                  Sky Brightness
                </div>
                <div className="font-mono text-xs font-black text-primary">
                  78%
                </div>
              </div>
              <div>
                <div className="mb-1 text-[8px] font-bold text-primary uppercase">
                  Milky Way
                </div>
                <div className="font-mono text-xs font-black text-primary">
                  Visible
                </div>
              </div>
              <div>
                <div className="mb-1 text-[8px] font-bold text-primary uppercase">
                  Constellation
                </div>
                <div className="font-mono text-xs font-black text-primary">
                  Orion
                </div>
              </div>
            </div>
          </div>

          {/* Astronomical Insight (Col 9-12) */}
          <div className="bg-space flex flex-col justify-center rounded-xl border-2 border-cyan-500/40 p-5 shadow-[0_0_25px_rgba(0,240,255,0.15)] md:col-span-4">
            <div className="mb-2 flex items-center justify-between text-[10px] font-black tracking-widest text-primary uppercase">
              <span>ASTRONOMICAL INSIGHT</span>
              <BookOpen className="h-4 w-4 text-primary/50" />
            </div>
            <div className="border-l-2 border-cyan-500 pl-3 font-serif text-xs leading-relaxed text-blue-100/90 italic lg:text-sm">
              "The heavens declare the glory of God; and the firmament shows his
              handiwork."
            </div>
            <div className="mt-2 text-right font-mono text-[10px] font-black text-primary">
              — Psalm 19:1
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
import { BookOpen } from "lucide-react"
