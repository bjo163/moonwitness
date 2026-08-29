import React from "react"
import { Activity } from "lucide-react"

export function ObservatoryTelemetry({ obs }: { obs: any }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5 text-xs font-black tracking-widest text-primary uppercase">
        <Activity className="h-4 w-4 animate-pulse text-success" />
        <span>LIVE TELEMETRY FEED</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9">
        {[
          {
            label: "LATITUDE",
            val: "-6.2000°",
            sub: "SOUTH",
            col: "#00F0FF",
          },
          {
            label: "LONGITUDE",
            val: "106.8160°",
            sub: "EAST",
            col: "#00F0FF",
          },
          {
            label: "ALTITUDE",
            val: "32 M",
            sub: "SEA LEVEL",
            col: "#10B981",
          },
          {
            label: "SUNSET",
            val: obs.loading ? "--:--" : obs.sun.sunset,
            sub: "WIB TIME",
            col: "#A855F7",
          },
          {
            label: "WEATHER",
            val: "25°C",
            sub: "CLEAR SKY",
            col: "#F59E0B",
          },
          {
            label: "VISIBILITY",
            val: "22 KM",
            sub: "EXCELLENT",
            col: "#10B981",
          },
          { label: "HUMIDITY", val: "68%", sub: "GOOD", col: "#3B82F6" },
          {
            label: "PRESSURE",
            val: "1012 hPa",
            sub: "STABLE",
            col: "#A855F7",
          },
          {
            label: "AIR QUALITY",
            val: "AQI 28",
            sub: "GOOD",
            col: "#10B981",
          },
        ].map((t, idx) => (
          <div
            key={idx}
            className="bg-background/40 hover:bg-background/60 flex flex-col justify-between rounded-lg border border-border p-3 text-center shadow-inner backdrop-blur-md transition-colors hover:border-border"
          >
            <div className="text-[9px] font-black tracking-wider text-primary uppercase">
              {t.label}
            </div>
            <div
              className="my-1.5 font-mono text-base font-black text-foreground drop-shadow-sm"
              style={{ color: t.col }}
            >
              {t.val}
            </div>
            <div className="text-[8px] font-bold tracking-widest text-primary uppercase">
              {t.sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
