"use client"

import React from "react"
import { Activity, Smile, Clock, Zap, Heart } from "lucide-react"

export function SunPositionDataMonitoring() {
  return (
    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Vitamin D Level Monitor */}
      <div className="flex flex-col items-center justify-between rounded-xl border border-border bg-card p-5">
        <div className="mb-4 w-full text-left">
          <h3 className="mb-1 text-[10px] font-bold tracking-widest text-foreground uppercase">
            VITAMIN D LEVEL MONITOR
          </h3>
          <p className="text-[9px] text-muted-foreground">Blood 25(OH)D Estimate</p>
        </div>

        <div className="relative mt-2 mb-6 flex h-36 w-36 items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full -rotate-90"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#1E293B"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#34D399"
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset="23"
              strokeLinecap="round"
              className="drop-shadow-sm"
            />
          </svg>
          <div className="relative z-10 text-center">
            <div className="font-mono text-4xl font-black text-foreground">
              92<span className="text-lg">%</span>
            </div>
            <div className="mt-1 text-[8px] font-bold tracking-widest text-success uppercase">
              OPTIMAL
            </div>
          </div>
        </div>

        <div className="flex w-full justify-center gap-6 text-[8px] text-muted-foreground">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded bg-rose-500" /> 0-20% Deficient
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded bg-amber-500" /> 21-30%
              Insufficient
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded bg-emerald-400" /> 31-60%
              Sufficient
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded bg-emerald-600" /> 61-100%
              Optimal
            </div>
          </div>
        </div>
        <p className="mt-6 text-center text-[9px] leading-relaxed text-foreground/50">
          Keep your level in optimal range for better health & immunity.
        </p>
      </div>

      {/* Sunlight Benefits */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-6">
          <h3 className="mb-1 text-[10px] font-bold tracking-widest text-foreground uppercase">
            SUNLIGHT BENEFITS
          </h3>
          <p className="text-[9px] text-muted-foreground">
            Powered by Sunlight & Science
          </p>
        </div>
        <div className="space-y-5">
          {[
            {
              t: "VITAMIN D PRODUCTION",
              d: "Strengthens bones, immune system, and mood.",
              i: Activity,
            },
            {
              t: "SEROTONIN BOOST",
              d: "Improves mood, reduces stress and anxiety.",
              i: Smile,
            },
            {
              t: "CIRCADIAN RHYTHM",
              d: "Regulates sleep-wake cycle and hormone balance.",
              i: Clock,
            },
            {
              t: "NATURAL ENERGY",
              d: "Improves focus, productivity and alertness.",
              i: Zap,
            },
            {
              t: "SKIN HEALTH",
              d: "Helps skin cell growth, repair and protection.",
              i: Heart,
            },
          ].map((b, i) => (
            <div key={i} className="flex items-start gap-3">
              <b.i className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
              <div>
                <div className="mb-0.5 text-[9px] font-bold tracking-widest text-foreground uppercase">
                  {b.t}
                </div>
                <div className="text-[8px] leading-relaxed text-muted-foreground">
                  {b.d}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Sunlight Exposure */}
      <div className="flex flex-col rounded-xl border border-border bg-card p-5">
        <div className="mb-4">
          <h3 className="mb-1 text-[10px] font-bold tracking-widest text-foreground uppercase">
            TODAY'S SUNLIGHT EXPOSURE
          </h3>
          <p className="text-[9px] text-muted-foreground">
            Daily Sunlight Exposure Tracker
          </p>
        </div>

        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="font-mono text-3xl font-black text-foreground">
              10.2{" "}
              <span className="text-sm font-normal text-muted-foreground">hrs</span>
            </div>
            <div className="mt-1 text-[8px] font-bold tracking-widest text-success uppercase">
              DAILY AVERAGE
            </div>
          </div>
          <div className="flex gap-1 font-mono text-[8px]">
            <div className="rounded bg-muted/30 px-1.5 py-0.5">7D</div>
            <div className="cursor-pointer rounded px-1.5 py-0.5 text-foreground/30 hover:bg-muted/30">
              30D
            </div>
            <div className="cursor-pointer rounded px-1.5 py-0.5 text-foreground/30 hover:bg-muted/30">
              90D
            </div>
          </div>
        </div>

        <div className="relative flex h-32 flex-1 items-end justify-between gap-2">
          <div className="absolute inset-0 border-b border-border" />
          {/* Bars */}
          {[
            { l: "FRI", v: 6.1, h: "50%" },
            { l: "SAT", v: 7.3, h: "60%" },
            { l: "SUN", v: 8.0, h: "70%" },
            { l: "MON", v: 9.5, h: "85%" },
            { l: "TUE", v: 10.2, h: "100%", act: true },
            { l: "WED", v: 8.7, h: "75%" },
            { l: "THU", v: 7.1, h: "55%" },
          ].map((b, i) => (
            <div
              key={i}
              className="group z-10 flex w-full flex-col items-center"
            >
              <div className="mb-2 font-mono text-[8px] text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                {b.v}
              </div>
              <div
                className={`w-full max-w-[14px] rounded-t-sm transition-all duration-1000 ${b.act ? "bg-amber-400 shadow-sm" : "bg-primary/50 hover:bg-primary/10"}`}
                style={{ height: b.h }}
              />
              <div className="mt-2 font-mono text-[7px] text-muted-foreground">
                {b.l}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2 border-t border-border pt-5 text-[9px]">
          <div>
            <div className="mb-1 tracking-widest text-muted-foreground uppercase">
              GOAL
            </div>
            <div className="font-mono text-foreground">8.0 hrs</div>
          </div>
          <div>
            <div className="mb-1 tracking-widest text-muted-foreground uppercase">
              ACHIEVED
            </div>
            <div className="font-mono text-success">
              10.2 hrs
            </div>
          </div>
          <div>
            <div className="mb-1 tracking-widest text-muted-foreground uppercase">
              CONSISTENCY
            </div>
            <div className="font-mono text-foreground">92%</div>
          </div>
        </div>
      </div>

      {/* Sunlight & Mood Boost */}
      <div className="flex flex-col rounded-xl border border-border bg-card p-5">
        <div className="mb-4">
          <h3 className="mb-1 text-[10px] font-bold tracking-widest text-foreground uppercase">
            SUNLIGHT & MOOD BOOST
          </h3>
          <p className="text-[9px] text-muted-foreground">
            Light exposure vs mood correlation
          </p>
        </div>

        <div className="relative mt-4 min-h-[140px] flex-1">
          <svg viewBox="0 0 200 100" className="h-full w-full overflow-visible">
            <path
              d="M 0 90 L 30 75 L 60 65 L 90 40 L 120 45 L 150 20 L 180 15 L 200 10"
              fill="none"
              stroke="#34D399"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-sm"
            />
            <path
              d="M 0 85 L 30 70 L 60 70 L 90 55 L 120 50 L 150 35 L 180 40 L 200 30"
              fill="none"
              stroke="#60A5FA"
              strokeWidth="2"
              strokeDasharray="4 4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="absolute inset-x-0 bottom-0 flex justify-between border-b border-border px-1 pb-1 font-mono text-[7px] text-muted-foreground">
            <span>0</span>
            <span>5</span>
            <span>10</span>
            <span>15</span>
            <span>20</span>
            <span>25</span>
            <span>30</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-4">
          <div>
            <div className="mb-1 text-[8px] tracking-widest text-muted-foreground uppercase">
              MOOD SCORE
            </div>
            <div className="font-mono text-2xl font-bold text-foreground">84%</div>
            <div className="mt-1 text-[8px] font-bold tracking-widest text-success uppercase">
              POSITIVE
            </div>
          </div>
          <div>
            <div className="mb-1 text-[8px] tracking-widest text-muted-foreground uppercase">
              ENERGY LEVEL
            </div>
            <div className="font-mono text-2xl font-bold text-foreground">76%</div>
            <div className="mt-1 text-[8px] font-bold tracking-widest text-warning uppercase">
              HIGH
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
