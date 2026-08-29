"use client"

import React from "react"
import { Hexagon, Activity } from "lucide-react"
import dynamic from "next/dynamic"
import {
  EarthquakeFeature,
  ISSPosition,
  FlightInfo,
  CyberAttack,
  MaritimeShip,
} from "@moon/client"

const LeafletMap = dynamic(
  () => import("./leaflet-map").then((mod) => mod.LeafletMap),
  {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] w-full items-center justify-center bg-black/50">
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
        <div className="flex h-full w-full items-center justify-center border border-red-500/30 bg-black/50">
          <div className="animate-pulse text-xs font-bold tracking-widest text-red-500">
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
}: {
  earthquakes?: EarthquakeFeature[]
  issPosition?: ISSPosition | null
  flights?: FlightInfo[]
  cyberAttacks?: CyberAttack[]
  ships?: MaritimeShip[]
}) {
  return (
    <div className="bg-background relative flex flex-col overflow-hidden rounded-xl border-2 border-primary/20 p-4 lg:col-span-6 xl:col-span-5">
      <div className="relative z-20 flex items-center justify-between">
        <div>
          <div className="mb-0.5 flex items-center gap-2 text-[10px] font-black tracking-widest text-white uppercase">
            LIVE WORLD MAP
            <span className="animate-pulse rounded-[2px] border border-red-500/30 bg-red-500/20 px-1.5 py-0.5 text-[8px] text-red-400">
              LIVE
            </span>
          </div>
          <div className="text-[8px] text-primary">
            Real-time planetary seismic monitoring (USGS Network)
          </div>
        </div>
        <div className="text-right">
          <div className="text-[12px] font-bold text-red-400">
            {earthquakes.length}
          </div>
          <div className="text-[7px] text-primary uppercase">Active Events</div>
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
      <div className="relative z-20 mt-4 flex items-center justify-between border-t border-white/10 pt-3">
        {[
          { l: "Seismic Sensors", v: "4,210", c: "#FF0055" },
          { l: "Observation Nodes", v: "318", c: "#00F0FF" },
          { l: "Research Centers", v: "124", c: "#A100FF" },
          { l: "Active Missions", v: "24", c: "#FF9900" },
        ].map((lg, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className="flex h-5 w-5 items-center justify-center rounded border border-white/10 bg-primary/10"
              style={{ borderColor: `${lg.c}40` }}
            >
              <Hexagon className="h-3 w-3" style={{ color: lg.c }} />
            </div>
            <div>
              <div className="text-[7px] text-primary uppercase">{lg.l}</div>
              <div className="text-[10px] font-black text-white">{lg.v}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
