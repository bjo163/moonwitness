import { Signal } from "lucide-react"

export function GlobalPrayerWallWidget() {
  return (
    <section
      className="space-y-2 rounded-md border border-warning/30 bg-warning/10 p-4"
      role="status"
      aria-label="Prayer wall unavailable"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-warning">
        <Signal className="size-4" aria-hidden="true" />
        <h2>Prayer wall unavailable</h2>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        No verified prayer feed or submission service is configured. Prayer
        activity and participant counts are not available.
      </p>
    </section>
  )
}
