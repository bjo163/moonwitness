"use client"
import { useMounted } from "@workspace/hooks"

import { useState, useEffect } from "react"
import { Orbit, Sun, Moon, Globe } from "lucide-react"

const ROTATION_STEP = 0.5
const FULL_CIRCLE_DEGREES = 360
const ORBIT_ANIMATION_INTERVAL_MS = 50
const MOON_ORBIT_SPEED_MULTIPLIER = 2

function OrbitingEarthAndMoon({ rotation }: { rotation: number }) {
  return (
    <div
      className="absolute flex h-36 w-36 items-center justify-center transition-transform duration-75"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="absolute top-0 flex -rotate-45 transform flex-col items-center">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-[0_0_15px_#00F0FF]">
          <Globe className="h-4 w-4 text-black" />
        </div>
        <span className="mt-0.5 text-[7px] font-bold text-primary">EARTH</span>

        {/* Orbiting Moon around Earth */}
        <div
          className="absolute flex h-10 w-10 items-center justify-center"
          style={{
            transform: `rotate(${rotation * MOON_ORBIT_SPEED_MULTIPLIER}deg)`,
          }}
        >
          <div className="absolute top-0 flex h-3 w-3 items-center justify-center rounded-full bg-white shadow-[0_0_10px_white]">
            <Moon className="h-2 w-2 text-black" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function OrbitOrreryWidget() {
  const mounted = useMounted()
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + ROTATION_STEP) % FULL_CIRCLE_DEGREES)
    }, ORBIT_ANIMATION_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  return (
    <div className="panel-box bg-space/90 space-y-4 border border-primary/40 p-4 font-mono shadow-[0_0_20px_rgba(0,240,255,0.15)] sm:p-5">
      <div className="flex items-center justify-between border-b border-primary/20 pb-2.5">
        <div className="flex items-center gap-2">
          <Orbit
            className="h-4 w-4 animate-spin text-primary"
            style={{ animationDuration: "20s" }}
          />
          <span className="font-display text-xs font-black tracking-widest text-primary uppercase">
            // 3D ORBITAL ORRERY & CELESTIAL ALIGNMENT
          </span>
        </div>
        <span className="tag-clip tag-clip-green tag-clip px-2 py-0.5 text-[8px] font-bold">
          ORBITAL MODEL
        </span>
      </div>

      <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
        {/* Visual Orrery Canvas View */}
        <div className="bg-space tag-clip relative flex h-44 w-full items-center justify-center overflow-hidden border border-primary/20">
          {/* Orbital Concentric Rings */}
          <div className="absolute h-36 w-36 rounded-full border border-dashed border-primary/20" />
          <div className="absolute h-24 w-24 rounded-full border border-accent/20" />

          {/* Central Sun */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent shadow-[0_0_20px_#FFE600]">
              <Sun
                className="h-5 w-5 animate-spin text-black"
                style={{ animationDuration: "15s" }}
              />
            </div>
            <span className="mt-1 text-[7px] font-bold text-accent">
              SUN (SHAMS)
            </span>
          </div>

          {/* Orbiting Earth & Moon */}
          <OrbitingEarthAndMoon rotation={rotation} />
        </div>

        {/* Telemetry Stats */}
        <div className="space-y-2 text-xs">
          <div className="bg-panel tag-clip space-y-1 border border-primary/20 p-2.5">
            <span className="block text-[8px] text-primary uppercase">
              {/* CELESTIAL SYNC STATUS */}
            </span>
            <div className="text-success text-xs font-bold">
              HARMONIZED • PERFECT CONVERGENCE
            </div>
          </div>

          <div className="bg-panel tag-clip space-y-1 border border-primary/20 p-2.5">
            <span className="block text-[8px] text-primary uppercase">
              {/* LUNAR ECLIPTIC ANGLE */}
            </span>
            <div className="text-xs font-bold text-accent">
              5.14° INCLINATION TO ECLIPTIC
            </div>
          </div>

          <div className="bg-panel tag-clip space-y-1 border border-primary/20 p-2.5">
            <span className="block text-[8px] text-primary uppercase">
              {/* QIBLA AXIS ALIGNMENT */}
            </span>
            <div className="text-xs font-bold text-primary">
              295.14° GEODESIC VECTOR
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
