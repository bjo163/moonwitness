"use client"

import { useState, useEffect } from "react"
import {
  Activity,
  Wind,
  CloudRain,
  CloudLightning,
  AlertOctagon,
  Globe,
  Thermometer,
  AlertTriangle,
  Droplets,
  Radio,
  Clock,
  Eye,
  MapPin,
  ChevronDown,
  Layers,
  ThermometerSun,
  Flame,
  Waves,
  ChevronRight,
  Compass,
  Sun,
} from "lucide-react"

// Leaflet map dynamically imported to prevent SSR issues
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"

const Map = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)
const Tile = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)
const LayerCtrl = dynamic(
  () => import("react-leaflet").then((mod) => mod.LayersControl),
  { ssr: false }
)
const BaseLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.LayersControl.BaseLayer),
  { ssr: false }
)
const Overlay = dynamic(
  () => import("react-leaflet").then((mod) => mod.LayersControl.Overlay),
  { ssr: false }
)

export function AtmosphericRadarView() {
  const [mounted, setMounted] = useState(false)
  const [rainTimestamp, setRainTimestamp] = useState<number>(0)

  useEffect(() => {
    setMounted(true)
    fetch("https://api.rainviewer.com/public/weather-maps.json")
      .then((res) => res.json())
      .then((data) => {
        if (
          data &&
          data.radar &&
          data.radar.past &&
          data.radar.past.length > 0
        ) {
          setRainTimestamp(data.radar.past[data.radar.past.length - 1].time)
        }
      })
      .catch((err) => console.error("RainViewer API failed:", err))
  }, [])

  if (!mounted)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020813] font-mono text-sm tracking-widest text-indigo-500">
        INITIALIZING ATMOSPHERIC RADAR...
      </div>
    )

  return (
    <div className="min-h-screen bg-[#020813] p-4 font-sans text-[#8F9FB3] selection:bg-indigo-500/30">
      <div className="mx-auto max-w-[1600px] space-y-4">
        {/* ═══ HEADER BAR ═══ */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-widest text-white uppercase">
                ATMOSPHERIC RADAR (CUACA GLOBAL)
              </h1>
              <p className="mt-1 text-[10px] text-[#8F9FB3]">
                Pemantauan lapisan atmosfer bumi, curah hujan ekstrem, badai,
                dan fenomena cuaca dengan data satelit secara real-time.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-6">
            <div className="border-r border-white/10 pr-6 text-right">
              <div className="mb-1 text-[8px] tracking-widest text-[#8F9FB3] uppercase">
                SYSTEM STATUS
              </div>
              <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />{" "}
                ONLINE
              </div>
            </div>
            <div className="border-r border-white/10 pr-6 text-right">
              <div className="mb-1 text-[8px] tracking-widest text-[#8F9FB3] uppercase">
                OPERATION MODE
              </div>
              <div className="text-[10px] font-bold tracking-widest text-white uppercase">
                ATMOSPHERIC-SCAN
              </div>
            </div>
            <div className="relative text-right">
              <div className="mb-1 text-[8px] tracking-widest text-[#8F9FB3] uppercase">
                LAST UPDATE
              </div>
              <div className="font-mono text-[10px] tracking-widest text-white">
                12 Agt 2026 • 18:47:32 UTC+0
              </div>
            </div>
            <div className="pointer-events-none relative -ml-2 h-16 w-16 opacity-80 mix-blend-screen">
              <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl" />
              <img
                src="/assets/satellite.png"
                alt="Satellite"
                className="relative z-10 h-full w-full scale-150 object-cover"
                style={{
                  maskImage:
                    "radial-gradient(circle, black 40%, transparent 70%)",
                  WebkitMaskImage:
                    "radial-gradient(circle, black 40%, transparent 70%)",
                }}
              />
            </div>
          </div>
        </div>

        {/* ═══ TOP STATS ROW ═══ */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
          {/* Stat 1 */}
          <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#040C1A] p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/20">
              <Radio className="h-4 w-4 text-indigo-400" />
            </div>
            <div>
              <div className="mb-0.5 text-[7px] tracking-widest text-[#8F9FB3] uppercase">
                SATELLITE STATUS
              </div>
              <div className="text-[10px] leading-tight font-bold tracking-widest text-indigo-400 uppercase">
                SCANNING ATMOSPHERE
              </div>
              <div className="mt-0.5 font-mono text-[8px] text-[#8F9FB3]">
                NOAA-20 / METOP-B
              </div>
            </div>
          </div>
          {/* Stat 2 */}
          <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#040C1A] p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00aaff]/20">
              <Globe className="h-4 w-4 text-[#00aaff]" />
            </div>
            <div>
              <div className="mb-0.5 text-[7px] tracking-widest text-[#8F9FB3] uppercase">
                GLOBAL COVERAGE
              </div>
              <div className="mb-1 font-mono text-lg leading-none font-bold text-white">
                98.7%
              </div>
              <div className="text-[8px] tracking-widest text-[#8F9FB3] uppercase">
                UPDATED 1 MIN AGO
              </div>
            </div>
          </div>
          {/* Stat 3 */}
          <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#040C1A] p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <div className="mb-0.5 text-[7px] tracking-widest text-[#8F9FB3] uppercase">
                ACTIVE ALERTS
              </div>
              <div className="mb-1 font-mono text-lg leading-none font-bold text-white">
                7
              </div>
              <div className="text-[8px] tracking-widest text-[#8F9FB3] uppercase">
                WORLDWIDE
              </div>
            </div>
          </div>
          {/* Stat 4 */}
          <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#040C1A] p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/20">
              <CloudLightning className="h-4 w-4 text-purple-400" />
            </div>
            <div>
              <div className="mb-0.5 text-[7px] tracking-widest text-[#8F9FB3] uppercase">
                STORM SYSTEMS
              </div>
              <div className="mb-1 font-mono text-lg leading-none font-bold text-white">
                12
              </div>
              <div className="text-[8px] tracking-widest text-[#8F9FB3] uppercase">
                ACTIVE
              </div>
            </div>
          </div>
          {/* Stat 5 */}
          <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#040C1A] p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/20">
              <Droplets className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <div className="mb-0.5 text-[7px] tracking-widest text-[#8F9FB3] uppercase">
                EXTREME RAIN AREAS
              </div>
              <div className="mb-1 font-mono text-lg leading-none font-bold text-white">
                23
              </div>
              <div className="text-[8px] tracking-widest text-[#8F9FB3] uppercase">
                HIGH INTENSITY
              </div>
            </div>
          </div>
          {/* Stat 6 */}
          <div className="col-span-2 flex items-center justify-between rounded-xl border border-white/5 bg-[#040C1A] p-4 md:col-span-1">
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                <Wind className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <div className="mb-0.5 text-[7px] tracking-widest text-[#8F9FB3] uppercase">
                  WIND SPEED (MAX)
                </div>
                <div className="mb-1 flex items-baseline gap-1 font-mono text-lg leading-none font-bold text-white">
                  126 <span className="text-xs">km/h</span>
                </div>
                <div className="text-[8px] tracking-widest text-[#8F9FB3] uppercase">
                  PACIFIC OCEAN
                </div>
              </div>
            </div>
            <div className="hidden h-10 w-px bg-white/10 md:block" />
            <div className="flex items-center gap-4 pl-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-500/20">
                <Thermometer className="h-4 w-4 text-rose-400" />
              </div>
              <div>
                <div className="mb-0.5 text-[7px] tracking-widest text-[#8F9FB3] uppercase">
                  TEMPERATURE (AVG)
                </div>
                <div className="mb-1 flex items-baseline gap-1 font-mono text-lg leading-none font-bold text-white">
                  24.6 <span className="text-xs">°C</span>
                </div>
                <div className="text-[8px] tracking-widest text-[#8F9FB3] uppercase">
                  GLOBAL AVG
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ MIDDLE GRID ═══ */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* LEFT SIDEBAR (Col 1-3) */}
          <div className="flex flex-col gap-4 lg:col-span-3">
            {/* Ringkasan Global */}
            <div className="rounded-xl border border-white/5 bg-[#040C1A] p-4">
              <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3 text-[9px] font-bold tracking-widest text-white uppercase">
                <Globe className="h-3.5 w-3.5 text-indigo-400" /> RINGKASAN
                GLOBAL
                <span className="ml-auto text-[7px] font-normal text-[#8F9FB3]">
                  (24 JAM TERAKHIR)
                </span>
              </div>
              <div className="space-y-3">
                {[
                  {
                    label: "Curah Hujan Ekstrem",
                    val: "23 Wilayah",
                    icon: CloudRain,
                    color: "text-[#00aaff]",
                  },
                  {
                    label: "Badai Tropis / Siklon",
                    val: "12 Sistem",
                    icon: CloudLightning,
                    color: "text-purple-400",
                  },
                  {
                    label: "Banjir Potensial",
                    val: "14 Wilayah",
                    icon: Waves,
                    color: "text-blue-400",
                  },
                  {
                    label: "Gelombang Panas",
                    val: "8 Wilayah",
                    icon: ThermometerSun,
                    color: "text-rose-400",
                  },
                  {
                    label: "Kebakaran Hutan",
                    val: "5 Wilayah",
                    icon: Flame,
                    color: "text-amber-500",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-[10px]"
                  >
                    <div className="flex items-center gap-2 text-[#8F9FB3]">
                      <item.icon className={`h-3 w-3 ${item.color}`} />
                      {item.label}
                    </div>
                    <div className="text-white">{item.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prakiraan 3 Hari */}
            <div className="rounded-xl border border-white/5 bg-[#040C1A] p-4">
              <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3 text-[9px] font-bold tracking-widest text-white uppercase">
                <Activity className="h-3.5 w-3.5 text-indigo-400" /> PRAKIRAAN 3
                HARI KE DEPAN
              </div>
              <div className="space-y-3">
                {[
                  {
                    date: "13 Agt 2026",
                    threat: "Tinggi",
                    threatColor: "text-rose-400",
                    val: "17 Wilayah",
                  },
                  {
                    date: "14 Agt 2026",
                    threat: "Sedang",
                    threatColor: "text-amber-400",
                    val: "12 Wilayah",
                  },
                  {
                    date: "15 Agt 2026",
                    threat: "Rendah",
                    threatColor: "text-emerald-400",
                    val: "9 Wilayah",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-[10px]"
                  >
                    <div className="font-mono text-[#8F9FB3]">{item.date}</div>
                    <div
                      className={`flex items-center gap-1 ${item.threatColor} font-bold`}
                    >
                      <AlertTriangle className="h-3 w-3" /> {item.threat}
                    </div>
                    <div className="text-white">{item.val}</div>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full rounded border border-white/10 py-2 text-[7px] tracking-widest text-white uppercase transition-colors hover:bg-white/5">
                LIHAT DETAIL PRAKIRAAN
              </button>
            </div>

            {/* Informasi Satelit */}
            <div className="flex-1 rounded-xl border border-white/5 bg-[#040C1A] p-4">
              <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3 text-[9px] font-bold tracking-widest text-white uppercase">
                <Radio className="h-3.5 w-3.5 text-indigo-400" /> INFORMASI
                SATELIT
              </div>
              <div className="space-y-4">
                {/* Sat 1 */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-white">
                      <Radio className="h-3 w-3 text-indigo-400" /> NOAA-20
                    </div>
                    <div className="text-[7px] tracking-widest text-[#8F9FB3] uppercase">
                      ACTIVE
                    </div>
                  </div>
                  <div className="space-y-1.5 pl-5">
                    <div className="flex justify-between text-[9px]">
                      <span className="text-[#8F9FB3]">Orbit</span>
                      <span className="text-white">Polar</span>
                    </div>
                    <div className="flex justify-between text-[9px]">
                      <span className="text-[#8F9FB3]">Ketinggian</span>
                      <span className="text-white">824 km</span>
                    </div>
                    <div className="flex justify-between text-[9px]">
                      <span className="text-[#8F9FB3]">Resolusi</span>
                      <span className="text-white">1.1 km</span>
                    </div>
                    <div className="flex justify-between text-[9px]">
                      <span className="text-[#8F9FB3]">Waktu Lintas</span>
                      <span className="font-mono text-white">18:45 UTC</span>
                    </div>
                  </div>
                </div>
                {/* Sat 2 */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-white">
                      <Radio className="h-3 w-3 text-indigo-400" /> METOP-B
                    </div>
                    <div className="text-[7px] tracking-widest text-[#8F9FB3] uppercase">
                      ACTIVE
                    </div>
                  </div>
                  <div className="space-y-1.5 pl-5">
                    <div className="flex justify-between text-[9px]">
                      <span className="text-[#8F9FB3]">Orbit</span>
                      <span className="text-white">Polar</span>
                    </div>
                    <div className="flex justify-between text-[9px]">
                      <span className="text-[#8F9FB3]">Ketinggian</span>
                      <span className="text-white">817 km</span>
                    </div>
                    <div className="flex justify-between text-[9px]">
                      <span className="text-[#8F9FB3]">Resolusi</span>
                      <span className="text-white">2.5 km</span>
                    </div>
                    <div className="flex justify-between text-[9px]">
                      <span className="text-[#8F9FB3]">Waktu Lintas</span>
                      <span className="font-mono text-white">18:40 UTC</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="mt-5 w-full rounded border border-white/10 py-2 text-[7px] tracking-widest text-indigo-300 uppercase transition-colors hover:bg-white/5">
                LIHAT SEMUA SATELIT
              </button>
            </div>
          </div>

          {/* MAIN MAP (Col 4-12) */}
          <div className="relative flex flex-col rounded-xl border border-white/5 bg-[#040C1A] p-2 lg:col-span-9">
            {/* Map Toolbar */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-4 text-[9px] font-bold tracking-widest uppercase">
                <button className="flex items-center gap-2 text-indigo-400">
                  <Globe className="h-3.5 w-3.5" /> PETA GLOBAL
                </button>
                <button className="flex items-center gap-2 text-[#8F9FB3] transition-colors hover:text-white">
                  <Droplets className="h-3.5 w-3.5" /> PRESIPITASI
                </button>
                <button className="flex items-center gap-2 text-[#8F9FB3] transition-colors hover:text-white">
                  <CloudRain className="h-3.5 w-3.5" /> AWAN (CLOUD COVER)
                </button>
                <button className="flex items-center gap-2 text-[#8F9FB3] transition-colors hover:text-white">
                  <Thermometer className="h-3.5 w-3.5" /> SUHU PERMUKAAN
                </button>
                <button className="flex items-center gap-2 text-[#8F9FB3] transition-colors hover:text-white">
                  <Wind className="h-3.5 w-3.5" /> ANGIN
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[7px] tracking-widest text-[#8F9FB3] uppercase">
                    Intensitas Curah Hujan (mm/h)
                  </span>
                  {/* Gradient Bar Mockup */}
                  <div className="relative h-1.5 w-48 rounded-full bg-gradient-to-r from-blue-500 via-green-500 to-red-600">
                    <div className="absolute top-2 flex w-full justify-between text-[6px] text-white/50">
                      <span>0</span>
                      <span>0.1</span>
                      <span>2.5</span>
                      <span>7.5</span>
                      <span>15</span>
                      <span>30</span>
                      <span>50+</span>
                    </div>
                  </div>
                </div>
                <div className="mx-2 h-6 w-px bg-white/10" />
                <button className="flex items-center gap-2 rounded border border-white/10 px-3 py-1.5 text-[9px] text-white hover:bg-white/5">
                  LAPISAN DATA{" "}
                  <span className="text-indigo-400">SEMUA LAPISAN</span>{" "}
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* The Leaflet Map Container */}
            <div className="relative z-0 min-h-[500px] flex-1 overflow-hidden rounded-lg border border-white/5 bg-[#0a0f18]">
              <Map
                center={[20, 40]} // Overview center
                zoom={3}
                scrollWheelZoom={true}
                className="h-full w-full bg-[#0a0f18] opacity-70"
                zoomControl={false}
              >
                <LayerCtrl position="topright">
                  <BaseLayer checked name="CartoDB Dark Matter">
                    <Tile
                      url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    />
                  </BaseLayer>
                  <BaseLayer name="ESRI Satellite">
                    <Tile url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                  </BaseLayer>
                </LayerCtrl>
              </Map>

              {/* Stunning Generated Precipitation Overlay */}
              <div className="pointer-events-none absolute inset-0 z-0 opacity-80 mix-blend-screen">
                <img
                  src="/assets/precipitation_map.png"
                  alt="Precipitation Data"
                  className="h-full w-full scale-105 object-cover"
                />
              </div>

              {/* Dark Vignette to blend map edges */}
              <div className="pointer-events-none absolute inset-0 z-10 shadow-[inset_0_0_80px_rgba(4,12,26,1)]" />

              {/* Mock UI Markers on Map */}
              <div className="pointer-events-none absolute inset-0 z-20 p-4">
                {/* Sample Storm Markers */}
                <div className="absolute top-[35%] left-[25%] flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/60 p-1.5 shadow-lg backdrop-blur-sm">
                  <CloudLightning className="h-4 w-4 animate-pulse text-purple-400" />
                  <div>
                    <div className="mb-0.5 text-[7px] leading-none font-bold text-white">
                      TS ERNESTO
                    </div>
                    <div className="text-[6px] text-[#8F9FB3]">
                      90 km/h • Category 1
                    </div>
                  </div>
                </div>
                <div className="absolute top-[45%] left-[55%] flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/60 p-1.5 shadow-lg backdrop-blur-sm">
                  <CloudLightning className="h-4 w-4 animate-pulse text-rose-400" />
                  <div>
                    <div className="mb-0.5 text-[7px] leading-none font-bold text-white">
                      TC BIPARJOY
                    </div>
                    <div className="text-[6px] text-[#8F9FB3]">
                      120 km/h • Category 2
                    </div>
                  </div>
                </div>
                <div className="absolute top-[40%] right-[10%] flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/60 p-1.5 shadow-lg backdrop-blur-sm">
                  <CloudLightning className="h-4 w-4 animate-pulse text-rose-500" />
                  <div>
                    <div className="mb-0.5 text-[7px] leading-none font-bold text-white">
                      TY KHANUN
                    </div>
                    <div className="text-[6px] text-[#8F9FB3]">
                      140 km/h • Category 3
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ BOTTOM ROW ═══ */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Peringatan Dini */}
          <div className="flex flex-col rounded-xl border border-white/5 bg-[#040C1A] p-4">
            <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3 text-[9px] font-bold tracking-widest text-white uppercase">
              <AlertOctagon className="h-3.5 w-3.5 text-rose-500" /> PERINGATAN
              DINI (EARLY WARNING)
            </div>
            <div className="flex-1">
              <div className="mb-2 grid grid-cols-12 border-b border-white/5 pb-1 text-[6px] tracking-widest text-[#8F9FB3] uppercase">
                <div className="col-span-4">WILAYAH</div>
                <div className="col-span-3">JENIS</div>
                <div className="col-span-2">TINGKAT</div>
                <div className="col-span-3 text-right">STATUS</div>
              </div>
              <div className="space-y-2.5">
                {[
                  {
                    w: "Kerala, India",
                    j: "Banjir Bandang",
                    t: "Tinggi",
                    tc: "text-rose-500",
                    st: "Aktif",
                    stc: "text-rose-500",
                  },
                  {
                    w: "Mindanao, PH",
                    j: "Badai Tropis",
                    t: "Tinggi",
                    tc: "text-rose-500",
                    st: "Aktif",
                    stc: "text-rose-500",
                  },
                  {
                    w: "Yogyakarta, ID",
                    j: "Hujan Lebat",
                    t: "Sedang",
                    tc: "text-amber-500",
                    st: "Waspada",
                    stc: "text-amber-500",
                  },
                  {
                    w: "Chiang Rai, TH",
                    j: "Banjir",
                    t: "Sedang",
                    tc: "text-amber-500",
                    st: "Waspada",
                    stc: "text-amber-500",
                  },
                  {
                    w: "Lombok, ID",
                    j: "Gelombang",
                    t: "Sedang",
                    tc: "text-amber-500",
                    st: "Waspada",
                    stc: "text-amber-500",
                  },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-12 items-center text-[8px]"
                  >
                    <div className="col-span-4 truncate pr-2 text-white">
                      {row.w}
                    </div>
                    <div className="col-span-3 truncate text-[#8F9FB3]">
                      {row.j}
                    </div>
                    <div className={`col-span-2 ${row.tc} font-bold`}>
                      {row.t}
                    </div>
                    <div
                      className={`col-span-3 flex items-center justify-end gap-1 text-right ${row.stc} font-bold`}
                    >
                      <div
                        className={`h-1.5 w-1.5 rounded-full bg-current ${row.st === "Aktif" ? "animate-pulse" : ""}`}
                      />{" "}
                      {row.st}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button className="mt-4 w-full rounded border border-white/10 py-2 text-[7px] tracking-widest text-indigo-300 uppercase transition-colors hover:bg-white/5">
              LIHAT SEMUA PERINGATAN
            </button>
          </div>

          {/* Data Real-Time */}
          <div className="flex flex-col rounded-xl border border-white/5 bg-[#040C1A] p-4">
            <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3 text-[9px] font-bold tracking-widest text-white uppercase">
              <Clock className="h-3.5 w-3.5 text-indigo-400" /> DATA REAL-TIME
              (GLOBAL)
            </div>
            <div className="flex-1 space-y-4">
              {[
                {
                  l: "Curah Hujan (Rata-rata)",
                  v: "2.48 mm/h",
                  i: Droplets,
                  color: "text-[#00aaff]",
                },
                {
                  l: "Kelembapan Udara",
                  v: "78%",
                  i: Waves,
                  color: "text-blue-300",
                },
                {
                  l: "Tekanan Udara",
                  v: "1011 hPa",
                  i: Activity,
                  color: "text-indigo-400",
                },
                {
                  l: "Kecepatan Angin (Rata-rata)",
                  v: "26 km/h",
                  i: Wind,
                  color: "text-emerald-400",
                },
                {
                  l: "Arah Angin Dominan",
                  v: "Barat Daya",
                  i: Compass,
                  color: "text-amber-400",
                },
                {
                  l: "Indeks UV Global",
                  v: "5 (Sedang)",
                  i: Sun,
                  color: "text-rose-400",
                },
              ].map((x, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-[9px]"
                >
                  <div className="flex items-center gap-2 text-[#8F9FB3]">
                    <x.i className={`h-3.5 w-3.5 ${x.color}`} /> {x.l}
                  </div>
                  <div
                    className={`font-mono font-bold ${x.v.includes("Sedang") ? "text-rose-400" : "text-white"}`}
                  >
                    {x.v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kualitas Udara */}
          <div className="flex flex-col rounded-xl border border-white/5 bg-[#040C1A] p-4">
            <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3 text-[9px] font-bold tracking-widest text-white uppercase">
              <Wind className="h-3.5 w-3.5 text-indigo-400" /> KUALITAS UDARA
              (AQI)
            </div>
            <div className="flex-1 space-y-4">
              {[
                {
                  c: "New Delhi, India",
                  v: 156,
                  st: "Tidak Sehat",
                  color: "text-rose-500",
                  bg: "bg-rose-500",
                },
                {
                  c: "Beijing, China",
                  v: 89,
                  st: "Sedang",
                  color: "text-amber-500",
                  bg: "bg-amber-500",
                },
                {
                  c: "Jakarta, Indonesia",
                  v: 62,
                  st: "Sedang",
                  color: "text-amber-500",
                  bg: "bg-amber-500",
                },
                {
                  c: "Los Angeles, USA",
                  v: 45,
                  st: "Baik",
                  color: "text-emerald-500",
                  bg: "bg-emerald-500",
                },
                {
                  c: "London, UK",
                  v: 32,
                  st: "Baik",
                  color: "text-emerald-500",
                  bg: "bg-emerald-500",
                },
              ].map((x, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-[9px]"
                >
                  <div className="flex items-center gap-2 text-[#8F9FB3]">
                    <div className={`h-2 w-2 rounded-full ${x.bg}`} /> {x.c}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-mono font-bold ${x.color}`}>
                      {x.v}
                    </span>
                    <span
                      className={`text-[7px] ${x.color} w-12 text-right tracking-widest uppercase`}
                    >
                      {x.st}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded border border-white/10 py-2 text-[7px] tracking-widest text-indigo-300 uppercase transition-colors hover:bg-white/5">
              LIHAT PETA KUALITAS UDARA
            </button>
          </div>

          {/* Fenomena Atmosfer */}
          <div className="flex flex-col rounded-xl border border-white/5 bg-[#040C1A] p-4">
            <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3 text-[9px] font-bold tracking-widest text-white uppercase">
              <Layers className="h-3.5 w-3.5 text-indigo-400" /> FENOMENA
              ATMOSFER
            </div>
            <div className="flex-1 space-y-4">
              {[
                { l: "MJO Phase", v: "Phase 4 (Active)", i: Activity },
                { l: "ENSO Status", v: "El Niño (Weak)", i: Waves },
                { l: "SOI Index", v: "-0.8", i: Activity },
                { l: "IOD Status", v: "Netral", i: Compass },
                { l: "Polarisasi Jet Stream", v: "Normal", i: Wind },
              ].map((x, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-[9px]"
                >
                  <div className="flex items-center gap-2 text-[#8F9FB3]">
                    <x.i className="h-3.5 w-3.5 text-[#8F9FB3]" /> {x.l}
                  </div>
                  <div className="font-mono text-white">{x.v}</div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded border border-white/10 py-2 text-[7px] tracking-widest text-indigo-300 uppercase transition-colors hover:bg-white/5">
              LIHAT ANALISIS LENGKAP
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
