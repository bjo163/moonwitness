"use client"

import React from "react"
import { Sun, Moon, Compass, Target, MapPin, Clock, Globe } from "lucide-react"
import type { EclipseData } from "./eclipse-hero-tabs"

interface EclipseMainVisualizerProps {
  eclipse: EclipseData
  isSolar: boolean
}

export function EclipseMainVisualizer({ eclipse, isSolar }: EclipseMainVisualizerProps) {
  return (
    <div className="space-y-6">
      {/* 1. Visual Simulation Card */}
      <div className="relative flex min-h-[280px] flex-col items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#050B16] p-6 shadow-2xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent" />

        {/* Orbit Visualization Circle */}
        <div className="relative flex h-48 w-48 items-center justify-center rounded-full border border-dashed border-white/20">
          {/* Sun / Moon Spheres */}
          <div className="absolute h-24 w-24 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-[0_0_50px_rgba(255,230,0,0.5)]" />
          <div
            className={`absolute h-24 w-24 rounded-full transition-all duration-1000 ${
              isSolar
                ? "translate-x-2 bg-black/90 shadow-[0_0_20px_rgba(0,0,0,0.8)]"
                : "translate-x-3 bg-red-900/80 shadow-[0_0_30px_rgba(255,0,85,0.4)]"
            }`}
          />
        </div>

        <div className="relative z-10 mt-4 text-center">
          <div className="font-mono text-sm font-black text-white uppercase">
            {eclipse.type}
          </div>
          <div className="font-mono text-[10px] text-yellow-400">
            TOTALITY DURATION: {eclipse.duration} • COVERAGE: {eclipse.coverage}
          </div>
        </div>
      </div>

      {/* 2. Specs & Geographic Path Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 font-mono text-[10px]">
        <div className="rounded-xl border border-white/5 bg-[#080E1C] p-3 shadow-md">
          <div className="flex items-center gap-1.5 text-white/40">
            <Target className="h-3.5 w-3.5 text-yellow-400" />
            <span>MAGNITUDE</span>
          </div>
          <div className="mt-1 text-sm font-black text-white">{eclipse.magnitude}</div>
        </div>

        <div className="rounded-xl border border-white/5 bg-[#080E1C] p-3 shadow-md">
          <div className="flex items-center gap-1.5 text-white/40">
            <Clock className="h-3.5 w-3.5 text-yellow-400" />
            <span>MAX DURATION</span>
          </div>
          <div className="mt-1 text-sm font-black text-white">{eclipse.duration}</div>
        </div>

        <div className="rounded-xl border border-white/5 bg-[#080E1C] p-3 shadow-md">
          <div className="flex items-center gap-1.5 text-white/40">
            <MapPin className="h-3.5 w-3.5 text-yellow-400" />
            <span>PRIMARY VISIBILITY</span>
          </div>
          <div className="mt-1 truncate text-xs font-bold text-white">{eclipse.location}</div>
        </div>

        <div className="rounded-xl border border-white/5 bg-[#080E1C] p-3 shadow-md">
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
