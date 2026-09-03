"use client"

import React from "react"
import { Copy, TrendingUp, Trophy, Target } from "lucide-react"

export function MissionStats() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Top Banner (Spans Full) */}
      <div className="relative flex flex-col items-center justify-between overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm text-card-foreground md:flex-row lg:col-span-3">
        <div className="relative z-10 flex w-full flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-wrap gap-8 items-center">
            <div>
              <p className="font-sans text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Account ID
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-mono text-base font-bold text-foreground">
                  MW-2025-05-26-71345
                </span>
                <button
                  className="text-muted-foreground transition-colors hover:text-primary"
                  aria-label="Copy account ID"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-muted"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-success"
                    strokeWidth="3"
                    strokeDasharray="92, 100"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute font-mono text-[11px] font-bold text-foreground">
                  92%
                </span>
              </div>
              <div>
                <p className="font-sans text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Profile Completion
                </p>
                <p className="font-sans text-xs font-semibold text-success">
                  Complete
                </p>
                <p className="font-sans text-[10px] text-muted-foreground">
                  All requirements verified
                </p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <h3 className="font-arabic text-2xl leading-relaxed font-bold text-foreground">
              وَقُلْ رَّبِّ زِدْنِي عِلْمًا
            </h3>
            <p className="mt-1 font-sans text-xs text-muted-foreground italic">
              &quot;And say, &apos;My Lord, increase me in knowledge.&apos;&quot;
            </p>
            <p className="font-mono text-[10px] text-primary">
              (Qur&apos;an 20:114)
            </p>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm text-card-foreground">
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Activity Level
          </p>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary shadow-sm">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-sans text-xl font-bold text-foreground">
                Level 7
              </h4>
              <p className="font-sans text-xs text-primary font-medium">
                Research Contributor
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="mb-2 flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>7,850 / 10,000 XP</span>
            <span>2,150 XP to next level</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[78.5%] rounded-full bg-primary" />
          </div>
        </div>
      </div>

      <div className="relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm text-card-foreground">
        <p className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Platform Rank
        </p>
        <div className="mt-4 flex flex-1 items-center justify-center">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-warning" />
            <h4 className="font-mono text-3xl font-bold text-foreground">
              #1,248
            </h4>
          </div>
        </div>
        <p className="mt-4 text-center font-sans text-[11px] text-muted-foreground">
          Top 2.41% of contributors
        </p>
      </div>

      <div className="relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm text-card-foreground">
        <p className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Contribution Score
        </p>
        <div className="relative mt-4 flex flex-1 items-center justify-center">
          <h4 className="font-mono text-3xl font-bold text-foreground">
            8,640
          </h4>
        </div>
        <div className="mt-4 text-center">
          <p className="font-sans text-xs text-foreground font-semibold">Active Contributor</p>
          <p className="mt-1 flex items-center justify-center gap-1 font-mono text-[11px] text-success">
            <TrendingUp className="h-3.5 w-3.5" /> +12.5% vs last month
          </p>
        </div>
      </div>
    </div>
  )
}
