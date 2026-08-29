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
import type { LucideIcon } from "lucide-react"
import { useGlobalMonitoring, type EarthquakeFeature } from "@moon/client"

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

const FILTERS: FilterDefinition[] = [
  { id: "all", label: "All activity", icon: Globe2 },
  { id: "seismic", label: "Seismic", icon: Activity },
  { id: "aviation", label: "Aviation", icon: Plane },
  { id: "space", label: "Space weather", icon: Sun },
]

const formatTime = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  })

const formatDate = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

const mapX = (longitude: number) => Math.max(2, Math.min(98, ((longitude + 180) / 360) * 100))
const mapY = (latitude: number) => Math.max(4, Math.min(96, ((90 - latitude) / 180) * 100))

function MetricCard({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: LucideIcon }) {
  return (
    <article className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3 text-muted-foreground">
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
        <Icon className="size-4" aria-hidden="true" />
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </article>
  )
}

function ActivityChart({ earthquakes }: { earthquakes: EarthquakeFeature[] }) {
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

  return (
    <div className="flex h-44 items-end gap-3 border-b border-l border-border px-3 pb-0 pt-5">
      {buckets.map((bucket) => (
        <div key={bucket.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
          <span className="text-xs tabular-nums text-muted-foreground">{bucket.count}</span>
          <div className="flex h-full w-full items-end">
            <div
              className="w-full rounded-t-md bg-primary/75 transition-[height]"
              style={{ height: `${Math.max(6, (bucket.count / max) * 100)}%` }}
              aria-label={`${bucket.count} earthquakes on ${bucket.label}`}
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
  selectedId,
  onSelectEarthquake,
}: {
  filter: MonitoringFilter
  earthquakes: EarthquakeFeature[]
  flights: { icao24: string; longitude: number; latitude: number }[]
  issPosition: { longitude: number; latitude: number } | null
  selectedId: string | null
  onSelectEarthquake: (earthquake: EarthquakeFeature) => void
}) {
  const show = (kind: MonitoringFilter) => filter === "all" || filter === kind
  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-border bg-muted/30">
      <div className="absolute inset-0 bg-[url('/assets/world-map.svg')] bg-contain bg-center bg-no-repeat opacity-35" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/40" aria-hidden="true" />
      <div className="absolute inset-0">
        {show("seismic") && earthquakes.slice(0, 100).map((earthquake) => {
          const [longitude, latitude] = earthquake.geometry.coordinates
          const selected = earthquake.id === selectedId
          return (
            <button
              key={earthquake.id}
              type="button"
              className={`absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background ${selected ? "z-10 bg-destructive ring-4 ring-destructive/25" : "bg-destructive/70"}`}
              style={{ left: `${mapX(longitude)}%`, top: `${mapY(latitude)}%`, transform: `translate(-50%, -50%) scale(${Math.max(0.8, Math.min(2.4, earthquake.properties.mag / 2))})` }}
              title={`${earthquake.properties.place} · M${earthquake.properties.mag}`}
              onClick={() => onSelectEarthquake(earthquake)}
            />
          )
        })}
        {show("aviation") && flights.slice(0, 80).map((flight) => (
          <span key={flight.icao24} className="absolute size-1.5 rounded-full bg-primary" style={{ left: `${mapX(flight.longitude)}%`, top: `${mapY(flight.latitude)}%` }} title={flight.icao24} />
        ))}
        {show("space") && issPosition && <span className="absolute size-3 rounded-full border-2 border-background bg-secondary" style={{ left: `${mapX(issPosition.longitude)}%`, top: `${mapY(issPosition.latitude)}%` }} title="ISS position" />}
      </div>
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-3 rounded-md border border-border bg-background/90 px-3 py-2 text-[11px] text-muted-foreground">
        <span><i className="mr-1 inline-block size-2 rounded-full bg-destructive" />Earthquakes</span>
        <span><i className="mr-1 inline-block size-2 rounded-full bg-primary" />Aircraft</span>
        <span><i className="mr-1 inline-block size-2 rounded-full bg-secondary" />ISS</span>
      </div>
    </div>
  )
}

function EarthquakeDetail({ earthquake }: { earthquake: EarthquakeFeature | null }) {
  if (!earthquake) {
    return <div className="flex min-h-44 items-center justify-center rounded-lg border border-dashed border-border p-5 text-center text-sm text-muted-foreground">Select an earthquake marker or table row to inspect event details.</div>
  }
  const [longitude, latitude, depth] = earthquake.geometry.coordinates
  return (
    <aside className="rounded-lg border border-border bg-muted/20 p-5">
      <div className="flex items-start justify-between gap-4">
        <div><p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Selected event</p><h3 className="mt-2 text-base font-semibold text-foreground">M{earthquake.properties.mag.toFixed(1)} · {earthquake.properties.place}</h3></div>
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

  useEffect(() => {
    setNow(new Date())
    const timer = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  const latestEarthquakes = useMemo(() => [...data.earthquakes].sort((a, b) => b.properties.time - a.properties.time).slice(0, 8), [data.earthquakes])
  const severeEarthquakes = data.earthquakes.filter(({ properties }) => properties.mag >= 5).length
  const status = data.isLoading ? "Syncing sources" : "Sources current"

  return (
    <div className="min-h-screen bg-background pb-12 text-foreground">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="text-sm font-medium text-primary">MoonWitness Observatory</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Global monitoring</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">A live view of publicly available environmental, mobility, and space-weather observations.</p></div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground"><span className={`size-2 rounded-full ${data.isLoading ? "bg-warning" : "bg-success"}`} />{status}<span className="hidden text-border sm:inline">|</span><span>{now ? `${formatTime(now.getTime())} WIB` : "—"}</span></div>
        </header>

        <nav className="flex flex-wrap gap-2" aria-label="Monitoring filters">
          {FILTERS.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setFilter(id)} aria-pressed={filter === id} className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${filter === id ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Icon className="size-4" aria-hidden="true" />{label}</button>)}
        </nav>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Monitoring summary">
          <MetricCard label="Earthquakes" value={data.earthquakes.length.toLocaleString()} detail={`${severeEarthquakes} events at M5.0+`} icon={Activity} />
          <MetricCard label="Aircraft tracked" value={data.flights.length.toLocaleString()} detail="OpenSky positions received" icon={Plane} />
          <MetricCard label="Prayer stations" value={data.globalPrayers.length.toLocaleString()} detail="Cities with current timings" icon={Waves} />
          <MetricCard label="Space events" value={data.spaceWeather.length.toLocaleString()} detail={data.issPosition ? "ISS position available" : "ISS position unavailable"} icon={Satellite} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]">
          <article className="rounded-xl border border-border bg-card p-5 shadow-sm"><div className="mb-5 flex items-start justify-between gap-4"><div><h2 className="text-lg font-semibold">Observation map</h2><p className="mt-1 text-sm text-muted-foreground">Select a marker to inspect the source record.</p></div><span className="text-xs text-muted-foreground">{data.earthquakes.length + data.flights.length + (data.issPosition ? 1 : 0)} observations</span></div><ActivityMap filter={filter} earthquakes={data.earthquakes} flights={data.flights} issPosition={data.issPosition} selectedId={selectedId ?? selectedEarthquake?.id ?? null} onSelectEarthquake={(earthquake) => setSelectedId(earthquake.id)} /></article>
          <EarthquakeDetail earthquake={selectedEarthquake} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
          <article className="rounded-xl border border-border bg-card p-5 shadow-sm"><div className="mb-5"><h2 className="text-lg font-semibold">Seismic activity</h2><p className="mt-1 text-sm text-muted-foreground">USGS events grouped by observation day.</p></div><ActivityChart earthquakes={data.earthquakes} /></article>
          <article className="rounded-xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center gap-3"><CloudSun className="size-5 text-primary" aria-hidden="true" /><div><h2 className="text-lg font-semibold">Source coverage</h2><p className="text-sm text-muted-foreground">Current response counts</p></div></div><dl className="mt-5 divide-y divide-border text-sm"><div className="flex justify-between py-3"><dt className="text-muted-foreground">Prayer stations</dt><dd>{data.globalPrayers.length}</dd></div><div className="flex justify-between py-3"><dt className="text-muted-foreground">Trend records</dt><dd>{data.trends.length}</dd></div><div className="flex justify-between py-3"><dt className="text-muted-foreground">Space weather</dt><dd>{data.spaceWeather.length}</dd></div></dl></article>
        </section>

        <section className="rounded-xl border border-border bg-card shadow-sm"><div className="border-b border-border px-5 py-4"><h2 className="text-lg font-semibold">Recent earthquakes</h2><p className="mt-1 text-sm text-muted-foreground">Latest records from the USGS feed.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm"><thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="px-5 py-3 font-medium">Magnitude</th><th className="px-5 py-3 font-medium">Location</th><th className="px-5 py-3 font-medium">Observed</th><th className="px-5 py-3 font-medium">Depth</th></tr></thead><tbody className="divide-y divide-border">{latestEarthquakes.map((earthquake) => <tr key={earthquake.id} className={`cursor-pointer transition-colors hover:bg-muted/50 ${selectedEarthquake?.id === earthquake.id ? "bg-primary/5" : ""}`} onClick={() => setSelectedId(earthquake.id)}><td className="px-5 py-3 font-semibold">M{earthquake.properties.mag.toFixed(1)}</td><td className="max-w-sm truncate px-5 py-3">{earthquake.properties.place}</td><td className="px-5 py-3 text-muted-foreground">{formatDate(earthquake.properties.time)} {formatTime(earthquake.properties.time)} WIB</td><td className="px-5 py-3 text-muted-foreground">{earthquake.geometry.coordinates[2].toFixed(1)} km</td></tr>)}{latestEarthquakes.length === 0 && <tr><td className="px-5 py-8 text-center text-muted-foreground" colSpan={4}>No earthquake records are available.</td></tr>}</tbody></table></div></section>
      </div>
    </div>
  )
}
