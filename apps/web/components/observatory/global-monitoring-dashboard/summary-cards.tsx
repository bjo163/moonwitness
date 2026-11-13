"use client"

import { Activity, Plane, Waves, Satellite } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { SourceStatus } from "@moon/client"
import { MetricCard } from "@workspace/ui"

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

interface EarthquakeFeature {
  properties: {
    mag: number
  }
}

interface SummaryCardsProps {
  data: {
    earthquakes: EarthquakeFeature[]
    flights: unknown[]
    globalPrayers: unknown[]
    spaceWeather: unknown[]
  }
  earthquakeStatus: SourceStatus | undefined
  aviationStatus: SourceStatus | undefined
  prayerSources: { source: string; status: SourceStatus }[]
  spaceStatus: SourceStatus | undefined
  isLoading: boolean
  sourceStatus: Record<string, SourceStatus>
}

export function SummaryCards({
  data,
  earthquakeStatus,
  aviationStatus,
  prayerSources,
  spaceStatus,
  isLoading,
  sourceStatus,
}: SummaryCardsProps) {
  const severeEarthquakes = data.earthquakes.filter((e) => e.properties.mag >= 5).length
  const prayerAvailableCount = prayerSources.filter((source) =>
    hasUsableSourceData(source.status)
  ).length

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Monitoring summary">
      <MetricCard
        label="Earthquakes"
        value={sourceCount(data.earthquakes.length, earthquakeStatus, isLoading)}
        detail={hasUsableSourceData(earthquakeStatus) ? `${severeEarthquakes} M5.0+ events · ${sourceStatusText(earthquakeStatus, false)}` : `USGS ${sourceStatusText(earthquakeStatus, isLoading)}`}
        icon={Activity}
      />
      <MetricCard
        label="Aircraft tracked"
        value={sourceCount(data.flights.length, aviationStatus, isLoading)}
        detail={`OpenSky ${sourceStatusText(aviationStatus, isLoading)}`}
        icon={Plane}
      />
      <MetricCard
        label="Prayer stations"
        value={prayerSources.length === 0 ? "—" : `${data.globalPrayers.length}/5`}
        detail={prayerSources.length === 0 && isLoading ? "Checking city sources" : `${prayerAvailableCount}/5 city sources available`}
        icon={Waves}
      />
      <MetricCard
        label="Space events"
        value={sourceCount(data.spaceWeather.length, spaceStatus, isLoading)}
        detail={`NASA DONKI ${sourceStatusText(spaceStatus, isLoading)} · ISS ${sourceStatusText(sourceStatus["iss-tracker"], isLoading)}`}
        icon={Satellite}
      />
    </section>
  )
}
