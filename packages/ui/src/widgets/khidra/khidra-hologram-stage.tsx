"use client"

import React from "react"

export function KhidraHologramStage() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {/* Glow Behind Hologram */}
      <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />

      {/* The Hologram Image */}
      <img
        src="/assets/khidra_hologram.png"
        alt="Khidra Hologram"
        className="relative z-10 h-auto max-h-[70vh] w-auto object-contain mix-blend-screen drop-shadow-sm"
        style={{ filter: "contrast(1.2) brightness(1.1)" }}
      />

      {/* Platform Rings (Blueprint 10 style) */}
      <div
        className="absolute bottom-10 left-1/2 flex w-[600px] -translate-x-1/2 flex-col items-center justify-center"
        style={{ transform: "translate(-50%, 0) rotateX(75deg)" }}
      >
        {/* Ring 1 */}
        <div className="absolute h-[400px] w-[400px] rounded-full border border-primary/60 shadow-sm" />
        {/* Ring 2 */}
        <div className="absolute h-[450px] w-[450px] animate-[spin_10s_linear_infinite] rounded-full border border-dashed border-primary/40" />
        {/* Ring 3 */}
        <div className="absolute h-[500px] w-[500px] rounded-full border border-primary/20" />

        {/* Core Base Light */}
        <div className="absolute h-[200px] w-[200px] rounded-full bg-primary/30 blur-[40px]" />
      </div>

      {/* Floating Chat Bubble */}
      <div className="absolute top-1/3 left-10 z-20 hidden max-w-[200px] animate-pulse rounded-lg border border-primary/40 rounded-xl border border-border/40 bg-card/90 p-4 font-mono shadow-sm lg:block">
        <div className="mb-2 text-sm font-bold text-primary">
          I&apos;m Khidra.
        </div>
        <div className="text-xs text-white">How may I assist you today?</div>
        {/* Speech tail */}
        <div className="absolute top-1/2 -right-2 h-4 w-4 -translate-y-1/2 rotate-45 border-t border-r border-primary/40 bg-black/60" />
      </div>

      {/* Stats Floating Right */}
      <div className="absolute top-1/3 right-10 z-20 hidden flex-col gap-4 font-mono text-[9px] tracking-widest uppercase lg:flex">
        <div className="flex flex-col items-end gap-1">
          <span className="text-primary/60">KNOWLEDGE INDEX</span>
          <span className="text-lg font-bold text-primary drop-shadow-sm">
            98.7%
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-primary/60">RESPONSE ACCURACY</span>
          <span className="text-lg font-bold text-primary drop-shadow-sm">
            96.2%
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-primary/60">SOURCES VERIFIED</span>
          <span className="text-lg font-bold text-primary drop-shadow-sm">
            12.0M+
          </span>
        </div>
      </div>
    </div>
  )
}
