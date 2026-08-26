"use client"

import { useState, useEffect } from "react"
import { StarmapHeader } from "../components/starmap/starmap-header"
import { StarmapViewport } from "../components/starmap/starmap-viewport"
import { StarmapControlsPanel } from "../components/starmap/starmap-controls-panel"

export function CelestialStarMapView() {
  const [mounted, setMounted] = useState(false)
  const [now, setNow] = useState(new Date())

  // Interactive States
  const [activeTab, setActiveTab] = useState("ALL")
  const [viewMode, setViewMode] = useState("3D SPHERE")
  const [starMag, setStarMag] = useState(5)
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

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020813] font-mono text-sm tracking-widest text-indigo-500">
        INITIALIZING CELESTIAL ENGINE...
      </div>
    )
  }

  // Format Time
  const timeUtc = (now.toISOString().split("T")[1] || "").split(".")[0] || "00:00:00"
  const timeLocal = now.toTimeString().split(" ")[0] || "00:00:00"

  // Simulated RA / Dec coordinates
  const baseRaSeconds = 40.24 + raOffset
  const raSeconds = (baseRaSeconds % 60).toFixed(2).padStart(5, "0")
  const raMinutes = (35 + Math.floor(baseRaSeconds / 60)) % 60
  const raHours = (8 + Math.floor((35 + Math.floor(baseRaSeconds / 60)) / 60)) % 24
  const raFormatted = `${raHours.toString().padStart(2, "0")}h ${raMinutes.toString().padStart(2, "0")}m ${raSeconds}s`
  const decFormatted = "+06° 12′ 00″"

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#040814] pb-12 font-sans text-white selection:bg-indigo-500/30">
      <div className="mx-auto max-w-[1800px] space-y-6 px-4 pt-6 lg:px-6">
        {/* 1. Header & Live Equatorial Coordinates */}
        <StarmapHeader
          raFormatted={raFormatted}
          decFormatted={decFormatted}
          timeUtc={timeUtc}
          timeLocal={timeLocal}
        />

        {/* 2. Main 2-Column Content Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT: 3D Dome Planetarium Viewport */}
          <div className="lg:col-span-2">
            <StarmapViewport
              viewMode={viewMode}
              onToggleViewMode={() =>
                setViewMode((prev) => (prev === "3D SPHERE" ? "PLANAR (2D)" : "3D SPHERE"))
              }
              autoRotate={controls.autoRotate}
              onToggleAutoRotate={() =>
                setControls((prev) => ({ ...prev, autoRotate: !prev.autoRotate }))
              }
              showConstellations={controls.showConstellations}
              onToggleConstellations={() =>
                setControls((prev) => ({ ...prev, showConstellations: !prev.showConstellations }))
              }
            />
          </div>

          {/* RIGHT: Star Catalog Filters & Celestial Wisdom */}
          <div>
            <StarmapControlsPanel
              starMag={starMag}
              onStarMagChange={setStarMag}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
