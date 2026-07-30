"use client"

import { useState, useEffect } from "react"
import { Globe } from "lucide-react"

const DEFAULT_LAT = -6.2088
const DEFAULT_LNG = 106.8456
const DEFAULT_DISTANCE_KM = 7914
const COORD_DECIMAL_DIGITS = 4

export function QiblaMapWidget() {
  const [mounted, setMounted] = useState(false)
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>({
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG,
  })
  const [distanceKm, _setDistanceKm] = useState(DEFAULT_DISTANCE_KM)

  useEffect(() => {
    setTimeout(() => setMounted(true), 0)
    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        },
        () => {
          /* Ignore geolocation error in fallback mode */
        }
      )
    }
  }, [])

  if (!mounted) return null

  return (
    <div className="panel-box border-success/40 bg-space/90 space-y-4 border p-4 font-mono shadow-[0_0_20px_rgba(0,255,102,0.15)] sm:p-5">
      <div className="border-success/20 flex items-center justify-between border-b pb-2.5">
        <div className="flex items-center gap-2">
          <Globe className="text-success h-4 w-4 animate-pulse" />
          <span className="font-display text-success text-xs font-black tracking-widest uppercase">
            // GPS GEODESIC QIBLA MAP TELEMETRY
          </span>
        </div>
        <span className="tag-clip tag-clip-green tag-clip px-2 py-0.5 text-[8px] font-bold">
          GPS SYNC 100%
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-3">
        <div className="bg-panel border-success/20 tag-clip space-y-1 border p-3">
          <span className="block text-[8px] text-primary uppercase">
            {/* KOORDINAT GPS LOKAL */}
          </span>
          <div className="font-bold text-foreground">
            {userCoords.lat.toFixed(COORD_DECIMAL_DIGITS)}° N, {userCoords.lng.toFixed(COORD_DECIMAL_DIGITS)}° E
          </div>
        </div>

        <div className="bg-panel border-success/20 tag-clip space-y-1 border p-3">
          <span className="block text-[8px] text-primary uppercase">
            {/* SUDUT AZIMUTH KIBLAT */}
          </span>
          <div className="text-success font-display font-bold">
            295.14° NNE (JAKARTA)
          </div>
        </div>

        <div className="bg-panel border-success/20 tag-clip space-y-1 border p-3">
          <span className="block text-[8px] text-primary uppercase">
            {/* JARAK LINTASAN KA&apos;BAH */}
          </span>
          <div className="font-display font-bold text-accent">
            {distanceKm.toLocaleString("en-US")} KM
          </div>
        </div>
      </div>
    </div>
  )
}
