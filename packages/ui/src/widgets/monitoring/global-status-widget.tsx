import { Activity } from "lucide-react"
import {
  resolveSourceStatus,
  summarizeSourceStatus,
  type SourceMeta,
  type SourceStatus,
} from "@moon/client"

const STATUS_CLASSES: Record<SourceStatus, string> = {
  LIVE: "border-success/30 bg-success/10 text-success",
  CACHED: "border-info/30 bg-info/10 text-info",
  STALE: "border-warning/30 bg-warning/10 text-warning",
  UNAVAILABLE: "border-destructive/30 bg-destructive/10 text-destructive",
  SIMULATED: "border-secondary/30 bg-secondary/10 text-secondary",
}

function formatCheckTime(timestamp: number): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(new Date(timestamp))
}

export function GlobalStatusWidget({
  sources = [],
}: {
  sources?: SourceMeta[]
}) {
  const summary = summarizeSourceStatus(sources)

  return (
    <section
      className="flex flex-1 flex-col rounded-md border border-border bg-card p-4"
      aria-label="Monitoring source status"
    >
      <div className="mb-3 flex items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Activity className="size-4 text-muted-foreground" aria-hidden="true" />
          <h2>Data sources</h2>
        </div>
        <span
          className={`rounded-md border px-2 py-1 text-xs font-medium ${STATUS_CLASSES[summary.status]}`}
        >
          {summary.status}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-2 text-xs">
        {(
          [
            ["Live", summary.live, "text-success"],
            ["Cached", summary.cached, "text-info"],
            ["Stale", summary.stale, "text-warning"],
            ["Unavailable", summary.unavailable, "text-destructive"],
            ["Simulated", summary.simulated, "text-secondary"],
            ["Total", summary.total, "text-foreground"],
          ] as const
        ).map(([label, count, color]) => (
          <div
            key={label}
            className="flex items-center justify-between rounded border border-border px-2 py-1.5"
          >
            <dt className="text-muted-foreground">{label}</dt>
            <dd className={`font-mono font-medium ${color}`}>{count}</dd>
          </div>
        ))}
      </dl>

      <ul className="mt-3 max-h-52 space-y-1 overflow-y-auto border-t border-border pt-3">
        {sources.length === 0 ? (
          <li className="text-xs text-muted-foreground">
            No source responses have been recorded.
          </li>
        ) : (
          sources.map((source) => {
            const status = resolveSourceStatus(source.status, source.timestamp)
            return (
              <li
                key={source.source}
                className="flex items-center justify-between gap-2 text-xs"
              >
                <span className="truncate text-foreground">
                  {source.source.replaceAll("-", " ")}
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className={STATUS_CLASSES[status]}>{status}</span>
                  <time
                    className="font-mono text-[10px] text-muted-foreground"
                    dateTime={new Date(source.timestamp).toISOString()}
                  >
                    {formatCheckTime(source.timestamp)}
                  </time>
                </span>
              </li>
            )
          })
        )}
      </ul>
    </section>
  )
}
