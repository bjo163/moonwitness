"use client"

import React from "react"
import { Activity, BarChart3, TrendingUp, Cpu } from "lucide-react"

export function AnalyticsTelemetryView() {
  return (
    <div className="p-8 h-screen flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-white tracking-widest uppercase flex items-center gap-3">
          <Activity className="h-8 w-8 text-emerald-400" />
          Global Telemetry & Analytics
        </h1>
        <p className="text-emerald-500/70 mt-2 font-mono text-sm">
          Real-time system monitoring, usage analytics, and performance metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="rounded-2xl border border-emerald-500/20 bg-black/40 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4 text-emerald-400 font-mono text-xs font-bold uppercase tracking-widest">
            <Cpu className="h-4 w-4" /> System Load
          </div>
          <div className="text-4xl font-black text-white font-mono">24.5%</div>
        </div>
        <div className="rounded-2xl border border-cyan-500/20 bg-black/40 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest">
            <TrendingUp className="h-4 w-4" /> Traffic Rate
          </div>
          <div className="text-4xl font-black text-white font-mono">1.2k/s</div>
        </div>
        <div className="rounded-2xl border border-purple-500/20 bg-black/40 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4 text-purple-400 font-mono text-xs font-bold uppercase tracking-widest">
            <BarChart3 className="h-4 w-4" /> Active Nodes
          </div>
          <div className="text-4xl font-black text-white font-mono">1,402</div>
        </div>
      </div>

      <div className="flex-1 rounded-2xl border border-emerald-500/20 bg-black/40 p-8 backdrop-blur-xl flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="text-emerald-500/50 font-mono tracking-widest text-lg uppercase animate-pulse">
          INITIALIZING DATA STREAM...
        </div>
      </div>
    </div>
  )
}
