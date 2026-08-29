"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  Activity,
  Zap,
  Layers,
  BarChart3,
  AlertTriangle,
  Globe,
  Clock,
  TrendingUp,
  Waves,
  MapPin,
  ChevronRight,
  Radio,
} from "lucide-react"
import { ContextBlock } from "@workspace/ui"
import { Panel, PanelHeader } from "@workspace/ui"
import { Stat } from "@workspace/ui"
import { SimpleTabs } from "@workspace/ui"
import { useResource } from "@workspace/hooks"
import { fetchEarthquakes } from "@moon/client"

// ── SEISMIC CONSTANTS ────────────────────────────────────
const CANVAS_HEIGHT = 200
const WAVE_COLORS = {
  pWave: "#00F0FF",
  sWave: "#FFE600",
  surface: "#FF0055",
} as const

const MAGNITUDE_THRESHOLD = {
  minor: 3.0,
  moderate: 5.0,
  strong: 7.0,
} as const

type SeismicEvent = {
  id: string
  location: string
  magnitude: number
  depth: number
  timestamp: string
  type: "tectonic" | "volcanic" | "collapse"
  coordinates: { lat: number; lng: number }
}

type WaveformPoint = {
  x: number
  y: number
  amplitude: number
}

// ── CANONICAL FALLBACK SEISMIC DATA ──────────────────────
const DEFAULT_RECENT_EVENTS: SeismicEvent[] = [
  {
    id: "SEQ-2026-08-001",
    location: "PACIFIC RING OF FIRE — TONGA TRENCH",
    magnitude: 6.2,
    depth: 45,
    timestamp: "2026-08-13T02:14:00Z",
    type: "tectonic",
    coordinates: { lat: -20.5, lng: -175.4 },
  },
  {
    id: "SEQ-2026-08-002",
    location: "JAVA SEA — SUNDA STRAIT",
    magnitude: 4.8,
    depth: 120,
    timestamp: "2026-08-13T01:45:00Z",
    type: "volcanic",
    coordinates: { lat: -6.1, lng: 105.4 },
  },
  {
    id: "SEQ-2026-08-003",
    location: "ANATOLIAN FAULT — TURKEY",
    magnitude: 3.5,
    depth: 15,
    timestamp: "2026-08-12T22:30:00Z",
    type: "tectonic",
    coordinates: { lat: 39.9, lng: 32.9 },
  },
  {
    id: "SEQ-2026-08-004",
    location: "MID-ATLANTIC RIDGE",
    magnitude: 5.1,
    depth: 33,
    timestamp: "2026-08-12T19:12:00Z",
    type: "tectonic",
    coordinates: { lat: 28.4, lng: -43.7 },
  },
  {
    id: "SEQ-2026-08-005",
    location: "MOUNT MERAPI — CENTRAL JAVA",
    magnitude: 2.8,
    depth: 5,
    timestamp: "2026-08-12T17:55:00Z",
    type: "volcanic",
    coordinates: { lat: -7.5, lng: 110.4 },
  },
]

const TECTONIC_STATS = {
  totalEvents24h: 142,
  avgMagnitude: 3.7,
  maxDepth: 680,
  activeZones: 23,
  pWaveVelocity: "6.5 km/s",
  sWaveVelocity: "3.5 km/s",
} as const

