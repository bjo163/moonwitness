import React from "react"
import {
  Moon,
  Scroll,
  Telescope,
  Languages,
  BarChart2,
  ChevronRight,
  ArrowRight,
} from "lucide-react"

export function MissionCommandWidget() {
  return (
    <div className="flex flex-col gap-4 lg:col-span-4">
      <div className="bg-space flex flex-1 flex-col rounded-xl border-2 border-primary/30 p-4 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black tracking-widest text-primary uppercase">
              MISSION COMMAND CENTER
            </div>
            <div className="mt-0.5 text-[8px] text-primary">
              Today&apos;s Missions
            </div>
          </div>
          <div className="flex cursor-pointer items-center gap-1 text-[8px] text-primary hover:text-white">
            View All <ChevronRight className="h-3 w-3" />
          </div>
        </div>

        <div className="grid flex-1 grid-cols-5 items-center gap-2">
          {[
            {
              n: "Observe Moon",
              icon: Moon,
              sev: "High Priority",
              c: "#00F0FF",
            },
            {
              n: "Verify Hadith",
              icon: Scroll,
              sev: "Medium Priority",
              c: "#FF9900",
            },
            {
              n: "Research Astronomy",
              icon: Telescope,
              sev: "High Priority",
              c: "#A100FF",
            },
            {
              n: "Translate Verse",
              icon: Languages,
              sev: "Medium Priority",
              c: "#00FF66",
            },
            {
              n: "Analyze Data",
              icon: BarChart2,
              sev: "Low Priority",
              c: "#8B9BB0",
            },
          ].map((m, i) => (
            <div
              key={i}
              className="bg-space group flex h-full cursor-pointer flex-col items-center justify-center rounded border border-white/5 p-2 text-center transition-colors hover:bg-white/10"
            >
              <m.icon className="mb-2 h-5 w-5" style={{ color: m.c }} />
              <div className="mb-1 text-[8px] leading-tight font-bold text-white">
                {m.n}
              </div>
              <div className="text-[6px] uppercase" style={{ color: m.c }}>
                {m.sev}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-space flex items-center justify-between rounded-xl border border-white/10 p-3">
        <div className="w-24 text-[9px] font-black tracking-widest text-primary uppercase">
          EXECUTIVE BRIEFING
        </div>

        <div className="flex flex-1 justify-between px-4 font-mono">
          <div className="text-center">
            <div className="mb-0.5 text-[7px] text-primary uppercase">
              Open Issues
            </div>
            <div className="text-danger text-sm font-black">14</div>
            <div className="text-danger mt-0.5 text-[6px] uppercase">
              1 Critical
            </div>
          </div>
          <div className="text-center">
            <div className="mb-0.5 text-[7px] text-primary uppercase">
              Projects
            </div>
            <div className="text-sm font-black text-white">42</div>
            <div className="mt-0.5 text-[6px] text-primary uppercase">
              Active
            </div>
          </div>
          <div className="text-center">
            <div className="mb-0.5 text-[7px] text-primary uppercase">
              Tasks
            </div>
            <div className="text-sm font-black text-white">238</div>
            <div className="mt-0.5 text-[6px] text-primary uppercase">
              Total
            </div>
          </div>
          <div className="text-center">
            <div className="mb-0.5 text-[7px] text-primary uppercase">
              Recommendations
            </div>
            <div className="text-sm font-black text-white">18</div>
            <div className="mt-0.5 text-[6px] text-primary uppercase">New</div>
          </div>
          <div className="text-center">
            <div className="mb-0.5 text-[7px] text-primary uppercase">
              AI Confidence
            </div>
            <div className="text-success text-sm font-black">97%</div>
            <div className="text-success mt-0.5 text-[6px] uppercase">
              Very High
            </div>
          </div>
        </div>

        <button className="flex items-center gap-1 text-[8px] font-bold tracking-widest text-primary uppercase hover:text-white">
          VIEW FULL <ArrowRight className="h-2.5 w-2.5" />
        </button>
      </div>
    </div>
  )
}
