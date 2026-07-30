"use client"

import React, { useState, useEffect } from "react"
import { MapPin } from "lucide-react"
import { getIslamicData, PrayerData } from "@workspace/quran-core"

const FALLBACK_LAT = -6.2088
const FALLBACK_LNG = 106.8456
const GEOLOCATION_TIMEOUT_MS = 10000
const MINUTES_IN_DEGREE = 60
const MAP_CENTER_OFFSET = 50
const LNG_SCALE_FACTOR = 0.2906
const LAT_SCALE_FACTOR = 1.37
const FALLBACK_MAP_X = 81.1
const FALLBACK_MAP_Y = 58.5

export function HomeGlobalCoordinatesWidget() {
  const [gpsLocation, setGpsLocation] = useState<{
    lat: number
    lng: number
    city?: string
  } | null>(null)
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null)

  useEffect(() => {
    // Request Real GPS Location
    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            city: "LOCAL NODE",
          })
          setPrayerData(
            getIslamicData(
              position.coords.latitude,
              position.coords.longitude,
              new Date()
            )
          )
        },
        (_error) => {
          // Fallback to Jakarta
          setGpsLocation({
            lat: FALLBACK_LAT,
            lng: FALLBACK_LNG,
            city: "ASIA/JAKARTA",
          })
          setPrayerData(getIslamicData(FALLBACK_LAT, FALLBACK_LNG, new Date()))
        },
        {
          enableHighAccuracy: false,
          timeout: GEOLOCATION_TIMEOUT_MS,
          maximumAge: 0,
        }
      )
    } else {
      setTimeout(() => {
        setGpsLocation({
          lat: FALLBACK_LAT,
          lng: FALLBACK_LNG,
          city: "ASIA/JAKARTA",
        })
        setPrayerData(getIslamicData(FALLBACK_LAT, FALLBACK_LNG, new Date()))
      }, 0)
    }
  }, [])

  const formatDMS = (coord: number, isLat: boolean) => {
    const absolute = Math.abs(coord)
    const degrees = Math.floor(absolute)
    const minutes = Math.floor((absolute - degrees) * MINUTES_IN_DEGREE)
    const direction = isLat ? (coord >= 0 ? "N" : "S") : coord >= 0 ? "E" : "W"
    return `${degrees.toString().padStart(2, "0")}° ${minutes.toString().padStart(2, "0")}' ${direction}`
  }

  // Map calibration
  const mapX = gpsLocation
    ? MAP_CENTER_OFFSET + gpsLocation.lng * LNG_SCALE_FACTOR
    : FALLBACK_MAP_X
  const mapY = gpsLocation
    ? MAP_CENTER_OFFSET - gpsLocation.lat * LAT_SCALE_FACTOR
    : FALLBACK_MAP_Y

  return (
    <div className="flex h-full flex-col lg:col-span-3">
      <div className="relative flex flex-1 flex-col rounded-lg border border-primary/20 bg-black/10 p-4 shadow-[inset_0_0_20px_rgba(0,255,255,0.02)] backdrop-blur-xl sm:p-5">
        <div>
          <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2.5 text-xs font-bold tracking-wider text-primary uppercase">
            <span>GLOBAL COORDINATES</span>
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
          </div>

          <div className="group relative my-3 flex h-28 w-full items-center justify-center overflow-hidden rounded-md border border-primary/20 bg-black/20 shadow-inner">
            <div
              className="absolute h-[446px] w-[800px] max-w-none opacity-40 transition-all duration-1000 group-hover:opacity-70"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(-${mapX}%, -${mapY}%)`,
                backgroundImage: "url('/assets/world-map.svg')",
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
                filter:
                  "brightness(0.8) sepia(1) hue-rotate(140deg) saturate(150%) opacity(0.8)",
              }}
            />

            <div className="theme-grid-bg pointer-events-none absolute inset-0 opacity-30" />

            <div
              className="pointer-events-none absolute top-1/2 left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border-[1.5px] border-emerald-400/50"
              style={{ animationDuration: "2s" }}
            />
            <div className="pointer-events-none absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-sm border-[1.5px] border-emerald-400" />
            <div className="pointer-events-none absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400 shadow-[0_0_10px_#10B981]" />

            <div className="absolute bottom-2 left-2 z-10 rounded border border-emerald-500/20 bg-black/60 px-1.5 py-0.5 font-mono text-[8px] text-emerald-400 backdrop-blur-md">
              LOCKED • {gpsLocation ? gpsLocation.city : "LOCATING..."}
            </div>
          </div>
        </div>

        <div className="mt-auto space-y-2 pt-1 font-sans text-[10px] font-medium tracking-widest uppercase">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-primary/80">COORDINATES</span>
            <span className="font-mono font-bold tracking-wide text-primary">
              {gpsLocation
                ? `${formatDMS(gpsLocation.lat, true)} ${formatDMS(gpsLocation.lng, false)}`
                : "ACQUIRING..."}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-primary/80">QIBLA VECTOR</span>
            <span className="font-mono font-bold tracking-wide text-fuchsia-400">
              {prayerData ? `${prayerData.qiblaDirection}°` : "..."}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
