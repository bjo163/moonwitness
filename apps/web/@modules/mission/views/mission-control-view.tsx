"use client"

import { useState, useEffect } from "react"
import { Target, AlertTriangle, Info, Globe, ShieldAlert } from "lucide-react"
import { ContextBlock } from "@core/ui"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"

// Dynamically import Leaflet components to avoid SSR window errors
const Map = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const Tile = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

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
    id: "m1", lat: 31.5, lng: 34.46, // Gaza
    title: "KRISIS KEMANUSIAAN JALUR GAZA",
    severity: "CRITICAL", type: "HUMANITARIAN",
    description: "Krisis kemanusiaan tingkat tertinggi. Blokade medis dan pangan. Membutuhkan intervensi diplomatik darurat dan jalur suplai independen."
  },
  {
    id: "m2", lat: 15.55, lng: 48.51, // Yemen
    title: "KELAPARAN EKSTREM YAMAN",
    severity: "CRITICAL", type: "HUMANITARIAN",
    description: "Jutaan warga sipil menghadapi ancaman kelaparan dan wabah penyakit akibat konflik berkepanjangan."
  },
  {
    id: "m3", lat: 34.55, lng: 69.2, // Afghanistan
    title: "KRISIS PENDIDIKAN & EKONOMI AFGHANISTAN",
    severity: "HIGH", type: "EDUCATION",
    description: "Pembatasan akses pendidikan dan pembekuan aset internasional menyebabkan kelumpuhan ekonomi massal."
  },
  {
    id: "m4", lat: 14.49, lng: 14.45, // Sudan / Sahel
    title: "KONFLIK BERSENJATA SUDAN",
    severity: "HIGH", type: "CONFLICT",
    description: "Perang saudara memicu jutaan pengungsi internal (IDP). Akses kesehatan hancur total."
  },
  {
    id: "m5", lat: 23.88, lng: 90.39, // Bangladesh / Rohingya
    title: "KAMP PENGUNGSI ROHINGYA",
    severity: "MEDIUM", type: "HUMANITARIAN",
    description: "Kondisi kamp pengungsi yang melebihi kapasitas rentan terhadap bencana alam dan wabah penyakit."
  }
]

