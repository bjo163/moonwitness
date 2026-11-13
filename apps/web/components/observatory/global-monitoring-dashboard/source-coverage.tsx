"use client"

import { CloudSun } from "lucide-react"
import type { SourceStatus } from "@moon/client"

function sourceStatusText(
  status: SourceStatus | undefined,
  isLoading: boolean
): string {
  if (status) return status.toLowerCase()
  return isLoading ? "checking" : "unavailable"
}

interface SourceCoverageProps {
  sourceSummary: { live: number; cached: number; stale: number; unavailable: number; simulated: number }
  prayerSources: { source: string; status: SourceStatus }[]
  data: {
    globalPrayers: unknown[]
    trends: unknown[]
    spaceWeather: unknown[]
  }
  sourceStatus: Record<string, SourceStatus>
  isLoading: boolean
}

export function SourceCoverage({ sourceSummary, prayerSources, data, sourceStatus, isLoading }: SourceCoverageProps) {
  const hasUsableSourceData = (status?: SourceStatus) =>
    status === "LIVE" || status === "CACHED" || status === "STALE"
  const prayerAvailableCount = prayerSources.filter((source) =>
    hasUsableSourceData(source.status)
  ).length

  return (
    <article className="rounded-md border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <CloudSun className="size-5 text-primary" aria-hidden="true" />
        <div>
          <h2 className="text-lg font-semibold">Source coverage</h2>
          <p className="text-sm text-muted-foreground">
            {sourceSummary.live} live · {sourceSummary.cached} cached · {sourceSummary.stale} stale · {sourceSummary.unavailable} unavailable · {sourceSummary.simulated} simulated
          </p>
        </div>
      </div>
      <dl className="mt-5 divide-y divide-border text-sm">
        <div className="flex justify-between py-3">
          <dt className="text-muted-foreground">Prayer stations</dt>
          <dd>{prayerSources.length === 0 ? "—" : `${data.globalPrayers.length}/5`}</dd>
        </div>
        <div className="flex justify-between py-3">
          <dt className="text-muted-foreground">Trend records</dt>
          <dd>{hasUsableSourceData(sourceStatus["google-trends"]) ? data.trends.length : sourceStatusText(sourceStatus["google-trends"], isLoading)}</dd>
        </div>
        <div className="flex justify-between py-3">
          <dt className="text-muted-foreground">Space weather</dt>
          <dd>{hasUsableSourceData(sourceStatus["nasa-donki"]) ? data.spaceWeather.length : sourceStatusText(sourceStatus["nasa-donki"], isLoading)}</dd>
        </div>
      </dl>
    </article>
  )
}
