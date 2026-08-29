import React from "react"
import { Moon, Clock, ArrowRight } from "lucide-react"
import { GlobalCityPrayer } from "@moon/client"

export function GlobalPrayerNetworkWidget({
  globalPrayers = [],
}: {
  globalPrayers?: GlobalCityPrayer[]
}) {
  return (
    <div className="bg-background flex flex-col rounded-xl border border-border p-4 lg:col-span-3 xl:col-span-3">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[9px] font-black tracking-widest text-foreground uppercase">
          GLOBAL PRAYER NETWORK
          <span className="animate-pulse rounded-[2px] border border-primary/30 bg-primary/20 px-1.5 py-0.5 text-[8px] text-primary">
            ALADHAN SYNC
          </span>
        </div>
      </div>

      <div className="hide-scrollbar min-h-[250px] flex-1 space-y-3 overflow-y-auto">
        {globalPrayers.length === 0 ? (
          <div className="py-10 text-center text-[10px] text-primary/50">
            Synchronizing with Aladhan Network...
          </div>
        ) : (
          globalPrayers.map((gp, idx) => (
            <div
              key={idx}
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
                    <span className="text-primary">Fajr</span>
                    <span>{gp.prayerTimes.Fajr}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-primary">Dhuhr</span>
                    <span>{gp.prayerTimes.Dhuhr}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-primary">Asr</span>
                    <span>{gp.prayerTimes.Asr}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-primary">Maghrib</span>
                    <span>{gp.prayerTimes.Maghrib}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-primary">Isha</span>
                    <span>{gp.prayerTimes.Isha}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="mt-2 flex w-full items-center justify-end gap-1 text-right text-[8px] font-bold tracking-widest text-primary uppercase hover:text-foreground">
        VIEW FULL NETWORK <ArrowRight className="h-2.5 w-2.5" />
      </button>
    </div>
  )
}
