import React from "react"
import { Moon } from "lucide-react"
import type { GlobalCityPrayer, SourceStatus } from "@moon/client"

export type GlobalPrayerNetworkWidgetProps = {
  globalPrayers?: GlobalCityPrayer[]
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

export function GlobalPrayerNetworkWidget({
  globalPrayers = [],
  status = "UNAVAILABLE",
}: GlobalPrayerNetworkWidgetProps) {
  const resolvedStatus = globalPrayers.length === 0 && status === "LIVE" ? "UNAVAILABLE" : status

  return (
    <div className="bg-background flex flex-col rounded-xl border border-border p-4 lg:col-span-3 xl:col-span-3">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[9px] font-black tracking-widest text-foreground uppercase">
          GLOBAL PRAYER NETWORK
          <span className={`rounded-[2px] border px-1.5 py-0.5 text-[8px] ${statusClasses(resolvedStatus)}`}>
            {statusLabel(resolvedStatus)}
          </span>
        </div>
      </div>

      <div className="hide-scrollbar min-h-[250px] flex-1 space-y-3 overflow-y-auto">
        {globalPrayers.length === 0 ? (
          <div className="py-10 text-center text-[10px] text-muted-foreground">
            Prayer data {statusLabel(resolvedStatus).toLowerCase()}. No verified city timings.
          </div>
        ) : (
          globalPrayers.map((gp, idx) => (
            <div
              key={`${gp.city}-${gp.country}-${idx}`}
              className="relative flex gap-3 overflow-hidden rounded-lg border border-primary/30 bg-primary/10 p-3"
            >
              <div className="absolute top-0 bottom-0 left-0 w-1 bg-primary" />
              <Moon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div className="w-full">
                <div className="mb-1 flex items-start justify-between">
                  <div className="text-[10px] font-black text-primary uppercase">
                    {gp.city}, {gp.country}
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-5 gap-1 text-center font-mono text-[8px] text-foreground">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Fajr</span>
                    <span>{gp.prayerTimes.Fajr}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Dhuhr</span>
                    <span>{gp.prayerTimes.Dhuhr}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Asr</span>
                    <span>{gp.prayerTimes.Asr}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Maghrib</span>
                    <span>{gp.prayerTimes.Maghrib}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Isha</span>
                    <span>{gp.prayerTimes.Isha}</span>
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
