"use client"

import React, { useRef, useEffect, useState } from "react"
import { Activity, ShieldAlert, Radio, Globe2 } from "lucide-react"

export interface SeismicEventItem {
  id: string
  location: string
  magnitude: number
  depthKm: number
  timestamp: string
  lat: number
  lng: number
}

export interface SeismicTectonicRadarProps {
  events?: SeismicEventItem[]
  height?: number
  className?: string
}

const DEFAULT_EVENTS: SeismicEventItem[] = [
  { id: "EQ-1", location: "Sunda Trench, Java", magnitude: 6.2, depthKm: 24, timestamp: "12m ago", lat: -7.5, lng: 106.8 },
  { id: "EQ-2", location: "Ring of Fire, Moluccas", magnitude: 5.4, depthKm: 10, timestamp: "48m ago", lat: 1.2, lng: 127.5 },
  { id: "EQ-3", location: "Pacific Rim, Honshu", magnitude: 4.9, depthKm: 35, timestamp: "2h ago", lat: 38.2, lng: 142.3 },
  { id: "EQ-4", location: "Anatolian Fault, Turkey", magnitude: 5.1, depthKm: 14, timestamp: "3h ago", lat: 37.8, lng: 35.4 },
]

export function SeismicTectonicRadar({
  events = DEFAULT_EVENTS,
  height = 360,
  className = "",
}: SeismicTectonicRadarProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [activeEvent, setActiveEvent] = useState<SeismicEventItem>(events[0] || DEFAULT_EVENTS[0]!)
  const [radarAngle, setRadarAngle] = useState(0)

  // Radar sweep animation
  useEffect(() => {
    let animId: number
    const animate = () => {
      setRadarAngle((prev) => (prev + 1.5) % 360)
      animId = requestAnimationFrame(animate)
    }
    animId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animId)
  }, [])

  // Render Radar Canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1
    const width = canvas.parentElement?.clientWidth || 600
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, width, height)

    const cx = width / 2
    const cy = height / 2
    const maxRadius = Math.min(width, height) / 2 - 20

    // 1. Grid Rings
    ctx.strokeStyle = "rgba(0, 240, 255, 0.12)"
    ctx.lineWidth = 1
    for (let r = maxRadius / 4; r <= maxRadius; r += maxRadius / 4) {
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.stroke()
    }

    // 2. Cross Axes
    ctx.beginPath()
    ctx.moveTo(cx - maxRadius, cy)
    ctx.lineTo(cx + maxRadius, cy)
    ctx.moveTo(cx, cy - maxRadius)
    ctx.lineTo(cx, cy + maxRadius)
    ctx.stroke()

    // 3. Radar Sweep Line & Sector
    const rad = (radarAngle * Math.PI) / 180
    const sweepX = cx + Math.cos(rad) * maxRadius
    const sweepY = cy + Math.sin(rad) * maxRadius

    const sweepGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius)
    sweepGrad.addColorStop(0, "rgba(0, 240, 255, 0.25)")
    sweepGrad.addColorStop(1, "rgba(0, 240, 255, 0)")

    ctx.save()
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, maxRadius, rad - 0.4, rad)
    ctx.closePath()
    ctx.fillStyle = sweepGrad
    ctx.fill()
    ctx.restore()

    ctx.strokeStyle = "#00F0FF"
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(sweepX, sweepY)
    ctx.stroke()

    // 4. Render Epicenter Pulse Dots
    events.forEach((ev, idx) => {
      // Map lat/lng roughly to radar circular coordinates
      const ex = cx + ((ev.lng - 100) / 180) * (maxRadius * 0.75)
      const ey = cy + ((-ev.lat) / 90) * (maxRadius * 0.75)

      const isHighMag = ev.magnitude >= 6.0
      ctx.fillStyle = isHighMag ? "#FF0055" : "#FFE600"
      ctx.shadowColor = isHighMag ? "#FF0055" : "#FFE600"
      ctx.shadowBlur = 10

      ctx.beginPath()
      ctx.arc(ex, ey, ev.magnitude * 1.5, 0, Math.PI * 2)
      ctx.fill()

      // Pulse Ring
      ctx.strokeStyle = isHighMag ? "rgba(255, 0, 85, 0.4)" : "rgba(255, 230, 0, 0.3)"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(ex, ey, (ev.magnitude * 2.5 + (radarAngle % 20)) % 30, 0, Math.PI * 2)
      ctx.stroke()
    })
  }, [radarAngle, height, events])

  return (
    <div className={`flex flex-col font-mono ${className}`}>
      {/* Radar Canvas Container */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-cyan-500/30 bg-[#040812]/90 shadow-[0_0_40px_rgba(0,240,255,0.15)]">
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height }}
          className="block"
        />

        {/* Live Radar Watermark */}
        <div className="absolute top-4 left-4 flex items-center gap-2 text-xs font-bold text-cyan-400">
          <Radio className="h-4 w-4 animate-pulse" />
          <span>SEISMIX TECTONIC RADAR</span>
        </div>

        <div className="absolute top-4 right-4 flex items-center gap-2 text-[10px] text-zinc-400 bg-black/60 px-2.5 py-1 rounded-lg border border-white/10">
          <Activity className="h-3 w-3 text-emerald-400" />
          <span>REAL-TIME SENSORS ACTIVE</span>
        </div>
      </div>

      {/* Epicenter Event Feed Cards */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {events.map((ev) => (
          <button
            key={ev.id}
            onClick={() => setActiveEvent(ev)}
            className={`p-3 rounded-xl border text-left transition-all ${
              activeEvent.id === ev.id
                ? "border-cyan-400 bg-cyan-950/30 text-white shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                : "border-white/10 bg-cyber-panel/80 text-zinc-400 hover:border-cyan-500/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-500">{ev.id}</span>
              <span
                className={`text-xs font-black px-1.5 py-0.5 rounded ${
                  ev.magnitude >= 6.0
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}
              >
                M {ev.magnitude}
              </span>
            </div>
            <div className="mt-2 text-xs font-bold text-zinc-200 truncate">{ev.location}</div>
            <div className="mt-1 flex items-center justify-between text-[10px] text-zinc-500">
              <span>Depth: {ev.depthKm} km</span>
              <span>{ev.timestamp}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}