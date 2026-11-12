import React from "react"
import { Sun, AlertTriangle } from "lucide-react"
import type { SourceStatus, SpaceWeatherEvent } from "@moon/client"

export function SpaceWeatherWidget({
  spaceWeather = [],
  status = "UNAVAILABLE",
}: {
  spaceWeather?: SpaceWeatherEvent[]
  status?: SourceStatus
}) {
  return (
    <div className="bg-background flex flex-col rounded-xl border border-border p-4 lg:col-span-3 xl:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[9px] font-black tracking-widest text-foreground uppercase">
          SPACE WEATHER (DONKI)
          <span className="rounded-md border border-border bg-muted px-2 py-1 text-[8px] text-muted-foreground">
            {status}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-3">
        {spaceWeather.length === 0 ? (
          <div className="py-10 text-center text-[10px] text-primary/50">
            {status === "UNAVAILABLE"
              ? "NASA DONKI data is unavailable; an event count cannot be reported."
              : status === "SIMULATED"
                ? "Space-weather data is simulated for demonstration only."
                : "No coronal mass ejection records were returned by the source."}
          </div>
        ) : (
          spaceWeather.map((sw, i) => (
            <div
              key={i}
              className="group flex cursor-default items-center justify-between rounded border border-border p-2 transition-colors hover:bg-muted/30"
            >
              <div className="flex max-w-[75%] items-start gap-2">
                <Sun className="text-warning mt-0.5 h-4 w-4 shrink-0 transition-colors group-hover:text-foreground" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-foreground transition-colors">
                    Coronal Mass Ejection
                  </span>
                  <span className="mt-1 line-clamp-2 text-[7px] text-primary">
                    {sw.note || "No notes available"}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-muted-foreground font-mono text-[9px] font-medium">
                  EVENT
                </span>
                <span className="text-[7px] text-foreground/50 uppercase">
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
