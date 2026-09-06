"use client"

import React from "react"
import { ArrowRight, TrendingUp, Globe, HardDrive, Shield } from "lucide-react"

export function SunPositionAnalytics() {
  return (
    <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Recent Activity */}
      <div className="rounded-xl border border-border bg-card p-5 lg:col-span-3">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-[10px] font-bold tracking-widest text-foreground uppercase">
            RECENT ACTIVITY
          </h3>
          <span className="flex items-center gap-1 rounded bg-success/10 px-2 py-0.5 text-[7px] font-bold tracking-widest text-success">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />{" "}
            LIVE FEED
          </span>
        </div>
        <div className="mb-3 grid grid-cols-12 border-b border-border pb-2 text-[7px] tracking-widest text-muted-foreground uppercase">
          <div className="col-span-3">TIME</div>
          <div className="col-span-6">ACTIVITY</div>
          <div className="col-span-3 text-right">STATUS</div>
        </div>
        <div className="space-y-4">
          {[
            {
              t: "22:17",
              a: "Sun Exposure Logged",
              s: "Optimal",
              c: "text-success",
            },
            {
              t: "22:16",
              a: "Vitamin D Level Checked",
              s: "Optimal",
              c: "text-success",
            },
            {
              t: "22:15",
              a: "UV Index Alert (Moderate)",
              s: "Active",
              c: "text-rose-400",
            },
            {
              t: "22:14",
              a: "Daily Light Report Generated",
              s: "Completed",
              c: "text-success",
            },
            {
              t: "22:13",
              a: "Health Insight Updated",
              s: "New",
              c: "text-success",
            },
          ].map((r, i) => (
            <div
              key={i}
              className="grid grid-cols-12 items-center text-[9px]"
            >
              <div className="col-span-3 font-mono text-foreground/50">{r.t}</div>
              <div className="col-span-6 truncate pr-2 text-foreground">{r.a}</div>
              <div
                className={`col-span-3 text-right font-bold tracking-wider ${r.c}`}
              >
                {r.s}
              </div>
            </div>
          ))}
        </div>
        <button className="mt-6 flex w-full items-center justify-center gap-1 border-t border-border pt-4 text-[8px] tracking-widest text-warning uppercase transition-colors hover:text-foreground">
          VIEW ALL ACTIVITY <ArrowRight className="h-2.5 w-2.5" />
        </button>
      </div>

      {/* Light Impact Analytics */}
      <div className="flex flex-col rounded-xl border border-border bg-card p-5 lg:col-span-4">
        <div className="mb-5">
          <h3 className="mb-1 text-[10px] font-bold tracking-widest text-foreground uppercase">
            LIGHT IMPACT ANALYTICS
          </h3>
          <p className="text-[9px] text-muted-foreground">30 DAYS OVERVIEW</p>
        </div>
        <div className="mb-6 grid grid-cols-4 gap-3">
          <div>
            <div className="mb-1 text-[7px] leading-tight tracking-widest text-muted-foreground uppercase">
              HEALTH IMPROVEMENT
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-success">
              <TrendingUp className="h-3 w-3" /> 24%
            </div>
          </div>
          <div>
            <div className="mb-1 text-[7px] leading-tight tracking-widest text-muted-foreground uppercase">
              MOOD ENHANCEMENT
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-success">
              <TrendingUp className="h-3 w-3" /> 31%
            </div>
          </div>
          <div>
            <div className="mb-1 text-[7px] leading-tight tracking-widest text-muted-foreground uppercase">
              ENERGY BOOST
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-success">
              <TrendingUp className="h-3 w-3" /> 19%
            </div>
          </div>
          <div>
            <div className="mb-1 text-[7px] leading-tight tracking-widest text-muted-foreground uppercase">
              SLEEP QUALITY
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-success">
              <TrendingUp className="h-3 w-3" /> 28%
            </div>
          </div>
        </div>

        <div className="flex-1 border-t border-border pt-4">
          <div className="mb-3 flex justify-between text-[8px] tracking-widest text-muted-foreground uppercase">
            <span className="flex items-center gap-1">
              <div className="h-0.5 w-2 bg-emerald-500" /> Health
            </span>
            <span className="flex items-center gap-1">
              <div className="h-0.5 w-2 bg-blue-500" /> Mood
            </span>
            <span className="flex items-center gap-1">
              <div className="h-0.5 w-2 bg-amber-500" /> Energy
            </span>
            <span className="flex items-center gap-1">
              <div className="h-0.5 w-2 bg-primary" /> Sleep
            </span>
          </div>
          <div className="flex h-20 w-full items-end justify-between opacity-60">
            {[45, 60, 80, 50, 95, 70, 85, 40, 65, 90, 55, 75].map((h, i) => (
              <div
                key={i}
                className="w-3 cursor-pointer rounded-t-sm bg-gradient-to-t from-emerald-900 to-emerald-400 transition-all hover:opacity-100"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between font-mono text-[7px] text-foreground/30">
            <span>1</span>
            <span>5</span>
            <span>10</span>
            <span>15</span>
            <span>20</span>
            <span>25</span>
            <span>30</span>
          </div>
        </div>
      </div>

      {/* System Resources */}
      <div className="flex flex-col rounded-xl border border-border bg-card p-5 lg:col-span-2">
        <div className="mb-6">
          <h3 className="mb-1 text-[10px] font-bold tracking-widest text-foreground uppercase">
            SYSTEM RESOURCES
          </h3>
          <p className="text-[9px] text-muted-foreground">Operational Status</p>
        </div>
        <div className="mb-6 grid grid-cols-2 gap-4">
          {[
            { l: "CPU", v: 23, c: "text-primary", s: "#22D3EE" },
            { l: "RAM", v: 48, c: "text-warning", s: "#FBBF24" },
            { l: "DISK", v: 61, c: "text-success", s: "#34D399" },
            { l: "NET", v: 18, c: "text-rose-400", s: "#FB7185" },
          ].map((r, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="relative mb-2 flex h-12 w-12 items-center justify-center">
                <svg
                  viewBox="0 0 36 36"
                  className="absolute inset-0 h-full w-full -rotate-90"
                >
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke={r.s}
                    strokeWidth="3"
                    strokeDasharray="100"
                    strokeDashoffset={100 - r.v}
                    strokeLinecap="round"
                  />
                </svg>
                <div className={`font-mono text-[9px] font-bold ${r.c}`}>
                  {r.v}%
                </div>
              </div>
              <div className="text-[7px] tracking-widest text-muted-foreground uppercase">
                {r.l}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-auto space-y-3 border-t border-border pt-4 text-[8px] text-foreground">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Globe className="h-3 w-3 text-success" /> DATABASE HEALTH
            </span>
            <span className="font-mono text-success">100%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <HardDrive className="h-3 w-3 text-success" /> BACKUP STATUS
            </span>
            <span className="font-mono text-success">Up to date</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3 w-3 text-success" /> SECURITY LEVEL
            </span>
            <span className="font-mono text-success">MAXIMUM</span>
          </div>
        </div>
      </div>

      {/* Global Sunlight Map */}
      <div className="flex flex-col rounded-xl border border-border bg-card p-5 lg:col-span-3">
        <div className="mb-4">
          <h3 className="mb-1 text-[10px] font-bold tracking-widest text-foreground uppercase">
            GLOBAL SUNLIGHT MAP
          </h3>
          <p className="text-[9px] text-muted-foreground">
            Real-time Sunlight Intensity
          </p>
        </div>
        <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-lg border border-border bg-card">
          <svg
            viewBox="0 0 800 400"
            fill="currentColor"
            className="w-full text-emerald-900/30"
          >
            <path d="M150 100 Q 200 80 250 120 T 350 150 Q 400 120 450 180 T 550 200 Q 600 150 700 180 L 700 300 L 150 300 Z" />
            <path d="M300 50 Q 350 30 400 80 T 500 120 Q 550 80 600 140 T 750 160 Q 800 100 850 120 L 850 50 L 300 50 Z" />
            <circle cx="450" cy="180" r="150" fill="url(#sunGlow)" />
            <defs>
              <radialGradient id="sunGlow">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
          <div className="absolute inset-x-0 bottom-2 flex justify-between bg-card px-4 py-1 text-[7px] tracking-widest text-foreground/50 uppercase backdrop-blur-sm">
            <span className="flex items-center gap-1.5">
              <div className="h-0.5 w-2 bg-emerald-900" /> LOW
            </span>
            <span className="flex items-center gap-1.5">
              <div className="h-0.5 w-2 bg-emerald-500" /> MODERATE
            </span>
            <span className="flex items-center gap-1.5">
              <div className="h-0.5 w-2 bg-amber-400" /> HIGH
            </span>
            <span className="flex items-center gap-1.5">
              <div className="h-0.5 w-2 bg-rose-500" /> EXTREME
            </span>
          </div>
        </div>
        <button className="mt-4 flex items-center justify-end gap-1 text-right text-[8px] tracking-widest text-warning uppercase transition-colors hover:text-foreground">
          VIEW DETAILED MAP <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}
