"use client"

import { useEffect, useMemo, useState } from "react"
import { Globe2, Activity, Plane, Satellite, CloudSun, MapPin, Sun, Waves } from "lucide-react"
import { Button } from "@workspace/ui"
import type { LucideIcon } from "lucide-react"
import {
  summarizeSourceStatus,
  useGlobalMonitoring,
  type EarthquakeFeature,
  type SourceStatus,
} from "@moon/client"
import { MetricCard } from "@workspace/ui"
import { ActivityMap, ActivityChart, EarthquakeDetail, SourceCoverage, SummaryCards } from "./global-monitoring-dashboard/index"

type MonitoringFilter =
  | "all"
  | "seismic"
  | "aviation"
  | "space"

type FilterDefinition = {
  id: MonitoringFilter
  label: string
  icon: LucideIcon
}

const FILTERS: readonly FilterDefinition[] = [
  { id: "all", label: "All layers", icon: Globe2 },
  { id: "seismic", label: "Seismic", icon: Activity },
  { id: "aviation", label: "Aviation", icon: Plane },
  { id: "space", label: "Space weather", icon: Satellite },
]

const formatTime = (time: number) =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(new Date(time))

const formatDate = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  })

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

function sourceCount(
  count: number,
  status: SourceStatus | undefined,
  _isLoading: boolean
): string {
  return hasUsableSourceData(status) ? count.toLocaleString() : "—"
}

