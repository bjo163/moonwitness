"use client"

import { MapPin } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@workspace/ui"
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

const mapX = (longitude: number) => Math.max(2, Math.min(98, ((longitude + 180) / 360) * 100))
const mapY = (latitude: number) => Math.max(4, Math.min(96, ((90 - latitude) / 180) * 100))

type MonitoringFilter = "all" | "seismic" | "aviation" | "space"

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

interface ActivityMapProps {
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
}

export function ActivityMap({
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
}: ActivityMapProps) {
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
              className={cn(
                "absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-ring",
                selected
                  ? "scale-150 border-foreground bg-primary z-20"
                  : "border-background bg-destructive/80 z-10"
              )}
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
