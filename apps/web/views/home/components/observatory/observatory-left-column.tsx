import React from "react"
import { Calendar } from "lucide-react"

export function ObservatoryLeftColumn({ obs }: { obs: any }) {
  return (
    <div className="flex flex-col justify-between space-y-6 lg:col-span-3">
      {/* Moon Status Box */}
      <div className="bg-background/40 hover:bg-background/60 space-y-4 rounded-xl border border-cyan-500/30 p-5 shadow-[0_0_30px_rgba(0,240,255,0.05)] backdrop-blur-xl transition-all duration-500 hover:border-cyan-400/50">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5 text-xs font-black tracking-wider text-primary uppercase">
          <span>| MOON STATUS</span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
            ● ACTIVE
          </span>
        </div>

        {/* Moon phase graphic preview */}
        <div className="flex items-center gap-4 py-2">
          <div className="bg-background/60 flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.1)] backdrop-blur-md">
            <img
              src="/assets/cam_moon.png"
              alt="Moon Phase"
              className="h-full w-full rounded-full object-cover drop-shadow-[0_0_8px_#00F0FF] filter"
            />
          </div>
          <div>
            <div className="text-xs font-black tracking-wider text-white uppercase">
              {obs.loading ? "SCANNING..." : obs.moon.phaseName}
            </div>
            <div className="mt-0.5 font-mono text-xl font-black text-primary drop-shadow-[0_0_8px_#00F0FF]">
              {obs.loading ? "--.-" : obs.moon.illumination}%
            </div>
            <div className="text-[9px] text-primary uppercase">
              ILLUMINATION
            </div>
          </div>
        </div>

        {/* Stats Table */}
        <div className="space-y-2 border-t border-white/10 pt-2 font-mono text-[11px]">
          <div className="flex justify-between">
            <span className="text-primary">LUNAR AGE</span>
            <span className="font-bold text-white">
              {obs.loading ? "--" : obs.moon.age} DAYS
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-primary">MOONRISE</span>
            <span className="font-bold text-white">18:42 WIB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-primary">MOONSET</span>
            <span className="font-bold text-white">06:11 WIB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-primary">NEXT FULL MOON</span>
            <span className="font-bold text-primary">
              {obs.loading ? "----" : obs.moon.nextFullMoon}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-white/5 pt-1">
            <span className="text-primary">VISIBILITY</span>
            <span className="rounded-xs border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 font-black tracking-wider text-emerald-400 backdrop-blur-sm">
              {obs.loading ? "---" : obs.moon.visibility} ●
            </span>
          </div>
        </div>
      </div>

      {/* Hijri Calendar Terminal Box */}
      <div className="bg-background/40 hover:bg-background/60 flex flex-col justify-between rounded-xl border border-cyan-500/30 p-5 shadow-[0_0_30px_rgba(0,200,255,0.05)] backdrop-blur-xl transition-all duration-500 hover:border-cyan-400/50">
        <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-2.5 text-xs font-black tracking-wider text-primary uppercase">
          <Calendar className="h-4 w-4 text-primary" />
          <span>HIJRI CALENDAR</span>
        </div>

        <div className="my-2 flex items-center gap-4">
          <div className="font-mono text-5xl font-black text-white drop-shadow-[0_0_12px_#FFF]">
            {obs.loading ? "--" : obs.hijri.day}
          </div>
          <div>
            <div className="text-sm font-black tracking-wider text-primary">
              {obs.loading ? "SCANNING..." : obs.hijri.month}
            </div>
            <div className="text-xs font-bold text-white/90">
              {obs.loading ? "----" : obs.hijri.year} AH
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5 text-xs font-black tracking-widest text-emerald-400 uppercase">
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
