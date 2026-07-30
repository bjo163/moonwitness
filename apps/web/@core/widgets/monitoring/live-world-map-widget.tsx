import React from "react"
import { Hexagon } from "lucide-react"

export function LiveWorldMapWidget() {
  return (
    <div className="bg-space relative flex flex-col overflow-hidden rounded-xl border-2 border-primary/20 p-4 lg:col-span-6 xl:col-span-5">
      <div className="relative z-20 flex items-center justify-between">
        <div>
          <div className="mb-0.5 text-[10px] font-black tracking-widest text-white uppercase">
            LIVE WORLD MAP
          </div>
          <div className="text-[8px] text-primary">
            Real-time monitoring of events, observations, and intelligence
          </div>
        </div>
        <button className="rounded border border-white/10 bg-white/5 px-2 py-1 text-[9px] text-primary hover:text-white">
          VIEW LAYERS ∨
        </button>
      </div>

      {/* Map Graphic Simulation */}
      <div className="relative mt-4 min-h-[200px] flex-1">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMCIvPgo8Y2lyY2xlIGN4PSI0IiBjeT0iNCIgcj0iMC41IiBmaWxsPSIjMzBENDc0Ii8+Cjwvc3ZnPg==')] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)] opacity-50" />

        {/* Floating Nodes */}
        <div className="absolute top-[30%] left-[25%]">
          <div className="bg-success h-2.5 w-2.5 animate-pulse rounded-full shadow-[0_0_15px_#00FF66]" />
        </div>
        <div className="absolute top-[50%] left-[15%]">
          <div className="bg-warning h-2.5 w-2.5 rounded-full shadow-[0_0_15px_#FF9900]" />
        </div>
        <div className="absolute top-[20%] left-[45%]">
          <div className="bg-danger h-3 w-3 animate-pulse rounded-full shadow-[0_0_20px_#FF0055]" />
        </div>
        <div className="absolute top-[40%] left-[55%]">
          <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_15px_#00F0FF]" />
        </div>
        <div className="absolute top-[60%] left-[75%]">
          <div className="bg-knowledge h-2.5 w-2.5 animate-pulse rounded-full shadow-[0_0_15px_#A100FF]" />
        </div>
        <div className="absolute top-[35%] left-[85%]">
          <div className="h-2 w-2 rounded-full bg-secondary shadow-[0_0_10px_#0088FF]" />
        </div>

        {/* Connecting Lines */}
        <svg className="absolute inset-0 z-0 h-full w-full opacity-40">
          <path
            d="M 25% 30% Q 35% 25% 45% 20%"
            fill="none"
            stroke="#FF0055"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <path
            d="M 45% 20% Q 50% 30% 55% 40%"
            fill="none"
            stroke="#00F0FF"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <path
            d="M 55% 40% Q 65% 50% 75% 60%"
            fill="none"
            stroke="#A100FF"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
        </svg>
      </div>

      {/* Map Legends */}
      <div className="relative z-20 mt-auto flex items-center justify-between border-t border-white/10 pt-3">
        {[
          { l: "Moon Reports", v: "842", c: "#00FF66" },
          { l: "Observation Nodes", v: "318", c: "#00F0FF" },
          { l: "Research Centers", v: "124", c: "#A100FF" },
          { l: "Active Missions", v: "24", c: "#FF9900" },
          { l: "Contributors", v: "12,842", c: "#0088FF" },
        ].map((lg, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className="flex h-5 w-5 items-center justify-center rounded border border-white/10 bg-primary"
              style={{ borderColor: `${lg.c}40` }}
            >
              <Hexagon className="h-3 w-3" style={{ color: lg.c }} />
            </div>
            <div>
              <div className="text-[7px] text-primary uppercase">{lg.l}</div>
              <div className="text-[10px] font-black text-white">{lg.v}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
