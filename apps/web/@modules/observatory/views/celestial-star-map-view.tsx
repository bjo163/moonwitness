"use client"

import { useState, useEffect } from "react"
import {
  Crosshair,
  MapPin,
  Clock,
  Settings,
  Globe,
  Activity,
  Compass,
  Telescope,
  Rocket,
  CircleDot,
  Radio,
  Maximize2,
  Calendar,
  AlertTriangle,
  Sun,
  Moon,
  ChevronRight,
  Database,
  CloudLightning,
} from "lucide-react"

export function CelestialStarMapView() {
  const [mounted, setMounted] = useState(false)
  const [now, setNow] = useState(new Date())

  // Interactive States
  const [activeTab, setActiveTab] = useState("ALL")
  const [viewMode, setViewMode] = useState("3D SPHERE")
  const [starMag, setStarMag] = useState(5) // 1 to 5
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  const [controls, setControls] = useState({
    autoRotate: true,
    showConstellations: true,
    showOrbits: true,
    showGrid: true,
  })

  // Simulated Coordinates
  const [raOffset, setRaOffset] = useState(0)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setNow(new Date())
      if (controls.autoRotate) {
        setRaOffset((prev) => prev + 0.01)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [controls.autoRotate])

  if (!mounted)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020813] font-mono text-sm tracking-widest text-indigo-500">
        INITIALIZING CELESTIAL ENGINE...
      </div>
    )

  // Format Time
  const timeString =
    (now.toISOString().split("T")[1] || "").split(".")[0] || "00:00:00"
  const localTimeString = now.toTimeString().split(" ")[0]

  // Simulated RA change
  const baseRaSeconds = 40.24 + raOffset
  const raSeconds = (baseRaSeconds % 60).toFixed(2).padStart(5, "0")
  const raMinutes = (35 + Math.floor(baseRaSeconds / 60)) % 60
  const raHours =
    (8 + Math.floor((35 + Math.floor(baseRaSeconds / 60)) / 60)) % 24

  const toggleControl = (key: keyof typeof controls) => {
    setControls((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#020813] p-4 font-sans text-[#8F9FB3] selection:bg-indigo-500/30">
      <div className="mx-auto flex max-w-[1800px] flex-1 flex-col space-y-4">
        {/* ═══ HEADER BAR ═══ */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-widest text-white uppercase">
                CELESTIAL STAR MAP (PLANETARIUM)
              </h1>
              <p className="mt-1 text-[10px] text-[#8F9FB3]">
                Simulasi interaktif rotasi bola langit (Celestial Sphere).
                Melacak anomali konstelasi, pulsar, dan koordinat orbit
                benda-benda langit secara mekanis.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-6">
            <div className="border-r border-white/10 pr-6 text-right">
              <div className="mb-1 text-[8px] tracking-widest text-[#8F9FB3] uppercase">
                OPERATION MODE
              </div>
              <div className="text-[10px] font-bold tracking-widest text-white uppercase">
                ASTRO-NAVIGATION
              </div>
            </div>
            <div className="border-r border-white/10 pr-6 text-right">
              <div className="mb-1 text-[8px] tracking-widest text-[#8F9FB3] uppercase">
                SYSTEM STATUS
              </div>
              <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />{" "}
                ONLINE
              </div>
            </div>
            <div className="border-r border-white/10 pr-6 text-right">
              <div className="mb-1 text-[8px] tracking-widest text-[#8F9FB3] uppercase">
                DATA SOURCE
              </div>
              <div className="text-[10px] font-bold tracking-widest text-white uppercase">
                GAIA DR3 • ESA • NASA
              </div>
            </div>
            <div className="relative text-right">
              <div className="mb-1 text-[8px] tracking-widest text-[#8F9FB3] uppercase">
                LAST UPDATE
              </div>
              <div className="font-mono text-[10px] tracking-widest text-white">
                12 Aug 2026
                <br />
                {timeString} UTC+0
              </div>
            </div>
            <div className="pointer-events-none relative -ml-4 h-16 w-16 opacity-70 mix-blend-screen">
              <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl" />
              <img
                src="/assets/celestial_sphere.png"
                alt="Globe"
                className="relative z-10 h-full w-full scale-150 object-cover"
              />
            </div>
          </div>
        </div>

        {/* ═══ MAIN GRID ═══ */}
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-12">
          {/* ◄◄◄ LEFT SIDEBAR (Col 1-3) ◄◄◄ */}
          <div className="custom-scrollbar flex flex-col gap-4 overflow-y-auto pr-1 lg:col-span-3">
            {/* Celestial Coordinates */}
            <div className="group relative overflow-hidden rounded-xl border border-white/5 bg-[#040C1A] p-4">
              <div className="pointer-events-none absolute inset-0 bg-indigo-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative z-10 mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest text-white uppercase">
                  CELESTIAL COORDINATES
                </div>
                <Crosshair
                  className={`h-3.5 w-3.5 text-indigo-400 ${controls.autoRotate ? "animate-[spin_4s_linear_infinite]" : ""}`}
                />
              </div>
              <div className="relative z-10 space-y-4">
                <div>
                  <div className="mb-1 flex items-center gap-2 text-[7px] tracking-widest text-indigo-400 uppercase">
                    <Compass className="h-2.5 w-2.5" /> RIGHT ASCENSION (RA)
                  </div>
                  <div className="font-mono text-xl tracking-wider text-white">
                    {raHours.toString().padStart(2, "0")}h{" "}
                    {raMinutes.toString().padStart(2, "0")}m {raSeconds}s
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex items-center gap-2 text-[7px] tracking-widest text-indigo-400 uppercase">
                    <Compass className="h-2.5 w-2.5" /> DECLINATION (DEC)
                  </div>
                  <div className="font-mono text-xl tracking-wider text-white">
                    +12° 42' 03.12"
                  </div>
                </div>
                <div className="my-2 h-px w-full bg-white/5" />
                <div>
                  <div className="mb-1 text-[7px] tracking-widest text-[#8F9FB3] uppercase">
                    ECLIPTIC LATITUDE
                  </div>
                  <div className="font-mono text-base text-white">
                    +04° 21' 17.45"
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-[7px] tracking-widest text-[#8F9FB3] uppercase">
                    ECLIPTIC LONGITUDE
                  </div>
                  <div className="font-mono text-base text-white">
                    128° 17' 33.88"
                  </div>
                </div>
                <div className="my-2 h-px w-full bg-white/5" />
                <div className="flex justify-between">
                  <div>
                    <div className="mb-1 text-[7px] tracking-widest text-[#8F9FB3] uppercase">
                      GALACTIC l
                    </div>
                    <div className="font-mono text-base text-white">
                      205.81°
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="mb-1 text-[7px] tracking-widest text-[#8F9FB3] uppercase">
                      GALACTIC b
                    </div>
                    <div className="font-mono text-base text-white">
                      +25.19°
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Time & Location */}
            <div className="rounded-xl border border-white/5 bg-[#040C1A] p-4">
              <div className="mb-4 text-[9px] font-bold tracking-widest text-white uppercase">
                TIME & LOCATION
              </div>
              <div className="space-y-3">
                {[
                  { l: "DATE", v: "12 Aug 2026", i: Calendar },
                  { l: "TIME (UTC)", v: timeString, i: Clock },
                  { l: "LOCAL TIME", v: `${localTimeString} WIB`, i: Clock },
                  { l: "LOCATION", v: "Jakarta, Indonesia", i: MapPin },
                  { l: "LAT / LON", v: "-6.2088° / 106.8456°", i: Globe },
                  { l: "ELEVATION", v: "27 m", i: Crosshair },
                ].map((item, i) => (
                  <div key={i} className="flex items-center text-[10px]">
                    <div className="flex w-28 shrink-0 items-center gap-2 text-[#8F9FB3]">
                      <item.i className="h-3 w-3 text-indigo-500/70" /> {item.l}
                    </div>
                    <div className="font-mono text-white">{item.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* View Controls */}
            <div className="flex-1 rounded-xl border border-white/5 bg-[#040C1A] p-4">
              <div className="mb-4 text-[9px] font-bold tracking-widest text-white uppercase">
                VIEW CONTROLS
              </div>
              <div className="space-y-3">
                {[
                  { l: "AUTO ROTATE", key: "autoRotate" },
                  { l: "SHOW CONSTELLATIONS", key: "showConstellations" },
                  { l: "SHOW ORBITS", key: "showOrbits" },
                  { l: "SHOW GRID", key: "showGrid" },
                ].map((item, i) => {
                  const active = controls[item.key as keyof typeof controls]
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between text-[10px]"
                    >
                      <div className="tracking-widest text-[#8F9FB3] uppercase">
                        {item.l}
                      </div>
                      <button
                        onClick={() =>
                          toggleControl(item.key as keyof typeof controls)
                        }
                        className={`rounded px-2 py-0.5 text-[8px] font-bold transition-colors ${active ? "border border-[#00aaff]/30 bg-[#00aaff]/20 text-[#00aaff]" : "border border-white/10 bg-white/5 text-white/50 hover:bg-white/10"}`}
                      >
                        {active ? "ON" : "OFF"}
                      </button>
                    </div>
                  )
                })}
                <div className="flex items-center justify-between pt-1 text-[10px]">
                  <div className="tracking-widest text-[#8F9FB3] uppercase">
                    LABELS
                  </div>
                  <button className="flex items-center gap-1 rounded border border-[#00aaff]/30 bg-[#00aaff]/20 px-2 py-0.5 text-[8px] font-bold text-[#00aaff] transition-colors hover:bg-[#00aaff]/30">
                    MEDIUM <ChevronRight className="h-2.5 w-2.5 rotate-90" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => setRaOffset(0)}
                className="mt-5 w-full rounded border border-white/10 py-2 text-[7px] tracking-widest text-[#8F9FB3] uppercase transition-colors hover:bg-white/5"
              >
                RESET VIEW
              </button>
            </div>
          </div>

          {/* ■■■ CENTER SPHERE (Col 4-9) ■■■ */}
          <div className="relative flex h-full min-h-[500px] flex-col overflow-hidden rounded-xl border border-white/5 bg-[#040C1A] lg:col-span-6">
            {/* Header Tabs */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/5 bg-black/40 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest text-white uppercase">
                <Maximize2 className="h-3.5 w-3.5 text-[#00aaff]" /> CELESTIAL
                SPHERE VIEW
              </div>
              <div className="flex gap-1 text-[8px] font-bold tracking-widest uppercase">
                {["ALL", "STARS", "CONSTELLATIONS", "PLANETS", "DEEP SKY"].map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`rounded px-3 py-1.5 transition-colors ${activeTab === tab ? "bg-white/10 text-white" : "text-[#8F9FB3] hover:text-white"}`}
                    >
                      {tab}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* The Globe Graphic */}
            <div className="relative z-0 flex flex-1 items-center justify-center p-8">
              {/* Glow Behind */}
              <div className="pointer-events-none absolute inset-0 scale-50 rounded-full bg-[#00aaff]/5 blur-[100px]" />

              {/* The 3D Sphere */}
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
                <div
                  className="relative h-full w-full transition-transform duration-300 ease-out"
                  style={{
                    transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                  }}
                >
                  <img
                    src="/assets/celestial_sphere.png"
                    alt="Celestial Sphere"
                    className="h-full w-full object-contain mix-blend-screen drop-shadow-[0_0_30px_rgba(0,170,255,0.3)] transition-opacity duration-500"
                    style={{
                      maskImage:
                        "radial-gradient(circle, black 70%, transparent 100%)",
                      WebkitMaskImage:
                        "radial-gradient(circle, black 70%, transparent 100%)",
                      opacity: viewMode === "2D SKY" ? 0.4 : 0.9,
                    }}
                  />
                </div>
              </div>

              {/* North/South/East/West Labels */}
              <div className="absolute top-4 font-mono text-sm font-bold text-[#00aaff]">
                N
              </div>
              <div className="absolute bottom-4 font-mono text-sm font-bold text-[#00aaff]">
                S
              </div>
              <div className="absolute left-6 font-mono text-sm font-bold text-emerald-400">
                E
              </div>
              <div className="absolute right-6 font-mono text-sm font-bold text-emerald-400">
                W
              </div>

              {/* D-Pad Controls (Left) */}
              <div className="absolute bottom-16 left-6 z-10 flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-black/40 p-2 shadow-lg backdrop-blur-md">
                <div className="grid grid-cols-3 gap-1">
                  <div />
                  <button
                    onClick={() => setPan((p) => ({ ...p, y: p.y + 20 }))}
                    className="flex h-6 w-6 items-center justify-center rounded border border-white/10 text-[#8F9FB3] transition-colors hover:bg-[#00aaff]/20 hover:text-[#00aaff]"
                  >
                    <ChevronRight className="h-3 w-3 -rotate-90" />
                  </button>
                  <div />
                  <button
                    onClick={() => setPan((p) => ({ ...p, x: p.x + 20 }))}
                    className="flex h-6 w-6 items-center justify-center rounded border border-white/10 text-[#8F9FB3] transition-colors hover:bg-[#00aaff]/20 hover:text-[#00aaff]"
                  >
                    <ChevronRight className="h-3 w-3 rotate-180" />
                  </button>
                  <button
                    onClick={() => {
                      setPan({ x: 0, y: 0 })
                      setZoom(1)
                      toggleControl("autoRotate")
                    }}
                    className="flex h-6 w-6 items-center justify-center rounded border border-white/10 text-[#8F9FB3] transition-colors hover:bg-[#00aaff]/20 hover:text-[#00aaff]"
                  >
                    <CircleDot
                      className={`h-3 w-3 ${controls.autoRotate ? "animate-pulse text-[#00aaff]" : ""}`}
                    />
                  </button>
                  <button
                    onClick={() => setPan((p) => ({ ...p, x: p.x - 20 }))}
                    className="flex h-6 w-6 items-center justify-center rounded border border-white/10 text-[#8F9FB3] transition-colors hover:bg-[#00aaff]/20 hover:text-[#00aaff]"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </button>
                  <div />
                  <button
                    onClick={() => setPan((p) => ({ ...p, y: p.y - 20 }))}
                    className="flex h-6 w-6 items-center justify-center rounded border border-white/10 text-[#8F9FB3] transition-colors hover:bg-[#00aaff]/20 hover:text-[#00aaff]"
                  >
                    <ChevronRight className="h-3 w-3 rotate-90" />
                  </button>
                  <div />
                </div>
                <div className="mt-2 flex w-full flex-col gap-1">
                  <button
                    onClick={() => setZoom((z) => Math.min(z + 0.2, 3))}
                    className="flex h-6 w-full items-center justify-center rounded border border-white/10 text-[#8F9FB3] hover:bg-white/5 active:bg-white/10"
                  >
                    +
                  </button>
                  <button
                    onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
                    className="flex h-6 w-full items-center justify-center rounded border border-white/10 text-[#8F9FB3] hover:bg-white/5 active:bg-white/10"
                  >
                    -
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="relative z-10 flex items-center justify-between border-t border-white/5 bg-black/40 p-4 backdrop-blur-sm">
              <div>
                <div className="mb-2 text-[7px] font-bold tracking-widest text-[#8F9FB3] uppercase">
                  STAR MAGNITUDE
                </div>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5].map((mag) => (
                    <button
                      key={mag}
                      onClick={() => setStarMag(mag)}
                      className={`rounded-full transition-all hover:scale-150 ${starMag >= mag ? "bg-white shadow-[0_0_5px_white]" : "bg-white/20"}`}
                      style={{ width: `${8 - mag}px`, height: `${8 - mag}px` }}
                    />
                  ))}
                  <span className="ml-2 font-mono text-[8px] text-[#8F9FB3]">
                    2 3 4 5 6+
                  </span>
                </div>
              </div>
              <div>
                <div className="mb-2 text-right text-[7px] font-bold tracking-widest text-[#8F9FB3] uppercase">
                  VIEW MODE
                </div>
                <div className="flex gap-1 rounded border border-white/10 bg-black p-0.5">
                  <button
                    onClick={() => setViewMode("3D SPHERE")}
                    className={`rounded px-4 py-1.5 text-[8px] font-bold tracking-widest uppercase transition-colors ${viewMode === "3D SPHERE" ? "bg-[#00aaff]/20 text-[#00aaff]" : "text-[#8F9FB3] hover:text-white"}`}
                  >
                    3D SPHERE
                  </button>
                  <button
                    onClick={() => setViewMode("2D SKY")}
                    className={`rounded px-4 py-1.5 text-[8px] font-bold tracking-widest uppercase transition-colors ${viewMode === "2D SKY" ? "bg-[#00aaff]/20 text-[#00aaff]" : "text-[#8F9FB3] hover:text-white"}`}
                  >
                    2D SKY
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ►►► RIGHT SIDEBAR (Col 10-12) ►►► */}
          <div className="custom-scrollbar flex flex-col gap-4 overflow-y-auto pl-1 lg:col-span-3">
            {/* Tracked Objects */}
            <div className="rounded-xl border border-white/5 bg-[#040C1A] p-4">
              <div className="mb-4 flex items-end justify-between border-b border-white/10 pb-3">
                <div className="text-[9px] font-bold tracking-widest text-white uppercase">
                  TRACKED OBJECTS
                </div>
                <div className="font-mono text-xl leading-none font-bold text-white">
                  732
                </div>
              </div>
              <div className="space-y-4">
                {[
                  {
                    n: "ISS (ZARYA)",
                    i: Rocket,
                    c: "text-[#00aaff]",
                    m: "-1.2",
                    a: "32.4°",
                    az: "145.6°",
                    r: "423 km",
                  },
                  {
                    n: "HUBBLE TELESCOPE",
                    i: Telescope,
                    c: "text-indigo-400",
                    m: "1.1",
                    a: "18.7°",
                    az: "201.3°",
                    r: "541 km",
                  },
                  {
                    n: "JUPITER",
                    i: Globe,
                    c: "text-amber-500",
                    m: "-2.6",
                    a: "28.3°",
                    az: "120.7°",
                    r: "6.12 AU",
                  },
                  {
                    n: "SATURN",
                    i: Globe,
                    c: "text-orange-400",
                    m: "0.4",
                    a: "16.1°",
                    az: "210.2°",
                    r: "9.64 AU",
                  },
                  {
                    n: "MARS",
                    i: Globe,
                    c: "text-rose-500",
                    m: "0.8",
                    a: "22.9°",
                    az: "89.4°",
                    r: "2.01 AU",
                  },
                ].map((x, i) => (
                  <div
                    key={i}
                    className="group flex cursor-pointer items-center gap-3"
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors group-hover:bg-white/10`}
                    >
                      <x.i className={`h-4 w-4 ${x.c}`} />
                    </div>
                    <div className="flex-1">
                      <div className="mb-1.5 text-[9px] font-bold tracking-widest text-white uppercase transition-colors group-hover:text-indigo-300">
                        {x.n}
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-[7px] tracking-widest text-[#8F9FB3] uppercase">
                        <div>
                          <div className="mb-0.5">MAG</div>
                          <div className="flex items-center gap-1 font-mono text-white">
                            <div className="h-1 w-1 rounded-full bg-emerald-400" />
                            {x.m}
                          </div>
                        </div>
                        <div>
                          <div className="mb-0.5">ALT</div>
                          <div className="font-mono text-white">{x.a}</div>
                        </div>
                        <div>
                          <div className="mb-0.5">AZ</div>
                          <div className="font-mono text-white">{x.az}</div>
                        </div>
                        <div className="text-right">
                          <div className="mb-0.5">DIST</div>
                          <div className="font-mono text-white">{x.r}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 flex w-full items-center justify-center gap-1 border-t border-white/10 py-2 text-[7px] tracking-widest text-indigo-400 uppercase transition-colors hover:text-white">
                VIEW ALL OBJECTS <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {/* Upcoming Events */}
            <div className="flex-1 rounded-xl border border-white/5 bg-[#040C1A] p-4">
              <div className="mb-4 border-b border-white/10 pb-3 text-[9px] font-bold tracking-widest text-white uppercase">
                UPCOMING EVENTS
              </div>
              <div className="space-y-4">
                {[
                  {
                    t: "PERSEID METEOR SHOWER",
                    d: "12-13 Aug 2026",
                    time: "PEAK",
                    c: "text-amber-400",
                    i: CloudLightning,
                  },
                  {
                    t: "MOON - JUPITER CONJUNCTION",
                    d: "14 Aug 2026",
                    time: "03:30 UTC",
                    c: "text-white",
                    i: Moon,
                  },
                  {
                    t: "MARS OPPOSITION",
                    d: "21 Aug 2026",
                    time: "08:22 UTC",
                    c: "text-rose-500",
                    i: Globe,
                  },
                  {
                    t: "NEW MOON",
                    d: "23 Aug 2026",
                    time: "08:06 UTC",
                    c: "text-[#8F9FB3]",
                    i: CircleDot,
                  },
                  {
                    t: "SATURN AT OPPOSITION",
                    d: "27 Aug 2026",
                    time: "05:12 UTC",
                    c: "text-orange-400",
                    i: Globe,
                  },
                ].map((x, i) => (
                  <div
                    key={i}
                    className="group flex cursor-pointer items-center justify-between text-[10px]"
                  >
                    <div className="flex items-center gap-3">
                      <x.i
                        className={`h-4 w-4 ${x.c} transition-transform group-hover:scale-110`}
                      />
                      <div>
                        <div className="mb-0.5 text-[8px] leading-tight font-bold tracking-widest text-white uppercase transition-colors group-hover:text-indigo-300">
                          {x.t}
                        </div>
                        <div className="font-mono text-[7px] text-[#8F9FB3]">
                          {x.d}
                        </div>
                      </div>
                    </div>
                    <div className="font-mono text-[9px] text-white group-hover:text-indigo-300">
                      {x.time}
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-5 flex w-full items-center justify-center gap-1 border-t border-white/10 py-2 text-[7px] tracking-widest text-indigo-400 uppercase transition-colors hover:text-white">
                VIEW ALL EVENTS <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* ═══ BOTTOM ROW GRID (12 Cols) ═══ */}
        <div className="grid shrink-0 grid-cols-1 gap-4 md:grid-cols-12">
          {/* Deep Sky */}
          <div className="flex flex-col rounded-xl border border-white/5 bg-[#040C1A] p-4 md:col-span-3">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3 text-[9px] font-bold tracking-widest text-white uppercase">
              <span>DEEP SKY HIGHLIGHTS</span>
              <span className="cursor-pointer text-[7px] text-[#8F9FB3] transition-colors hover:text-white">
                VIEW ALL
              </span>
            </div>
            <div className="flex-1 space-y-3">
              {[
                { n: "Andromeda Galaxy (M31)", dist: "2.54 Mly", m: "3.4" },
                { n: "Orion Nebula (M42)", dist: "1,344 ly", m: "4.0" },
                { n: "Pleiades (M45)", dist: "444 ly", m: "1.6" },
                { n: "Sombrero Galaxy (M104)", dist: "28.7 Mly", m: "8.0" },
              ].map((x, i) => (
                <div
                  key={i}
                  className="group flex cursor-pointer items-center gap-2"
                >
                  <div className="relative h-7 w-10 shrink-0 overflow-hidden rounded border border-white/10 bg-black">
                    <img
                      src="/assets/deep_sky.png"
                      className="h-full w-full scale-150 object-cover mix-blend-screen transition-transform group-hover:scale-125"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[9px] text-white transition-colors group-hover:text-indigo-300">
                      {x.n}
                    </div>
                    <div className="font-mono text-[7px] text-[#8F9FB3]">
                      {x.dist}
                    </div>
                  </div>
                  <div className="font-mono text-[7px] whitespace-nowrap text-white">
                    MAG {x.m}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pulsar Monitor */}
          <div className="flex flex-col rounded-xl border border-white/5 bg-[#040C1A] p-4 md:col-span-3">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3 text-[9px] font-bold tracking-widest text-white uppercase">
              <span>PULSAR MONITOR</span>
              <span className="cursor-pointer text-[7px] text-[#8F9FB3] transition-colors hover:text-white">
                VIEW ALL
              </span>
            </div>
            <div className="flex-1">
              <div className="mb-2 grid grid-cols-12 gap-2 text-[6px] tracking-widest text-[#8F9FB3] uppercase">
                <div className="col-span-5">PULSAR</div>
                <div className="col-span-3">PERIOD</div>
                <div className="col-span-2">MAG</div>
                <div className="col-span-2 text-right">STATUS</div>
              </div>
              <div className="space-y-2.5">
                {[
                  {
                    n: "PSR B0833-45 (Vela)",
                    p: "89 ms",
                    m: "23.6",
                    s: "STABLE",
                    sc: "text-emerald-400",
                  },
                  {
                    n: "PSR B1937+21",
                    p: "1.56 ms",
                    m: "23.8",
                    s: "STABLE",
                    sc: "text-emerald-400",
                  },
                  {
                    n: "PSR J0437-4715",
                    p: "5.76 ms",
                    m: "24.1",
                    s: "MONITOR",
                    sc: "text-amber-400",
                  },
                  {
                    n: "PSR B0531+21 (Crab)",
                    p: "33 ms",
                    m: "16.5",
                    s: "ACTIVE",
                    sc: "text-emerald-400",
                  },
                  {
                    n: "PSR J0737-3039A",
                    p: "22.7 ms",
                    m: "23.4",
                    s: "STABLE",
                    sc: "text-emerald-400",
                  },
                ].map((x, i) => (
                  <div
                    key={i}
                    className="-mx-1 grid cursor-pointer grid-cols-12 items-center gap-2 rounded px-1 py-0.5 text-[8px] transition-colors hover:bg-white/5"
                  >
                    <div className="col-span-5 truncate text-white">{x.n}</div>
                    <div className="col-span-3 font-mono text-white">{x.p}</div>
                    <div className="col-span-2 font-mono text-white">{x.m}</div>
                    <div
                      className={`col-span-2 text-right text-[6px] font-bold tracking-widest uppercase ${x.sc} flex items-center justify-end gap-1`}
                    >
                      {x.s === "ACTIVE" && (
                        <div className="h-1 w-1 animate-pulse rounded-full bg-emerald-500" />
                      )}
                      {x.s}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div className="flex flex-col rounded-xl border border-white/5 bg-[#040C1A] p-4 md:col-span-2">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3 text-[9px] font-bold tracking-widest text-white uppercase">
              <span>CONSTELLATION ALERTS</span>
              <span className="cursor-pointer text-[7px] text-[#8F9FB3] transition-colors hover:text-white">
                VIEW ALL
              </span>
            </div>
            <div className="flex-1 space-y-3">
              <div className="group flex cursor-pointer items-start gap-2">
                <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-amber-500 transition-transform group-hover:scale-110" />
                <div className="flex-1">
                  <div className="mb-0.5 flex items-center justify-between">
                    <span className="text-[9px] font-bold tracking-widest text-white uppercase transition-colors group-hover:text-amber-400">
                      DRACO
                    </span>
                    <span className="rounded border border-amber-500/20 bg-amber-500/20 px-1 py-0.5 text-[6px] font-bold text-amber-500">
                      MEDIUM
                    </span>
                  </div>
                  <div className="text-[7px] text-[#8F9FB3]">
                    Anomali pergerakan bintang terdeteksi
                  </div>
                  <div className="mt-0.5 font-mono text-[6px] text-white/40">
                    12 Aug 2026 18:22 UTC
                  </div>
                </div>
              </div>
              <div className="group flex cursor-pointer items-start gap-2">
                <Activity className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500 transition-transform group-hover:scale-110" />
                <div className="flex-1">
                  <div className="mb-0.5 flex items-center justify-between">
                    <span className="text-[9px] font-bold tracking-widest text-white uppercase transition-colors group-hover:text-emerald-400">
                      ORION
                    </span>
                    <span className="rounded border border-emerald-500/20 bg-emerald-500/20 px-1 py-0.5 text-[6px] font-bold text-emerald-500">
                      LOW
                    </span>
                  </div>
                  <div className="text-[7px] text-[#8F9FB3]">
                    Peningkatan aktivitas nebulosa
                  </div>
                  <div className="mt-0.5 font-mono text-[6px] text-white/40">
                    12 Aug 2026 15:47 UTC
                  </div>
                </div>
              </div>
              <div className="group flex cursor-pointer items-start gap-2">
                <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-rose-500 transition-transform group-hover:scale-110" />
                <div className="flex-1">
                  <div className="mb-0.5 flex items-center justify-between">
                    <span className="text-[9px] font-bold tracking-widest text-white uppercase transition-colors group-hover:text-rose-400">
                      SCORPIUS
                    </span>
                    <span className="rounded border border-rose-500/20 bg-rose-500/20 px-1 py-0.5 text-[6px] font-bold text-rose-500">
                      HIGH
                    </span>
                  </div>
                  <div className="text-[7px] text-[#8F9FB3]">
                    Perubahan kecerlangan Antares
                  </div>
                  <div className="mt-0.5 font-mono text-[6px] text-white/40">
                    12 Aug 2026 14:11 UTC
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Indices */}
          <div className="flex flex-col rounded-xl border border-white/5 bg-[#040C1A] p-4 md:col-span-2">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3 text-[9px] font-bold tracking-widest text-white uppercase">
              <span>ASTRONOMICAL INDICES</span>
            </div>
            <div className="flex-1 space-y-4">
              {[
                { l: "Kp Index", v: "1.67", s: "LOW", sc: "text-[#00aaff]" },
                {
                  l: "Solar Flux (F10.7)",
                  v: "143 sfu",
                  s: "NORMAL",
                  sc: "text-emerald-400",
                },
                {
                  l: "Aurora Probability",
                  v: "12%",
                  s: "LOW",
                  sc: "text-[#00aaff]",
                },
                {
                  l: "Geomagnetic Field (nT)",
                  v: "-18.6",
                  s: "NORMAL",
                  sc: "text-emerald-400",
                },
                {
                  l: "Cosmic Ray Flux",
                  v: "3820",
                  s: "NORMAL",
                  sc: "text-emerald-400",
                },
              ].map((x, i) => (
                <div
                  key={i}
                  className="-mx-1 flex cursor-pointer items-center justify-between rounded px-1 py-0.5 text-[9px] transition-colors hover:bg-white/5"
                >
                  <div className="text-[#8F9FB3]">{x.l}</div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-white">{x.v}</span>
                    <span
                      className={`text-[6px] font-bold tracking-widest uppercase ${x.sc} w-8 text-right`}
                    >
                      {x.s}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-2 flex w-full items-center justify-center gap-1 border-t border-white/10 py-2 text-[7px] tracking-widest text-indigo-400 uppercase transition-colors hover:text-white">
              VIEW FULL INDICES <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          {/* Quick Nav */}
          <div className="flex flex-col rounded-xl border border-white/5 bg-[#040C1A] p-4 md:col-span-2">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3 text-[9px] font-bold tracking-widest text-white uppercase">
              <span>QUICK NAVIGATION</span>
            </div>
            <div className="grid flex-1 grid-cols-4 gap-2">
              {[
                { l: "SOLAR SYSTEM", i: Sun },
                { l: "STAR CATALOG", i: Crosshair },
                { l: "GALAXY MAP", i: Globe },
                { l: "ORBIT SIMULATOR", i: TargetIcon },
                { l: "TELESCOPE VIEW", i: Telescope },
                { l: "MISSION CONTROL", i: Rocket },
                { l: "SPACE WEATHER", i: CloudLightning },
                { l: "DATA ARCHIVE", i: Database },
              ].map((x, i) => (
                <div
                  key={i}
                  className="group flex h-14 cursor-pointer flex-col items-center justify-center gap-2 rounded border border-white/5 p-2 text-center transition-all hover:border-indigo-500/30 hover:bg-white/5"
                >
                  <x.i className="h-4 w-4 text-[#8F9FB3] transition-all group-hover:scale-110 group-hover:text-indigo-400" />
                  <div className="text-[5px] leading-tight tracking-widest text-[#8F9FB3] uppercase group-hover:text-white">
                    {x.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ FOOTER ═══ */}
        <div className="flex shrink-0 items-center justify-between px-2 pt-2 text-[7px] tracking-widest text-[#8F9FB3] uppercase">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />{" "}
              CONNECTED TO ASTRONOMICAL NETWORK
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="h-2.5 w-2.5" /> LATENCY{" "}
              <span className="font-mono text-white">42ms</span>
            </div>
          </div>
          <div className="font-bold tracking-[0.3em] opacity-50">
            "WHEN THE MOON WITNESSES, WE SHARE MESSAGES."
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> DATA
              SYNCHRONIZED
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-2.5 w-2.5" />{" "}
              <span className="font-mono text-white">{timeString} UTC+0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TargetIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}
