"use client"

import React from "react"
import { Layers3, Signal } from "lucide-react"
import dynamic from "next/dynamic"
import {
  EarthquakeFeature,
  ISSPosition,
  FlightInfo,
  CyberAttack,
  MaritimeShip,
  resolveSourceStatus,
  type SourceMeta,
  type SourceStatus,
} from "@moon/client"

const LeafletMap = dynamic(
  () => import("./leaflet-map").then((mod) => mod.LeafletMap),
  {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] w-full items-center justify-center bg-card">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <div className="animate-pulse text-xs font-bold tracking-widest text-primary">
          INITIALIZING SATELLITE LINK...
        </div>
      </div>
    </div>
  ),
})

class MapErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true }
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.warn("Map System Error Caught (Auto-Recovering):", error)
    // Auto recover after 3 seconds
    setTimeout(() => this.setState({ hasError: false }), 3000)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full items-center justify-center border border-destructive/30 bg-card">
          <div className="animate-pulse text-xs font-bold tracking-widest text-destructive">
            SATELLITE LINK REESTABLISHING...
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export function LiveWorldMapWidget({
  earthquakes = [],
  issPosition,
  flights = [],
  cyberAttacks = [],
  ships = [],
  sourceMeta = [],
}: {
  earthquakes?: EarthquakeFeature[]
  issPosition?: ISSPosition | null
  flights?: FlightInfo[]
  cyberAttacks?: CyberAttack[]
  ships?: MaritimeShip[]
  sourceMeta?: SourceMeta[]
}) {
  const sourceStatus = (source: string): SourceStatus => {
    const metadata = sourceMeta.find((entry) => entry.source === source)
    return metadata
      ? resolveSourceStatus(metadata.status, metadata.timestamp)
      : "UNAVAILABLE"
  }
  const earthquakeStatus = sourceStatus("usgs-earthquakes")
  const earthquakeCount =
    earthquakeStatus === "UNAVAILABLE" && earthquakes.length === 0
      ? "—"
      : earthquakes.length
  const mapLayers = [
    ["Earthquakes", "usgs-earthquakes"],
    ["ISS position", "iss-tracker"],
    ["Aircraft", "opensky-flights"],
    ["Security events", "cyber-attacks"],
    ["Vessels", "maritime-ships"],
  ] as const

  return (
    <div className="bg-background relative flex flex-col overflow-hidden rounded-xl border-2 border-primary/20 p-4 lg:col-span-6 xl:col-span-5">
      <div className="relative z-20 flex items-center justify-between">
        <div>
          <div className="mb-0.5 flex items-center gap-2 text-[10px] font-black tracking-widest text-foreground uppercase">
            Global monitoring map
            <span className="rounded-md border border-border bg-muted px-2 py-1 text-[8px] text-muted-foreground">
              USGS {earthquakeStatus}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Map layers reflect their individual source status.
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-foreground">
            {earthquakeCount}
          </div>
          <div className="text-[10px] text-muted-foreground">
            Earthquake records
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-4 min-h-[300px] flex-1">
        <MapErrorBoundary>
          <LeafletMap
            earthquakes={earthquakes}
            issPosition={issPosition}
            flights={flights}
            cyberAttacks={cyberAttacks}
            ships={ships}
          />
        </MapErrorBoundary>
      </div>

      <div className="relative z-20 mt-4 border-t border-border pt-3">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium">
          <Layers3 className="size-4 text-muted-foreground" aria-hidden="true" />
          Data layers
        </div>
        <ul className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
          {mapLayers.map(([label, source]) => (
            <li
              key={source}
              className="flex items-center justify-between gap-2 rounded border border-border px-2 py-1.5"
            >
              <span className="truncate text-muted-foreground">{label}</span>
              <span className="inline-flex shrink-0 items-center gap-1">
                <Signal className="size-3" aria-hidden="true" />
                {sourceStatus(source)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
