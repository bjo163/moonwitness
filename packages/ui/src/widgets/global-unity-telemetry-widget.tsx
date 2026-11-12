import { Signal } from "lucide-react"

export function GlobalUnityTelemetryWidget() {
  return (
    <div
      className="flex items-center gap-2 rounded-md border border-warning/50 bg-warning/10 px-3 py-2 text-sm text-warning"
      role="status"
      aria-label="Unity telemetry unavailable"
    >
      <Signal className="size-4" aria-hidden="true" />
      <span className="font-medium">Unity telemetry unavailable</span>
      <span className="text-xs text-muted-foreground">
        No verified production source is configured.
      </span>
    </div>
  )
}
