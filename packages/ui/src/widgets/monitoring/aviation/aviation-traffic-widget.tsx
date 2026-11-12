import React from "react"
import { Plane } from "lucide-react"
import type { FlightInfo, SourceStatus } from "@moon/client"

export type AviationTrafficWidgetProps = {
  flights?: FlightInfo[]
  status?: SourceStatus
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

export function AviationTrafficWidget({
  flights = [],
  status = "UNAVAILABLE",
}: AviationTrafficWidgetProps) {
  const displayFlights = [...flights].sort((a, b) => b.altitude - a.altitude).slice(0, 10)
  const resolvedStatus = flights.length === 0 && status === "LIVE" ? "UNAVAILABLE" : status
  const canShowCount = resolvedStatus === "LIVE" || resolvedStatus === "CACHED" || resolvedStatus === "STALE"

  return (
    <div className="bg-background flex flex-col rounded-xl border border-border p-4 lg:col-span-3 xl:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[9px] font-black tracking-widest text-primary uppercase">
          AVIATION NETWORK
          <span className={`rounded-[2px] border px-1.5 py-0.5 text-[8px] ${statusClasses(resolvedStatus)}`}>
            {statusLabel(resolvedStatus)}
          </span>
        </div>
        <div className="text-[12px] font-bold text-secondary">{canShowCount ? flights.length : "—"}</div>
      </div>

      <div className="hide-scrollbar flex-1 space-y-3 overflow-y-auto">
        {flights.length === 0 ? (
          <div className="py-10 text-center text-[10px] text-muted-foreground">
            Aviation feed {statusLabel(resolvedStatus).toLowerCase()}. No verified transponder data.
          </div>
        ) : (
          displayFlights.map((f) => (
            <div
              key={f.icao24}
              className="group flex gap-2 rounded-md p-1"
            >
              <div className="mt-0.5 w-6 font-mono text-[8px] text-muted-foreground">{f.callsign || "—"}</div>
              <div className="bg-background flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border">
                <Plane className="h-3 w-3 text-secondary group-hover:text-foreground" />
              </div>
              <div className="flex-1">
                <div className="mb-0.5 text-[9px] leading-tight font-bold text-foreground">
                  {f.origin_country || "Unknown origin"}
                </div>
                <div className="max-w-[100px] truncate text-[7px] text-muted-foreground">
                  Alt: {f.altitude}m • Vel: {f.velocity}m/s
                </div>
              </div>
              <div className="text-[7px] font-bold text-secondary uppercase">TRK: {f.true_track}°</div>
            </div>
          ))
        )}
      </div>

    </div>
  )
}
