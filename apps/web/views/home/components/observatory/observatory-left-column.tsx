import React from "react"
import { Calendar } from "lucide-react"

export function ObservatoryLeftColumn({ obs }: { obs: any }) {
  return (
    <div className="flex flex-col justify-between space-y-6 lg:col-span-3">
      {/* Moon Status Box */}
      <div className="bg-background/40 hover:bg-background/60 space-y-4 rounded-xl border border-border p-5 shadow-sm backdrop-blur-xl transition-all duration-500 hover:border-border">
        <div className="flex items-center justify-between border-b border-border pb-2.5 text-xs font-black tracking-wider text-primary uppercase">
          <span>| MOON STATUS</span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-success">
            ● ACTIVE
          </span>
        </div>

        {/* Moon phase graphic preview */}
        <div className="flex items-center gap-4 py-2">
          <div className="bg-background/60 flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border shadow-sm backdrop-blur-md">
            <img
              src="/assets/cam_moon.png"
              alt="Moon Phase"
              className="h-full w-full rounded-full object-cover drop-shadow-sm filter"
            />
          </div>
          <div>
            <div className="text-xs font-black tracking-wider text-foreground uppercase">
              {obs.loading ? "SCANNING..." : obs.moon.phaseName}
            </div>
            <div className="mt-0.5 font-mono text-xl font-black text-primary drop-shadow-sm">
              {obs.loading ? "--.-" : obs.moon.illumination}%
            </div>
            <div className="text-[9px] text-primary uppercase">
              ILLUMINATION
            </div>
          </div>
        </div>

        {/* Stats Table */}
        <div className="space-y-2 border-t border-border pt-2 font-mono text-[11px]">
          <div className="flex justify-between">
            <span className="text-primary">LUNAR AGE</span>
            <span className="font-bold text-foreground">
              {obs.loading ? "--" : obs.moon.age} DAYS
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-primary">MOONRISE</span>
            <span className="font-bold text-foreground">18:42 WIB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-primary">MOONSET</span>
            <span className="font-bold text-foreground">06:11 WIB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-primary">NEXT FULL MOON</span>
            <span className="font-bold text-primary">
              {obs.loading ? "----" : obs.moon.nextFullMoon}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-1">
            <span className="text-primary">VISIBILITY</span>
            <span className="rounded-xs border border-success/30 bg-success/10 px-2 py-0.5 font-black tracking-wider text-success backdrop-blur-sm">
              {obs.loading ? "---" : obs.moon.visibility} ●
            </span>
          </div>
        </div>
      </div>

      {/* Hijri Calendar Terminal Box */}
      <div className="bg-background/40 hover:bg-background/60 flex flex-col justify-between rounded-xl border border-border p-5 shadow-sm backdrop-blur-xl transition-all duration-500 hover:border-border">
        <div className="mb-3 flex items-center gap-2 border-b border-border pb-2.5 text-xs font-black tracking-wider text-primary uppercase">
          <Calendar className="h-4 w-4 text-primary" />
          <span>HIJRI CALENDAR</span>
        </div>

        <div className="my-2 flex items-center gap-4">
          <div className="font-mono text-5xl font-black text-foreground drop-shadow-sm">
            {obs.loading ? "--" : obs.hijri.day}
          </div>
          <div>
            <div className="text-sm font-black tracking-wider text-primary">
              {obs.loading ? "SCANNING..." : obs.hijri.month}
            </div>
            <div className="text-xs font-bold text-foreground">
              {obs.loading ? "----" : obs.hijri.year} AH
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5 text-xs font-black tracking-widest text-success uppercase">
          <span>
            {obs.loading
              ? "----"
              : `${obs.hijri.weekdayEn} // ${obs.hijri.weekdayAr}`}
          </span>
          <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
        </div>
      </div>
    </div>
  )
}
