"use client"

import { useState, useEffect } from "react"
import { ContextBlock } from "@workspace/ui"
import { useResource } from "@workspace/hooks"
import { fetchEarthquakes } from "@moon/client"
import "leaflet/dist/leaflet.css"
import {
  MissionControlIntelligence,
  MissionControlRadar,
  type CrisisMarker,
} from "./mission-control-panels"

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
        <MissionControlRadar
          mounted={mounted}
          targets={allTargets}
          onSelectTarget={setActiveTarget}
        />
        <MissionControlIntelligence
          activeTarget={activeTarget}
          targets={allTargets}
        />
      </div>
    </>
  )
}
