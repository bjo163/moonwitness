"use client"

import { useState, useEffect, useCallback } from "react"
/* eslint-disable-next-line no-restricted-imports -- Standard icons for Qibla AR view */
import { Camera, Compass, MapPin, AlertTriangle } from "lucide-react"
import { ContextBlock } from "@core/ui"

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
          lng: pos.coords.longitude
        })
        setStatusMsg("GPS LOCKED. FETCHING QIBLA VECTOR...")
      },
      (err) => {
        setError(`GPS ERROR: ${err.message.toUpperCase()}`)
      },
      { enableHighAccuracy: true }
    )
  }, [])

  // 2. Fetch Arah Kiblat dari Aladhan API
  useEffect(() => {
    if (!location) return

    const fetchQibla = async () => {
      try {
        const res = await fetch(`http://api.aladhan.com/v1/qibla/${location.lat}/${location.lng}`)
        const json = await res.json()
        if (json.data && json.data.direction) {
          setQiblaTarget(json.data.direction)
          setStatusMsg("QIBLA VECTOR ACQUIRED. CALIBRATING GYROSCOPE...")
        } else {
          setError("FAILED TO CALCULATE QIBLA DIRECTION FROM SATELLITE")
        }
      } catch (e: any) {
        setError(`QIBLA API ERROR: ${e.message.toUpperCase()}`)
      }
    }
    fetchQibla()
  }, [location])

  // 3. Sensor Kompas (Device Orientation)
  const handleOrientation = useCallback((event: any) => {
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
  }, [qiblaTarget])

  const requestCompassPermission = async () => {
    // Meminta izin iOS 13+ untuk DeviceOrientation
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission()
        if (permissionState === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation, true)
          setStatusMsg("MAGNETOMETER SENSOR ACTIVE")
        } else {
          setError("COMPASS PERMISSION DENIED BY USER")
        }
      } catch (e: any) {
        setError("COMPASS SENSOR UNAVAILABLE ON THIS DEVICE")
      }
    } else {
      // Non iOS 13+ devices
      window.addEventListener('deviceorientationabsolute', handleOrientation, true)
      window.addEventListener('deviceorientation', handleOrientation, true)
      setStatusMsg("MAGNETOMETER SENSOR ACTIVE (IF HARDWARE SUPPORTS IT)")
    }
  }

  // Auto-request compass if no permission required
  useEffect(() => {
    if (qiblaTarget !== null) {
      if (typeof window !== 'undefined' && typeof (window as any).DeviceOrientationEvent !== 'undefined' && typeof (DeviceOrientationEvent as any).requestPermission !== 'function') {
        window.addEventListener('deviceorientationabsolute', handleOrientation, true)
        window.addEventListener('deviceorientation', handleOrientation, true)
        setStatusMsg("SENSORS ONLINE. ROTATE DEVICE TO ALIGN.")
      }
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientationabsolute', handleOrientation, true)
        window.removeEventListener('deviceorientation', handleOrientation, true)
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

      <div className="panel-box bg-space relative space-y-6 overflow-hidden border-2 border-primary/50 p-8 text-center shadow-[0_0_50px_rgba(0,240,255,0.25)]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-primary/20 pb-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-primary">
            <Compass className="h-4 w-4 text-primary animate-pulse" />
            <span>SATELLITE QIBLA RADAR</span>
          </div>
          <span className={`tag-clip tag-clip px-2 py-0.5 text-[9px] font-bold ${isAligned ? "bg-success text-black shadow-[0_0_15px_#00FF66]" : "bg-warning text-black"}`}>
            {isAligned ? "● TARGET LOCKED" : "○ SCANNING HORIZON"}
          </span>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/50 text-destructive p-4 text-xs font-bold flex items-center justify-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Permission Request for iOS */}
        {!error && typeof window !== 'undefined' && typeof (window as any).DeviceOrientationEvent !== 'undefined' && typeof (DeviceOrientationEvent as any).requestPermission === 'function' && qiblaTarget && !isCompassActive && (
          <button 
            onClick={requestCompassPermission}
            className="bg-primary/20 border border-primary text-primary px-4 py-2 text-xs font-bold hover:bg-primary/40 animate-pulse"
          >
            AUTHORIZE COMPASS SENSOR
          </button>
        )}

        {/* Status Text */}
        {!error && (
          <div className="text-[10px] text-primary/70 font-mono tracking-widest uppercase">
            {statusMsg}
          </div>
        )}

        {/* Interactive Gyro Compass Scope */}
        <div className="relative mx-auto flex h-72 w-72 items-center justify-center">
          {/* Background Highlight when locked */}
          {isAligned && (
            <div className="absolute inset-0 bg-success/20 rounded-full blur-xl animate-pulse" />
          )}

          {/* Outer HUD Rings */}
          <div
            className="absolute inset-0 rounded-full border-4 border-dashed border-primary/30"
            style={{ 
              transform: `rotate(${-heading}deg)`,
              transition: 'transform 0.1s linear'
            }}
          >
            {/* North Indicator Fixed to Ring */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-black font-black text-xs px-2 py-1 rounded-sm">N</div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-primary/50 text-[10px] font-bold">S</div>
            <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/50 text-[10px] font-bold">W</div>
            <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 text-primary/50 text-[10px] font-bold">E</div>
          </div>
          
          <div className="absolute inset-8 rounded-full border border-primary/20" />

          {/* Crosshair Target Scope (Device is always pointing UP in the UI) */}
          <div className="absolute h-[120%] w-0.5 bg-gradient-to-t from-transparent via-primary/50 to-transparent" />
          <div className="absolute w-full h-0.5 bg-primary/20" />
          
          {/* Static Device Pointer */}
          <div className="absolute top-4 w-4 h-4 border-t-2 border-l-2 border-primary rotate-45" />

          {/* Qibla Target Vector Indicator */}
          {qiblaTarget !== null && (
            <div
              className="absolute flex h-full w-full items-center justify-center"
              style={{ 
                transform: `rotate(${qiblaTarget - heading}deg)`,
                transition: 'transform 0.1s linear'
              }}
            >
              <div className="absolute top-1 flex flex-col items-center">
                <div className={`h-8 w-8 flex items-center justify-center text-xl transition-all ${isAligned ? "scale-150 drop-shadow-[0_0_15px_#00FF66]" : ""}`}>
                  🕋
                </div>
                {/* Connecting Line to Center */}
                <div className={`w-0.5 h-32 mt-2 ${isAligned ? "bg-success shadow-[0_0_10px_#00FF66]" : "bg-warning/50 border-dashed"}`} />
              </div>
            </div>
          )}
        </div>

        {/* Status Telemetry Dashboard */}
        <div className="grid grid-cols-2 gap-3 pt-4 text-xs sm:grid-cols-4">
          <div className="bg-panel tag-clip border border-primary/20 p-3 text-left">
            <span className="block text-[8px] text-primary/50 flex items-center gap-1"><MapPin className="w-3 h-3"/> LATITUDE</span>
            <span className="font-bold text-foreground">
              {location ? location.lat.toFixed(4) : "---"}°
            </span>
          </div>
          <div className="bg-panel tag-clip border border-primary/20 p-3 text-left">
            <span className="block text-[8px] text-primary/50 flex items-center gap-1"><MapPin className="w-3 h-3"/> LONGITUDE</span>
            <span className="font-bold text-foreground">
              {location ? location.lng.toFixed(4) : "---"}°
            </span>
          </div>

          <div className="bg-panel tag-clip border border-primary/20 p-3 text-left">
            <span className="block text-[8px] text-primary/50">COMPASS HEADING</span>
            <span className="font-bold text-primary text-sm">
              {heading.toFixed(1)}°
            </span>
          </div>

          <div className={`bg-panel tag-clip border p-3 text-left ${isAligned ? "border-success bg-success/10" : "border-primary/20"}`}>
            <span className="block text-[8px] text-primary/50">QIBLA TARGET</span>
            <span className={`font-bold text-sm ${isAligned ? "text-success" : "text-warning"}`}>
              {qiblaTarget ? qiblaTarget.toFixed(1) : "---"}°
            </span>
          </div>
        </div>
        
        {!isCompassActive && !error && (
           <div className="text-[9px] text-warning bg-warning/10 p-2 mt-4 text-left border-l-2 border-warning">
              INFO: Device orientation sensor inactive or absolute heading unavailable. The radar may not rotate automatically if you are on a desktop PC or lack hardware compass.
           </div>
        )}
      </div>
    </>
  )
}
