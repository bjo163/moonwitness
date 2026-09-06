"use client"

import React from "react"
import { ArrowRight, Download, Database, Share2 } from "lucide-react"
import { Button, resolveSemanticColor, type SemanticColorToken } from "@workspace/ui"

const COMPARISONS = [
  { n: "Moon", p: 80, c: "primary" as SemanticColorToken, v: "+42%" },
  { n: "AI & Technology", p: 65, c: "info" as SemanticColorToken, v: "+38%" },
  { n: "History", p: 55, c: "success" as SemanticColorToken, v: "+31%" },
  { n: "Astronomy", p: 45, c: "info" as SemanticColorToken, v: "+26%" },
]

export function KnowledgeTrendBottomGrid() {
  return (
    <div className="grid grid-cols-1 items-stretch gap-4 pt-2 md:grid-cols-2 lg:grid-cols-4">
      {/* Trend Prediction */}
      <div className="bg-background relative flex flex-col justify-between overflow-hidden rounded-xl border border-border p-4">
        <div className="relative z-10 mb-4 text-[9px] font-black tracking-widest text-primary uppercase">
          TREND PREDICTION
        </div>

        <div className="relative z-10 font-sans text-[10px] leading-relaxed text-foreground">
          Based on last 7 days pattern,{" "}
          <span className="font-bold text-primary">Moon related topics</span>{" "}
          will increase by{" "}
          <span className="font-bold text-success">28% next week</span>.
        </div>

        <div className="relative z-0 mt-4 h-12 w-full">
          {/* Prediction line */}
          <svg
            viewBox="0 0 100 20"
            className="h-full w-full overflow-visible"
            preserveAspectRatio="none"
          >
            <polyline
              points="0,20 20,15 40,18 60,10 80,12 100,0"
              fill="none"
              stroke="#00F0FF"
              strokeWidth="1.5"
              strokeDasharray="2 2"
              className="drop-shadow-sm"
            />
          </svg>
        </div>
      </div>

      {/* AI Insight by Khidra */}
      <div className="bg-background flex items-center gap-4 rounded-xl border-2 border-success/30 p-4 shadow-sm">
        <div className="bg-background relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-emerald-500/50">
          <img
            alt="Media"
            src="/assets/mod_khidra.png"
            className="h-full w-full object-cover mix-blend-screen"
          />
        </div>

        <div className="flex-1">
          <div className="mb-1 text-[9px] font-black tracking-widest text-primary uppercase">
            AI INSIGHT BY <span className="text-success">KHIDRA</span>
          </div>
          <div className="mb-3 border-l-2 border-success/30 pl-2 font-sans text-[9px] leading-relaxed text-foreground italic">
            "The synergy between faith, science, and technology is the key to
            understanding the signs around us."
          </div>
          <Button type="button" variant="ghost" size="sm" className="text-[8px] font-bold tracking-widest text-success uppercase">
            ASK KHIDRA <ArrowRight className="h-2.5 w-2.5" />
          </Button>
        </div>
      </div>

      {/* Trend Comparison */}
      <div className="bg-background rounded-xl border border-border p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[9px] font-black tracking-widest text-primary uppercase">
            TREND COMPARISON
          </div>
          <div className="text-[7px] text-primary">
            This Week vs Last Week
          </div>
        </div>
        <div className="space-y-2">
          {COMPARISONS.map((cmp, i) => (
            <div key={i} className="flex items-center gap-2 text-[8px]">
              <div className="w-20 truncate text-foreground">{cmp.n}</div>
              <div className="bg-background h-1.5 flex-1 overflow-hidden rounded-full">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${cmp.p}%`, backgroundColor: resolveSemanticColor(cmp.c) }}
                />
              </div>
              <div
                className="w-8 text-right font-mono font-bold"
                style={{ color: resolveSemanticColor(cmp.c) }}
              >
                {cmp.v}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Data */}
      <div className="bg-background flex flex-col justify-between rounded-xl border border-border p-4">
        <div>
          <div className="mb-2 text-[9px] font-black tracking-widest text-primary uppercase">
            EXPORT DATA
          </div>
          <div className="mb-4 text-[8px] text-primary">
            Download trend data for your research or report.
          </div>
        </div>
        <div className="space-y-2">
          <Button type="button" variant="outline" size="sm" className="w-full justify-start text-left text-[9px]">
            <Download className="h-3 w-3 text-primary" /> Export as PDF
          </Button>
          <Button type="button" variant="outline" size="sm" className="w-full justify-start text-left text-[9px]">
            <Database className="h-3 w-3 text-success" /> Export as CSV
          </Button>
          <Button type="button" variant="outline" size="sm" className="w-full justify-start text-left text-[9px]">
            <Share2 className="text-knowledge h-3 w-3" /> Share Insights
          </Button>
        </div>
      </div>
    </div>
  )
}
