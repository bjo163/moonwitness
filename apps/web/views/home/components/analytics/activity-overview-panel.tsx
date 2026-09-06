"use client"

import React from "react"
import { Network, Moon, Book, Flame, ArrowRight } from "lucide-react"

const DISCOVERIES = [
  {
    n: "New Cross Reference Found",
    s: "Qur'an 2:164 ↔ Qur'an 3:190",
    icon: Network,
    colorClass: "text-primary",
    t: "2h ago",
  },
  {
    n: "Astronomical Event Added",
    s: "Lunar Eclipse on 14 Mar 2026",
    icon: Moon,
    colorClass: "text-warning",
    t: "5h ago",
  },
  {
    n: "Historical Record Unlocked",
    s: "The Treaty of Hudaybiyyah",
    icon: Book,
    colorClass: "text-success",
    t: "1d ago",
  },
  {
    n: "Knowledge Milestone",
    s: "Completed 100 Days Learning Streak",
    icon: Flame,
    colorClass: "text-pink-400",
    t: "1d ago",
  },
]

export function ActivityOverviewPanel() {
  return (
    <div className="flex flex-col gap-6 lg:col-span-4">
      {/* Activity Chart */}
      <div className="bg-background flex flex-1 flex-col justify-between rounded-xl border border-border p-5 shadow-sm">
        <div className="mb-4 text-[10px] font-black tracking-widest text-primary uppercase">
          ACTIVITY OVERVIEW
        </div>

        <div className="mb-6 flex gap-2 text-[9px] font-bold tracking-wider">
          <button className="flex-1 rounded border border-border bg-primary/20 py-1.5 text-primary">
            7 DAYS
          </button>
          <button className="flex-1 rounded border border-border bg-transparent py-1.5 text-muted-foreground transition-colors hover:text-foreground">
            30 DAYS
          </button>
          <button className="flex-1 rounded border border-border bg-transparent py-1.5 text-muted-foreground transition-colors hover:text-foreground">
            90 DAYS
          </button>
        </div>

        {/* Chart Visual Simulation */}
        <div className="relative flex h-24 w-full items-end justify-between px-2 text-[8px] text-muted-foreground">
          <div className="absolute inset-x-0 bottom-0 border-t border-border" />
          <div className="absolute inset-x-0 bottom-[25%] border-t border-border/50" />
          <div className="absolute inset-x-0 bottom-[50%] border-t border-border/50" />
          <div className="absolute inset-x-0 bottom-[75%] border-t border-border/50" />
          <div className="absolute inset-x-0 top-0 border-t border-border" />

          <div className="absolute top-0 left-0 -translate-y-1/2">100</div>
          <div className="absolute bottom-[75%] left-0 -translate-y-1/2">75</div>
          <div className="absolute bottom-[50%] left-0 -translate-y-1/2">50</div>
          <div className="absolute bottom-[25%] left-0 -translate-y-1/2">25</div>
          <div className="absolute bottom-0 left-0 -translate-y-1/2">0</div>

          <svg
            className="absolute inset-0 h-full w-full overflow-visible pl-6"
            preserveAspectRatio="none"
          >
            <polyline
              points="0,60 20,40 40,50 60,30 80,45 100,20 120,40"
              fill="none"
              stroke="currentColor"
              className="text-primary"
              strokeWidth="1.5"
            />
            <polyline
              points="0,80 20,70 40,75 60,60 80,70 100,50 120,65"
              fill="none"
              stroke="currentColor"
              className="text-success"
              strokeWidth="1.5"
            />
          </svg>

          <div className="relative z-10 mt-auto flex w-full justify-between border-t border-border pt-2 pl-6 font-mono text-[7px] uppercase">
            <span>19 MAY</span>
            <span>20 MAY</span>
            <span>21 MAY</span>
            <span>22 MAY</span>
            <span>23 MAY</span>
            <span>24 MAY</span>
            <span>25 MAY</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-[8px] font-bold tracking-wider text-foreground uppercase">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> READING
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> STUDY
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-warning" /> REFLECTION
          </span>
        </div>
      </div>

      {/* Recent Discoveries */}
      <div className="bg-background flex flex-1 flex-col justify-between rounded-xl border border-border p-5">
        <div className="mb-4 text-[10px] font-black tracking-widest text-primary uppercase">
          RECENT DISCOVERIES
        </div>

        <div className="space-y-3 font-mono">
          {DISCOVERIES.map((act, i) => (
            <div key={i} className="flex items-start gap-3">
              <act.icon className={`mt-0.5 h-3.5 w-3.5 ${act.colorClass}`} />
              <div className="flex-1">
                <div className="text-[10px] font-bold text-foreground">
                  {act.n}
                </div>
                <div className="max-w-[200px] truncate text-[9px] text-muted-foreground">
                  {act.s}
                </div>
              </div>
              <div className="text-[8px] whitespace-nowrap text-muted-foreground">
                {act.t}
              </div>
            </div>
          ))}
        </div>

        <button className="mt-3 flex w-full items-center justify-end gap-1 text-right text-[9px] font-bold tracking-widest text-primary uppercase hover:text-foreground">
          VIEW ALL ACTIVITY <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}
