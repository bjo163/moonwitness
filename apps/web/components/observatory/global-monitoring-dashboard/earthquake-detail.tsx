"use client"

import { MapPin } from "lucide-react"
import type { SourceStatus, EarthquakeFeature } from "@moon/client"
import { cn } from "@workspace/ui"

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

interface EarthquakeDetailProps {
  earthquake: EarthquakeFeature | null
  status: SourceStatus | undefined
  isLoading: boolean
}

export function EarthquakeDetail({ earthquake, status, isLoading }: EarthquakeDetailProps) {
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