// ── SEISMOGRAPH CANVAS ───────────────────────────────────
function SeismographCanvas({
  isActive,
  waveType,
}: {
  isActive: boolean
  waveType: "pWave" | "sWave" | "surface"
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const offsetRef = useRef(0)

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    const mid = h / 2

    ctx.clearRect(0, 0, w, h)

    // Grid lines
    ctx.strokeStyle = "rgba(0, 240, 255, 0.06)"
    ctx.lineWidth = 0.5
    const gridStep = 20
    for (let gy = 0; gy < h; gy += gridStep) {
      ctx.beginPath()
      ctx.moveTo(0, gy)
      ctx.lineTo(w, gy)
      ctx.stroke()
    }
    for (let gx = 0; gx < w; gx += gridStep) {
      ctx.beginPath()
      ctx.moveTo(gx, 0)
      ctx.lineTo(gx, h)
      ctx.stroke()
    }

    // Center reference line
    ctx.strokeStyle = "rgba(0, 240, 255, 0.15)"
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(0, mid)
    ctx.lineTo(w, mid)
    ctx.stroke()
    ctx.setLineDash([])

    if (!isActive) return

    const color = WAVE_COLORS[waveType]

    // Waveform parameters per type
    const params = {
      pWave: { freq: 0.04, amp: 35, speed: 3, noise: 5 },
      sWave: { freq: 0.025, amp: 55, speed: 2, noise: 12 },
      surface: { freq: 0.015, amp: 70, speed: 1.2, noise: 20 },
    }

    const p = params[waveType]
    offsetRef.current += p.speed

    // Draw waveform
    ctx.strokeStyle = color
    ctx.lineWidth = 1.5
    ctx.shadowColor = color
    ctx.shadowBlur = 8
    ctx.beginPath()

    for (let x = 0; x < w; x++) {
      const base = Math.sin((x + offsetRef.current) * p.freq) * p.amp
      const harmonic =
        Math.sin((x + offsetRef.current) * p.freq * 2.7) * (p.amp * 0.3)
      const noise = (Math.random() - 0.5) * p.noise
      const decay = 1 - (Math.abs(x - w / 2) / (w / 2)) * 0.3
      const y = mid + (base + harmonic + noise) * decay

      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.shadowBlur = 0

    // Glow fill beneath
    ctx.globalAlpha = 0.05
    ctx.fillStyle = color
    ctx.lineTo(w, h)
    ctx.lineTo(0, h)
    ctx.closePath()
    ctx.fill()
    ctx.globalAlpha = 1

    animationRef.current = requestAnimationFrame(drawWaveform)
  }, [isActive, waveType])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const parent = canvas.parentElement
    if (parent) {
      canvas.width = parent.clientWidth
      canvas.height = CANVAS_HEIGHT
    }

    if (isActive) {
      animationRef.current = requestAnimationFrame(drawWaveform)
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isActive, drawWaveform])

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height: `${CANVAS_HEIGHT}px` }}
    />
  )
}

// ── MAGNITUDE BADGE ──────────────────────────────────────
function MagnitudeBadge({ magnitude }: { magnitude: number }) {
  const getLevel = () => {
    if (magnitude >= MAGNITUDE_THRESHOLD.strong)
      return { label: "SEVERE", color: "#FF0055", glow: "rgba(255,0,85,0.4)" }
    if (magnitude >= MAGNITUDE_THRESHOLD.moderate)
      return { label: "STRONG", color: "#FFE600", glow: "rgba(255,230,0,0.3)" }
    if (magnitude >= MAGNITUDE_THRESHOLD.minor)
      return {
        label: "MODERATE",
        color: "#FF9900",
        glow: "rgba(255,153,0,0.25)",
      }
    return { label: "MINOR", color: "#00FF66", glow: "rgba(0,255,102,0.2)" }
  }

  const level = getLevel()

  return (
    <div
      className="tag-clip flex items-center gap-1.5 border px-2 py-1 font-mono text-[9px] font-bold tracking-widest"
      style={{
        color: level.color,
        borderColor: `${level.color}50`,
        background: `${level.color}12`,
        boxShadow: `0 0 15px ${level.glow}`,
      }}
    >
      <span
        className="h-1.5 w-1.5 animate-pulse rounded-full"
        style={{ background: level.color }}
      />
      M {magnitude.toFixed(1)} • {level.label}
    </div>
  )
}

