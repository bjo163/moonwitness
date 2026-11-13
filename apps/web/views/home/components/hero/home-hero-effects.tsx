"use client"

import React from "react"

export interface HomeHeroShakeOverlayProps {
  isShaking: boolean
}

export function HomeHeroShakeOverlay({ isShaking }: HomeHeroShakeOverlayProps) {
  if (!isShaking) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[800] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden opacity-50 mix-blend-screen">
        <div
          className="absolute inset-[-100%] animate-[matrixRain_2s_linear_infinite]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0, transparent 40px, rgba(34, 211, 238, 0.4) 40px, rgba(52, 211, 153, 0.8) 42px, transparent 44px)",
            backgroundSize: "100% 200px",
          }}
        />
        <div
          className="absolute inset-[-100%] animate-[matrixRain_3s_linear_infinite]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0, transparent 60px, rgba(250, 204, 21, 0.4) 60px, rgba(255, 255, 255, 0.8) 62px, transparent 64px)",
            backgroundSize: "20px 300px",
            marginLeft: "15px",
          }}
        />
      </div>

      <div className="absolute inset-0 animate-[pulse_0.5s_infinite] bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.1)_0%,transparent_70%)]" />
      <div className="absolute inset-0 animate-pulse border-[4px] border-border shadow-sm" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[length:100%_4px]" />
      <div className="pointer-events-none absolute inset-0 flex animate-[smoothSubliminal_2s_infinite] items-center justify-center">
        <span className="font-sans text-5xl font-black tracking-[0.8em] text-foreground drop-shadow-sm md:text-8xl">
          OVERRIDE
        </span>
      </div>
    </div>
  )
}

export interface HomeHeroLevelUpProps {
  isLevelUp: boolean
  xpData: { iman: number; taqwa: number; ilm: number }
}

export function HomeHeroLevelUp({ isLevelUp, xpData }: HomeHeroLevelUpProps) {
  if (!isLevelUp) return null

  return (
    <div className="pointer-events-none fixed top-24 left-10 z-[1000] flex flex-col items-start">
      <div className="relative flex w-[280px] animate-in flex-col gap-3 rounded-lg border border-border bg-card p-5 shadow-sm backdrop-blur-md duration-700 ease-out fill-mode-forwards slide-in-from-left-10 fade-in">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-primary shadow-sm" />
          <div className="font-mono text-[10px] font-bold tracking-[0.3em] text-primary">
            SYSTEM OVERRIDE COMPLETE
          </div>
        </div>

        <h1 className="text-xl font-light tracking-[0.2em] text-foreground">
          RANK ASCENDED
        </h1>

        <div className="mt-2 flex w-full flex-col gap-2 font-mono text-[11px] text-primary/70">
          <div className="flex animate-in justify-between border-b border-border pb-1 delay-[300ms] fill-mode-both fade-in slide-in-from-left-2">
            <span className="tracking-widest">FAITH SYNC</span>
            <span className="text-primary">+{xpData.iman} XP</span>
          </div>
          <div className="flex animate-in justify-between border-b border-border pb-1 delay-[600ms] fill-mode-both fade-in slide-in-from-left-2">
            <span className="tracking-widest">PIETY RESONANCE</span>
            <span className="text-primary">+{xpData.taqwa} XP</span>
          </div>
          <div className="flex animate-in justify-between border-b border-border pb-1 delay-[900ms] fill-mode-both fade-in slide-in-from-left-2">
            <span className="tracking-widest">KNOWLEDGE DB</span>
            <span className="text-primary">+{xpData.ilm} XP</span>
          </div>
        </div>

        {/* Futuristic Data Bar */}
        <div className="mt-2 w-full border border-border bg-card p-0.5">
          <div className="h-1 w-0 animate-[fillBar_2.5s_ease-out_forwards_1.2s] bg-primary shadow-sm" />
        </div>
      </div>
    </div>
  )
}
