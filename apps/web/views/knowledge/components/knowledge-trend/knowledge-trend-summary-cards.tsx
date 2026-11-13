"use client"

import React from "react"
import {
  Moon,
  Brain,
  Map,
  Telescope,
  Scroll,
  BookOpen,
  Flame,
  Target,
} from "lucide-react"
import { resolveSemanticColor, type SemanticColorToken } from "@workspace/ui"

const TRENDING_METRICS = [
  { n: "MOON", v: "68.4K", p: "+42%", i: Moon, c: "primary" as SemanticColorToken },
  {
    n: "AI & TECHNOLOGY",
    v: "53.1K",
    p: "+38%",
    i: Brain,
    c: "info" as SemanticColorToken,
  },
  { n: "HISTORY", v: "48.7K", p: "+31%", i: Map, c: "success" as SemanticColorToken },
  {
    n: "ASTRONOMY",
    v: "47.2K",
    p: "+26%",
    i: Telescope,
    c: "primary" as SemanticColorToken,
  },
  { n: "HADITH", v: "36.8K", p: "+24%", i: Scroll, c: "warning" as SemanticColorToken },
  {
    n: "QUR'AN",
    v: "35.9K",
    p: "+22%",
    i: BookOpen,
    c: "success" as SemanticColorToken,
  },
  {
    n: "ESCHATOLOGY",
    v: "29.7K",
    p: "+18%",
    i: Flame,
    c: "info" as SemanticColorToken,
  },
  {
    n: "SCIENCE",
    v: "21.3K",
    p: "+16%",
    i: Target,
    c: "destructive" as SemanticColorToken,
  },
]

const HISTOGRAM_BARS = [
  45, 82, 23, 67, 12, 89, 34, 56, 78, 19, 91, 43, 65, 27, 88, 54,
  31, 76, 98, 15, 62, 41, 85, 29, 73, 58, 37, 94, 18, 69, 47, 81,
  25, 71, 52, 39, 86, 14, 61, 33,
]

export function KnowledgeTrendSummaryCards() {
  return (
    <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12">
      <div className="lg:col-span-10">
        <div className="mb-3 text-[9px] font-black tracking-widest text-primary uppercase">
          TRENDING THIS WEEK
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
          {TRENDING_METRICS.map((tr, i) => (
            <div
              key={i}
              className="bg-background group flex flex-col justify-between rounded-xl border border-border p-3 shadow-sm transition-colors hover:border-border"
            >
              <div className="mb-2 flex items-center gap-2">
                <tr.i className="h-3.5 w-3.5" style={{ color: resolveSemanticColor(tr.c) }} />
                <div className="truncate text-[8px] font-black text-primary uppercase transition-colors group-hover:text-foreground">
                  {tr.n}
                </div>
              </div>
              <div className="mb-2 flex items-end justify-between">
                <div className="text-sm font-black text-foreground">{tr.v}</div>
                <div
                  className="text-[9px] font-bold"
                  style={{ color: resolveSemanticColor(tr.c) }}
                >
                  {tr.p}
                </div>
              </div>
              {/* Sparkline simulation */}
              <svg
                viewBox="0 0 100 20"
                className="h-4 w-full overflow-visible"
                preserveAspectRatio="none"
              >
                <polyline
                  points={`0,15 20,${12 - (i % 3)} 40,${15 - (i % 4)} 60,${8 + (i % 2)} 80,5 100,2`}
                  fill="none"
                  stroke={resolveSemanticColor(tr.c)}
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-background flex flex-col justify-between rounded-xl border border-primary/30 p-3 lg:col-span-2">
        <div className="mb-2 text-[9px] font-black tracking-widest text-primary uppercase">
          OVERALL TREND SCORE
        </div>

        <div className="flex items-center justify-between">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-primary">
            <div
              className="absolute inset-0 rounded-full border-[4px] border-emerald-400 border-r-transparent border-b-transparent shadow-sm"
              style={{ transform: "rotate(45deg)" }}
            />
            <div
              className="absolute inset-0 rounded-full border-[4px] border-primary border-b-transparent border-l-transparent"
              style={{ transform: "rotate(-45deg)" }}
            />

            <div className="text-center">
              <div className="font-mono text-xl leading-none font-black text-primary">
                82
              </div>
              <div className="mt-1 text-[6px] font-bold text-success uppercase">
                Very High
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="mb-1 text-[7px] leading-tight text-primary uppercase">
              Global Knowledge Interest
            </div>
            <div className="font-mono text-sm font-black text-success">
              +18%
            </div>
            <div className="text-[7px] text-primary">from last week</div>
          </div>
        </div>

        <div className="mt-2 flex h-4 w-full items-end gap-[1px]">
          {HISTOGRAM_BARS.map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-primary/10"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