export function MissionControlView() {
  const [mounted, setMounted] = useState(false)
  const [activeTarget, setActiveTarget] = useState<CrisisMarker | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // To fix Leaflet's default icon missing issues in Next.js dynamically
  useEffect(() => {
    if (mounted) {
      const L = require('leaflet')
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      })
    }
  }, [mounted])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return "text-destructive border-destructive"
      case "HIGH": return "text-warning border-warning"
      case "MEDIUM": return "text-accent border-accent"
      default: return "text-primary border-primary"
    }
  }

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return "bg-destructive text-white"
      case "HIGH": return "bg-warning text-black"
      case "MEDIUM": return "bg-accent text-black"
      default: return "bg-primary text-black"
    }
  }

  return (
    <>
      <ContextBlock
        title="GLOBAL MISSION COMMAND"
        subtitle="Pusat kendali taktis untuk melacak zona krisis kemanusiaan dan konflik global. Digunakan untuk merumuskan strategi bantuan, diplomasi, dan resolusi perdamaian."
        operation="TACTICAL-MAPPING"
        status="ONLINE"
        accentColor="destructive"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Radar Map (3 columns wide) */}
        <div className="lg:col-span-3 panel-box bg-space border-2 border-primary/50 shadow-[0_0_50px_rgba(255,51,102,0.15)] flex flex-col p-1">
          <div className="p-3 border-b border-primary/20 bg-black flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-primary">
              <Target className="w-4 h-4 text-destructive animate-pulse" />
              SATELLITE TACTICAL LINK
            </div>
            <div className="text-[10px] bg-destructive/20 text-destructive px-2 py-1 font-mono font-bold uppercase">
              CLASSIFIED INTELLIGENCE
            </div>
          </div>

          <div className="h-[600px] w-full relative z-0">
            {!mounted ? (
              <div className="w-full h-full flex items-center justify-center text-primary animate-pulse font-mono text-sm bg-black">
                INITIALIZING TACTICAL MAP...
              </div>
            ) : (
              <Map 
                center={[25, 45]} // Centered on Middle East roughly
                zoom={3} 
                scrollWheelZoom={true}
                className="w-full h-full bg-[#0a0f18]"
                zoomControl={false}
              >
                <Tile
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; CARTO'
                />
                
                {MISSION_TARGETS.map(target => (
                  <Marker 
                    key={target.id} 
                    position={[target.lat, target.lng]}
                    eventHandlers={{
                      click: () => setActiveTarget(target)
                    }}
                  >
                    <Popup className="bg-black border border-primary/30 text-white rounded-none">
                      <div className="p-1 max-w-[200px]">
                        <div className={`text-[10px] font-bold px-1 py-0.5 mb-2 inline-block ${getSeverityBg(target.severity)}`}>
                          {target.severity} PRIORITY
                        </div>
                        <h4 className="font-bold text-xs mb-1">{target.title}</h4>
                        <p className="text-[10px] text-gray-400">{target.type}</p>
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
          <div className="panel-box bg-panel border-2 border-primary/30 p-6 shadow-lg">
            <h3 className="text-xs font-bold text-primary tracking-widest flex items-center gap-2 mb-4 border-b border-primary/20 pb-2">
              <Globe className="w-4 h-4" />
              TARGET INTELLIGENCE
            </h3>

            {activeTarget ? (
              <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                <div className={`inline-block px-2 py-1 text-[10px] font-bold ${getSeverityBg(activeTarget.severity)}`}>
                  {activeTarget.severity} PRIORITY
                </div>
                
                <h4 className="text-lg font-black text-white leading-tight">
                  {activeTarget.title}
                </h4>
                
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="border border-primary/20 p-2 bg-black/50">
                    <span className="text-primary/50 block mb-1">LATITUDE</span>
                    <span className="font-mono text-accent">{activeTarget.lat}°</span>
                  </div>
                  <div className="border border-primary/20 p-2 bg-black/50">
                    <span className="text-primary/50 block mb-1">LONGITUDE</span>
                    <span className="font-mono text-accent">{activeTarget.lng}°</span>
                  </div>
                </div>

                <div className="border-l-2 border-primary/50 pl-3 py-1 my-4">
                  <div className="text-[10px] text-primary/50 font-bold tracking-widest mb-1">THREAT CLASSIFICATION</div>
                  <div className="text-xs font-bold text-warning">{activeTarget.type}</div>
                </div>

                <p className="text-xs text-primary/80 leading-relaxed bg-primary/5 p-3 border border-primary/10">
                  {activeTarget.description}
                </p>

                <button className="w-full mt-4 bg-primary/20 border border-primary text-primary py-2 text-xs font-bold hover:bg-primary/40 transition-colors flex justify-center items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  INITIATE RELIEF PROTOCOL
                </button>
              </div>
            ) : (
              <div className="text-center py-12 opacity-50">
                <Info className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="text-xs text-primary font-mono">SELECT A TARGET ON THE RADAR TO VIEW INTELLIGENCE DOSSIER</p>
              </div>
            )}
          </div>
          
          {/* Mission Stats */}
          <div className="panel-box bg-panel border border-primary/30 p-4">
             <div className="text-[10px] text-primary/50 font-bold tracking-widest mb-3">GLOBAL SUMMARY</div>
             <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-white">Active Zones</span>
                <span className="font-mono font-bold text-accent">{MISSION_TARGETS.length}</span>
             </div>
             <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-white">Critical Threats</span>
                <span className="font-mono font-bold text-destructive">
                  {MISSION_TARGETS.filter(t => t.severity === "CRITICAL").length}
                </span>
             </div>
          </div>
        </div>

      </div>
    </>
  )
}
