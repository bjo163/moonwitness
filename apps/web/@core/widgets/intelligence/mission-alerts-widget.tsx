import React from "react"
import { AlertTriangle, Sun, BookOpen, ArrowRight } from "lucide-react"

export function MissionAlertsWidget() {
  return (
    <div className="bg-space flex flex-col rounded-xl border border-white/10 p-4 lg:col-span-3 xl:col-span-3">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[9px] font-black tracking-widest text-white uppercase">
          MISSION ALERTS
        </div>
        <div className="cursor-pointer text-[8px] text-primary hover:text-white">
          View All
        </div>
      </div>

      <div className="hide-scrollbar flex-1 space-y-3 overflow-y-auto">
        {/* Critical Alert */}
        <div className="border-danger/30 bg-danger/10 relative flex gap-3 overflow-hidden rounded-lg border p-3">
          <div className="bg-danger absolute top-0 bottom-0 left-0 w-1" />
          <AlertTriangle className="text-danger mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <div className="mb-1 flex items-start justify-between">
              <div className="text-danger text-[9px] font-black uppercase">
                CRITICAL
              </div>
              <div className="text-[8px] text-primary">2m ago</div>
            </div>
            <div className="mb-0.5 text-[10px] font-bold text-white">
              Moon Observation Coverage
            </div>
            <div className="text-danger/80 text-[8px] leading-snug">
              West Africa region coverage dropped. Coverage: 20%
            </div>
          </div>
        </div>

        {/* High Alert */}
        <div className="border-warning/30 bg-warning/10 relative flex gap-3 overflow-hidden rounded-lg border p-3">
          <div className="bg-warning absolute top-0 bottom-0 left-0 w-1" />
          <Sun className="text-warning mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <div className="mb-1 flex items-start justify-between">
              <div className="text-warning text-[9px] font-black uppercase">
                HIGH
              </div>
              <div className="text-[8px] text-primary">12m ago</div>
            </div>
            <div className="mb-0.5 text-[10px] font-bold text-white">
              Solar Storm Activity Detected
            </div>
            <div className="text-warning/80 text-[8px] leading-snug">
              Possible impact on satellite. Systems in 24-48 hours.
            </div>
          </div>
        </div>

        {/* Medium Alert */}
        <div className="border-warning/20 bg-warning/5 relative flex cursor-pointer gap-3 overflow-hidden rounded-lg border p-3 opacity-80 transition-opacity hover:opacity-100">
          <div className="bg-warning/50 absolute top-0 bottom-0 left-0 w-1" />
          <BookOpen className="text-warning/80 mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <div className="mb-1 flex items-start justify-between">
              <div className="text-warning/80 text-[9px] font-black uppercase">
                MEDIUM
              </div>
              <div className="text-[8px] text-primary">25m ago</div>
            </div>
            <div className="mb-0.5 text-[10px] font-bold text-white">
              Translation Review Needed
            </div>
            <div className="text-warning/60 text-[8px] leading-snug">
              23 new translations need review.
            </div>
          </div>
        </div>
      </div>

      <button className="text-danger mt-2 flex w-full items-center justify-end gap-1 text-right text-[8px] font-bold tracking-widest uppercase hover:text-white">
        VIEW ALL ALERTS <ArrowRight className="h-2.5 w-2.5" />
      </button>
    </div>
  )
}
