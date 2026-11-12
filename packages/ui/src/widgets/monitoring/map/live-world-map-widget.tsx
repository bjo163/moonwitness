"use client"

import React from "react"
import { Hexagon } from "lucide-react"
import dynamic from "next/dynamic"
import type {
  EarthquakeFeature,
  ISSPosition,
  FlightInfo,
  CyberAttack,
  MaritimeShip,
  SourceStatus,
  SourceMeta,
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

export type LiveWorldMapWidgetProps = {
  earthquakes?: EarthquakeFeature[]
  issPosition?: ISSPosition | null
  flights?: FlightInfo[]
  cyberAttacks?: CyberAttack[]
  ships?: MaritimeShip[]
  status?: SourceStatus
  sourceSummary?: SourceMeta
}

function statusLabel(status: SourceStatus): string {
  if (status === "LIVE") return "LIVE"
  if (status === "CACHED") return "CACHED"
  if (status === "STALE") return "STALE"
  if (status === "SIMULATED") return "SIMULATED"
  return "UNAVAILABLE"
}

function statusClasses(status: SourceStatus): string {
  if (status === "LIVE") return "animate-pulse border-success/30 bg-success/20 text-success"
  if (status === "STALE") return "border-warning/30 bg-warning/20 text-warning"
  if (status === "CACHED") return "border-info/30 bg-info/20 text-info"
  if (status === "SIMULATED") return "border-secondary/30 bg-secondary/20 text-secondary"
  return "border-border bg-muted/30 text-muted-foreground"
}

function formatCount(
  count: number,
  status: SourceStatus | undefined,
): string | number {
  const effective = status ?? "UNAVAILABLE"
  if (effective === "UNAVAILABLE") return "—"
  return count
}

function mapX(longitude: number): number {
  return ((longitude + 180) / 360) * 100
}

function mapY(latitude: number): number {
  return ((90 - latitude) / 180) * 100
}

export function LiveWorldMapWidget({
  earthquakes = [],
  issPosition,
  flights = [],
  cyberAttacks = [],
  ships = [],
  status = "UNAVAILABLE",
  sourceSummary,
}: LiveWorldMapWidgetProps) {
  const resolvedStatus = status
  const showEventCount = resolvedStatus !== "UNAVAILABLE"
  const legends = [
    {
      label: "Seismic Events",
      value: formatCount(earthquakes.length, resolvedStatus),
      color: "hsl(var(--destructive))",
    },
    {
      label: "Tracked Flights",
      value: formatCount(flights.length, resolvedStatus),
      color: "hsl(var(--secondary))",
    },
    {
      label: "Cyber Events",
      value: formatCount(cyberAttacks.length, resolvedStatus),
      color: "hsl(var(--warning))",
    },
    {
      label: "Maritime Vessels",
      value: formatCount(ships.length, resolvedStatus),
      color: "hsl(var(--info))",
    },
  ]
  return (
    <div className="bg-background relative flex flex-col overflow-hidden rounded-xl border-2 border-primary/20 p-4 lg:col-span-6 xl:col-span-5">
      <div className="relative z-20 flex items-center justify-between">
        <div>
          <div className="mb-0.5 flex items-center gap-2 text-[10px] font-black tracking-widest text-foreground uppercase">
            LIVE WORLD MAP
            <span className={`rounded-[2px] border px-1.5 py-0.5 text-[8px] ${statusClasses(resolvedStatus)}`}>
              {statusLabel(resolvedStatus)}
            </span>
          </div>
          <div className="text-[8px] text-muted-foreground">
            {sourceSummary?.source
              ? `Source: ${sourceSummary.source}`
              : "Aggregated monitoring sources"}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[12px] font-bold text-destructive">
            {showEventCount ? earthquakes.length : "—"}
          </div>
          <div className="text-[7px] text-muted-foreground uppercase">Active Events</div>
        </div>
      </div>

      {/* Map Interactive Simulation */}
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

      {/* Map Legends */}
      <div className="relative z-20 mt-4 flex items-center justify-between border-t border-border pt-3">
        {legends.map((lg, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className="flex h-5 w-5 items-center justify-center rounded border border-border bg-primary/10"
              style={{ borderColor: lg.color }}
            >
              <Hexagon className="h-3 w-3" style={{ color: lg.color }} />
            </div>
            <div>
              <div className="text-[7px] text-muted-foreground uppercase">{lg.label}</div>
              <div className="text-[10px] font-black text-foreground">{lg.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
