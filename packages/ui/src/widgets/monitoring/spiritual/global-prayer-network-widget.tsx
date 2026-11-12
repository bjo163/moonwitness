import { Moon } from "lucide-react"
import type {
  GlobalCityPrayer,
  SourceMeta,
  SourceStatus,
} from "@moon/client"

const STATUS_CLASSES: Record<SourceStatus, string> = {
  LIVE: "border-success/30 bg-success/10 text-success",
  CACHED: "border-info/30 bg-info/10 text-info",
  STALE: "border-warning/30 bg-warning/10 text-warning",
  UNAVAILABLE: "border-destructive/30 bg-destructive/10 text-destructive",
  SIMULATED: "border-secondary/30 bg-secondary/10 text-secondary",
}

export function GlobalPrayerNetworkWidget({
  globalPrayers = [],
  sourceMeta = [],
}: {
  globalPrayers?: GlobalCityPrayer[]
  sourceMeta?: SourceMeta[]
}) {
  const prayerSources = sourceMeta.filter((source) =>
    source.source.startsWith("prayer-")
  )
  const prayersByCity = new Map(
    globalPrayers.map((prayer) => [prayer.city, prayer])
  )

  return (
    <section className="flex flex-col rounded-md border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2 border-b border-border pb-3 text-sm font-medium">
        <Moon className="size-4 text-muted-foreground" aria-hidden="true" />
        <h2>Calculated prayer times</h2>
      </div>

      <div className="max-h-80 flex-1 space-y-3 overflow-y-auto">
        {prayerSources.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No prayer-time source responses have been recorded.
          </p>
        ) : (
          prayerSources.map((source) => {
            const city = source.source.slice("prayer-".length)
            const prayer = prayersByCity.get(city)
            const statusClass = STATUS_CLASSES[source.status]

            return (
              <article
                key={source.source}
                className="rounded border border-border p-3"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="text-xs font-semibold">
                    {prayer ? `${prayer.city}, ${prayer.country}` : city}
                  </h3>
                  <span
                    className={`rounded-md border px-2 py-1 text-[10px] ${statusClass}`}
                  >
                    {source.status}
                  </span>
                </div>
                {prayer ? (
                  <dl className="grid grid-cols-5 gap-1 text-center font-mono text-[10px]">
                    {Object.entries(prayer.prayerTimes).map(([name, time]) => (
                      <div key={name}>
                        <dt className="text-muted-foreground">{name}</dt>
                        <dd className="mt-1 text-foreground">{time}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {source.status === "UNAVAILABLE"
                      ? "Prayer-time data is unavailable for this location."
                      : "No prayer-time data is available for this location."}
                  </p>
                )}
              </article>
            )
          })
        )}
      </div>
    </section>
  )
}
