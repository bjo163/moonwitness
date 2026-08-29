"use client"

import React, { useRef, useEffect, useState, useCallback } from "react"
import { Orbit, Sparkles, Compass } from "lucide-react"

export interface CelestialMoonSphereProps {
  phase?: number // 0.0 to 1.0 (0: New Moon, 0.25: First Quarter, 0.5: Full Moon, 0.75: Third Quarter)
  size?: number
  interactive?: boolean
  showTelemetry?: boolean
  glowColor?: string
  className?: string
}

export function CelestialMoonSphere({
  phase = 0.48, // Default ~Almost Full Moon
  size = 260,
  interactive = true,
  showTelemetry = true,
  glowColor = "#00F0FF",
  className = "",
}: CelestialMoonSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  // Calculate Hijri Day from Phase
  const hijriDay = Math.min(30, Math.max(1, Math.round(phase * 29.53) + 1))
  const illuminationPercent = Math.round((1 - Math.cos(phase * 2 * Math.PI)) * 50)

  const getPhaseName = (p: number) => {
    if (p < 0.03 || p > 0.97) return "NEW MOON (HILAL AWAL)"
    if (p < 0.22) return "WAXING CRESCENT (HILAL MUDA)"
    if (p < 0.28) return "FIRST QUARTER (TARBI' AWAL)"
    if (p < 0.47) return "WAXING GIBBOUS (BIMA' AWAL)"
    if (p < 0.53) return "FULL MOON (PURNAMA BADR)"
    if (p < 0.72) return "WANING GIBBOUS (BIMA' AKHIR)"
    if (p < 0.78) return "THIRD QUARTER (TARBI' AKHIR)"
    return "WANING CRESCENT (HILAL AKHIR)"
  }

  // Draw Realistic Photometric Terminator
  const renderMoon = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const radius = (size / 2) * 0.82

    ctx.clearRect(0, 0, size, size)

    // 1. celestial Atmosphere Outer ambient
    const outerGlow = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius * 1.35)
    outerGlow.addColorStop(0, "rgba(0, 240, 255, 0.15)")
    outerGlow.addColorStop(0.5, "rgba(0, 240, 255, 0.04)")
    outerGlow.addColorStop(1, "rgba(0, 0, 0, 0)")
    ctx.fillStyle = outerGlow
    ctx.beginPath()
    ctx.arc(cx, cy, radius * 1.35, 0, Math.PI * 2)
    ctx.fill()

    // 2. Dark Moon Sphere Base (Night Side)
    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.clip()

    const darkGrad = ctx.createRadialGradient(cx - radius * 0.2, cy - radius * 0.2, 0, cx, cy, radius)
    darkGrad.addColorStop(0, "#151D2A")
    darkGrad.addColorStop(0.7, "#0B1017")
    darkGrad.addColorStop(1, "#03060A")
    ctx.fillStyle = darkGrad
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)

    // 3. Realistic Mare & Crater Synthesizer (Simulated procedural texture)
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)"
    const craters = [
      { x: cx - 0.2 * radius, y: cy - 0.3 * radius, r: radius * 0.28 },
      { x: cx + 0.35 * radius, y: cy - 0.15 * radius, r: radius * 0.22 },
      { x: cx - 0.1 * radius, y: cy + 0.25 * radius, r: radius * 0.32 },
      { x: cx + 0.25 * radius, y: cy + 0.35 * radius, r: radius * 0.2 },
      { x: cx - 0.45 * radius, y: cy + 0.1 * radius, r: radius * 0.15 },
    ]
    craters.forEach((c) => {
      ctx.beginPath()
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2)
      ctx.fill()
    })

    // 4. Illumination Phase Geometry (Terminator Line Curve)
    const normalizedPhase = phase % 1.0
    const phi = normalizedPhase * 2 * Math.PI

    ctx.fillStyle = "#E6F8FF"
    ctx.shadowColor = glowColor
    ctx.shadowBlur = 18

    // Build lit hemisphere arc
    ctx.beginPath()
    if (normalizedPhase <= 0.5) {
      // Waxing (Right side illuminated)
      ctx.arc(cx, cy, radius, -Math.PI / 2, Math.PI / 2, false)
      const terminatorWidth = radius * Math.cos(phi)
      ctx.ellipse(cx, cy, Math.abs(terminatorWidth), radius, 0, Math.PI / 2, -Math.PI / 2, terminatorWidth < 0)
    } else {
      // Waning (Left side illuminated)
      ctx.arc(cx, cy, radius, Math.PI / 2, -Math.PI / 2, false)
      const terminatorWidth = radius * Math.cos(phi)
      ctx.ellipse(cx, cy, Math.abs(terminatorWidth), radius, 0, -Math.PI / 2, Math.PI / 2, terminatorWidth < 0)
    }
    ctx.closePath()

    // Lit gradient with photometric limb brightening
    const litGrad = ctx.createRadialGradient(
      normalizedPhase < 0.5 ? cx + radius * 0.4 : cx - radius * 0.4,
      cy - radius * 0.3,
      0,
      cx,
      cy,
      radius
    )
    litGrad.addColorStop(0, "#FFFFFF")
    litGrad.addColorStop(0.4, "#D6F2FE")
    litGrad.addColorStop(0.85, "#80D2F4")
    litGrad.addColorStop(1, "#3892BF")
    ctx.fillStyle = litGrad
    ctx.fill()

    // Subtle Surface Detail Layer on Lit side
    ctx.fillStyle = "rgba(10, 20, 30, 0.15)"
    craters.forEach((c) => {
      ctx.beginPath()
      ctx.arc(c.x, c.y, c.r * 0.9, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.restore()

    // 5. Optical Rim Ring
    ctx.strokeStyle = "rgba(0, 240, 255, 0.3)"
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.stroke()
  }, [phase, size, glowColor])

  useEffect(() => {
    renderMoon()
  }, [renderMoon])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    setRotation({ x: -y * 12, y: x * 12 })
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
    setIsHovered(false)
  }

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 800,
      }}
    >
      {/* 3D Dynamic Tilt Wrapper */}
      <div
        className="relative transition-transform duration-200 ease-out"
        style={{
          width: size,
          height: size,
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: size, height: size }}
          className="relative z-10 block cursor-crosshair"
        />

        {/* Orbit Crosshair Overlay on Hover */}
        {isHovered && interactive && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center animate-in fade-in duration-300">
            <div className="h-full w-full rounded-full border border-border border-dashed animate-spin [animation-duration:40s]" />
            <div className="absolute h-4 w-4 border-t border-l border-border" />
            <div className="absolute h-4 w-4 border-b border-r border-border" />
          </div>
        )}
      </div>

      {/* Telemetry Readout */}
      {showTelemetry && (
        <div className="mt-4 flex flex-col items-center gap-1 font-mono">
          <div className="flex items-center gap-2 text-[10px] tracking-widest text-primary uppercase">
            <Orbit className="h-3 w-3 animate-spin [animation-duration:12s]" />
            <span>{getPhaseName(phase)}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span>DAY • {hijriDay} HIJRI</span>
            <span className="text-zinc-600">|</span>
            <span className="text-emerald-400 font-bold">{illuminationPercent}% LIT</span>
          </div>
        </div>
      )}
    </div>
  )
}