"use client"

import React from "react"
import Image from "next/image"
import { Book, Target, ShieldCheck, Globe } from "lucide-react"

const FLOATING_STATS = [
  { l: "KNOWLEDGE INDEX", v: "98.7%", icon: Book, color: "text-success" },
  { l: "RESPONSE ACCURACY", v: "96.2%", icon: Target, color: "text-primary" },
  { l: "SOURCES VERIFIED", v: "12.8M+", icon: ShieldCheck, color: "text-blue-400" },
  { l: "LANGUAGES", v: "12", icon: Globe, color: "text-pink-400" },
]

export function KhidraHologramCanvas() {
  return (
    <div className="flex flex-col gap-6 lg:col-span-5">
      <div className="bg-background relative flex min-h-[400px] flex-1 items-center justify-center overflow-hidden rounded-2xl border-2 border-success/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.15)_0%,transparent_70%)]" />

        {/* Telemetry Rings */}
        <div className="absolute bottom-10 h-12 w-[80%] rounded-[50%] border-2 border-success/40 blur-xs" />
        <div className="absolute bottom-12 h-8 w-[60%] rounded-[50%] border border-primary/50" />
        <div className="absolute bottom-14 h-4 w-[40%] animate-pulse rounded-[50%] border border-border" />

        {/* The AI Hologram Character */}
        <div className="relative z-10 flex h-[90%] w-full items-end justify-center drop-shadow-sm">
          <Image
            unoptimized
            width={120}
            height={120}
            src="/assets/khidra_hologram.png"
            alt="Khidra AI Hologram"
            className="h-full object-contain mix-blend-screen"
            style={{
              filter: "brightness(1.2) contrast(1.1) saturate(1.3) hue-rotate(10deg)",
            }}
          />
        </div>

        {/* Floating Chat Bubble */}
        <div className="bg-background/80 absolute top-1/4 left-[10%] z-20 rounded-xl rounded-tr-xs border border-success/50 p-4 shadow-xs backdrop-blur-xs">
          <div className="mb-1 font-bold text-success">I&apos;m Khidra.</div>
          <div className="text-xs text-foreground">
            How may I assist you
            <br />
            today?
          </div>
          <div className="bg-background absolute top-0 -right-2 h-4 w-4 rotate-45 border-t border-r border-success/50" />
        </div>

        {/* Floating Stats */}
        <div className="absolute top-1/4 right-[5%] z-20 space-y-4">
          {FLOATING_STATS.map((stat, i) => (
            <div
              key={i}
              className="bg-background/80 flex items-center gap-3 rounded-lg border border-border p-2.5 shadow-xs backdrop-blur-xs"
            >
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <div>
                <div className="text-[8px] font-black tracking-wider text-muted-foreground uppercase">
                  {stat.l}
                </div>
                <div className={`font-mono text-xs font-black ${stat.color}`}>
                  {stat.v}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