export function GlobalMonitoringDashboard() {
  const data = useGlobalMonitoring()
  const [filter, setFilter] = useState<MonitoringFilter>("all")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [now, setNow] = useState<Date | null>(null)
  const selectedEarthquake = data.earthquakes.find(({ id }) => id === selectedId) ?? data.earthquakes[0] ?? null
  const sourceSummary = summarizeSourceStatus(data.sourceMeta)
  const sourceStatus = Object.fromEntries(
    data.sourceMeta.map((source) => [source.source, source.status])
  ) as Record<string, SourceStatus>
  const earthquakeStatus = sourceStatus["usgs-earthquakes"]
  const aviationStatus = sourceStatus["opensky-flights"]
  const issStatus = sourceStatus["iss-tracker"]
  const prayerSources = data.sourceMeta.filter((source) =>
    source.source.startsWith("prayer-")
  )
  const spaceStatus = sourceStatus["nasa-donki"]
  const latestSourceTimestamp = data.sourceMeta
    .filter(
      (source) =>
        source.status !== "UNAVAILABLE" && source.status !== "SIMULATED"
    )
    .reduce(
      (latestTimestamp, source) =>
        Math.max(latestTimestamp, source.timestamp),
      0
    )

  useEffect(() => {
    setNow(new Date())
    const timer = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  const latestEarthquakes = useMemo(() => [...data.earthquakes].sort((a, b) => b.properties.time - a.properties.time).slice(0, 8), [data.earthquakes])
  const severeEarthquakes = data.earthquakes.filter(({ properties }) => properties.mag >= 5).length
  const availableSourceCount =
    sourceSummary.live + sourceSummary.cached + sourceSummary.stale
  const dashboardStatus = data.isLoading
    ? "Checking sources"
    : sourceSummary.unavailable > 0 && availableSourceCount > 0
      ? "Partial source coverage"
      : sourceSummary.unavailable > 0
        ? "Sources unavailable"
        : `${sourceSummary.status.toLowerCase()} source data`
  const dashboardStatusColor =
    data.isLoading
      ? "bg-warning"
      : sourceSummary.unavailable > 0 && availableSourceCount > 0
        ? "bg-warning"
      : sourceSummary.status === "LIVE"
        ? "bg-success"
        : sourceSummary.status === "STALE"
          ? "bg-warning"
          : sourceSummary.status === "SIMULATED"
            ? "bg-secondary"
            : "bg-destructive"
  const prayerAvailableCount = prayerSources.filter((source) =>
    hasUsableSourceData(source.status)
  ).length

  return (
    <div className="min-h-screen bg-background pb-8 text-foreground">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="text-sm font-medium text-primary">MoonWitness Observatory</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Global monitoring</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">A live view of publicly available environmental, mobility, and space-weather observations.</p></div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground"><span aria-hidden="true" className={`size-2 rounded-full ${dashboardStatusColor}`} />{dashboardStatus}<span className="hidden text-border sm:inline">|</span><span>{now ? `${formatTime(now.getTime())} WIB` : "—"}</span>{latestSourceTimestamp > 0 && <time dateTime={new Date(latestSourceTimestamp).toISOString()}>· Updated {formatTime(latestSourceTimestamp)} WIB</time>}</div>
        </header>

        <nav className="flex flex-wrap gap-2" aria-label="Monitoring filters">
          {FILTERS.map(({ id, label, icon: Icon }) => <Button key={id} type="button" variant="ghost" onClick={() => setFilter(id)} aria-pressed={filter === id} className={`min-h-11 inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${filter === id ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Icon className="size-4" aria-hidden="true" />{label}</Button>)}
        </nav>

        <SummaryCards
          data={data}
          earthquakeStatus={earthquakeStatus}
          aviationStatus={aviationStatus}
          prayerSources={prayerSources}
          spaceStatus={spaceStatus}
          isLoading={data.isLoading}
          sourceStatus={sourceStatus}
        />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]">
          <article className="rounded-md border border-border bg-card p-5"><div className="mb-5 flex items-start justify-between gap-4"><div><h2 className="text-lg font-semibold">Observation map</h2><p className="mt-1 text-sm text-muted-foreground">Select an earthquake marker to inspect its source record.</p></div><span className="text-xs text-muted-foreground">{sourceCount(data.earthquakes.length, earthquakeStatus, data.isLoading)} earthquakes · {sourceCount(data.flights.length, aviationStatus, data.isLoading)} flights</span></div><ActivityMap filter={filter} earthquakes={data.earthquakes} flights={data.flights} issPosition={data.issPosition} earthquakeStatus={earthquakeStatus} aviationStatus={aviationStatus} issStatus={issStatus} isLoading={data.isLoading} selectedId={selectedId ?? selectedEarthquake?.id ?? null} onSelectEarthquake={(earthquake: EarthquakeFeature) => setSelectedId(earthquake.id)} /></article>
          <EarthquakeDetail earthquake={selectedEarthquake} status={earthquakeStatus} isLoading={data.isLoading} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
          <article className="rounded-md border border-border bg-card p-5"><div className="mb-5"><h2 className="text-lg font-semibold">Seismic activity</h2><p className="mt-1 text-sm text-muted-foreground">USGS events grouped by observation day.</p></div><ActivityChart earthquakes={data.earthquakes} status={earthquakeStatus} isLoading={data.isLoading} /></article>
          <SourceCoverage sourceSummary={sourceSummary} prayerSources={prayerSources} data={data} sourceStatus={sourceStatus} isLoading={data.isLoading} />
        </section>

        <section className="rounded-md border border-border bg-card"><div className="border-b border-border px-5 py-4"><h2 className="text-lg font-semibold">Recent earthquakes</h2><p className="mt-1 text-sm text-muted-foreground">Latest records from the USGS feed.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm"><thead className="bg-muted/40 text-xs font-medium text-muted-foreground"><tr><th className="px-5 py-3 font-medium">Magnitude</th><th className="px-5 py-3 font-medium">Location</th><th className="px-5 py-3 font-medium">Observed</th><th className="px-5 py-3 font-medium">Depth</th></tr></thead><tbody className="divide-y divide-border">{latestEarthquakes.map((earthquake) => <tr key={earthquake.id} className={`${selectedEarthquake?.id === earthquake.id ? "bg-primary/5" : ""}`}><td className="px-5 py-3 font-semibold"><button type="button" aria-pressed={selectedEarthquake?.id === earthquake.id} onClick={() => setSelectedId(earthquake.id)} className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">{`M${earthquake.properties.mag.toFixed(1)}`}</button></td><td className="max-w-sm truncate px-5 py-3">{earthquake.properties.place}</td><td className="px-5 py-3 text-muted-foreground">{formatDate(earthquake.properties.time)} {formatTime(earthquake.properties.time)} WIB</td><td className="px-5 py-3 text-muted-foreground">{earthquake.geometry.coordinates[2].toFixed(1)} km</td></tr>)}{latestEarthquakes.length === 0 && <tr><td className="px-5 py-8 text-center text-muted-foreground" colSpan={4}>{hasUsableSourceData(earthquakeStatus) ? "No earthquake records were returned." : `USGS source ${sourceStatusText(earthquakeStatus, data.isLoading)}.`}</td></tr>}</tbody></table></div></section>
      </div>
    </div>
  )
}
