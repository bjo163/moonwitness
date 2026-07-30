import React from "react"
import { Sun, AlertTriangle } from "lucide-react"
import { SpaceWeatherEvent } from "@core/api/hooks/use-global-monitoring"

export function SpaceWeatherWidget({ spaceWeather = [] }: { spaceWeather?: SpaceWeatherEvent[] }) {
  return (
    <div className="bg-space flex flex-col rounded-xl border border-white/10 p-4 lg:col-span-3 xl:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[9px] font-black tracking-widest text-white uppercase flex items-center gap-2">
          SPACE WEATHER (DONKI)
          <span className="bg-warning/20 text-warning px-1.5 py-0.5 rounded-[2px] text-[8px] border border-warning/30 animate-pulse">NASA API</span>
        </div>
      </div>

      <div className="flex-1 space-y-3">
        {spaceWeather.length === 0 ? (
          <div className="text-center text-primary/50 text-[10px] py-10">Monitoring Solar Flares & CMEs...</div>
        ) : (
          spaceWeather.map((sw, i) => (
            <div
              key={i}
              className="group flex cursor-default items-center justify-between rounded p-2 transition-colors hover:bg-white/5 border border-white/5"
            >
              <div className="flex items-start gap-2 max-w-[75%]">
                <Sun className="h-4 w-4 shrink-0 text-warning transition-colors group-hover:text-white mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-white font-bold transition-colors">
                    Coronal Mass Ejection
                  </span>
                  <span className="text-[7px] text-primary mt-1 line-clamp-2">
                    {sw.note || "No notes available"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="font-mono text-[9px] font-bold text-warning">
                  ACTIVE
                </span>
                <span className="text-[7px] uppercase text-white/50">{sw.startTime?.split("T")[0]}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

