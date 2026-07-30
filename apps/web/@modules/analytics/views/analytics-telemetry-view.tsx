"use client"

import React from "react"
import { Activity, BarChart3, TrendingUp, Cpu } from "lucide-react"

export function AnalyticsTelemetryView() {
  return (
    <div className="flex h-screen flex-col p-8">
      <div className="mb-6">
        <h1 className="flex items-center gap-3 text-3xl font-black tracking-widest text-white uppercase">
          <Activity className="h-8 w-8 text-emerald-400" />
          Global Telemetry & Analytics
        </h1>
        <p className="mt-2 font-mono text-sm text-emerald-500/70">
          Real-time system monitoring, usage analytics, and performance metrics.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-emerald-500/20 bg-black/40 p-6 backdrop-blur-xl">
          <div className="mb-4 flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-emerald-400 uppercase">
            <Cpu className="h-4 w-4" /> System Load
          </div>
          <div className="font-mono text-4xl font-black text-white">24.5%</div>
        </div>
        <div className="rounded-2xl border border-cyan-500/20 bg-black/40 p-6 backdrop-blur-xl">
          <div className="mb-4 flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-cyan-400 uppercase">
            <TrendingUp className="h-4 w-4" /> Traffic Rate
          </div>
          <div className="font-mono text-4xl font-black text-white">1.2k/s</div>
        </div>
        <div className="rounded-2xl border border-purple-500/20 bg-black/40 p-6 backdrop-blur-xl">
          <div className="mb-4 flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-purple-400 uppercase">
            <BarChart3 className="h-4 w-4" /> Active Nodes
          </div>
          <div className="font-mono text-4xl font-black text-white">1,402</div>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl border border-emerald-500/20 bg-black/40 p-8 backdrop-blur-xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] bg-[size:4rem_4rem]"></div>
        <div className="animate-pulse font-mono text-lg tracking-widest text-emerald-500/50 uppercase">
          INITIALIZING DATA STREAM...
        </div>
      </div>
    </div>
  )
}
