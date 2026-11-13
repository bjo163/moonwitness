import React from "react"
import { Activity } from "lucide-react"
import type { EarthquakeFeature, SourceStatus } from "@moon/client"
import { resolveSemanticColor, type SemanticColorToken } from "../../../lib/semantic-color"

export type PlanetarySeismicWidgetProps = {
  earthquakes?: EarthquakeFeature[]
  status?: SourceStatus
  sourceLabel?: string
}

function statusLabel(status: SourceStatus): string {
  if (status === "LIVE") return "LIVE"
  if (status === "CACHED") return "CACHED"
  if (status === "STALE") return "STALE"
  if (status === "SIMULATED") return "SIMULATED"
  return "UNAVAILABLE"
}

function statusClasses(status: SourceStatus): string {
  if (status === "LIVE") return "animate-pulse border-success/30 bg-success/20 text-success"
  if (status === "STALE") return "border-warning/30 bg-warning/20 text-warning"
  if (status === "CACHED") return "border-info/30 bg-info/20 text-info"
  if (status === "SIMULATED") return "border-secondary/30 bg-secondary/20 text-secondary"
  return "border-border bg-muted/30 text-muted-foreground"
}

export function PlanetarySeismicWidget({
  earthquakes = [],
  status = "UNAVAILABLE",
  sourceLabel = "USGS",
}: PlanetarySeismicWidgetProps) {
  const recentEvents = earthquakes.slice(0, 6)
  const resolvedStatus = recentEvents.length === 0 && status === "LIVE" ? "UNAVAILABLE" : status

  return (
    <div className="bg-background flex flex-col rounded-xl border border-border p-4 lg:col-span-6 xl:col-span-7">
      <div className="mb-4 flex items-center gap-2 text-[9px] font-black tracking-widest text-primary uppercase">
        PLANETARY SEISMIC ACTIVITY
        <span className={`rounded-[2px] border px-1.5 py-0.5 text-[8px] ${statusClasses(resolvedStatus)}`}>
          {sourceLabel} {statusLabel(resolvedStatus)}
        </span>
      </div>

      <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-3">
        {recentEvents.length === 0 ? (
          <div className="col-span-full py-10 text-center text-[10px] text-muted-foreground">
            Seismic feed {statusLabel(resolvedStatus).toLowerCase()}. No verified events to display.
          </div>
        ) : (
          recentEvents.map((eq) => {
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
                className="bg-background group flex flex-col justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/30"
              >
                <div className="mb-2 flex items-start gap-2">
                  <Activity className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
                  <div className="text-[9px] leading-tight font-bold text-foreground">
                    {eq.properties.place}
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex justify-between text-[7px] text-muted-foreground uppercase">
                    <span>SEVERITY</span>
                    <span>MAGNITUDE</span>
                  </div>
                  <div className="mb-2 flex items-baseline justify-between">
                    <span className="text-[10px] font-black" style={{ color: resolveSemanticColor(color) }}>
                      {sev}
                    </span>
                    <span className="font-mono text-[9px] font-bold" style={{ color: resolveSemanticColor(color) }}>
                      {mag.toFixed(1)}
                    </span>
                  </div>

                  <div className="mb-1 text-[7px] text-muted-foreground uppercase">TIME</div>
                  <div className="truncate text-[9px] text-foreground/80">
                    {new Date(eq.properties.time).toLocaleString()}
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
