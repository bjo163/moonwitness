import Link from "next/link"
import React from "react"
import { Moon, Clock, Compass, Sparkles, Radio, MapPin } from "lucide-react"

export function ObservatoryBottomDeck() {
  return (
    <div className="bg-background/40 grid grid-cols-1 items-center gap-6 rounded-xl border border-cyan-500/30 p-6 shadow-sm backdrop-blur-xl transition-all duration-500 hover:border-cyan-400/50 lg:grid-cols-12">
      {/* LEFT: QUICK ACCESS OBSERVATORY TOOLKIT (Col 1-5) */}
      <div className="space-y-3 lg:col-span-5">
        <div className="flex items-center gap-2 text-xs font-black tracking-wider text-white uppercase">
          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-sm" />
          <span>QUICK ACCESS TOOLS</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px] sm:grid-cols-4">
          {[
            {
              l: "MOON CALENDAR",
              icon: Moon,
              href: "/observatory/lunar-calendar",
            },
            {
              l: "PRAYER TIMES",
              icon: Clock,
              href: "/observatory/prayer-times",
            },
            {
              l: "ATMOSPHERIC RADAR",
              icon: Compass,
              href: "/observatory/atmospheric-radar",
            },
            {
              l: "STAR MAP",
              icon: Sparkles,
              href: "/observatory/celestial-star-map",
            },
          ].map((btn, i) => (
            <Link
              key={i}
              href={btn.href}
              className="bg-background/60 group hover:bg-background/80 flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded border border-white/10 p-2.5 text-center transition-all hover:border-cyan-400/50"
            >
              <btn.icon className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
              <span className="text-[9px] font-bold text-white/90 group-hover:text-cyan-400">
                {btn.l}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* CENTER: SYSTEM SYNCHRONIZATION FEED (Col 6-8) */}
      <div className="space-y-2 border-y border-white/10 py-4 font-mono text-[11px] md:border-x md:border-y-0 md:px-6 md:py-0 lg:col-span-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-black tracking-wider text-primary uppercase">
          <Radio className="h-3.5 w-3.5 animate-ping text-emerald-400" />
          <span>SYSTEM FEED</span>
        </div>
        <div className="space-y-1.5 text-[10px] text-primary">
          <div className="truncate">
            <span className="font-bold text-emerald-400">23:50:16</span> •
            AlAdhan API synchronized
          </div>
          <div className="truncate">
            <span className="font-bold text-primary">23:50:15</span> • Qibla
            direction locked
          </div>
          <div className="truncate">
            <span className="font-bold text-amber-400">23:50:14</span> •
            Telemetry feed updated
          </div>
          <div className="truncate">
            <span className="text-knowledge font-bold">23:50:13</span> •
            Background matrix active
          </div>
        </div>
      </div>

      {/* RIGHT: GEO LOCATION TRACKER (Col 9-12) */}
      <div className="flex flex-col items-end justify-between space-y-2 text-right lg:col-span-3">
        <div className="flex items-center gap-2 text-xs font-black tracking-widest text-white uppercase">
          <span>GEO LOCATION</span>
          <MapPin className="h-4 w-4 animate-bounce text-rose-500" />
        </div>
        <div className="font-mono text-[12px] font-black tracking-wide text-primary uppercase">
          JAKARTA, INDONESIA
        </div>
        <div className="flex items-center justify-end gap-1.5 font-mono text-[10px] font-bold text-emerald-400">
          <span>ACTIVE REGION</span>
          <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400 shadow-sm" />
        </div>
        <div className="font-mono text-[9px] text-primary">
          GPS ACCURACY LOCKED // 0.01M
        </div>
      </div>
    </div>
  )
}
