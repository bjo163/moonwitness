"use client"

import React from "react"
import { TrendingUp, Globe, Clock } from "lucide-react"
import { TrendingTopic } from "../../../api/hooks/use-global-monitoring"

export function TrendingTopicsWidget({ trends = [] }: { trends?: TrendingTopic[] }) {
  return (
    <div className="bg-space flex flex-col rounded-xl border border-white/10 p-4 lg:col-span-4 xl:col-span-3">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[9px] font-black tracking-widest text-primary uppercase flex items-center gap-2">
          HUMANITY'S FOCUS
          <span className="bg-white/20 text-white px-1.5 py-0.5 rounded-[2px] text-[8px] border border-white/30">TRENDS</span>
        </div>
      </div>

      <div className="hide-scrollbar flex-1 space-y-3 overflow-y-auto max-h-[300px]">
        {trends.length === 0 ? (
          <div className="text-center text-primary/50 text-[10px] py-10 flex flex-col items-center gap-2">
            <Globe className="h-6 w-6 animate-pulse" />
            Analyzing Global Search Trends...
          </div>
        ) : (
          trends.map((t, i) => (
            <div
              key={i}
              className="group flex flex-col gap-2 rounded p-2 transition-colors hover:bg-white/5 border border-white/5"
            >
              <div className="flex items-start gap-3">
                <div className="font-mono text-[14px] font-black text-primary/30 group-hover:text-primary transition-colors mt-0.5">
                  {(i + 1).toString().padStart(2, '0')}
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-bold text-white mb-1 leading-tight">
                    {t.title}
                  </div>
                  <div className="flex items-center gap-3 text-[8px] text-primary/70">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-2.5 w-2.5 text-secondary" />
                      {t.traffic} Searches
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {new Date(t.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
