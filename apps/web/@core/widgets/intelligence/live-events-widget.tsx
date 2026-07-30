import React from "react"
import { Eye, Activity, Moon, Zap, BookOpen, ArrowRight } from "lucide-react"

export function LiveEventsWidget() {
  return (
    <div className="bg-space flex flex-col rounded-xl border border-white/10 p-4 lg:col-span-3 xl:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[9px] font-black tracking-widest text-primary uppercase">
          LIVE EVENTS FEED
        </div>
        <div className="cursor-pointer text-[8px] text-primary hover:text-white">
          View All ∨
        </div>
      </div>

      <div className="hide-scrollbar flex-1 space-y-3 overflow-y-auto">
        {[
          {
            t: "07:12",
            i: Eye,
            n: "New Moon sighted",
            s: "Indonesia - Aceh",
            stat: "Verified",
            c: "text-success",
          },
          {
            t: "07:07",
            i: Activity,
            n: "Earthquake M 4.6",
            s: "Japan",
            stat: "4.2",
            c: "text-warning",
          },
          {
            t: "07:01",
            i: Moon,
            n: "Lunar Eclipse in 23 days",
            s: "Visible in Asia, Africa",
            stat: "Upcoming",
            c: "text-secondary",
          },
          {
            t: "06:58",
            i: Zap,
            n: "Solar flare M1.2 detected",
            s: "Active Region 3664",
            stat: "Watch",
            c: "text-warning",
          },
          {
            t: "06:45",
            i: BookOpen,
            n: "New research published",
            s: "Hilal Algorithm v2.1",
            stat: "New",
            c: "text-primary",
          },
        ].map((ev, i) => (
          <div
            key={i}
            className="group flex cursor-pointer gap-2 rounded p-1 transition-colors hover:bg-white/5"
          >
            <div className="mt-0.5 w-6 font-mono text-[8px] text-primary">
              {ev.t}
            </div>
            <div className="bg-space flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/10">
              <ev.i className="h-3 w-3 text-white/70 group-hover:text-white" />
            </div>
            <div className="flex-1">
              <div className="mb-0.5 text-[9px] leading-tight font-bold text-white">
                {ev.n}
              </div>
              <div className="max-w-[100px] truncate text-[7px] text-primary">
                {ev.s}
              </div>
            </div>
            <div className={`text-[7px] font-bold ${ev.c}`}>{ev.stat}</div>
          </div>
        ))}
      </div>

      <button className="mt-2 flex w-full items-center justify-center gap-1 border-t border-white/10 pt-2 text-center text-[8px] font-bold tracking-widest text-primary uppercase hover:text-white">
        VIEW ALL EVENTS <ArrowRight className="h-2.5 w-2.5" />
      </button>
    </div>
  )
}
