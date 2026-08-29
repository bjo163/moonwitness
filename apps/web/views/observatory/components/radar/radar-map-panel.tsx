"use client"

import React from "react"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)

interface RadarMapPanelProps {
  rainTimestamp: number
}

export function RadarMapPanel({ rainTimestamp }: RadarMapPanelProps) {
  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-xl border border-white/10 bg-muted shadow-2xl">
      <MapContainer
        center={[-2.5, 118.0]}
        zoom={5}
        className="h-[420px] w-full bg-muted"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        {rainTimestamp > 0 && (
          <TileLayer
            url={`https://tilecache.rainviewer.com/v2/radar/${rainTimestamp}/256/{z}/{x}/{y}/2/1_1.png`}
            opacity={0.7}
          />
        )}
      </MapContainer>

      {/* Radar Overlay Controls Badge */}
      <div className="absolute top-3 left-3 z-[1000] rounded border border-cyan-500/30 bg-card px-3 py-1.5 font-mono text-[9px] text-cyan-300 backdrop-blur-md">
        RAINVIEWER DOPPLER COMPOSITE {rainTimestamp > 0 ? `• TS: ${rainTimestamp}` : "• LIVE"}
      </div>
    </div>
  )
}
