"use client"

import React from "react"
import { Hexagon, ArrowRight } from "lucide-react"

export function HeroBanner({
  profile,
  name = "Operator",
}: {
  profile?: {
    title?: string
    level?: number
  } | null
  name?: string
}) {
  return (
    <div className="bg-space relative mb-6 overflow-hidden rounded-2xl border border-cyan-500/20 p-6 shadow-[0_10px_30px_rgba(0,240,255,0.05)] md:p-8">
      {/* Background Earth image with dark gradient overlays */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-screen" />
        <div className="from-space via-space/80 to-space/40 absolute inset-0 bg-gradient-to-r" />
        <div className="from-space absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        {/* Left Side: User Info */}
        <div className="space-y-4">
          <div>
            <p className="font-mono text-xs text-primary/60">System Online,</p>
            <h1 className="font-sans text-4xl font-bold tracking-tight text-white">
              {name}
            </h1>
            <p className="font-mono text-xs text-cyan-400">
              Rank: {profile?.title || "Explorer"} • Level {profile?.level || 1}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="tag-clip flex items-center gap-2 border border-cyan-500/30 bg-cyan-950/40 px-3 py-1.5 backdrop-blur-md">
              <Hexagon className="h-4 w-4 text-cyan-400" />
              <span className="font-mono text-xs text-cyan-300">
                ACTIVE SECTOR • ALPHA
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Mission Briefing */}
        <div className="w-full max-w-sm rounded-xl border border-cyan-500/30 bg-black/50 p-5 shadow-[0_0_30px_rgba(0,240,255,0.1)] backdrop-blur-xl transition-all hover:border-cyan-500/50 hover:shadow-[0_0_40px_rgba(0,240,255,0.2)]">
          <h3 className="mb-2 font-sans text-xs font-bold tracking-wider text-cyan-400 uppercase">
            Mission Briefing
          </h3>
          <p className="mb-4 font-sans text-sm text-primary/80">
            Stay curious, keep observing, and let knowledge lead you closer to
            the Creator.
          </p>
          <button className="group flex items-center gap-2 font-mono text-xs font-medium text-cyan-400 transition-colors hover:text-cyan-300">
            View Full Briefing
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  )
}
