"use client"

import React from "react"
import { TrendingUp, Globe, Clock } from "lucide-react"
import { TrendingTopic } from "../../../api/hooks/use-global-monitoring"

export function TrendingTopicsWidget({
  trends = [],
}: {
  trends?: TrendingTopic[]
}) {
  return (
    <div className="bg-space flex flex-col rounded-xl border border-white/10 p-4 lg:col-span-4 xl:col-span-3">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[9px] font-black tracking-widest text-primary uppercase">
          HUMANITY'S FOCUS
          <span className="rounded-[2px] border border-white/30 bg-white/20 px-1.5 py-0.5 text-[8px] text-white">
            TRENDS
          </span>
        </div>
      </div>

      <div className="hide-scrollbar max-h-[300px] flex-1 space-y-3 overflow-y-auto">
        {trends.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center text-[10px] text-primary/50">
            <Globe className="h-6 w-6 animate-pulse" />
            Analyzing Global Search Trends...
          </div>
        ) : (
          trends.map((t, i) => (
            <div
              key={i}
              className="group flex flex-col gap-2 rounded border border-white/5 p-2 transition-colors hover:bg-white/5"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 font-mono text-[14px] font-black text-primary/30 transition-colors group-hover:text-primary">
                  {(i + 1).toString().padStart(2, "0")}
                </div>
                <div className="flex-1">
                  <div className="mb-1 text-[11px] leading-tight font-bold text-white">
                    {t.title}
                  </div>
                  <div className="flex items-center gap-3 text-[8px] text-primary/70">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-2.5 w-2.5 text-secondary" />
                      {t.traffic} Searches
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {new Date(t.pubDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