// ── EVENT CARD ───────────────────────────────────────────
function EventCard({ event }: { event: SeismicEvent }) {
  const typeColors = {
    tectonic: "#00F0FF",
    volcanic: "#FF9900",
    collapse: "#A100FF",
  } as const

  const color = typeColors[event.type]
  const timeAgo = getTimeAgo(event.timestamp)

  return (
    <div
      className="rounded-xl border border-border/40 bg-card/90 bg-background/80 group border p-4 transition-all duration-300 hover:-translate-y-0.5"
      style={{
        borderColor: `${color}25`,
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="tag-clip flex h-6 w-6 items-center justify-center border"
            style={{
              borderColor: `${color}50`,
              background: `${color}15`,
            }}
          >
            <Activity className="h-3 w-3" style={{ color }} />
          </div>
          <span
            className="font-mono text-[9px] font-bold tracking-widest uppercase"
            style={{ color }}
          >
            {event.type}
          </span>
        </div>
        <MagnitudeBadge magnitude={event.magnitude} />
      </div>

      <h4 className="mb-2 text-xs font-bold tracking-wider text-foreground uppercase">
        {event.location}
      </h4>

      <div className="flex flex-wrap items-center gap-3 font-mono text-[9px] text-primary">
        <span className="flex items-center gap-1">
          <Layers className="h-3 w-3" />
          DEPTH {event.depth} KM
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {timeAgo}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {event.coordinates.lat.toFixed(1)}°,{" "}
          {event.coordinates.lng.toFixed(1)}°
        </span>
      </div>

      <div
        className="mt-3 flex items-center gap-1 font-mono text-[8px] font-bold tracking-widest opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ color }}
      >
        ANALYZE WAVEFORM <ChevronRight className="h-3 w-3" />
      </div>
    </div>
  )
}

// ── SEISMIC PULSE RING ───────────────────────────────────
function PulseRing() {
  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-full border"
          style={{
            borderColor: "rgba(255, 230, 0, 0.15)",
            animation: `seismicPulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
            animationDelay: `${i * 1}s`,
          }}
        />
      ))}
      <div
        className="tag-clip flex h-14 w-14 items-center justify-center border-2"
        style={{
          borderColor: "rgba(255, 230, 0, 0.6)",
          background: "rgba(255, 230, 0, 0.1)",
          boxShadow: "0 0 30px rgba(255, 230, 0, 0.25)",
        }}
      >
        <Activity className="h-6 w-6 text-amber-500" />
      </div>
    </div>
  )
}

// ── HELPERS ──────────────────────────────────────────────
function getTimeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime()
  const hours = Math.floor(diff / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  if (hours > 0) return `${hours}H ${minutes}M AGO`
  return `${minutes}M AGO`
}

// ── MAIN VIEW ────────────────────────────────────────────
export function SeismicForgeView() {
  const { data: earthquakeData } = useResource(fetchEarthquakes, { storageKey: "mw_seismic_forge" })

  const liveEvents: SeismicEvent[] = earthquakeData?.features?.length
    ? earthquakeData.features.slice(0, 6).map((f: any, idx: number) => {
        const mag = f.properties?.mag || 0
        const place = f.properties?.place || "Global Seismic Region"
        const depth = f.geometry?.coordinates?.[2] || 10
        const lng = f.geometry?.coordinates?.[0] || 0
        const lat = f.geometry?.coordinates?.[1] || 0
        return {
          id: f.id || `SEQ-LIVE-${idx + 1}`,
          location: String(place).toUpperCase(),
          magnitude: Number(mag.toFixed(1)),
          depth: Math.round(depth),
          timestamp: new Date(f.properties?.time || Date.now()).toISOString(),
          type: mag >= 5.0 ? ("tectonic" as const) : ("volcanic" as const),
          coordinates: { lat, lng },
        }
      })
    : DEFAULT_RECENT_EVENTS

  const totalEvents24h = earthquakeData?.features?.length || TECTONIC_STATS.totalEvents24h
  const avgMagnitude = earthquakeData?.features?.length
    ? Number(
        (
          earthquakeData.features.reduce(
            (acc: number, cur: any) => acc + (cur.properties?.mag || 0),
            0
          ) / earthquakeData.features.length
        ).toFixed(1)
      )
    : TECTONIC_STATS.avgMagnitude

  const [activeWave, setActiveWave] = useState<"pWave" | "sWave" | "surface">(
    "pWave"
  )
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [systemTime, setSystemTime] = useState("")

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setSystemTime(now.toISOString().replace("T", " • ").slice(0, 21) + " UTC")
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  const waveTabs = [
    { id: "pWave", label: "P-WAVE", icon: Zap },
    { id: "sWave", label: "S-WAVE", icon: Waves },
    { id: "surface", label: "SURFACE", icon: Radio },
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 pb-20 sm:px-6">
      {/* ── CONTEXT BLOCK (H1) ─────────────────────────── */}
      <ContextBlock
        title="SEISMIX — SEISMIC SIMULATION FORGE"
        subtitle="Real-time seismic waveform analysis, tectonic monitoring, and earthquake intelligence telemetry. Module O-08 under Observatory family."
        operation="SEISMIC.FORGE"
        status={isMonitoring ? "MONITORING" : "STANDBY"}
        accentColor="accent"
      />

      {/* ── ZONE A: TELEMETRY STATS ────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Stat
          label="EVENTS 24H"
          value={totalEvents24h}
          trend="+12%"
          icon={Activity}
          accentColor="accent"
        />
        <Stat
          label="AVG MAGNITUDE"
          value={avgMagnitude}
          icon={BarChart3}
          accentColor="accent"
        />
        <Stat
          label="MAX DEPTH"
          value={`${TECTONIC_STATS.maxDepth} km`}
          icon={Layers}
          accentColor="system"
        />
        <Stat
          label="ACTIVE ZONES"
          value={TECTONIC_STATS.activeZones}
          trend="+3"
          icon={Globe}
          accentColor="warning"
        />
        <Stat
          label="P-WAVE VEL"
          value={TECTONIC_STATS.pWaveVelocity}
          icon={Zap}
          accentColor="system"
        />
        <Stat
          label="S-WAVE VEL"
          value={TECTONIC_STATS.sWaveVelocity}
          icon={Waves}
          accentColor="accent"
        />
      </div>

      {/* ── ZONE B: LIVE SEISMOGRAPH ───────────────────── */}
      <Panel level="level1" accentColor="accent">
        <PanelHeader
          title="LIVE SEISMOGRAPH"
          icon={Activity}
          status={isMonitoring ? "RECORDING" : "PAUSED"}
          accentColor="accent"
          subtitle="Real-time waveform capture from global seismic network sensors"
        />

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <SimpleTabs
            tabs={waveTabs}
            activeTab={activeWave}
            onChange={(id: string) =>
              setActiveWave(id as "pWave" | "sWave" | "surface")
            }
            accentColor="accent"
          />
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className="flex items-center gap-2 border px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest transition-all "
            style={{
              borderColor: isMonitoring
                ? "rgba(0, 255, 102, 0.4)"
                : "rgba(255, 0, 85, 0.4)",
              color: isMonitoring ? "#00FF66" : "#FF0055",
              background: isMonitoring
                ? "rgba(0, 255, 102, 0.08)"
                : "rgba(255, 0, 85, 0.08)",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: isMonitoring ? "#00FF66" : "#FF0055",
                animation: isMonitoring ? "pulse 2s infinite" : "none",
              }}
            />
            {isMonitoring ? "● LIVE" : "○ PAUSED"}
          </button>
        </div>

        {/* Canvas waveform */}
        <div
          className="relative overflow-hidden border"
          style={{
            borderColor: `${WAVE_COLORS[activeWave]}20`,
            background: "rgba(5, 7, 10, 0.8)",
          }}
        >
          <SeismographCanvas isActive={isMonitoring} waveType={activeWave} />

          {/* Waveform legend overlay */}
          <div className="absolute bottom-2 left-3 flex items-center gap-3 font-mono text-[8px] font-bold tracking-widest">
            <span style={{ color: WAVE_COLORS[activeWave] }}>
              ◉{" "}
              {activeWave === "pWave"
                ? "PRIMARY WAVE"
                : activeWave === "sWave"
                  ? "SECONDARY WAVE"
                  : "SURFACE WAVE"}
            </span>
            <span className="text-primary">SYS.TIME: {systemTime}</span>
          </div>
        </div>

        {/* Wave info cards */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              key: "pWave",
              label: "P-WAVE (PRIMARY)",
              desc: "Compressional longitudinal wave — fastest seismic wave, travels through all media",
              color: WAVE_COLORS.pWave,
              vel: "6-8 km/s",
            },
            {
              key: "sWave",
              label: "S-WAVE (SECONDARY)",
              desc: "Transverse shear wave — cannot propagate through liquids, slower than P-wave",
              color: WAVE_COLORS.sWave,
              vel: "3-5 km/s",
            },
            {
              key: "surface",
              label: "SURFACE WAVE",
              desc: "Rayleigh & Love waves — most destructive, largest amplitude near surface",
              color: WAVE_COLORS.surface,
              vel: "2-4 km/s",
            },
          ].map((w) => (
            <div
              key={w.key}
              className="rounded-xl border border-border/40 bg-card/90 border p-3 transition-all duration-300 hover:-translate-y-0.5"
              style={{
                borderColor:
                  activeWave === w.key ? `${w.color}50` : "rgba(0,240,255,0.1)",
                background:
                  activeWave === w.key ? `${w.color}08` : "transparent",
                boxShadow:
                  activeWave === w.key ? `0 0 20px ${w.color}15` : "none",
              }}
            >
              <div className="mb-1 flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: w.color }}
                />
                <span
                  className="font-mono text-[9px] font-bold tracking-widest"
                  style={{ color: w.color }}
                >
                  {w.label}
                </span>
              </div>
              <p className="mb-1 font-mono text-[8px] leading-relaxed text-primary">
                {w.desc}
              </p>
              <span
                className="font-mono text-[9px] font-bold"
                style={{ color: w.color }}
              >
                VELOCITY: {w.vel}
              </span>
            </div>
          ))}
        </div>
      </Panel>

      {/* ── ZONE C: RECENT SEISMIC EVENTS ──────────────── */}
      <Panel level="level2" accentColor="warning">
        <PanelHeader
          title="RECENT SEISMIC EVENTS"
          icon={AlertTriangle}
          status="LIVE"
          accentColor="warning"
          subtitle="Latest detected earthquake and volcanic activity worldwide"
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {liveEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </Panel>

      {/* ── ZONE D: PULSE RING + SYSTEM STATUS ─────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel level="level3" accentColor="accent" className="lg:col-span-1">
          <PanelHeader
            title="SEISMIC PULSE"
            icon={Radio}
            status="BROADCASTING"
            accentColor="accent"
          />
          <div className="flex flex-col items-center justify-center py-6">
            <PulseRing />
            <p className="mt-4 text-center font-mono text-[9px] leading-relaxed text-primary">
              GLOBAL SEISMIC NETWORK
              <br />
              <span className="font-bold text-foreground">
                347 STATIONS ONLINE
              </span>
            </p>
          </div>
        </Panel>

        <Panel level="level3" accentColor="system" className="lg:col-span-2">
          <PanelHeader
            title="CRUSTAL DYNAMICS MONITOR"
            icon={TrendingUp}
            status="ANALYZING"
            accentColor="system"
          />

          {/* Simplified magnitude distribution bars */}
          <div className="space-y-3">
            {[
              { range: "0.0 — 2.9", count: 87, pct: 61, color: "#00FF66" },
              { range: "3.0 — 4.9", count: 38, pct: 27, color: "#FFE600" },
              { range: "5.0 — 6.9", count: 14, pct: 10, color: "#FF9900" },
              { range: "7.0+", count: 3, pct: 2, color: "#FF0055" },
            ].map((row) => (
              <div key={row.range} className="space-y-1">
                <div className="flex items-center justify-between font-mono text-[9px]">
                  <span className="font-bold tracking-widest text-foreground">
                    M {row.range}
                  </span>
                  <span style={{ color: row.color }}>
                    {row.count} EVENTS ({row.pct}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden bg-white/5">
                  <div
                    className="h-full transition-all duration-1000"
                    style={{
                      width: `${row.pct}%`,
                      background: `linear-gradient(90deg, ${row.color}60, ${row.color})`,
                      boxShadow: `0 0 10px ${row.color}40`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-primary/10 pt-3">
            <p className="font-mono text-[8px] text-primary">
              DATA SOURCE: USGS EARTHQUAKE HAZARDS PROGRAM • IRIS DMC • GEOSCOPE
              NETWORK
              <br />
              <span className="text-foreground">LAST SYNC: {systemTime}</span>
            </p>
          </div>
        </Panel>
      </div>

      {/* ── KEYFRAME INJECTION ─────────────────────────── */}
      <style jsx>{`
        @keyframes seismicPulse {
          0% {
            transform: scale(0.5);
            opacity: 0.8;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
