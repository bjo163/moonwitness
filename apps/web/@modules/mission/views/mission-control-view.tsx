"use client"

import React from "react"
import { Target, Flag, Shield, Zap } from "lucide-react"

export function MissionControlView() {
  return (
    <div className="p-8 h-screen flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-white tracking-widest uppercase flex items-center gap-3">
          <Target className="h-8 w-8 text-rose-400" />
          Mission Control
        </h1>
        <p className="text-rose-500/70 mt-2 font-mono text-sm">
          Strategic planning, objective tracking, and active deployment operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="rounded-2xl border border-rose-500/20 bg-black/40 p-5 backdrop-blur-xl space-y-2">
          <Shield className="h-5 w-5 text-rose-400" />
          <h3 className="text-rose-200 font-mono text-xs uppercase tracking-widest">Active Objectives</h3>
          <div className="text-2xl font-black text-white font-mono">03</div>
        </div>
        <div className="rounded-2xl border border-rose-500/20 bg-black/40 p-5 backdrop-blur-xl space-y-2">
          <Zap className="h-5 w-5 text-rose-400" />
          <h3 className="text-rose-200 font-mono text-xs uppercase tracking-widest">Energy Reserves</h3>
          <div className="text-2xl font-black text-white font-mono">98%</div>
        </div>
        <div className="rounded-2xl border border-rose-500/20 bg-black/40 p-5 backdrop-blur-xl space-y-2">
          <Flag className="h-5 w-5 text-rose-400" />
          <h3 className="text-rose-200 font-mono text-xs uppercase tracking-widest">Completed</h3>
          <div className="text-2xl font-black text-white font-mono">142</div>
        </div>
      </div>

      <div className="flex-1 rounded-2xl border border-rose-500/20 bg-black/40 p-8 backdrop-blur-xl flex items-center justify-center relative overflow-hidden">
        <div className="text-rose-500/50 font-mono tracking-widest text-lg uppercase animate-pulse">
          AWAITING COMMAND ORDERS...
        </div>
      </div>
    </div>
  )
}
