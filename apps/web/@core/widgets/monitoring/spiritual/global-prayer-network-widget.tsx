import React from "react"
import { Moon, Clock, ArrowRight } from "lucide-react"
import { GlobalCityPrayer } from "@core/api/hooks/use-global-monitoring"

export function GlobalPrayerNetworkWidget({ globalPrayers = [] }: { globalPrayers?: GlobalCityPrayer[] }) {
  return (
    <div className="bg-space flex flex-col rounded-xl border border-white/10 p-4 lg:col-span-3 xl:col-span-3">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[9px] font-black tracking-widest text-white uppercase flex items-center gap-2">
          GLOBAL PRAYER NETWORK
          <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded-[2px] text-[8px] border border-primary/30 animate-pulse">ALADHAN SYNC</span>
        </div>
      </div>

      <div className="hide-scrollbar flex-1 space-y-3 overflow-y-auto min-h-[250px]">
        {globalPrayers.length === 0 ? (
          <div className="text-center text-primary/50 text-[10px] py-10">Synchronizing with Aladhan Network...</div>
        ) : (
          globalPrayers.map((gp, idx) => (
            <div key={idx} className="border-primary/30 bg-primary/10 relative flex gap-3 overflow-hidden rounded-lg border p-3">
              <div className="bg-primary absolute top-0 bottom-0 left-0 w-1" />
              <Moon className="text-primary mt-0.5 h-5 w-5 shrink-0" />
              <div className="w-full">
                <div className="mb-1 flex items-start justify-between">
                  <div className="text-primary text-[10px] font-black uppercase">
                    {gp.city}, {gp.country}
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-1 mt-2 text-center text-[8px] font-mono text-white/70">
                  <div className="flex flex-col"><span className="text-primary">Fajr</span><span>{gp.prayerTimes.Fajr}</span></div>
                  <div className="flex flex-col"><span className="text-primary">Dhuhr</span><span>{gp.prayerTimes.Dhuhr}</span></div>
                  <div className="flex flex-col"><span className="text-primary">Asr</span><span>{gp.prayerTimes.Asr}</span></div>
                  <div className="flex flex-col"><span className="text-primary">Maghrib</span><span>{gp.prayerTimes.Maghrib}</span></div>
                  <div className="flex flex-col"><span className="text-primary">Isha</span><span>{gp.prayerTimes.Isha}</span></div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="text-primary mt-2 flex w-full items-center justify-end gap-1 text-right text-[8px] font-bold tracking-widest uppercase hover:text-white">
        VIEW FULL NETWORK <ArrowRight className="h-2.5 w-2.5" />
      </button>
    </div>
  )
}

