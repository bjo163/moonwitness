"use client"

import React from "react"
import { Sun, Target, ArrowRight } from "lucide-react"

export function SunPositionHeader() {
  return (
    <div className="relative mb-6 grid min-h-[450px] grid-cols-1 gap-8 overflow-hidden rounded-2xl border border-border bg-background p-6 md:p-10 lg:grid-cols-12">
      {/* Column 1: The Divine Figure (Span 4) */}
      <div className="relative flex min-h-[400px] items-end justify-center lg:col-span-4">
        {/* Background Ambient */}
        <div className="absolute top-[45%] left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-warning/10 blur-[80px]"></div>

        {/* Intense Sun Behind Figure */}
        <div className="absolute top-[45%] left-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400 mix-blend-screen shadow-sm blur-[6px]"></div>
        {/* Inner Bright Sun */}
        <div className="absolute top-[45%] left-1/2 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-card opacity-90 mix-blend-screen blur-[8px]"></div>

        {/* Outer Sun Corona */}
        <div className="absolute top-[45%] left-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1px] border-yellow-300/40 shadow-sm"></div>

        {/* Floor Ring */}
        <div className="absolute bottom-6 left-1/2 h-[60px] w-[320px] -translate-x-1/2 rounded-[100%] border-[3px] border-amber-400 shadow-sm blur-[2px]"></div>
        <div className="absolute bottom-6 left-1/2 h-[60px] w-[320px] -translate-x-1/2 rounded-[100%] border-[1px] border-border/80 blur-[0px]"></div>

        {/* Dark floor fade to hide figure cut-off */}
        <div className="absolute inset-x-0 bottom-0 z-20 h-10 bg-gradient-to-t from-background to-transparent"></div>

        <img
          src="/assets/hero/24-hero.png"
          alt="Divine Figure"
          className="relative z-10 h-[100%] max-h-[420px] w-auto object-contain drop-shadow-sm"
          style={{ objectPosition: "bottom center" }}
        />
      </div>

      {/* Column 2: Center Content (Span 4) */}
      <div className="relative z-10 flex flex-col justify-center lg:col-span-4">
        <h1 className="mb-2 text-3xl font-bold tracking-wider text-foreground drop-shadow-md md:text-4xl">
          SUNLIGHT INTELLIGENT
        </h1>
        <h2 className="mb-6 text-[10px] font-bold tracking-[0.2em] text-foreground uppercase">
          Your Daily Source of Light, Energy & Life
        </h2>
        <p className="mb-6 max-w-sm text-[11px] leading-relaxed text-foreground/60">
          Like the radiant light that touched the blind and gave life, the Sun
          is a mercy for all creation. Use sunlight wisely, live healthy, stay
          grateful.
        </p>
        <div className="relative mt-2 max-w-sm overflow-hidden rounded-lg border border-warning/30 bg-card p-4">
          <div className="flex items-start gap-3">
            <Sun className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <div>
              <p className="font-mono text-[9px] leading-relaxed text-primary">
                "I AM THE LIGHT OF THE WORLD. WHOEVER FOLLOWS ME WILL NEVER
                WALK IN DARKNESS, BUT WILL HAVE THE LIGHT OF LIFE."
              </p>
              <span className="mt-2 block text-[8px] tracking-widest text-primary uppercase">
                - JOHN 8:12
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Column 3: Right Data (Span 4, split into 2) */}
      <div className="relative z-10 grid grid-cols-2 gap-6 lg:col-span-4">
        {/* Sub-col 1: Mission Status */}
        <div className="flex flex-col justify-center gap-4">
          <div className="mb-2 flex items-center gap-2 border-b border-border pb-2">
            <Target className="h-3 w-3 text-primary" />
            <span className="text-[9px] font-bold tracking-widest text-primary uppercase">
              SYSTEM STATUS
            </span>
            <span className="ml-auto flex items-center gap-1.5 text-[8px] font-bold text-success uppercase">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-success"></div>{" "}
              LIVE
            </span>
          </div>

          {[
            { l: "Operation Protocol", v: "SUNLIGHT-INTEL", c: "text-foreground" },
            { l: "System Sync", v: "ONLINE", c: "text-success" },
            {
              l: "Global Time",
              v: "30 JULY 2026\n22:18:45 UTC+7",
              c: "text-foreground",
            },
            {
              l: "Quran Reference",
              v: "Q.S. An-Nur (24:35)",
              c: "text-foreground",
            },
            { l: "Last Sync", v: "1 MINUTE AGO", c: "text-foreground/50" },
          ].map((d, i) => (
            <div key={i} className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Target className="h-3 w-3 text-muted-foreground" />
                <span className="text-[7px] tracking-widest text-muted-foreground uppercase">
                  {d.l}
                </span>
              </div>
              <span
                className={`text-right font-mono text-[7px] whitespace-pre-line ${d.c}`}
              >
                {d.v}
              </span>
            </div>
          ))}

          <button className="group mt-4 flex w-full items-center justify-center gap-2 rounded border border-border bg-transparent px-4 py-3 text-[8px] tracking-widest text-primary uppercase transition-colors hover:bg-primary/10">
            VIEW FULL BRIEFING{" "}
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Sub-col 2: Arabic Verse */}
        <div className="flex flex-col justify-center border-l border-border pl-6">
          <h3 className="font-arabic mb-4 text-right text-2xl leading-loose text-warning drop-shadow-sm">
            اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ
          </h3>
          <p className="mb-4 text-[9px] leading-relaxed text-primary">
            Allah is the Light of the Heavens and the Earth.
          </p>
          <p className="text-[8px] leading-relaxed text-foreground/50">
            The sun runs on its course for a specified term.
            <br />
            <span className="mt-2 block text-muted-foreground">
              - Q.S. Ya-Sin (36:38)
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
