"use client"

import React from "react"
import { Sun, Moon, Compass, Target, MapPin, Clock, Globe } from "lucide-react"
import { CelestialEclipseSimulator } from "@workspace/ui"
import type { EclipseData } from "./eclipse-hero-tabs"

interface EclipseMainVisualizerProps {
  eclipse: EclipseData
  isSolar: boolean
}

export function EclipseMainVisualizer({ eclipse, isSolar }: EclipseMainVisualizerProps) {
  return (
    <div className="space-y-6">
      {/* 1. 3D Photometric Eclipse Simulation Deck */}
      <CelestialEclipseSimulator
        initialProgress={0.5}
        eclipseType={isSolar ? "TOTAL_SOLAR" : "TOTAL_LUNAR"}
      />

      {/* 2. Specs & Geographic Path Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 font-mono text-[10px]">
        <div className="rounded-xl border border-white/5 bg-card p-3 shadow-md">
          <div className="flex items-center gap-1.5 text-white/40">
            <Target className="h-3.5 w-3.5 text-yellow-400" />
            <span>MAGNITUDE</span>
          </div>
          <div className="mt-1 text-sm font-black text-white">{eclipse.magnitude}</div>
        </div>

        <div className="rounded-xl border border-white/5 bg-card p-3 shadow-md">
          <div className="flex items-center gap-1.5 text-white/40">
            <Clock className="h-3.5 w-3.5 text-yellow-400" />
            <span>MAX DURATION</span>
          </div>
          <div className="mt-1 text-sm font-black text-white">{eclipse.duration}</div>
        </div>

        <div className="rounded-xl border border-white/5 bg-card p-3 shadow-md">
          <div className="flex items-center gap-1.5 text-white/40">
            <MapPin className="h-3.5 w-3.5 text-yellow-400" />
            <span>PRIMARY VISIBILITY</span>
          </div>
          <div className="mt-1 truncate text-xs font-bold text-white">{eclipse.location}</div>
        </div>

        <div className="rounded-xl border border-white/5 bg-card p-3 shadow-md">
          <div className="flex items-center gap-1.5 text-white/40">
            <Globe className="h-3.5 w-3.5 text-yellow-400" />
            <span>SAROS SERIES</span>
          </div>
          <div className="mt-1 text-sm font-black text-white">SAROS 126</div>
        </div>
      </div>
    </div>
  )
}
