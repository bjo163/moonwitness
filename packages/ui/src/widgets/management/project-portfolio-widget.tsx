import React from "react"
import { FolderGit2, ArrowRight } from "lucide-react"

export function ProjectPortfolioWidget() {
  return (
    <div className="bg-background flex flex-col rounded-xl border border-white/10 p-4 lg:col-span-4 xl:col-span-3">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[9px] font-black tracking-widest text-primary uppercase">
          PROJECT PORTFOLIO
        </div>
        <div className="cursor-pointer text-[8px] text-primary hover:text-white">
          View All ∨
        </div>
      </div>

      <div className="mb-2 flex w-full border-b border-white/10 pb-2 text-[8px] text-primary uppercase">
        <div className="flex-1">All Active Projects</div>
        <div className="w-24 text-center">Progress</div>
        <div className="w-12 text-center">Team</div>
        <div className="w-16 text-right">Deadline</div>
      </div>

      <div className="flex-1 space-y-3">
        {[
          {
            n: "Global Moon Observation",
            p: 72,
            t: 48,
            d: "15 Jun",
            c: "#00F0FF",
          },
          {
            n: "Astronomy Atlas Project",
            p: 45,
            t: 12,
            d: "30 Jul",
            c: "#00FF66",
          },
          {
            n: "Qur'an Translation Initiative",
            p: 90,
            t: 156,
            d: "10 Jun",
            c: "#A100FF",
          },
          {
            n: "Knowledge Graph Development",
            p: 44,
            t: 24,
            d: "22 Aug",
            c: "#FF9900",
          },
          {
            n: "Hilal Visibility Research",
            p: 68,
            t: 15,
            d: "5 Jul",
            c: "#0088FF",
          },
        ].map((proj, i) => (
          <div
            key={i}
            className="group flex cursor-pointer items-center rounded py-0.5 text-[9px] transition-colors hover:bg-white/5"
          >
            <div className="flex flex-1 items-center gap-2 pr-2">
              <FolderGit2 className="h-3.5 w-3.5 shrink-0 text-primary group-hover:text-primary" />
              <span className="truncate text-white">{proj.n}</span>
            </div>
            <div className="flex w-24 items-center gap-2">
              <div className="bg-background h-1 flex-1 overflow-hidden rounded-full">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${proj.p}%`, backgroundColor: proj.c }}
                />
              </div>
              <span className="w-6 font-mono font-bold text-primary">
                {proj.p}%
              </span>
            </div>
            <div className="w-12 text-center text-primary">{proj.t}</div>
            <div className="w-16 text-right font-mono text-primary">
              {proj.d}
            </div>
          </div>
        ))}
      </div>

      <button className="mt-2 flex w-full items-center justify-center gap-1 border-t border-white/10 pt-2 text-center text-[8px] font-bold tracking-widest text-primary uppercase hover:text-white">
        VIEW ALL PROJECTS <ArrowRight className="h-2.5 w-2.5" />
      </button>
    </div>
  )
}
