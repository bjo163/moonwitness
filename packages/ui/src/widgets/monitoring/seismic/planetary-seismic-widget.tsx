import React from "react"
import { Activity } from "lucide-react"
import { EarthquakeFeature } from "@moon/client"
import { resolveSemanticColor, type SemanticColorToken } from "../../../lib/semantic-color"

export function PlanetarySeismicWidget({
  earthquakes = [],
}: {
  earthquakes?: EarthquakeFeature[]
}) {
  // Sort by magnitude, or just take the most recent 6
  const recentEvents = earthquakes.slice(0, 6)

  return (
    <div className="bg-background flex flex-col rounded-xl border border-border p-4 lg:col-span-6 xl:col-span-7">
      <div className="mb-4 flex items-center gap-2 text-[9px] font-black tracking-widest text-primary uppercase">
        PLANETARY SEISMIC ACTIVITY
        <span className="animate-pulse rounded-[2px] border border-destructive/30 bg-destructive/20 px-1.5 py-0.5 text-[8px] text-destructive">
          USGS LIVE
        </span>
      </div>

      <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-3">
        {recentEvents.length === 0 ? (
          <div className="col-span-full py-10 text-center text-[10px] text-primary/50">
            Synchronizing with USGS Network...
          </div>
        ) : (
          recentEvents.map((eq, i) => {
            const mag = eq.properties.mag
            let sev = "Low"
            let color: SemanticColorToken = "success"

            if (mag >= 6) {
              sev = "Critical"
              color = "destructive"
            } else if (mag >= 4.5) {
              sev = "High"
              color = "warning"
            } else if (mag >= 3) {
              sev = "Medium"
              color = "info"
            }

            return (
              <div
                key={eq.id}
                className="bg-background group flex flex-col justify-between rounded-lg border border-border p-3 transition-colors hover:border-border"
              >
                <div className="mb-2 flex items-start gap-2">
                  <Activity className="h-4 w-4 shrink-0 text-foreground/50 group-hover:text-foreground" />
                  <div className="text-[9px] leading-tight font-bold text-foreground">
                    {eq.properties.place}
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex justify-between text-[7px] text-primary uppercase">
                    <span>SEVERITY</span>
                    <span>MAGNITUDE</span>
                  </div>
                  <div className="mb-2 flex items-baseline justify-between">
                    <span
                      className="text-[10px] font-black"
                      style={{ color: resolveSemanticColor(color) }}
                    >
                      {sev}
                    </span>
                    <span
                      className="font-mono text-[9px] font-bold"
                      style={{ color: resolveSemanticColor(color) }}
                    >
                      {mag.toFixed(1)}
                    </span>
                  </div>

                  <div className="mb-1 text-[7px] text-primary uppercase">
                    TIME
                  </div>
                  <div className="truncate text-[9px] text-primary">
                    {new Date(eq.properties.time).toLocaleString()}
                  </div>

                  {/* Sparkline simulation */}
                  <div className="mt-3 flex items-end gap-[1px]">
                    {Array.from({ length: 15 }).map((_, sparkIdx) => {
                      const maxH = mag > 4.5 ? 15 : 8
                      const height = 2 + Math.random() * maxH
                      return (
                        <div
                          key={sparkIdx}
                          className="w-1.5 opacity-30"
                          style={{
                            height: `${height}px`,
                            backgroundColor: resolveSemanticColor(color),
                          }}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
