import React from "react"
import { Sun, AlertTriangle } from "lucide-react"
import { SpaceWeatherEvent } from "@core/api/hooks/use-global-monitoring"

export function SpaceWeatherWidget({
  spaceWeather = [],
}: {
  spaceWeather?: SpaceWeatherEvent[]
}) {
  return (
    <div className="bg-space flex flex-col rounded-xl border border-white/10 p-4 lg:col-span-3 xl:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[9px] font-black tracking-widest text-white uppercase">
          SPACE WEATHER (DONKI)
          <span className="bg-warning/20 text-warning border-warning/30 animate-pulse rounded-[2px] border px-1.5 py-0.5 text-[8px]">
            NASA API
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-3">
        {spaceWeather.length === 0 ? (
          <div className="py-10 text-center text-[10px] text-primary/50">
            Monitoring Solar Flares & CMEs...
          </div>
        ) : (
          spaceWeather.map((sw, i) => (
            <div
              key={i}
              className="group flex cursor-default items-center justify-between rounded border border-white/5 p-2 transition-colors hover:bg-white/5"
            >
              <div className="flex max-w-[75%] items-start gap-2">
                <Sun className="text-warning mt-0.5 h-4 w-4 shrink-0 transition-colors group-hover:text-white" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-white transition-colors">
                    Coronal Mass Ejection
                  </span>
                  <span className="mt-1 line-clamp-2 text-[7px] text-primary">
                    {sw.note || "No notes available"}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-warning font-mono text-[9px] font-bold">
                  ACTIVE
                </span>
                <span className="text-[7px] text-white/50 uppercase">
                  {sw.startTime?.split("T")[0]}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
