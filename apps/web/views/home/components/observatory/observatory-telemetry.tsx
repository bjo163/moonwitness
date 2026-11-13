import React from "react"
import { Activity } from "lucide-react"
import { resolveSemanticColor, type SemanticColorToken } from "@workspace/ui"

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
            col: "info" as SemanticColorToken,
          },
          {
            label: "LONGITUDE",
            val: "106.8160°",
            sub: "EAST",
            col: "info" as SemanticColorToken,
          },
          {
            label: "ALTITUDE",
            val: "32 M",
            sub: "SEA LEVEL",
            col: "success" as SemanticColorToken,
          },
          {
            label: "SUNSET",
            val: obs.loading ? "--:--" : obs.sun.sunset,
            sub: "WIB TIME",
            col: "info" as SemanticColorToken,
          },
          {
            label: "WEATHER",
            val: "25°C",
            sub: "CLEAR SKY",
            col: "warning" as SemanticColorToken,
          },
          {
            label: "VISIBILITY",
            val: "22 KM",
            sub: "EXCELLENT",
            col: "success" as SemanticColorToken,
          },
          { label: "HUMIDITY", val: "68%", sub: "GOOD", col: "primary" as SemanticColorToken },
          {
            label: "PRESSURE",
            val: "1012 hPa",
            sub: "STABLE",
            col: "info" as SemanticColorToken,
          },
          {
            label: "AIR QUALITY",
            val: "AQI 28",
            sub: "GOOD",
            col: "success" as SemanticColorToken,
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
              style={{ color: resolveSemanticColor(t.col) }}
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
