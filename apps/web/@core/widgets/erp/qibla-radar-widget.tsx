"use client"

import React, { useEffect, useState } from "react"
import { Compass, AlertCircle } from "lucide-react"

// Mecca coordinates
const MECCA_LAT = 21.422487
const MECCA_LNG = 39.826206

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371 // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function getBearing(lat1: number, lon1: number, lat2: number, lon2: number) {
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const y = Math.sin(dLon) * Math.cos(lat2 * (Math.PI / 180))
  const x =
    Math.cos(lat1 * (Math.PI / 180)) * Math.sin(lat2 * (Math.PI / 180)) -
    Math.sin(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.cos(dLon)
  let brng = Math.atan2(y, x) * (180 / Math.PI)
  return (brng + 360) % 360
}

function getCompassDirection(bearing: number) {
  const val = Math.floor(bearing / 22.5 + 0.5)
  const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
  return arr[val % 16]
}

export function QiblaRadarWidget() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [heading, setHeading] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 1. Get Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => {
          // Fallback to Jakarta
          console.warn("Geolocation failed, using Jakarta", err)
          setCoords({ lat: -6.2, lng: 106.816 })
        }
      )
    } else {
      setCoords({ lat: -6.2, lng: 106.816 })
    }

    // 2. Get Compass (Mobile only usually)
    const handleOrientation = (event: DeviceOrientationEvent) => {
      let alpha = event.alpha
      // iOS specific absolute orientation
      if ((event as any).webkitCompassHeading !== undefined) {
        alpha = (event as any).webkitCompassHeading
      } else if (alpha !== null) {
        // Android absolute alpha is usually relative, but absolute if deviceorientationabsolute is fired
        // Math is complex here, we will just use 360 - alpha for simplicity
        alpha = 360 - alpha
      }
      if (alpha !== null) setHeading(alpha)
    }

    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientationabsolute", handleOrientation)
      // For iOS 13+
      window.addEventListener("deviceorientation", handleOrientation)
    }

    return () => {
      window.removeEventListener("deviceorientationabsolute", handleOrientation)
      window.removeEventListener("deviceorientation", handleOrientation)
    }
  }, [])

  if (!coords) {
    return (
      <div className="bg-space/90 pointer-events-auto flex w-48 items-center gap-3 rounded-xl border-2 border-emerald-500/20 p-3 shadow-lg animate-pulse">
        <div className="h-12 w-12 rounded-full bg-emerald-500/10"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 w-full rounded bg-emerald-500/20"></div>
          <div className="h-4 w-2/3 rounded bg-emerald-500/20"></div>
        </div>
      </div>
    )
  }

  const qiblaBearing = getBearing(coords.lat, coords.lng, MECCA_LAT, MECCA_LNG)
  const distanceKm = getDistance(coords.lat, coords.lng, MECCA_LAT, MECCA_LNG)
  const dirStr = getCompassDirection(qiblaBearing)

  // Calculate rotation of compass needle (if heading is available, point to Qibla relative to phone)
  let rotation = qiblaBearing
  if (heading !== null) {
    rotation = qiblaBearing - heading
  }

  return (
    <div className="bg-space/90 pointer-events-auto flex w-48 items-center gap-3 rounded-xl border-2 border-emerald-500/60 p-3 shadow-[0_0_30px_rgba(16,185,129,0.3)] backdrop-blur">
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-emerald-400/50 bg-black">
        <div style={{ transform: `rotate(${rotation}deg)`, transition: "transform 0.2s ease-out" }} className="absolute inset-0 flex items-center justify-center">
          {/* Arrow pointing up */}
          <div className="h-full w-1 bg-gradient-to-t from-transparent to-emerald-400 absolute top-0 rounded-t-full" style={{ height: '50%' }}></div>
        </div>
        <Compass className="h-6 w-6 text-emerald-400/50" />
        <div className="absolute inset-0 scale-110 rounded-full border border-emerald-500/30" />
      </div>
      <div>
        <div className="mb-0.5 text-[9px] font-black tracking-wider text-emerald-400 uppercase">
          QIBLA RADAR
        </div>
        <div className="font-mono text-lg leading-none font-black text-white tabular-nums drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">
          {qiblaBearing.toFixed(1)}° <span className="text-[10px] text-emerald-300 ml-0.5">{dirStr}</span>
        </div>
        <div className="mt-1 text-[8px] text-emerald-400/70 tabular-nums">
          DIST: {distanceKm.toLocaleString(undefined, { maximumFractionDigits: 0 })} KM
        </div>
      </div>
    </div>
  )
}
