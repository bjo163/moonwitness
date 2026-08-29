"use client"

import React, { useState, useEffect, useRef } from "react"
import { Compass, Navigation, MapPin, Sparkles, ShieldCheck } from "lucide-react"
import { DEFAULT_COORDINATES, SYSTEM_CONSTANTS } from "@workspace/types"

export interface CelestialQiblaCompassProps {
  userLatitude?: number
  userLongitude?: number
  cityName?: string
  size?: number
  className?: string
}

export function CelestialQiblaCompass({
  userLatitude = -6.1702, // Default: Jakarta
  userLongitude = 106.8315,
  cityName = "Jakarta, Indonesia",
  size = 320,
  className = "",
}: CelestialQiblaCompassProps) {
  const [heading, setHeading] = useState<number>(0)
  const [isLocked, setIsLocked] = useState<boolean>(false)
  const [isManualDragging, setIsManualDragging] = useState<boolean>(false)
  const dialRef = useRef<HTMLDivElement | null>(null)

  // Calculate Great-Circle Bearing to Kaaba
  const kaabaLat = (DEFAULT_COORDINATES.MAKKAH_KAABA.latitude * Math.PI) / 180
  const kaabaLng = (DEFAULT_COORDINATES.MAKKAH_KAABA.longitude * Math.PI) / 180
  const userLatRad = (userLatitude * Math.PI) / 180
  const userLngRad = (userLongitude * Math.PI) / 180

  const dLng = kaabaLng - userLngRad
  const y = Math.sin(dLng) * Math.cos(kaabaLat)
  const x =
    Math.cos(userLatRad) * Math.sin(kaabaLat) -
    Math.sin(userLatRad) * Math.cos(kaabaLat) * Math.cos(dLng)
  let qiblaBearing = (Math.atan2(y, x) * 180) / Math.PI
  qiblaBearing = (qiblaBearing + 360) % 360

  // Calculate Distance (Haversine Formula)
  const dLat = kaabaLat - userLatRad
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(userLatRad) * Math.cos(kaabaLat) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distanceKm = Math.round(6371 * c)

  // Check Lock Alignment (within 2.5 degrees)
  useEffect(() => {
    const diff = Math.abs((heading % 360) - qiblaBearing)
    const normalizedDiff = Math.min(diff, 360 - diff)
    setIsLocked(normalizedDiff <= 2.5)
  }, [heading, qiblaBearing])

  // Gyroscope DeviceOrientation listener if available
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null && !isManualDragging) {
        // webkitCompassHeading for iOS, alpha for Android
        const compassHeading = (e as any).webkitCompassHeading || 360 - e.alpha
        setHeading(Math.round(compassHeading))
      }
    }

    if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation)
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("deviceorientation", handleOrientation)
      }
    }
  }, [isManualDragging])

  // Interactive Drag for Desktop / Simulation
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.buttons) return
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const angleRad = Math.atan2(e.clientY - cy, e.clientX - cx)
    let deg = (angleRad * 180) / Math.PI + 90
    deg = (deg + 360) % 360
    setHeading(Math.round(deg))
    setIsManualDragging(true)
  }

  return (
    <div className={`flex flex-col items-center justify-center font-mono ${className}`}>
      {/* Compass Dial Outer Container */}
      <div
        ref={dialRef}
        onPointerMove={handlePointerMove}
        onPointerUp={() => setIsManualDragging(false)}
        className="relative flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
        style={{ width: size, height: size }}
      >
        {/* Outer Laser Ring */}
        <div
          className={`absolute inset-0 rounded-full border transition-all duration-300 ${
            isLocked
              ? "border-emerald-400 shadow-[0_0_50px_rgba(0,255,102,0.4)] bg-emerald-950/20"
              : "border-cyan-500/30 shadow-[0_0_30px_rgba(0,240,255,0.15)] bg-card/80"
          } backdrop-blur-md`}
        />

        {/* Rotating 360 Degree Dial */}
        <div
          className="absolute inset-3 rounded-full transition-transform duration-100 ease-out"
          style={{ transform: `rotate(${-heading}deg)` }}
        >
          {/* Degree Ticks */}
          {[...Array(12)].map((_, i) => {
            const angle = i * 30
            const isCardinal = angle % 90 === 0
            return (
              <div
                key={angle}
                className="absolute left-1/2 top-0 -translate-x-1/2 origin-bottom"
                style={{
                  height: size / 2 - 12,
                  transform: `rotate(${angle}deg)`,
                }}
              >
                <div
                  className={`w-0.5 ${
                    isCardinal ? "h-3.5 bg-cyan-400 font-bold" : "h-2 bg-cyan-500/30"
                  }`}
                />
                {isCardinal && (
                  <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[9px] font-black text-cyan-300">
                    {angle === 0 ? "N" : angle === 90 ? "E" : angle === 180 ? "S" : "W"}
                  </span>
                )}
              </div>
            )
          })}

          {/* Qibla Vector Pointer (Green Target Line) */}
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 origin-bottom"
            style={{
              height: size / 2 - 12,
              transform: `rotate(${qiblaBearing}deg)`,
            }}
          >
            <div className="flex flex-col items-center">
              <div className="h-5 w-5 rounded-full border border-emerald-400 bg-emerald-500/30 p-0.5 shadow-[0_0_15px_rgba(0,255,102,0.8)] animate-pulse flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>
              <span className="mt-1 text-[8px] font-black tracking-widest text-emerald-400">
                KA'BAH
              </span>
            </div>
          </div>
        </div>

        {/* Fixed Center Reticle & Heading Pointer */}
        <div className="relative z-20 flex flex-col items-center justify-center pointer-events-none">
          <div
            className={`h-16 w-16 rounded-full border flex flex-col items-center justify-center transition-all ${
              isLocked
                ? "border-emerald-400 bg-emerald-950/60 text-emerald-300 shadow-[0_0_20px_rgba(0,255,102,0.6)]"
                : "border-cyan-500/40 bg-black/60 text-cyan-400"
            }`}
          >
            <Navigation
              className={`h-6 w-6 transition-transform duration-300 ${
                isLocked ? "text-emerald-400 scale-110" : "text-cyan-400"
              }`}
              style={{
                transform: `rotate(${qiblaBearing - heading}deg)`,
              }}
            />
            <span className="text-[9px] font-bold mt-0.5">
              {Math.round(qiblaBearing)}°
            </span>
          </div>
        </div>

        {/* Top Fixed Needle Pointer */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
        </div>
      </div>

      {/* Telemetry HUD Cards */}
      <div className="mt-6 w-full max-w-sm grid grid-cols-2 gap-3 text-xs">
        <div
          className={`rounded-xl border p-3 flex flex-col items-center justify-center transition-colors ${
            isLocked
              ? "border-emerald-500/50 bg-emerald-950/20 text-emerald-300"
              : "border-cyan-500/20 bg-card/80 text-zinc-300"
          }`}
        >
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 uppercase tracking-wider">
            {isLocked ? (
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Compass className="h-3.5 w-3.5 text-cyan-400" />
            )}
            Status
          </div>
          <div className="mt-1 font-bold text-xs tracking-widest uppercase">
            {isLocked ? "LOCK ENGAGED" : "ALIGNING SCOPE"}
          </div>
        </div>

        <div className="rounded-xl border border-cyan-500/20 bg-card/80 p-3 flex flex-col items-center justify-center text-zinc-300">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 uppercase tracking-wider">
            <MapPin className="h-3.5 w-3.5 text-amber-400" />
            Distance
          </div>
          <div className="mt-1 font-bold text-xs text-amber-300">
            {distanceKm.toLocaleString()} KM
          </div>
        </div>
      </div>

      <div className="mt-2 text-[10px] text-zinc-500 text-center">
        LOCATION: <span className="text-zinc-300">{cityName}</span> • TARGET: <span className="text-emerald-400">21.4225° N, 39.8262° E</span>
      </div>
    </div>
  )
}