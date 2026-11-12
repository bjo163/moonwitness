"use client"

import { Signal } from "lucide-react"

export function GlobalUnityTelemetryWidget() {
  return (
    <div
      role="status"
      aria-label="Unity telemetry unavailable"
      className="flex items-center gap-2 font-mono"
    >
      <div className="flex items-center gap-1 rounded-md border border-destructive/50 bg-destructive/10 px-2 py-0.5 text-[8px] font-bold text-destructive">
        <Signal aria-hidden="true" className="h-3 w-3" />
        <span>[ UNITY: — ]</span>
        <span>(— PRAYERS)</span>
        <span className="rounded bg-destructive/20 px-1 text-[7px] font-bold uppercase">
          UNAVAILABLE
        </span>
      </div>
      <span className="text-[10px] text-muted-foreground">
        Unity telemetry source is not configured.
      </span>
    </div>
  )
}
