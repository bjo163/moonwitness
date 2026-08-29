import React from "react"
import { Plane, ArrowRight } from "lucide-react"
import { FlightInfo } from "@moon/client"

export function AviationTrafficWidget({
  flights = [],
}: {
  flights?: FlightInfo[]
}) {
  // Sort by altitude (highest first) for the list
  const displayFlights = [...flights]
    .sort((a, b) => b.altitude - a.altitude)
    .slice(0, 10)

  return (
    <div className="bg-background flex flex-col rounded-xl border border-border p-4 lg:col-span-3 xl:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[9px] font-black tracking-widest text-primary uppercase">
          AVIATION NETWORK
          <span className="animate-pulse rounded-[2px] border border-secondary/30 bg-secondary/20 px-1.5 py-0.5 text-[8px] text-secondary">
            OPENSKY LIVE
          </span>
        </div>
        <div className="text-[12px] font-bold text-secondary">
          {flights.length}
        </div>
      </div>

      <div className="hide-scrollbar flex-1 space-y-3 overflow-y-auto">
        {flights.length === 0 ? (
          <div className="py-10 text-center text-[10px] text-primary/50">
            Scanning Transponders...
          </div>
        ) : (
          displayFlights.map((f, i) => (
            <div
              key={f.icao24}
              className="group flex cursor-pointer gap-2 rounded border border-transparent p-1 transition-colors hover:border-border hover:bg-muted/30"
            >
              <div className="mt-0.5 w-6 font-mono text-[8px] text-primary">
                {f.callsign}
              </div>
              <div className="bg-background flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border">
                <Plane className="h-3 w-3 text-secondary group-hover:text-foreground" />
              </div>
              <div className="flex-1">
                <div className="mb-0.5 text-[9px] leading-tight font-bold text-foreground">
                  {f.origin_country}
                </div>
                <div className="max-w-[100px] truncate text-[7px] text-primary">
                  Alt: {f.altitude}m • Vel: {f.velocity}m/s
                </div>
              </div>
              <div className="text-[7px] font-bold text-secondary uppercase">
                TRK: {f.true_track}°
              </div>
            </div>
          ))
        )}
      </div>

      <button className="mt-2 flex w-full items-center justify-center gap-1 border-t border-border pt-2 text-center text-[8px] font-bold tracking-widest text-primary uppercase hover:text-foreground">
        VIEW FULL NETWORK <ArrowRight className="h-2.5 w-2.5" />
      </button>
    </div>
  )
}
