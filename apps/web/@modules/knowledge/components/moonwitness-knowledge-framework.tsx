"use client"

import React from "react"
import { THEME_TOKENS } from "@core/tokens/theme-tokens"
import {
  BookOpen,
  Orbit,
  Brain,
  Sun,
  ArrowRight,
  Sparkles,
  Globe,
  Cpu,
} from "lucide-react"
import { Panel } from "@core/ui"
import { Section, SectionBadge } from "@core/ui"

export function MoonwitnessKnowledgeFramework() {
  const fw = THEME_TOKENS.framework

  return (
    <Section id="knowledge-framework" borderColor="cyan" className="relative">
      {/* ═══ LAYER 1: DEEP SPACE SCI-FI GRADIENTS & WIREFRAME GRID ═════════ */}
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-radial-gradient absolute top-1/2 left-1/2 h-[600px] w-[1000px] -translate-x-1/2 -translate-y-1/2 from-cyan-900/15 via-indigo-950/10 to-transparent blur-[140px]" />
      </div>

      <div className="relative z-10">
        {/* OUTER SCI-FI DIAGNOSTIC FRAME (From Image 3 perimeter casing) */}
        <Panel className="bg-space/90 relative p-6 shadow-[0_0_50px_rgba(0,200,255,0.18)] backdrop-blur-xl transition-all duration-700 ease-out">
          {/* Top Frame Telemetry Label */}
          <div className="bg-space btn-clip absolute -top-3 left-1/2 z-50 -translate-x-1/2 border border-primary/50 px-6 py-0.5 text-[10px] font-black tracking-[0.3em] text-primary uppercase shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            ─── KNOWLEDGE CORE ───
          </div>

          {/* ═══ LAYER 3 & LAYER 5: TOP TELEMETRY & DOCTRINE HEADER (Image 3) */}
          <div className="mb-12 flex flex-col items-start justify-between gap-8 border-b border-white/15 pb-10 lg:flex-row lg:items-center">
            <div className="space-y-4">
              <SectionBadge
                number="02"
                label="THE MOONWITNESS KNOWLEDGE FRAMEWORK"
              />

              <h2 className="flex items-center gap-4 font-mono text-4xl font-black tracking-wider text-white uppercase drop-shadow-[0_0_30px_rgba(255,255,255,0.35)] sm:text-6xl">
                <span className="flex items-center">
                  <span className="text-danger drop-shadow-[0_0_15px_#FF3355]">
                    R
                  </span>
                  <span className="text-success drop-shadow-[0_0_15px_#00FF66]">
                    G
                  </span>
                  <span className="text-primary drop-shadow-[0_0_15px_#00F0FF]">
                    B
                  </span>
                </span>
                <ArrowRight className="animate-bounce-x h-8 w-8 text-white drop-shadow-[0_0_15px_#FFF] sm:h-12 sm:w-12" />
                <span className="tracking-widest text-white drop-shadow-[0_0_25px_#FFF]">
                  LIGHT
                </span>
              </h2>
            </div>

            <div className="max-w-2xl rounded-md border-y border-r border-l-4 border-primary border-primary/30 bg-primary/90 p-5 py-2 pl-6 font-mono text-xs leading-relaxed text-primary shadow-[0_0_25px_rgba(0,240,255,0.15)] sm:text-sm">
              <p className="mb-2.5 font-sans leading-relaxed font-normal text-foreground">
                Light does not represent omniscience itself. Rather, it
                symbolizes the integration of{" "}
                <span className="text-danger font-mono font-black">
                  Reality (Haqiqah)
                </span>
                ,{" "}
                <span className="text-success font-mono font-black">
                  Flourishing (Falāḥ)
                </span>
                , and{" "}
                <span className="font-mono font-black text-primary">
                  Wisdom (Ḥikmah)
                </span>{" "}
                into a coherent understanding.
              </p>
              <div className="flex items-center gap-2 border-t border-white/10 pt-2.5 font-mono text-xs font-black tracking-[0.15em] text-emerald-400 uppercase">
                <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
                <span>
                  {/* RGB IS THE PATH TOWARD INTEGRATED UNDERSTANDING. */}
                </span>
              </div>
            </div>
          </div>

          {/* ═══ LAYER 3 & LAYER 4: THE 4 INTERCONNECTED KNOWLEDGE MODULES (Image 3) */}
          <div className="relative my-10 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* 1. RED // HAQIQAH */}
            <Panel
              accentColor="danger"
              className="group bg-space/80 flex min-h-[380px] flex-col justify-between p-7 backdrop-blur-xl"
            >
              <div>
                <div className="border-danger/30 mb-4 flex items-center justify-between border-b pb-3.5">
                  <span className="text-danger bg-danger/15 border-danger/60 tag-clip border px-3 py-1 text-xs font-black tracking-widest uppercase shadow-[0_0_10px_rgba(255,51,85,0.4)]">
                    01 // RED
                  </span>
                  <span className="bg-danger h-2.5 w-2.5 animate-ping rounded-full shadow-[0_0_10px_#FF3355]" />
                </div>
                <h3 className="mb-1 font-mono text-3xl font-black tracking-widest text-white uppercase drop-shadow-[0_0_10px_rgba(255,51,85,0.5)]">
                  HAQIQAH
                </h3>
                <div className="text-warning mb-6 font-mono text-[11px] font-black tracking-[0.2em] uppercase">
                  REALITY • HISTORY • TRUTH
                </div>
              </div>

              {/* Glowing Optic Center Emblem */}
              <div className="relative my-6 flex items-center justify-center">
                <div className="bg-radial-gradient from-danger/30 via-space border-danger/50 relative z-10 flex h-28 w-28 items-center justify-center rounded-full border to-black shadow-[0_0_40px_rgba(255,51,85,0.7)] transition-transform duration-300 group-hover:scale-110">
                  <div
                    className="border-danger/60 animate-spin-slow absolute h-[120%] w-[120%] rounded-full border border-dashed"
                    style={{ animationDuration: "25s" }}
                  />
                  <BookOpen className="text-danger h-12 w-12 drop-shadow-[0_0_15px_#FF3355]" />
                </div>

                {/* Optical Laser Data Bridge to Card 2 (Desktop ONLY) */}
                <div className="absolute top-1/2 -right-[40px] z-30 hidden -translate-y-1/2 items-center lg:flex">
                  <div className="bg-danger h-[3px] w-8 shadow-[0_0_12px_#FF3355]" />
                  <div className="h-0 w-0 border-t-[6px] border-b-[6px] border-l-[9px] border-t-transparent border-b-transparent border-l-[#FF3355]" />
                </div>
              </div>

              <p className="border-danger/30 mt-auto border-t pt-6 font-sans text-xs leading-relaxed font-normal text-primary">
                Discover reality through history, scripture, human civilization,
                and empirical reflections upon ancestral truth.
              </p>
            </Panel>

            {/* 2. GREEN // FALĀḤ */}
            <Panel
              accentColor="success"
              className="group bg-space/80 flex min-h-[380px] flex-col justify-between p-7 backdrop-blur-xl"
            >
              <div>
                <div className="mb-4 flex items-center justify-between border-b border-emerald-400/30 pb-3.5">
                  <span className="tag-clip border border-emerald-400/60 bg-emerald-500/15 px-3 py-1 text-xs font-black tracking-widest text-emerald-400 uppercase shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                    02 // GREEN
                  </span>
                  <span className="h-2.5 w-2.5 animate-ping rounded-full bg-emerald-400 shadow-[0_0_10px_#10B981]" />
                </div>
                <h3 className="mb-1 font-mono text-3xl font-black tracking-widest text-white uppercase drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                  FALĀḤ
                </h3>
                <div className="text-success mb-6 font-mono text-[11px] font-black tracking-[0.2em] uppercase">
                  CREATION • UNIVERSE • GROWTH
                </div>
              </div>

              <div className="relative my-6 flex items-center justify-center">
                <div className="bg-radial-gradient via-space relative z-10 flex h-28 w-28 items-center justify-center rounded-full border border-emerald-400/50 from-emerald-500/30 to-black shadow-[0_0_40px_rgba(16,185,129,0.7)] transition-transform duration-300 group-hover:scale-110">
                  <div
                    className="animate-spin-slow absolute h-[120%] w-[120%] rounded-full border border-dashed border-emerald-400/60"
                    style={{ animationDuration: "35s" }}
                  />
                  <Orbit className="animate-spin-slow h-12 w-12 text-emerald-400 drop-shadow-[0_0_15px_#10B981]" />
                </div>

                {/* Optical Laser Data Bridge to Card 3 */}
                <div className="absolute top-1/2 -right-[40px] z-30 hidden -translate-y-1/2 items-center lg:flex">
                  <div className="h-[3px] w-8 bg-emerald-400 shadow-[0_0_12px_#10B981]" />
                  <div className="h-0 w-0 border-t-[6px] border-b-[6px] border-l-[9px] border-t-transparent border-b-transparent border-l-emerald-400" />
                </div>
              </div>

              <p className="mt-auto border-t border-emerald-400/30 pt-6 font-sans text-xs leading-relaxed font-normal text-primary">
                Observe creation, explore the cosmos, study scientific
                astronomy, and cultivate flourishing throughout the living
                natural world.
              </p>
            </Panel>

            {/* 3. BLUE // ḤIKMAH */}
            <Panel
              accentColor="primary"
              className="group bg-space/80 flex min-h-[380px] flex-col justify-between p-7 backdrop-blur-xl"
            >
              <div>
                <div className="mb-4 flex items-center justify-between border-b border-primary/30 pb-3.5">
                  <span className="tag-clip border border-primary/60 bg-cyan-500/15 px-3 py-1 text-xs font-black tracking-widest text-primary uppercase shadow-[0_0_10px_rgba(0,240,255,0.4)]">
                    03 // BLUE
                  </span>
                  <span className="h-2.5 w-2.5 animate-ping rounded-full bg-cyan-400 shadow-[0_0_10px_#00F0FF]" />
                </div>
                <h3 className="mb-1 font-mono text-3xl font-black tracking-widest text-white uppercase drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
                  ḤIKMAH
                </h3>
                <div className="mb-6 font-mono text-[11px] font-black tracking-[0.2em] text-primary uppercase">
                  WISDOM • REFLECTION • PURPOSE
                </div>
              </div>

              <div className="relative my-6 flex items-center justify-center">
                <div className="bg-radial-gradient via-space relative z-10 flex h-28 w-28 items-center justify-center rounded-full border border-primary/50 from-cyan-500/30 to-black shadow-[0_0_40px_rgba(0,240,255,0.7)] transition-transform duration-300 group-hover:scale-110">
                  <div
                    className="animate-spin-slow absolute h-[120%] w-[120%] rounded-full border border-dashed border-primary/60"
                    style={{
                      animationDuration: "30s",
                      animationDirection: "reverse",
                    }}
                  />
                  <Brain className="h-12 w-12 text-primary drop-shadow-[0_0_15px_#00F0FF]" />
                </div>

                {/* Optical Laser Data Bridge to Card 4 */}
                <div className="absolute top-1/2 -right-[40px] z-30 hidden -translate-y-1/2 items-center lg:flex">
                  <div className="h-[3px] w-8 bg-cyan-400 shadow-[0_0_12px_#00F0FF]" />
                  <div className="h-0 w-0 border-t-[6px] border-b-[6px] border-l-[9px] border-t-transparent border-b-transparent border-l-cyan-400" />
                </div>
              </div>

              <p className="mt-auto border-t border-primary/30 pt-6 font-sans text-xs leading-relaxed font-normal text-primary">
                Synthesize reality and creation through divine guidance,
                extracting profound meaning and eternal wisdom.
              </p>
            </Panel>

            {/* 4. LIGHT // ILLUMINATION */}
            <Panel
              accentColor="secondary"
              className="group bg-panel/80 flex min-h-[380px] flex-col justify-between p-7 backdrop-blur-xl"
            >
              <div>
                <div className="mb-4 flex items-center justify-between border-b border-white/30 pb-3.5">
                  <span className="tag-clip border border-white/50 bg-white/10 px-3 py-1 text-xs font-black tracking-widest text-white uppercase shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                    // LIGHT
                  </span>
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white shadow-[0_0_15px_#FFF]" />
                </div>
                <h3 className="mb-1 font-mono text-3xl font-black tracking-widest text-white uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
                  NŪR
                </h3>
                <div className="mb-6 flex items-center gap-2 font-mono text-[11px] font-black tracking-[0.2em] text-foreground uppercase">
                  <Sparkles className="h-3 w-3 text-white" />
                  THE ULTIMATE SYNTHESIS
                </div>
              </div>

              <div className="relative my-6 flex items-center justify-center">
                {/* Hyper-glowing White Core */}
                <div className="bg-radial-gradient via-panel relative z-10 flex h-28 w-28 items-center justify-center rounded-full border border-white/70 from-white/40 to-black shadow-[0_0_60px_rgba(255,255,255,0.6)] transition-transform duration-500 group-hover:scale-110">
                  <div
                    className="animate-spin-slow absolute h-[130%] w-[130%] rounded-full border-2 border-dotted border-white/40"
                    style={{ animationDuration: "15s" }}
                  />
                  <div
                    className="animate-spin-slow absolute h-[90%] w-[90%] rounded-full border border-white/20"
                    style={{
                      animationDuration: "10s",
                      animationDirection: "reverse",
                    }}
                  />
                  <Sun className="h-14 w-14 text-white drop-shadow-[0_0_25px_#FFF]" />
                </div>

                {/* Connecting Rays from the left (absorbing RGB) */}
                <div className="absolute top-1/2 -left-[40px] z-0 hidden -translate-y-1/2 lg:block">
                  <div className="h-px w-[40px] bg-gradient-to-r from-transparent via-white/50 to-white/90 shadow-[0_0_10px_#FFF]" />
                </div>
              </div>

              <p className="mt-auto border-t border-white/40 pt-6 font-sans text-xs leading-relaxed font-medium text-white/90">
                The integrated state of awareness. When Truth, Flourishing, and
                Wisdom align, the mind reaches enlightenment (Nūr).
              </p>
            </Panel>
          </div>

          {/* ═══ LAYER 3 & LAYER 4: THE INTEGRATION PATH DECK (From Image 3) ════ */}
          <div className="bg-space mt-12 rounded-lg border border-cyan-500/40 p-7 font-mono text-xs shadow-inner">
            <div className="mb-6 flex items-center gap-3 border-b border-primary/30 pb-4">
              <Cpu className="h-5 w-5 animate-pulse text-primary" />
              <span className="text-sm font-black tracking-widest text-white uppercase drop-shadow-[0_0_10px_#00F0FF]">
                THE INTEGRATION PATH
              </span>
              <span className="hidden font-sans text-xs text-primary md:inline">
                {/* Three pillars. One understanding. The journey from observation to illumination. */}
              </span>
            </div>

            {/* 4 Sequential Stage Flow (Image 3) */}
            <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="bg-space border-danger/60 hover:border-danger flex items-center justify-between rounded-md border p-4 shadow-inner transition-all">
                <div className="flex items-center gap-3.5">
                  <div className="bg-danger/20 border-danger text-danger shrink-0 rounded-full border p-2.5 shadow-[0_0_10px_#FF3355]">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black tracking-wider text-white uppercase">
                      OBSERVE REALITY
                    </div>
                    <div className="font-sans text-[11px] text-primary">
                      Through history and revelation
                    </div>
                  </div>
                </div>
                <span className="text-danger ml-2 hidden text-base font-black xl:inline">
                  ➔
                </span>
              </div>

              <div className="bg-space flex items-center justify-between rounded-md border border-emerald-400/60 p-4 shadow-inner transition-all hover:border-emerald-400">
                <div className="flex items-center gap-3.5">
                  <div className="shrink-0 rounded-full border border-emerald-400 bg-emerald-500/20 p-2.5 text-emerald-400 shadow-[0_0_10px_#10B981]">
                    <Orbit className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black tracking-wider text-white uppercase">
                      EXPLORE CREATION
                    </div>
                    <div className="font-sans text-[11px] text-primary">
                      Through cosmos and signs
                    </div>
                  </div>
                </div>
                <span className="ml-2 hidden text-base font-black text-emerald-400 xl:inline">
                  ➔
                </span>
              </div>

              <div className="bg-space flex items-center justify-between rounded-md border border-primary/60 p-4 shadow-inner transition-all hover:border-primary">
                <div className="flex items-center gap-3.5">
                  <div className="shrink-0 rounded-full border border-primary bg-cyan-500/20 p-2.5 text-primary shadow-[0_0_10px_#00F0FF]">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black tracking-wider text-white uppercase">
                      REFLECT WISDOM
                    </div>
                    <div className="font-sans text-[11px] text-primary">
                      Through deep contemplation
                    </div>
                  </div>
                </div>
                <span className="ml-2 hidden text-base font-black text-primary xl:inline">
                  ➔
                </span>
              </div>

              <div className="to-space flex items-center justify-between rounded-md border-2 border-white bg-gradient-to-r from-white/15 via-primary p-4 shadow-[0_0_25px_rgba(255,255,255,0.25)]">
                <div className="flex items-center gap-3.5">
                  <div className="shrink-0 animate-pulse rounded-full border border-white bg-white/20 p-2.5 text-white shadow-[0_0_12px_#FFF]">
                    <Sun className="h-5 w-5 drop-shadow-[0_0_8px_#FFF]" />
                  </div>
                  <div>
                    <div className="text-xs font-black tracking-wider text-white uppercase drop-shadow-[0_0_8px_#FFF]">
                      ILLUMINATE UNDERSTANDING
                    </div>
                    <div className="font-sans text-[11px] text-foreground">
                      Through integrated unity
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Diagnostic Strip (From Image 3) */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-4 font-mono text-xs tracking-wider text-primary">
              <div className="font-bold text-white">
                <span>SYSTEM ID: </span>
                <span className="text-primary">MWOS-2026-0525</span>
              </div>

              <div className="flex items-center gap-2.5 rounded-sm border border-primary/30 bg-black px-4 py-1">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      className="inline-block h-2 w-2.5 animate-pulse bg-emerald-400 shadow-[0_0_6px_#10B981]"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
                <span className="mx-1 text-white/30">|</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      className="inline-block h-2 w-2.5 animate-pulse bg-cyan-400 shadow-[0_0_6px_#00F0FF]"
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                  ))}
                </div>
                <span className="ml-2 text-xs font-black tracking-widest text-white">
                  {/* KNOWLEDGE FLOW ACTIVE // */}
                </span>
              </div>

              <div className="flex items-center gap-2 font-black text-emerald-400 drop-shadow-[0_0_8px_#10B981]">
                <span>KNOWLEDGE CORE STATUS: SYNCHRONIZED</span>
                <Globe className="animate-spin-slow h-4 w-4 text-emerald-400" />
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </Section>
  )
}
