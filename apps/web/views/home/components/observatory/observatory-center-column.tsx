import Image from "next/image"
import React, { useState } from "react"
import { Sun, Compass } from "lucide-react"

export function ObservatoryCenterColumn({ obs }: { obs: any }) {
  const [activeTab, setActiveTab] = useState("CELESTIAL VIEW")

  return (
    <div className="bg-background/40 relative flex min-h-[500px] flex-col justify-between overflow-hidden rounded-2xl border border-cyan-500/40 p-6 shadow-sm backdrop-blur-xl transition-all duration-500 hover:border-cyan-400/60 lg:col-span-6">
      {/* Top View Selector Tabs */}
      <div className="bg-background/60 z-10 mx-auto mb-6 flex w-full max-w-lg items-center justify-center gap-2 rounded-lg border border-cyan-500/30 p-1.5 shadow-inner backdrop-blur-md">
        {["CELESTIAL VIEW", "ORBIT VIEW", "HEMISPHERE", "DEEP SKY"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded py-1.5 text-[10px] font-black tracking-wider uppercase transition-all ${
                activeTab === tab
                  ? "border border-cyan-500/50 bg-cyan-500/20 text-cyan-400 shadow-sm"
                  : "text-primary hover:text-white"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* Center Orbital Viewport Illusion */}
      <div className="relative my-4 flex min-h-[320px] w-full flex-1 items-center justify-center">
        {/* Starry space background graphic */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl border border-cyan-500/20 bg-black/40">
          <img
            src="/assets/hero_bg.png"
            alt="Deep Space Matrix"
            className="h-full w-full object-cover opacity-30 contrast-125 filter"
          />
          <div className="theme-grid-bg absolute inset-0 opacity-20" />
        </div>

        {/* Animated Orbital Ellipses */}
        <div
          className="animate-spin-slow pointer-events-none absolute h-[220px] w-[420px] rounded-[50%] border border-dashed border-amber-400/20"
          style={{ animationDuration: "60s" }}
        />
        <div
          className="animate-spin-slow pointer-events-none absolute h-[320px] w-[320px] rounded-full border border-primary/20"
          style={{
            animationDirection: "reverse",
            animationDuration: "45s",
          }}
        />
        <div className="pointer-events-none absolute h-[200px] w-[200px] rounded-full border border-emerald-400/10" />

        {/* Sun Object */}
        <div className="bg-background/70 animate-float absolute top-6 left-10 flex items-center gap-2 rounded-lg border border-amber-500/40 p-2 shadow-sm backdrop-blur-md">
          <Sun className="animate-spin-slow h-6 w-6 shrink-0 text-amber-400" />
          <div className="font-mono text-[9px] leading-tight">
            <div className="text-xs font-black text-amber-400">SUN ☀</div>
            <div className="text-primary">ALT 32.4° • AZ 128.7°</div>
          </div>
        </div>

        {/* Center High-Res Moon Sphere */}
        <div className="group relative z-20 flex flex-col items-center">
          <div className="flex h-48 w-48 items-center justify-center overflow-hidden rounded-full border-2 border-primary/40 shadow-sm transition-transform duration-700 hover:scale-105 sm:h-56 sm:w-56">
            <img
              src="/assets/cam_moon.png"
              alt="Lunar Terminal"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="bg-background/80 mt-3 rounded-full border border-cyan-500/40 px-3 py-1 text-center shadow-sm backdrop-blur-md">
            <span className="font-mono text-xs font-black tracking-widest text-primary uppercase">
              ◎ MOON // 384,400 KM
            </span>
          </div>
        </div>

        {/* Earth & Qibla Vector */}
        <div className="bg-background/70 absolute bottom-6 left-6 flex items-center gap-2.5 rounded-lg border border-primary/40 p-2 shadow-sm backdrop-blur-md sm:left-10">
          <Image
            unoptimized
            width={120}
            height={120}
            src="/assets/cam_earth.png"
            alt="Earth"
            className="h-8 w-8 rounded-full border border-primary shadow-sm"
          />
          <div className="font-mono text-[9px] leading-tight">
            <div className="text-xs font-black text-primary">EARTH 🌐</div>
            <div className="text-primary">LAT -6.200° • LON 106.816°</div>
          </div>
        </div>

        <div className="bg-background/70 absolute right-6 bottom-6 flex items-center gap-2.5 rounded-lg border border-emerald-400/40 p-2.5 shadow-sm backdrop-blur-md sm:right-10">
          <Compass className="animate-bounce-x h-6 w-6 text-emerald-400" />
          <div className="text-right font-mono text-[9px] leading-tight">
            <div className="text-xs font-black text-emerald-400">
              QIBLA VECTOR
            </div>
            <div className="text-white">
              {obs.loading ? "---" : obs.qibla}° NW // 8,865 KM
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 4 Diagnostic Pills */}
      <div className="z-10 grid grid-cols-2 gap-2 border-t border-white/10 pt-4 text-center font-mono text-[10px] font-black uppercase sm:grid-cols-4">
        <span className="flex items-center justify-center gap-1.5 rounded border border-cyan-500/40 bg-cyan-950/40 px-2 py-1 text-primary shadow-sm backdrop-blur-sm">
          <span className="h-1.5 w-1.5 animate-ping rounded-full bg-cyan-400" />{" "}
          ORBIT TRACE ON
        </span>
        <span className="flex items-center justify-center gap-1.5 rounded border border-purple-400/40 bg-purple-950/40 px-2 py-1 text-purple-300 shadow-sm backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400" /> STAR FIELD
          ON
        </span>
        <span className="flex items-center justify-center gap-1.5 rounded border border-blue-400/40 bg-blue-950/40 px-2 py-1 text-blue-300 shadow-sm backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" /> ATMOSPHERE
          ON
        </span>
        <span className="flex items-center justify-center gap-1.5 rounded border border-emerald-400/40 bg-emerald-950/40 px-2 py-1 text-emerald-300 shadow-sm backdrop-blur-sm">
          <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400" />{" "}
          QIBLA LINE ON
        </span>
      </div>
    </div>
  )
}
