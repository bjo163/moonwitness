"use client"

import dynamic from "next/dynamic"
import { Globe, Info, ShieldAlert, Target } from "lucide-react"
import { Button } from "@workspace/ui"

const Map = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)
const Tile = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
})

export type CrisisMarker = {
  id: string
  lat: number
  lng: number
  title: string
  severity: "CRITICAL" | "HIGH" | "MEDIUM"
  type: "HUMANITARIAN" | "CONFLICT" | "EDUCATION"
  description: string
}

function getSeverityBackground(severity: CrisisMarker["severity"]) {
  switch (severity) {
    case "CRITICAL":
      return "bg-destructive text-foreground"
    case "HIGH":
      return "bg-warning text-foreground"
    case "MEDIUM":
      return "bg-accent text-foreground"
  }
}

export function MissionControlRadar({
  mounted,
  targets,
  onSelectTarget,
}: {
  mounted: boolean
  targets: CrisisMarker[]
  onSelectTarget: (target: CrisisMarker) => void
}) {
  return (
    <div className="rounded-xl border border-border/40 bg-card/90 bg-background flex flex-col border-2 border-primary/50 p-1 shadow-sm lg:col-span-3">
      <div className="flex items-center justify-between border-b border-primary/20 bg-card p-3">
        <div className="flex items-center gap-2 text-xs font-bold text-primary">
          <Target className="h-4 w-4 animate-pulse text-destructive" />
          SATELLITE TELEMETRY LINK
        </div>
        <div className="bg-destructive/20 px-2 py-1 font-mono text-[10px] font-bold text-destructive uppercase">
          LIVE MONITORING
        </div>
      </div>

      <div className="relative z-0 h-[600px] w-full">
        {!mounted ? (
          <div className="flex h-full w-full animate-pulse items-center justify-center bg-card font-mono text-sm text-primary">
            INITIALIZING SATELLITE MAP...
          </div>
        ) : (
          <Map
            center={[25, 45]}
            zoom={3}
            scrollWheelZoom={true}
            className="h-full w-full bg-card"
            zoomControl={false}
          >
            <Tile
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution="&copy; CARTO"
            />

            {targets.map((target) => (
              <Marker
                key={target.id}
                position={[target.lat, target.lng]}
                eventHandlers={{
                  click: () => onSelectTarget(target),
                }}
              >
                <Popup className="rounded-none border border-primary/30 bg-card text-foreground">
                  <div className="max-w-[200px] p-1">
                    <div
                      className={`mb-2 inline-block px-1 py-0.5 text-[10px] font-bold ${getSeverityBackground(target.severity)}`}
                    >
                      {target.severity} PRIORITY
                    </div>
                    <h4 className="mb-1 text-xs font-bold">{target.title}</h4>
                    <p className="text-[10px] text-muted-foreground">
                      {target.type}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </Map>
        )}
      </div>
    </div>
  )
}

export function MissionControlIntelligence({
  activeTarget,
  targets,
}: {
  activeTarget: CrisisMarker | null
  targets: CrisisMarker[]
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/40 bg-card/90 bg-panel border-2 border-primary/30 p-6 shadow-lg">
        <h3 className="mb-4 flex items-center gap-2 border-b border-primary/20 pb-2 text-xs font-bold tracking-widest text-primary">
          <Globe className="h-4 w-4" />
          TARGET INTELLIGENCE
        </h3>

        {activeTarget ? (
          <div className="animate-in space-y-4 duration-300 fade-in zoom-in">
            <div
              className={`inline-block px-2 py-1 text-[10px] font-bold ${getSeverityBackground(activeTarget.severity)}`}
            >
              {activeTarget.severity} PRIORITY
            </div>

            <h4 className="text-lg leading-tight font-black text-foreground">
              {activeTarget.title}
            </h4>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="border border-primary/20 bg-card p-2">
                <span className="mb-1 block text-primary/50">LATITUDE</span>
                <span className="font-mono text-accent">
                  {activeTarget.lat}°
                </span>
              </div>
              <div className="border border-primary/20 bg-card p-2">
                <span className="mb-1 block text-primary/50">LONGITUDE</span>
                <span className="font-mono text-accent">
                  {activeTarget.lng}°
                </span>
              </div>
            </div>

            <div className="my-4 border-l-2 border-primary/50 py-1 pl-3">
              <div className="mb-1 text-[10px] font-bold tracking-widest text-primary/50">
                THREAT CLASSIFICATION
              </div>
              <div className="text-warning text-xs font-bold">
                {activeTarget.type}
              </div>
            </div>

            <p className="border border-primary/10 bg-primary/5 p-3 text-xs leading-relaxed text-primary/80">
              {activeTarget.description}
            </p>

            <Button type="button" variant="ghost" className="mt-4 flex w-full items-center justify-center gap-2 border border-primary bg-primary/20 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/40">
              <ShieldAlert className="h-4 w-4" />
              INITIATE RELIEF PROTOCOL
            </Button>
          </div>
        ) : (
          <div className="py-12 text-center opacity-50">
            <Info className="mx-auto mb-3 h-8 w-8 text-primary" />
            <p className="font-mono text-xs text-primary">
              SELECT A TARGET ON THE RADAR TO VIEW INTELLIGENCE DOSSIER
            </p>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border/40 bg-card/90 bg-panel border border-primary/30 p-4">
        <div className="mb-3 text-[10px] font-bold tracking-widest text-primary/50">
          GLOBAL SUMMARY
        </div>
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-foreground">Active Zones</span>
          <span className="font-mono font-bold text-accent">
            {targets.length}
          </span>
        </div>
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-foreground">Critical Threats</span>
          <span className="font-mono font-bold text-destructive">
            {targets.filter((target) => target.severity === "CRITICAL").length}
          </span>
        </div>
      </div>
    </div>
  )
}
