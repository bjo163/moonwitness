import React from "react"
import { Activity } from "lucide-react"
import type { EarthquakeFeature, SourceStatus } from "@moon/client"
import { resolveSemanticColor, type SemanticColorToken } from "../../../lib/semantic-color"

export function PlanetarySeismicWidget({
  earthquakes = [],
  status = "UNAVAILABLE",
}: {
  earthquakes?: EarthquakeFeature[]
  status?: SourceStatus
}) {
  const recentEvents = earthquakes.slice(0, 6)
  const statusClass =
    status === "LIVE"
      ? "border-success/30 bg-success/10 text-success"
      : status === "CACHED"
        ? "border-info/30 bg-info/10 text-info"
        : status === "STALE"
          ? "border-warning/30 bg-warning/10 text-warning"
          : status === "SIMULATED"
            ? "border-secondary/30 bg-secondary/10 text-secondary"
            : "border-destructive/30 bg-destructive/10 text-destructive"

  return (
    <div className="bg-background flex flex-col rounded-xl border border-border p-4 lg:col-span-6 xl:col-span-7">
      <div className="mb-4 flex items-center justify-between gap-2 text-[9px] font-black tracking-widest text-primary uppercase">
        PLANETARY SEISMIC ACTIVITY
        <span className={`rounded-md border px-2 py-1 text-[8px] ${statusClass}`}>
          USGS {status}
        </span>
      </div>

      <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-3">
        {recentEvents.length === 0 ? (
          <div className="col-span-full py-10 text-center text-sm text-muted-foreground">
            {status === "UNAVAILABLE"
              ? "The USGS source is unavailable; an event count cannot be reported."
              : status === "SIMULATED"
                ? "Seismic data is simulated for demonstration only."
                : "No earthquake records were returned by the source."}
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

                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
