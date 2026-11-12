"use client"

import { useEffect, useMemo, useState } from "react"
/* eslint-disable-next-line no-restricted-imports -- Observatory uses Lucide icons for semantic controls. */
import {
  Activity,
  CloudSun,
  Globe2,
  MapPin,
  Plane,
  Satellite,
  Sun,
  Waves,
} from "lucide-react"
import { Button } from "@workspace/ui"
import type { LucideIcon } from "lucide-react"
import {
  summarizeSourceStatus,
  useGlobalMonitoring,
  type EarthquakeFeature,
  type SourceStatus,
} from "@moon/client"
import { MetricCard } from "@workspace/ui"

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

const mapX = (longitude: number) => Math.max(2, Math.min(98, ((longitude + 180) / 360) * 100))
const mapY = (latitude: number) => Math.max(4, Math.min(96, ((90 - latitude) / 180) * 100))

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

function ActivityChart({
  earthquakes,
  status,
  isLoading,
}: {
  earthquakes: EarthquakeFeature[]
  status: SourceStatus | undefined
  isLoading: boolean
}) {
  const buckets = useMemo(() => {
    const now = Date.now()
    return Array.from({ length: 7 }, (_, index) => {
      const end = now - (6 - index) * 24 * 60 * 60 * 1000
      const start = end - 24 * 60 * 60 * 1000
      const count = earthquakes.filter(({ properties }) => properties.time >= start && properties.time < end).length
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

function ActivityMap({
  filter,
  earthquakes,
  flights,
  issPosition,
  earthquakeStatus,
  aviationStatus,
  issStatus,
  isLoading,
  selectedId,
  onSelectEarthquake,
}: {
  filter: MonitoringFilter
  earthquakes: EarthquakeFeature[]
  flights: { icao24: string; longitude: number; latitude: number }[]
  issPosition: { longitude: number; latitude: number } | null
  earthquakeStatus: SourceStatus | undefined
  aviationStatus: SourceStatus | undefined
  issStatus: SourceStatus | undefined
  isLoading: boolean
  selectedId: string | null
  onSelectEarthquake: (earthquake: EarthquakeFeature) => void
}) {
  const show = (kind: MonitoringFilter) => filter === "all" || filter === kind
  return (
    <div
      role="group"
      aria-label="Observation map"
      className="relative min-h-[420px] overflow-hidden rounded-md border border-border bg-muted/30"
    >
      <div className="absolute inset-0 bg-[url('/assets/world-map.svg')] bg-contain bg-center bg-no-repeat opacity-35" aria-hidden="true" />
      <div className="absolute inset-0 bg-background/10" aria-hidden="true" />
      <div className="absolute inset-0">
        {show("seismic") && hasUsableSourceData(earthquakeStatus) && earthquakes.slice(0, 100).map((earthquake) => {
          const [longitude, latitude] = earthquake.geometry.coordinates
          const selected = earthquake.id === selectedId
          return (
            <button
              key={earthquake.id}
              type="button"
              onClick={() => onSelectEarthquake(earthquake)}
              className={`absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-ring ${
                selected ? "scale-150 border-foreground bg-primary z-20" : "border-background bg-destructive/80 z-10"
              }`}
              style={{ left: `${mapX(longitude)}%`, top: `${mapY(latitude)}%` }}
              aria-label={`Earthquake: ${earthquake.properties.place}, magnitude ${earthquake.properties.mag}`}
            />
          )
        })}
        {show("aviation") && hasUsableSourceData(aviationStatus) && flights.slice(0, 80).map((flight) => (
          <span aria-hidden="true" key={flight.icao24} className="absolute size-1.5 rounded-full bg-primary" style={{ left: `${mapX(flight.longitude)}%`, top: `${mapY(flight.latitude)}%` }} title={flight.icao24} />
        ))}
        {show("space") && hasUsableSourceData(issStatus) && issPosition && <span aria-hidden="true" className="absolute size-3 rounded-full border-2 border-background bg-secondary" style={{ left: `${mapX(issPosition.longitude)}%`, top: `${mapY(issPosition.latitude)}%` }} title="ISS position" />}
      </div>
      {filter === "seismic" && !hasUsableSourceData(earthquakeStatus) && (
        <p role="status" className="absolute inset-x-4 bottom-4 rounded-md border border-border bg-background/90 p-3 text-sm text-muted-foreground">
          Seismic observations are {sourceStatusText(earthquakeStatus, isLoading)}.
        </p>
      )}
      {filter === "aviation" && !hasUsableSourceData(aviationStatus) && (
        <p role="status" className="absolute inset-x-4 bottom-4 rounded-md border border-border bg-background/90 p-3 text-sm text-muted-foreground">
          Flight observations are {sourceStatusText(aviationStatus, isLoading)}.
        </p>
      )}
      {filter === "space" && !hasUsableSourceData(issStatus) && (
        <p role="status" className="absolute inset-x-4 bottom-4 rounded-md border border-border bg-background/90 p-3 text-sm text-muted-foreground">
          ISS position data are {sourceStatusText(issStatus, isLoading)}.
        </p>
      )}
    </div>
  )
}

function EarthquakeDetail({
  earthquake,
  status,
  isLoading,
}: {
  earthquake: EarthquakeFeature | null
  status: SourceStatus | undefined
  isLoading: boolean
}) {
  if (!earthquake) {
    return (
      <aside className="rounded-md border border-border bg-card p-5 text-sm text-muted-foreground">
        {hasUsableSourceData(status)
          ? "No earthquake records were returned."
          : `Earthquake source ${sourceStatusText(status, isLoading)}. No observations are available.`}
      </aside>
    )
  }
  const [longitude, latitude, depth] = earthquake.geometry.coordinates
  return (
    <aside className="rounded-md border border-border bg-muted/20 p-5">
      <div className="flex items-start justify-between gap-4">
        <div><p className="text-xs font-medium text-muted-foreground">Selected event</p><h3 className="mt-2 text-base font-semibold text-foreground">M{earthquake.properties.mag.toFixed(1)} · {earthquake.properties.place}</h3></div>
        <Activity className="size-5 text-destructive" aria-hidden="true" />
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
        <div><dt className="text-xs text-muted-foreground">Observed</dt><dd className="mt-1 text-foreground">{formatDate(earthquake.properties.time)} {formatTime(earthquake.properties.time)} WIB</dd></div>
        <div><dt className="text-xs text-muted-foreground">Depth</dt><dd className="mt-1 text-foreground">{depth.toFixed(1)} km</dd></div>
        <div><dt className="text-xs text-muted-foreground">Latitude</dt><dd className="mt-1 text-foreground">{latitude.toFixed(3)}°</dd></div>
        <div><dt className="text-xs text-muted-foreground">Longitude</dt><dd className="mt-1 text-foreground">{longitude.toFixed(3)}°</dd></div>
      </dl>
      <a className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline" href={earthquake.properties.url} target="_blank" rel="noreferrer">Open source event <MapPin className="size-4" aria-hidden="true" /></a>
    </aside>
  )
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

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Monitoring summary">
          <MetricCard label="Earthquakes" value={sourceCount(data.earthquakes.length, earthquakeStatus, data.isLoading)} detail={hasUsableSourceData(earthquakeStatus) ? `${severeEarthquakes} M5.0+ events · ${sourceStatusText(earthquakeStatus, false)}` : `USGS ${sourceStatusText(earthquakeStatus, data.isLoading)}`} icon={Activity} />
          <MetricCard label="Aircraft tracked" value={sourceCount(data.flights.length, aviationStatus, data.isLoading)} detail={`OpenSky ${sourceStatusText(aviationStatus, data.isLoading)}`} icon={Plane} />
          <MetricCard label="Prayer stations" value={prayerSources.length === 0 ? "—" : `${data.globalPrayers.length}/5`} detail={prayerSources.length === 0 && data.isLoading ? "Checking city sources" : `${prayerAvailableCount}/5 city sources available`} icon={Waves} />
          <MetricCard label="Space events" value={sourceCount(data.spaceWeather.length, spaceStatus, data.isLoading)} detail={`NASA DONKI ${sourceStatusText(spaceStatus, data.isLoading)} · ISS ${sourceStatusText(sourceStatus["iss-tracker"], data.isLoading)}`} icon={Satellite} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]">
          <article className="rounded-md border border-border bg-card p-5"><div className="mb-5 flex items-start justify-between gap-4"><div><h2 className="text-lg font-semibold">Observation map</h2><p className="mt-1 text-sm text-muted-foreground">Select an earthquake marker to inspect its source record.</p></div><span className="text-xs text-muted-foreground">{sourceCount(data.earthquakes.length, earthquakeStatus, data.isLoading)} earthquakes · {sourceCount(data.flights.length, aviationStatus, data.isLoading)} flights</span></div><ActivityMap filter={filter} earthquakes={data.earthquakes} flights={data.flights} issPosition={data.issPosition} earthquakeStatus={earthquakeStatus} aviationStatus={aviationStatus} issStatus={issStatus} isLoading={data.isLoading} selectedId={selectedId ?? selectedEarthquake?.id ?? null} onSelectEarthquake={(earthquake) => setSelectedId(earthquake.id)} /></article>
          <EarthquakeDetail earthquake={selectedEarthquake} status={earthquakeStatus} isLoading={data.isLoading} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
          <article className="rounded-md border border-border bg-card p-5"><div className="mb-5"><h2 className="text-lg font-semibold">Seismic activity</h2><p className="mt-1 text-sm text-muted-foreground">USGS events grouped by observation day.</p></div><ActivityChart earthquakes={data.earthquakes} status={earthquakeStatus} isLoading={data.isLoading} /></article>
          <article className="rounded-md border border-border bg-card p-5"><div className="flex items-center gap-3"><CloudSun className="size-5 text-primary" aria-hidden="true" /><div><h2 className="text-lg font-semibold">Source coverage</h2><p className="text-sm text-muted-foreground">{sourceSummary.live} live · {sourceSummary.cached} cached · {sourceSummary.stale} stale · {sourceSummary.unavailable} unavailable · {sourceSummary.simulated} simulated</p></div></div><dl className="mt-5 divide-y divide-border text-sm"><div className="flex justify-between py-3"><dt className="text-muted-foreground">Prayer stations</dt><dd>{prayerSources.length === 0 ? "—" : `${data.globalPrayers.length}/5`}</dd></div><div className="flex justify-between py-3"><dt className="text-muted-foreground">Trend records</dt><dd>{sourceCount(data.trends.length, sourceStatus["google-trends"], data.isLoading)}</dd></div><div className="flex justify-between py-3"><dt className="text-muted-foreground">Space weather</dt><dd>{sourceCount(data.spaceWeather.length, spaceStatus, data.isLoading)}</dd></div></dl></article>
        </section>

        <section className="rounded-md border border-border bg-card"><div className="border-b border-border px-5 py-4"><h2 className="text-lg font-semibold">Recent earthquakes</h2><p className="mt-1 text-sm text-muted-foreground">Latest records from the USGS feed.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm"><thead className="bg-muted/40 text-xs font-medium text-muted-foreground"><tr><th className="px-5 py-3 font-medium">Magnitude</th><th className="px-5 py-3 font-medium">Location</th><th className="px-5 py-3 font-medium">Observed</th><th className="px-5 py-3 font-medium">Depth</th></tr></thead><tbody className="divide-y divide-border">{latestEarthquakes.map((earthquake) => <tr key={earthquake.id} className={`${selectedEarthquake?.id === earthquake.id ? "bg-primary/5" : ""}`}><td className="px-5 py-3 font-semibold"><button type="button" aria-pressed={selectedEarthquake?.id === earthquake.id} onClick={() => setSelectedId(earthquake.id)} className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">{`M${earthquake.properties.mag.toFixed(1)}`}</button></td><td className="max-w-sm truncate px-5 py-3">{earthquake.properties.place}</td><td className="px-5 py-3 text-muted-foreground">{formatDate(earthquake.properties.time)} {formatTime(earthquake.properties.time)} WIB</td><td className="px-5 py-3 text-muted-foreground">{earthquake.geometry.coordinates[2].toFixed(1)} km</td></tr>)}{latestEarthquakes.length === 0 && <tr><td className="px-5 py-8 text-center text-muted-foreground" colSpan={4}>{hasUsableSourceData(earthquakeStatus) ? "No earthquake records were returned." : `USGS source ${sourceStatusText(earthquakeStatus, data.isLoading)}.`}</td></tr>}</tbody></table></div></section>
      </div>
    </div>
  )
}
