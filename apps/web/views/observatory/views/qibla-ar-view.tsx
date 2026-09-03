"use client"

import { useState, useEffect, useCallback } from "react"
/* eslint-disable-next-line no-restricted-imports -- Standard icons for Qibla AR view */
import { Camera, Compass, MapPin, AlertTriangle } from "lucide-react"
import { ContextBlock } from "@workspace/ui"
import { CelestialQiblaCompass } from "@workspace/ui"

const FULL_CIRCLE_DEGREES = 360
const ALIGNMENT_TOLERANCE_DEGREES = 5

type GeoLocation = { lat: number; lng: number } | null

export function QiblaArView() {
  const [heading, setHeading] = useState(0)
  const [qiblaTarget, setQiblaTarget] = useState<number | null>(null)
  const [location, setLocation] = useState<GeoLocation>(null)
  const [isAligned, setIsAligned] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statusMsg, setStatusMsg] = useState<string>("INITIALIZING SENSORS...")
  const [isCompassActive, setIsCompassActive] = useState(false)

  // 1. Dapatkan Lokasi Pengguna
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("GEOLOCATION SENSOR NOT DETECTED ON THIS DEVICE")
      return
    }

    setStatusMsg("ACQUIRING SATELLITE GPS LOCK...")
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
        setStatusMsg("GPS LOCKED. FETCHING QIBLA VECTOR...")
      },
      (err) => {
        setError(`GPS ERROR: ${err.message.toUpperCase()}`)
      },
      { enableHighAccuracy: true }
    )
  }, [])

  // 2. Calculate Great-Circle Qibla Direction to Kaaba (Makkah: 21.4225° N, 39.8262° E)
  useEffect(() => {
    if (!location) return

    try {
      const phi1 = (location.lat * Math.PI) / 180
      const phi2 = (21.4225 * Math.PI) / 180
      const deltaLambda = ((39.8262 - location.lng) * Math.PI) / 180
      const y = Math.sin(deltaLambda)
      const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda)
      const qiblaAngle = (Math.atan2(y, x) * 180) / Math.PI
      const normalizedAngle = (qiblaAngle + 360) % 360

      setQiblaTarget(Number(normalizedAngle.toFixed(1)))
      setStatusMsg("QIBLA VECTOR ACQUIRED. CALIBRATING GYROSCOPE...")
    } catch {
      setError("FAILED TO CALCULATE QIBLA VECTOR")
    }
  }, [location])

  // 3. Sensor Kompas (Device Orientation)
  const handleOrientation = useCallback(
    (event: any) => {
      let compassHeading = 0
      let absolute = false

      // iOS webkitCompassHeading
      if (event.webkitCompassHeading) {
        compassHeading = event.webkitCompassHeading
        absolute = true
      }
      // Android absolute alpha
      else if (event.absolute && event.alpha !== null) {
        compassHeading = 360 - event.alpha
        absolute = true
      }
      // Fallback if not absolute but alpha exists (often not magnetic north, but relative)
      else if (event.alpha !== null) {
        compassHeading = 360 - event.alpha
        absolute = false
      }

      setHeading(compassHeading)
      setIsCompassActive(absolute)

      if (qiblaTarget !== null) {
        const offset = Math.abs(compassHeading - qiblaTarget)
        // Normalize offset
        const minOffset = Math.min(offset, 360 - offset)
        setIsAligned(minOffset < ALIGNMENT_TOLERANCE_DEGREES)
      }
    },
    [qiblaTarget]
  )

  const requestCompassPermission = async () => {
    // Meminta izin iOS 13+ untuk DeviceOrientation
    if (
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      try {
        const permissionState = await (
          DeviceOrientationEvent as any
        ).requestPermission()
        if (permissionState === "granted") {
          window.addEventListener("deviceorientation", handleOrientation, true)
          setStatusMsg("MAGNETOMETER SENSOR ACTIVE")
        } else {
          setError("COMPASS PERMISSION DENIED BY USER")
        }
      } catch (e: any) {
        setError("COMPASS SENSOR UNAVAILABLE ON THIS DEVICE")
      }
    } else {
      // Non iOS 13+ devices
      window.addEventListener(
        "deviceorientationabsolute",
        handleOrientation,
        true
      )
      window.addEventListener("deviceorientation", handleOrientation, true)
      setStatusMsg("MAGNETOMETER SENSOR ACTIVE (IF HARDWARE SUPPORTS IT)")
    }
  }

  // Auto-request compass if no permission required
  useEffect(() => {
    if (qiblaTarget !== null) {
      if (
        typeof window !== "undefined" &&
        typeof (window as any).DeviceOrientationEvent !== "undefined" &&
        typeof (DeviceOrientationEvent as any).requestPermission !== "function"
      ) {
        window.addEventListener(
          "deviceorientationabsolute",
          handleOrientation,
          true
        )
        window.addEventListener("deviceorientation", handleOrientation, true)
        setStatusMsg("SENSORS ONLINE. ROTATE DEVICE TO ALIGN.")
      }
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "deviceorientationabsolute",
          handleOrientation,
          true
        )
        window.removeEventListener("deviceorientation", handleOrientation, true)
      }
    }
  }, [qiblaTarget, handleOrientation])

  return (
    <>
      <ContextBlock
        title="RADAR SPASIAL KIBLAT (QIBLA AR)"
        subtitle="Sistem penyelarasan arah shalat presisi tinggi menggunakan GPS satelit (Geolocation) dan sensor magnetometer/giroskop perangkat."
        operation="QIBLA-SPATIAL-RADAR"
        status="ONLINE"
        accentColor="success"
      />

      <div className="rounded-xl border border-border/40 bg-card/90 bg-background relative space-y-6 overflow-hidden border-2 border-primary/50 p-8 text-center shadow-sm">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-primary/20 pb-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-primary">
            <Compass className="h-4 w-4 animate-pulse text-primary" />
            <span>SATELLITE QIBLA RADAR</span>
          </div>
          <span
            className={`rounded-md rounded-md px-2 py-0.5 text-[9px] font-bold ${isAligned ? "bg-success text-black shadow-sm" : "bg-warning text-black"}`}
          >
            {isAligned ? "● TARGET LOCKED" : "○ SCANNING HORIZON"}
          </span>
        </div>

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center gap-2 border border-destructive/50 bg-destructive/10 p-4 text-xs font-bold text-destructive">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Permission Request for iOS */}
        {!error &&
          typeof window !== "undefined" &&
          typeof (window as any).DeviceOrientationEvent !== "undefined" &&
          typeof (DeviceOrientationEvent as any).requestPermission ===
            "function" &&
          qiblaTarget &&
          !isCompassActive && (
            <button
              onClick={requestCompassPermission}
              className="animate-pulse border border-primary bg-primary/20 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/40"
            >
              AUTHORIZE COMPASS SENSOR
            </button>
          )}

        {/* Status Text */}
        {!error && (
          <div className="font-mono text-[10px] tracking-widest text-primary/70 uppercase">
            {statusMsg}
          </div>
        )}

        {/* Interactive 3D Celestial Qibla Compass */}
        <div className="py-2">
          <CelestialQiblaCompass
            userLatitude={location ? location.lat : -6.1702}
            userLongitude={location ? location.lng : 106.8315}
            cityName={location ? "User GPS Position" : "Jakarta, Indonesia"}
            size={300}
          />
        </div>

        {/* Status Telemetry Dashboard */}
        <div className="grid grid-cols-2 gap-3 pt-4 text-xs sm:grid-cols-4">
          <div className="bg-panel rounded-md border border-primary/20 p-3 text-left">
            <span className="block flex items-center gap-1 text-[8px] text-primary/50">
              <MapPin className="h-3 w-3" /> LATITUDE
            </span>
            <span className="font-bold text-foreground">
              {location ? location.lat.toFixed(4) : "---"}°
            </span>
          </div>
          <div className="bg-panel rounded-md border border-primary/20 p-3 text-left">
            <span className="block flex items-center gap-1 text-[8px] text-primary/50">
              <MapPin className="h-3 w-3" /> LONGITUDE
            </span>
            <span className="font-bold text-foreground">
              {location ? location.lng.toFixed(4) : "---"}°
            </span>
          </div>

          <div className="bg-panel rounded-md border border-primary/20 p-3 text-left">
            <span className="block text-[8px] text-primary/50">
              COMPASS HEADING
            </span>
            <span className="text-sm font-bold text-primary">
              {heading.toFixed(1)}°
            </span>
          </div>

          <div
            className={`bg-panel rounded-md border p-3 text-left ${isAligned ? "border-success bg-success/10" : "border-primary/20"}`}
          >
            <span className="block text-[8px] text-primary/50">
              QIBLA TARGET
            </span>
            <span
              className={`text-sm font-bold ${isAligned ? "text-success" : "text-warning"}`}
            >
              {qiblaTarget ? qiblaTarget.toFixed(1) : "---"}°
            </span>
          </div>
        </div>

        {!isCompassActive && !error && (
          <div className="text-warning bg-warning/10 border-warning mt-4 border-l-2 p-2 text-left text-[9px]">
            INFO: Device orientation sensor inactive or absolute heading
            unavailable. The radar may not rotate automatically if you are on a
            desktop PC or lack hardware compass.
          </div>
        )}
      </div>
    </>
  )
}
