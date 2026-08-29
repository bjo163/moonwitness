"use client"

import { useState, useEffect } from "react"
import { Target, AlertTriangle, Info, Globe, ShieldAlert } from "lucide-react"
import { ContextBlock } from "@workspace/ui"
import { useResource } from "@workspace/hooks"
import { fetchEarthquakes } from "@moon/client"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"

// Dynamically import Leaflet components to avoid SSR window errors
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

type CrisisMarker = {
  id: string
  lat: number
  lng: number
  title: string
  severity: "CRITICAL" | "HIGH" | "MEDIUM"
  type: "HUMANITARIAN" | "CONFLICT" | "EDUCATION"
  description: string
}

const MISSION_TARGETS: CrisisMarker[] = [
  {
    id: "m1",
    lat: 31.5,
    lng: 34.46, // Gaza
    title: "KRISIS KEMANUSIAAN JALUR GAZA",
    severity: "CRITICAL",
    type: "HUMANITARIAN",
    description:
      "Krisis kemanusiaan tingkat tertinggi. Blokade medis dan pangan. Membutuhkan intervensi diplomatik darurat dan jalur suplai independen.",
  },
  {
    id: "m2",
    lat: 15.55,
    lng: 48.51, // Yemen
    title: "KELAPARAN EKSTREM YAMAN",
    severity: "CRITICAL",
    type: "HUMANITARIAN",
    description:
      "Jutaan warga sipil menghadapi ancaman kelaparan dan wabah penyakit akibat konflik berkepanjangan.",
  },
  {
    id: "m3",
    lat: 34.55,
    lng: 69.2, // Afghanistan
    title: "KRISIS PENDIDIKAN & EKONOMI AFGHANISTAN",
    severity: "HIGH",
    type: "EDUCATION",
    description:
      "Pembatasan akses pendidikan dan pembekuan aset internasional menyebabkan kelumpuhan ekonomi massal.",
  },
  {
    id: "m4",
    lat: 14.49,
    lng: 14.45, // Sudan / Sahel
    title: "KONFLIK BERSENJATA SUDAN",
    severity: "HIGH",
    type: "CONFLICT",
    description:
      "Perang saudara memicu jutaan pengungsi internal (IDP). Akses kesehatan hancur total.",
  },
  {
    id: "m5",
    lat: 23.88,
    lng: 90.39, // Bangladesh / Rohingya
    title: "KAMP PENGUNGSI ROHINGYA",
    severity: "MEDIUM",
    type: "HUMANITARIAN",
    description:
      "Kondisi kamp pengungsi yang melebihi kapasitas rentan terhadap bencana alam dan wabah penyakit.",
  },
]

export function MissionControlView() {
  const [mounted, setMounted] = useState(false)
  const [activeTarget, setActiveTarget] = useState<CrisisMarker | null>(null)

  const { data: quakeData } = useResource(fetchEarthquakes, {
    storageKey: "mw_mission_quakes",
  })

  const liveQuakeMarkers: CrisisMarker[] = quakeData?.features
    ? quakeData.features
        .filter((f: any) => (f.properties?.mag || 0) >= 4.5)
        .slice(0, 10)
        .map((f: any, idx: number) => {
          const mag = f.properties?.mag || 0
          const place = f.properties?.place || "Earthquake Epicenter"
          const lng = f.geometry?.coordinates?.[0] || 0
          const lat = f.geometry?.coordinates?.[1] || 0
          return {
            id: f.id || `eq-${idx + 1}`,
            lat,
            lng,
            title: `SEISMIC ANOMALY M${mag.toFixed(1)} — ${String(place).toUpperCase()}`,
            severity: mag >= 6.0 ? ("CRITICAL" as const) : mag >= 5.0 ? ("HIGH" as const) : ("MEDIUM" as const),
            type: "CONFLICT" as const,
            description: `USGS real-time telemetry detected magnitude ${mag.toFixed(1)} event at depth ${Math.round(f.geometry?.coordinates?.[2] || 10)} km.`,
          }
        })
    : []

  const allTargets = [...MISSION_TARGETS, ...liveQuakeMarkers]

  useEffect(() => {
    setMounted(true)
  }, [])

  // To fix Leaflet's default icon missing issues in Next.js dynamically
  useEffect(() => {
    if (mounted) {
      const L = require("leaflet")
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      })
    }
  }, [mounted])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "text-destructive border-destructive"
      case "HIGH":
        return "text-warning border-warning"
      case "MEDIUM":
        return "text-accent border-accent"
      default:
        return "text-primary border-primary"
    }
  }

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-destructive text-foreground"
      case "HIGH":
        return "bg-warning text-foreground"
      case "MEDIUM":
        return "bg-accent text-foreground"
      default:
        return "bg-primary text-foreground"
    }
  }

  return (
    <>
      <ContextBlock
        title="GLOBAL MISSION COMMAND"
        subtitle="Pusat monitoring kemanusiaan global untuk melacak zona krisis dan merumuskan strategi bantuan, diplomasi, dan resolusi perdamaian."
        operation="SATELLITE-MAPPING"
        status="ONLINE"
        accentColor="destructive"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Radar Map (3 columns wide) */}
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
                center={[25, 45]} // Centered on Middle East roughly
                zoom={3}
                scrollWheelZoom={true}
                className="h-full w-full bg-card"
                zoomControl={false}
              >
                <Tile
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution="&copy; CARTO"
                />

                {allTargets.map((target) => (
                  <Marker
                    key={target.id}
                    position={[target.lat, target.lng]}
                    eventHandlers={{
                      click: () => setActiveTarget(target),
                    }}
                  >
                    <Popup className="rounded-none border border-primary/30 bg-card text-foreground">
                      <div className="max-w-[200px] p-1">
                        <div
                          className={`mb-2 inline-block px-1 py-0.5 text-[10px] font-bold ${getSeverityBg(target.severity)}`}
                        >
                          {target.severity} PRIORITY
                        </div>
                        <h4 className="mb-1 text-xs font-bold">
                          {target.title}
                        </h4>
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

        {/* Intelligence Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border/40 bg-card/90 bg-panel border-2 border-primary/30 p-6 shadow-lg">
            <h3 className="mb-4 flex items-center gap-2 border-b border-primary/20 pb-2 text-xs font-bold tracking-widest text-primary">
              <Globe className="h-4 w-4" />
              TARGET INTELLIGENCE
            </h3>

            {activeTarget ? (
              <div className="animate-in space-y-4 duration-300 fade-in zoom-in">
                <div
                  className={`inline-block px-2 py-1 text-[10px] font-bold ${getSeverityBg(activeTarget.severity)}`}
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
                    <span className="mb-1 block text-primary/50">
                      LONGITUDE
                    </span>
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

                <button className="mt-4 flex w-full items-center justify-center gap-2 border border-primary bg-primary/20 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/40">
                  <ShieldAlert className="h-4 w-4" />
                  INITIATE RELIEF PROTOCOL
                </button>
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

          {/* Mission Stats */}
          <div className="rounded-xl border border-border/40 bg-card/90 bg-panel border border-primary/30 p-4">
            <div className="mb-3 text-[10px] font-bold tracking-widest text-primary/50">
              GLOBAL SUMMARY
            </div>
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-foreground">Active Zones</span>
              <span className="font-mono font-bold text-accent">
                {allTargets.length}
              </span>
            </div>
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-foreground">Critical Threats</span>
              <span className="font-mono font-bold text-destructive">
                {
                  allTargets.filter((t) => t.severity === "CRITICAL")
                    .length
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
