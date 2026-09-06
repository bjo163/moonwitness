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
import { AstronomyEventsSidebar } from "./astronomy-events-sidebar"
import { AstronomyTelemetryRow } from "./astronomy-telemetry-row"

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
      className="bg-background relative z-10 overflow-hidden border-b border-blue-500/30 py-20 font-mono text-foreground"
    >
      {/* ═══ LAYER 1: DEEP SPACE BACKGROUND ═══════════════════════════════════ */}
      <div className="pointer-events-none absolute inset-0">
        <div className="theme-grid-bg absolute inset-0 opacity-30" />
        <div className="bg-radial-gradient absolute top-1/4 left-1/2 h-[600px] w-[1200px] -translate-x-1/2 from-blue-900/20 via-indigo-900/10 to-transparent blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:100%_4px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-6 sm:px-10">
        {/* ═══ TOP HEADER (Blueprint 07) ══════════════════════════════════════ */}
        <div className="flex flex-col items-center justify-between gap-6 border-b border-border pb-6 xl:flex-row">
          <div className="flex w-full items-center gap-6 xl:w-auto">
            <div className="flex flex-col gap-2">
              <div className="bg-background inline-flex w-fit items-center gap-3 rounded-sm border-2 border-blue-500/60 px-3.5 py-1.5 text-xs font-black tracking-[0.25em] text-blue-300 uppercase shadow-sm">
                <span className="rounded-xs bg-blue-500 px-1.5 py-0.5 font-black text-foreground">
                  07
                </span>
                <span>DIVINE ASTRONOMY</span>
              </div>
              <h2 className="pl-1 font-mono text-xl font-black tracking-widest text-foreground uppercase drop-shadow-sm sm:text-3xl">
                Signs in the Heavens
              </h2>
            </div>
          </div>

          <div className="bg-background max-w-xl flex-1 rounded-lg border border-blue-500/30 p-4 text-center font-sans text-xs leading-relaxed text-blue-100 shadow-inner xl:text-left">
            Observe the celestial order through the Moon, Sun, stars, eclipses,
            and planetary motion. Explore creation through scientific
            observation and historical records.
          </div>

          <div className="bg-background flex min-w-[280px] shrink-0 items-center justify-end gap-4 rounded-xl border-2 border-blue-500/50 p-4 shadow-sm">
            <div className="text-right">
              <div className="font-mono text-2xl font-black tracking-widest text-foreground drop-shadow-sm">
                {clockWIB}
              </div>
              <div className="mt-1 text-[10px] font-bold text-blue-300 uppercase">
                25 MAY 2025 // 27 DHU AL-QIDAH 1446
              </div>
            </div>
            <Clock className="h-8 w-8 shrink-0 animate-pulse text-blue-400 drop-shadow-sm" />
          </div>
        </div>

        {/* ═══ LAYER 2: THREE-COLUMN MAIN GRID ════════════════════════════════ */}
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          {/* LEFT SIDEBAR: MENU & EVENTS (Col 1-3) */}
          <AstronomyEventsSidebar />


          {/* CENTER CANVAS: 3D CELESTIAL ORRERY (Col 4-9) */}
          <div className="bg-background relative flex min-h-[500px] flex-col overflow-hidden rounded-2xl border-2 border-border p-1 shadow-sm lg:col-span-6">
            {/* Deep Space Background image */}
            <div className="absolute inset-0 z-0">
              <img
                src="/assets/hero_bg.png"
                alt="Deep Space"
                className="h-full w-full object-cover opacity-60 mix-blend-screen"
              />
              <div className="from-background to-background absolute inset-0 bg-gradient-to-b via-transparent" />
            </div>

            {/* Orbital Rings */}
            <div className="absolute top-1/2 left-1/2 z-0 h-[60%] w-[110%] -translate-x-1/2 -translate-y-1/2 -rotate-12 transform rounded-[50%] border border-primary/20" />
            <div className="absolute top-1/2 left-1/2 z-0 h-[40%] w-[80%] -translate-x-1/2 -translate-y-1/2 rotate-12 transform rounded-[50%] border border-blue-400/20" />

            {/* display OVERLAYS (Z-10) */}
            <div className="pointer-events-none relative z-10 flex h-full w-full flex-col justify-between p-4">
              {/* TOP PANELS: Moon & Sun Stats */}
              <div className="flex w-full items-start justify-between">
                {/* MOON PANEL */}
                <div className="bg-background/80 pointer-events-auto w-48 rounded-lg border border-primary/50 p-3 shadow-sm backdrop-blur">
                  <div className="mb-2 flex items-center gap-2 border-b border-border pb-2">
                    <Moon className="h-4 w-4 text-primary" />
                    <span className="text-[11px] font-black tracking-wider text-primary">
                      MOON
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-1.5 font-mono text-[9px]">
                    <span className="text-primary">Illumination</span>
                    <span className="text-right text-foreground">78.4%</span>
                    <span className="text-primary">Age</span>
                    <span className="text-right text-primary">12.6 Days</span>
                    <span className="text-primary">Distance</span>
                    <span className="text-right text-primary">384,400 KM</span>
                    <span className="text-primary">Phase</span>
                    <span className="text-right text-foreground">
                      Waning Gibbous
                    </span>
                  </div>
                </div>

                {/* SUN PANEL */}
                <div className="bg-background/80 pointer-events-auto w-44 rounded-lg border border-amber-500/50 p-3 shadow-sm backdrop-blur">
                  <div className="mb-2 flex items-center gap-2 border-b border-border pb-2">
                    <Sun className="h-4 w-4 text-warning" />
                    <span className="text-[11px] font-black tracking-wider text-warning">
                      SUN
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-1.5 font-mono text-[9px]">
                    <span className="text-primary">Altitude</span>
                    <span className="text-right text-foreground">52.3°</span>
                    <span className="text-primary">Azimuth</span>
                    <span className="text-right text-foreground">182.4°</span>
                    <span className="text-primary">Distance</span>
                    <span className="text-right text-amber-300">
                      149.6 M KM
                    </span>
                    <span className="text-primary">Status</span>
                    <span className="text-right text-foreground">Active</span>
                  </div>
                </div>
              </div>

              {/* CELESTIAL BODIES (Z-20) */}
              <div className="pointer-events-auto absolute top-1/2 left-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                {/* Center Massive Moon */}
                <div className="relative z-20 h-64 w-64 cursor-pointer rounded-full shadow-sm transition-transform duration-1000 hover:scale-105 sm:h-80 sm:w-80">
                  <img
                    src="/assets/moon_photorealistic.png"
                    alt="Moon"
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>

                {/* Sun (Right Background) */}
                <div className="absolute top-[30%] right-[-20px] z-10 h-32 w-32 animate-pulse rounded-full opacity-90 shadow-sm">
                  <img
                    src="/assets/sun_photorealistic.png"
                    alt="Sun"
                    className="h-full w-full rounded-full object-cover mix-blend-screen"
                  />
                </div>

                {/* Earth (Bottom Left) */}
                <div className="absolute bottom-[10%] left-6 z-30 h-28 w-28 rounded-full shadow-sm">
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
                <div className="bg-background/80 pointer-events-auto w-44 rounded-lg border border-blue-500/50 p-3 shadow-sm backdrop-blur">
                  <div className="mb-2 border-b border-border pb-2 text-[11px] font-black tracking-wider text-blue-400 uppercase">
                    EARTH
                  </div>
                  <div className="grid grid-cols-2 gap-y-1.5 font-mono text-[9px]">
                    <span className="text-primary">Latitude</span>
                    <span className="text-right text-foreground">6.200° S</span>
                    <span className="text-primary">Longitude</span>
                    <span className="text-right text-foreground">106.816° E</span>
                    <span className="text-primary">Altitude</span>
                    <span className="text-right text-foreground">32.0 KM</span>
                    <span className="text-primary">Status</span>
                    <span className="text-right text-blue-300">Day</span>
                  </div>
                </div>

                {/* QIBLA DIRECTION (CENTER BOTTOM) */}
                <QiblaRadarWidget />

                {/* CONSTELLATIONS PANEL */}
                <div className="pointer-events-auto text-right">
                  <div className="mb-1 text-[10px] font-black tracking-widest text-foreground uppercase">
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
            <div className="bg-background rounded-xl border border-blue-500/30 p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-[10px] font-black tracking-widest text-blue-300 uppercase">
                <Target className="h-3.5 w-3.5" /> SOLAR SYSTEM VIEW
              </div>

              <div className="relative mb-4 flex h-20 w-full items-center justify-between overflow-hidden rounded-lg border border-border bg-card px-2">
                <div className="absolute top-1/2 left-[-20px] h-16 w-16 -translate-y-1/2 rounded-full bg-amber-500 opacity-60 blur-[10px]" />
                <div className="z-10 flex w-full items-center justify-between px-4">
                  {/* Fake planets */}
                  {[4, 6, 8, 5, 14, 12, 10, 8].map((size, i) => (
                    <div
                      key={i}
                      className="rounded-full bg-muted shadow-sm"
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
                  <span className="text-foreground">Planets</span>
                </div>
                <div>
                  <span className="text-blue-400">5</span>{" "}
                  <span className="text-foreground">Dwarf Planets</span>
                </div>
                <div>
                  <span className="text-blue-400">200+</span>{" "}
                  <span className="text-foreground">Moons</span>
                </div>
                <div>
                  <span className="text-primary">Millions of Asteroids</span>
                </div>
              </div>
            </div>

            {/* Moon Phase Calendar */}
            <div className="bg-background rounded-xl border border-primary/30 p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-[10px] font-black tracking-widest text-primary uppercase">
                <Moon className="h-3.5 w-3.5" /> MOON PHASE CALENDAR
              </div>

              <div className="mb-3 flex items-center justify-between border-b border-border py-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-border bg-card ${i === 3 ? "mx-2 scale-125 border-primary shadow-sm" : "opacity-60"}`}
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
                  <div className="font-mono font-bold text-foreground">
                    11 JUN 2025
                  </div>
                </div>
              </div>
            </div>

            {/* Celestial Timeline */}
            <div className="bg-background flex-1 rounded-xl border border-blue-500/30 p-4 shadow-sm">
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
                      className="bg-background flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"
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
                    <div className="w-[calc(100%-2rem)] rounded border border-border bg-muted/30 p-2 text-left transition-colors group-hover:bg-muted/30 md:w-[calc(50%-1.5rem)] md:group-odd:text-right">
                      <div className="text-[10px] leading-tight font-bold text-foreground">
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
        <AstronomyTelemetryRow />
      </div>
    </section>
  )
}
