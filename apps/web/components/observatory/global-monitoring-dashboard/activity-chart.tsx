"use client"

import { useMemo } from "react"
import type { SourceStatus, EarthquakeFeature } from "@moon/client"
import { cn } from "@workspace/ui"

function hasUsableSourceData(status?: SourceStatus): boolean {
  return status === "LIVE" || status === "CACHED" || status === "STALE"
}

function sourceStatusText(
  status: SourceStatus | undefined,
  isLoading: boolean
): string {
  if (status) return status.toLowerCase()
  return isLoading ? "checking" : "unavailable"
}

interface ActivityChartProps {
  earthquakes: EarthquakeFeature[]
  status: SourceStatus | undefined
  isLoading: boolean
}

export function ActivityChart({ earthquakes, status, isLoading }: ActivityChartProps) {
  const buckets = useMemo(() => {
    const now = Date.now()
    return Array.from({ length: 7 }, (_, index) => {
      const end = now - (6 - index) * 24 * 60 * 60 * 1000
      const start = end - 24 * 60 * 60 * 1000
      const count = earthquakes.filter(
        ({ properties }) => properties.time >= start && properties.time < end
      ).length
      return { label: new Date(end).toLocaleDateString("en-GB", { weekday: "short" }), count }
    })
  }, [earthquakes])
  const max = Math.max(...buckets.map((bucket) => bucket.count), 1)

  if (!hasUsableSourceData(status)) {
    return (
      <div
        role="status"
        className="flex h-44 items-center justify-center border border-border text-sm text-muted-foreground"
      >
        Seismic activity is {sourceStatusText(status, isLoading)}.
      </div>
    )
  }

  return (
    <div
      role="img"
      aria-label="Earthquake counts by day for the latest seven days"
      className="flex h-44 items-end gap-3 border-b border-l border-border px-3 pb-0 pt-5"
    >
      {buckets.map((bucket) => (
        <div key={bucket.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
          <span className="text-xs tabular-nums text-muted-foreground">{bucket.count}</span>
          <div className="flex h-full w-full items-end">
            <div
              className="w-full rounded-t-md bg-primary/75 transition-[height]"
              style={{ height: `${Math.max(6, (bucket.count / max) * 100)}%` }}
            />
          </div>
          <span className="text-[11px] text-muted-foreground">{bucket.label}</span>
        </div>
      ))}
    </div>
  )
}
