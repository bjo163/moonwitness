"use client"
import { useMounted } from "@workspace/hooks"

import React, { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// @ts-ignore
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png"
// @ts-ignore
import iconUrl from "leaflet/dist/images/marker-icon.png"
// @ts-ignore
import shadowUrl from "leaflet/dist/images/marker-shadow.png"
import {
  EarthquakeFeature,
  ISSPosition,
  FlightInfo,
  CyberAttack,
  MaritimeShip,
} from "@moon/client"

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    typeof iconRetinaUrl === "string"
      ? iconRetinaUrl
      : (iconRetinaUrl as any)?.src,
  iconUrl: typeof iconUrl === "string" ? iconUrl : (iconUrl as any)?.src,
  shadowUrl:
    typeof shadowUrl === "string" ? shadowUrl : (shadowUrl as any)?.src,
})

// Custom red icon for earthquakes
const earthquakeIcon = new L.DivIcon({
  className: "bg-transparent",
  html: `<div class="h-3 w-3 animate-ping rounded-full bg-red-500 opacity-75 shadow-[0_0_15px_#FF0055]"></div><div class="h-3 w-3 rounded-full bg-red-600 absolute top-0 left-0"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
})

// Custom icon for ISS
const issIcon = new L.DivIcon({
  className: "bg-transparent",
  html: `<div class="relative flex items-center justify-center h-8 w-8">
           <div class="absolute h-full w-full animate-spin-slow rounded-full border border-dashed border-primary/50"></div>
           <div class="h-4 w-4 bg-primary rounded shadow-[0_0_20px_#00F0FF] animate-pulse"></div>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

// Custom icon for Flights
const flightIcon = (track: number) =>
  new L.DivIcon({
    className: "bg-transparent",
    html: `<div style="transform: rotate(${track}deg)" class="text-warning text-[14px]">✈</div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })

// Custom icon for Cyber Attacks
const cyberIcon = new L.DivIcon({
  className: "bg-transparent",
  html: `<div class="h-4 w-4 bg-purple-500 rounded-sm rotate-45 animate-pulse shadow-[0_0_10px_#A855F7]"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

// Custom icon for Maritime Ships
const shipIcon = (heading: number) =>
  new L.DivIcon({
    className: "bg-transparent",
    html: `<div style="transform: rotate(${heading}deg)" class="text-blue-400 text-[14px]">⛴</div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })

export function LeafletMap({
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
  const mounted = useMounted()
  const [mapKey] = useState(() => Date.now().toString())

  if (!mounted) return null

  return (
    <div className="h-full w-full overflow-hidden rounded-md border border-white/10">
      <MapContainer
        key={mapKey}
        center={[20, 0]}
        className="h-full w-full bg-[#0a0f18]"
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Render ISS */}
        {issPosition?.latitude !== undefined &&
          issPosition?.longitude !== undefined && (
            <Marker
              position={[issPosition.latitude, issPosition.longitude]}
              icon={issIcon}
              zIndexOffset={1000}
            >
              <Popup className="bg-background border border-white/10 text-white">
                <div className="text-xs">
                  <div className="font-bold tracking-widest text-primary">
                    INTERNATIONAL SPACE STATION
                  </div>
                  <div className="mt-1 text-[10px] text-white/70">
                    Alt: {issPosition.altitude?.toFixed(2) ?? "N/A"} km <br />
                    Vel: {issPosition.velocity?.toFixed(2) ?? "N/A"} km/h
                  </div>
                </div>
              </Popup>
            </Marker>
          )}

        {/* Render Flights */}
        {flights.map((flight) => (
          <Marker
            key={flight.icao24}
            position={[flight.latitude, flight.longitude]}
            icon={flightIcon(flight.true_track || 0)}
          >
            <Popup className="bg-background border-warning font-mono text-foreground">
              <div className="p-2">
                <div className="text-warning border-warning/30 mb-1 border-b pb-1 font-bold">
                  CALLSIGN: {flight.callsign}
                </div>
                <div className="text-xs">
                  ORIGIN: {flight.origin_country}
                  <br />
                  ALTITUDE: {Math.round(flight.altitude || 0)}m<br />
                  VELOCITY: {Math.round(flight.velocity || 0)}m/s
                  <br />
                  TRACK: {Math.round(flight.true_track || 0)}°
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Cyber Attacks */}
        {cyberAttacks.map((attack) => (
          <React.Fragment key={attack.id}>
            {/* Draw attack trajectory line */}
            <Polyline
              positions={[attack.source, attack.target]}
              color="#EF4444"
              weight={1}
              opacity={0.5}
              dashArray="4"
              className="animate-pulse"
            />
            {/* Target marker */}
            <Marker position={attack.target} icon={cyberIcon}>
              <Popup className="bg-background border-red-500 font-mono text-foreground">
                <div className="p-2">
                  <div className="mb-1 border-b border-red-500/30 pb-1 font-bold text-red-500">
                    THREAT: {attack.type}
                  </div>
                  <div className="text-xs">
                    STATUS: BLOCKED
                    <br />
                    LAT: {attack.target[0].toFixed(2)}
                    <br />
                    LNG: {attack.target[1].toFixed(2)}
                  </div>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}

        {/* Render Maritime Ships */}
        {ships.map((ship) => (
          <Marker
            key={ship.id}
            position={[ship.lat, ship.lng]}
            icon={shipIcon(ship.heading)}
          >
            <Popup className="bg-background border-blue-500 font-mono text-foreground">
              <div className="p-2">
                <div className="mb-1 border-b border-blue-500/30 pb-1 font-bold text-blue-400">
                  VESSEL: {ship.name}
                </div>
                <div className="text-xs">
                  TYPE: {ship.type}
                  <br />
                  DEST: {ship.destination}
                  <br />
                  SPEED: {Math.round(ship.speed)} kts
                  <br />
                  HDG: {Math.round(ship.heading)}°
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Earthquakes */}
        {earthquakes.slice(0, 100).map((eq) => {
          const [lng, lat] = eq.geometry.coordinates
          return (
            <Marker key={eq.id} position={[lat, lng]} icon={earthquakeIcon}>
              <Popup className="bg-background border border-white/10 text-white">
                <div className="text-xs">
                  <div className="font-bold text-red-400">
                    M {eq.properties.mag.toFixed(1)}
                  </div>
                  <div>{eq.properties.place}</div>
                  <div className="text-[9px] text-white/50">
                    {new Date(eq.properties.time).toLocaleString()}
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
