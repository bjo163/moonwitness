import Link from "next/link"
import React from "react"
import { Sun, Compass, Sparkles } from "lucide-react"

export function ObservatoryRightColumn({ obs }: { obs: any }) {
  return (
    <div className="flex flex-col justify-between space-y-5 lg:col-span-3">
      {/* Upcoming Events List */}
      <div className="bg-space/40 backdrop-blur-xl space-y-3.5 rounded-xl border border-cyan-500/30 p-5 shadow-[0_0_30px_rgba(0,200,255,0.05)] transition-all duration-500 hover:border-cyan-400/50 hover:bg-space/60">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs font-black tracking-wider text-primary uppercase">
          <span>| UPCOMING EVENTS</span>
          <Sparkles className="h-3.5 w-3.5 animate-pulse text-amber-400" />
        </div>

        <div className="space-y-3 font-mono text-[11px]">
          {[
            {
              title: "LAST QUARTER",
              dt: "03 JUN 2025 / 02:41 WIB",
              col: "#00F0FF",
            },
            {
              title: "NEW MOON",
              dt: obs.loading ? "SCANNING..." : `${obs.moon.nextFullMoon} / 12:00 WIB`,
              col: "#10B981",
            },
            {
              title: "SOLAR ECLIPSE",
              dt: "21 SEP / VISIBLE PARTIAL",
              col: "#F59E0B",
            },
          ].map((ev, i) => (
            <div
              key={i}
              className="flex flex-col border-l-2 py-1 pl-2.5 transition-colors hover:bg-white/5"
              style={{ borderColor: ev.col }}
            >
              <span className="text-xs font-black text-white">
                {ev.title}
              </span>
              <span className="mt-0.5 text-[10px] text-primary">
                {ev.dt}
              </span>
            </div>
          ))}
        </div>

        <Link
          href="/observatory/lunar-calendar"
          className="block pt-1 text-right text-[10px] font-black text-primary hover:underline"
        >
          VIEW ALL EVENTS ➔
        </Link>
      </div>

      {/* Sun Position Strip */}
      <div className="bg-space/40 backdrop-blur-xl flex items-center justify-between rounded-xl border border-amber-500/30 p-4 shadow-[0_0_25px_rgba(245,158,11,0.05)] transition-all duration-500 hover:border-amber-400/50">
        <div className="flex items-center gap-3">
          <Sun className="animate-spin-slow h-8 w-8 shrink-0 text-amber-400 drop-shadow-[0_0_8px_#F59E0B] filter" />
          <div>
            <div className="text-[10px] font-black text-primary uppercase">
              SUN POSITION
            </div>
            <div className="font-mono text-xs font-black text-amber-300">
              SUNRISE {obs.loading ? "--:--" : obs.sun.sunrise}
            </div>
          </div>
        </div>
        <div className="text-right font-mono text-[10px] font-bold text-white">
          DAY LENGTH
          <br />
          <span className="text-xs font-black text-amber-400">
            11h 45m 12s
          </span>
        </div>
      </div>

      {/* Qibla Direction Compass Dial */}
      <div className="bg-space/40 backdrop-blur-xl flex items-center justify-between gap-3 rounded-xl border border-emerald-500/30 p-5 shadow-[0_0_30px_rgba(16,185,129,0.05)] transition-all duration-500 hover:border-emerald-400/50">
        <div>
          <div className="mb-1 text-xs font-black tracking-wider text-emerald-400 uppercase">
            | QIBLA DIRECTION
          </div>
          <div className="font-mono text-3xl font-black text-white drop-shadow-[0_0_10px_#10B981]">
            {obs.loading ? "---.-" : obs.qibla}°
          </div>
          <div className="mt-0.5 text-[11px] font-bold text-emerald-300 uppercase">
            NW TOWARDS MAKKAH
          </div>
          <div className="mt-1 flex items-center gap-1 text-[9px] font-bold text-primary">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />{" "}
            ACCURACY ±0.1° • CALIBRATED
          </div>
        </div>

        {/* Compass Gauge visual */}
        <div className="bg-space/60 backdrop-blur-md relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-emerald-400/40 shadow-[inset_0_0_15px_rgba(16,185,129,0.15)]">
          <Compass className="h-10 w-10 animate-pulse text-emerald-400 drop-shadow-[0_0_8px_#10B981]" />
          <span className="absolute top-1 text-[8px] font-black text-white">
            N
          </span>
          <span className="absolute bottom-1 text-[8px] font-black text-primary">
            S
          </span>
        </div>
      </div>
    </div>
  )
}
