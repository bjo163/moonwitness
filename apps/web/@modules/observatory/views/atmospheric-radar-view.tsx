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
  Sun
} from "lucide-react"

// Leaflet map dynamically imported to prevent SSR issues
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"

const Map = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const Tile = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const LayerCtrl = dynamic(() => import("react-leaflet").then((mod) => mod.LayersControl), { ssr: false })
const BaseLayer = dynamic(() => import("react-leaflet").then((mod) => mod.LayersControl.BaseLayer), { ssr: false })
const Overlay = dynamic(() => import("react-leaflet").then((mod) => mod.LayersControl.Overlay), { ssr: false })

export function AtmosphericRadarView() {
  const [mounted, setMounted] = useState(false)
  const [rainTimestamp, setRainTimestamp] = useState<number>(0)

  useEffect(() => {
    setMounted(true)
    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then(res => res.json())
      .then(data => {
        if (data && data.radar && data.radar.past && data.radar.past.length > 0) {
          setRainTimestamp(data.radar.past[data.radar.past.length - 1].time)
        }
      })
      .catch(err => console.error("RainViewer API failed:", err))
  }, [])

  if (!mounted) return <div className="min-h-screen bg-[#020813] flex items-center justify-center text-indigo-500 font-mono text-sm tracking-widest">INITIALIZING ATMOSPHERIC RADAR...</div>

  return (
    <div className="bg-[#020813] text-[#8F9FB3] font-sans min-h-screen p-4 selection:bg-indigo-500/30">
      <div className="max-w-[1600px] mx-auto space-y-4">
        
        {/* ═══ HEADER BAR ═══ */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                 <Radio className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-white font-bold tracking-widest uppercase text-lg">
                  ATMOSPHERIC RADAR (CUACA GLOBAL)
                </h1>
                <p className="text-[10px] mt-1 text-[#8F9FB3]">
                  Pemantauan lapisan atmosfer bumi, curah hujan ekstrem, badai, dan fenomena cuaca dengan data satelit secara real-time.
                </p>
              </div>
           </div>
           <div className="flex items-center gap-6 shrink-0">
             <div className="text-right border-r border-white/10 pr-6">
                <div className="text-[8px] uppercase tracking-widest text-[#8F9FB3] mb-1">SYSTEM STATUS</div>
                <div className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest flex items-center justify-end gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> ONLINE
                </div>
             </div>
             <div className="text-right border-r border-white/10 pr-6">
                <div className="text-[8px] uppercase tracking-widest text-[#8F9FB3] mb-1">OPERATION MODE</div>
                <div className="text-white text-[10px] font-bold uppercase tracking-widest">ATMOSPHERIC-SCAN</div>
             </div>
             <div className="text-right relative">
                <div className="text-[8px] uppercase tracking-widest text-[#8F9FB3] mb-1">LAST UPDATE</div>
                <div className="text-white text-[10px] font-mono tracking-widest">12 Agt 2026 • 18:47:32 UTC+0</div>
             </div>
             <div className="opacity-80 mix-blend-screen -ml-2 pointer-events-none relative w-16 h-16">
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
                <img 
                  src="/assets/satellite.png" 
                  alt="Satellite" 
                  className="w-full h-full object-cover scale-150 relative z-10" 
                  style={{ 
                    maskImage: 'radial-gradient(circle, black 40%, transparent 70%)', 
                    WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 70%)' 
                  }}
                />
             </div>
           </div>
        </div>

        {/* ═══ TOP STATS ROW ═══ */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
           {/* Stat 1 */}
           <div className="bg-[#040C1A] border border-white/5 rounded-xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                 <Radio className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                 <div className="text-[7px] uppercase tracking-widest text-[#8F9FB3] mb-0.5">SATELLITE STATUS</div>
                 <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-tight">SCANNING ATMOSPHERE</div>
                 <div className="text-[8px] text-[#8F9FB3] mt-0.5 font-mono">NOAA-20 / METOP-B</div>
              </div>
           </div>
           {/* Stat 2 */}
           <div className="bg-[#040C1A] border border-white/5 rounded-xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#00aaff]/20 flex items-center justify-center shrink-0">
                 <Globe className="w-4 h-4 text-[#00aaff]" />
              </div>
              <div>
                 <div className="text-[7px] uppercase tracking-widest text-[#8F9FB3] mb-0.5">GLOBAL COVERAGE</div>
                 <div className="text-lg font-bold text-white font-mono leading-none mb-1">98.7%</div>
                 <div className="text-[8px] text-[#8F9FB3] uppercase tracking-widest">UPDATED 1 MIN AGO</div>
              </div>
           </div>
           {/* Stat 3 */}
           <div className="bg-[#040C1A] border border-white/5 rounded-xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                 <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                 <div className="text-[7px] uppercase tracking-widest text-[#8F9FB3] mb-0.5">ACTIVE ALERTS</div>
                 <div className="text-lg font-bold text-white font-mono leading-none mb-1">7</div>
                 <div className="text-[8px] text-[#8F9FB3] uppercase tracking-widest">WORLDWIDE</div>
              </div>
           </div>
           {/* Stat 4 */}
           <div className="bg-[#040C1A] border border-white/5 rounded-xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                 <CloudLightning className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                 <div className="text-[7px] uppercase tracking-widest text-[#8F9FB3] mb-0.5">STORM SYSTEMS</div>
                 <div className="text-lg font-bold text-white font-mono leading-none mb-1">12</div>
                 <div className="text-[8px] text-[#8F9FB3] uppercase tracking-widest">ACTIVE</div>
              </div>
           </div>
           {/* Stat 5 */}
           <div className="bg-[#040C1A] border border-white/5 rounded-xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                 <Droplets className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                 <div className="text-[7px] uppercase tracking-widest text-[#8F9FB3] mb-0.5">EXTREME RAIN AREAS</div>
                 <div className="text-lg font-bold text-white font-mono leading-none mb-1">23</div>
                 <div className="text-[8px] text-[#8F9FB3] uppercase tracking-widest">HIGH INTENSITY</div>
              </div>
           </div>
           {/* Stat 6 */}
           <div className="bg-[#040C1A] border border-white/5 rounded-xl p-4 flex items-center justify-between col-span-2 md:col-span-1">
              <div className="flex gap-4 items-center">
                 <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Wind className="w-4 h-4 text-emerald-400" />
                 </div>
                 <div>
                    <div className="text-[7px] uppercase tracking-widest text-[#8F9FB3] mb-0.5">WIND SPEED (MAX)</div>
                    <div className="text-lg font-bold text-white font-mono leading-none mb-1 flex items-baseline gap-1">126 <span className="text-xs">km/h</span></div>
                    <div className="text-[8px] text-[#8F9FB3] uppercase tracking-widest">PACIFIC OCEAN</div>
                 </div>
              </div>
              <div className="w-px h-10 bg-white/10 hidden md:block" />
              <div className="flex gap-4 items-center pl-2">
                 <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0">
                    <Thermometer className="w-4 h-4 text-rose-400" />
                 </div>
                 <div>
                    <div className="text-[7px] uppercase tracking-widest text-[#8F9FB3] mb-0.5">TEMPERATURE (AVG)</div>
                    <div className="text-lg font-bold text-white font-mono leading-none mb-1 flex items-baseline gap-1">24.6 <span className="text-xs">°C</span></div>
                    <div className="text-[8px] text-[#8F9FB3] uppercase tracking-widest">GLOBAL AVG</div>
                 </div>
              </div>
           </div>
        </div>

        {/* ═══ MIDDLE GRID ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
           
           {/* LEFT SIDEBAR (Col 1-3) */}
           <div className="lg:col-span-3 flex flex-col gap-4">
              
              {/* Ringkasan Global */}
              <div className="bg-[#040C1A] border border-white/5 rounded-xl p-4">
                 <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-white mb-4 border-b border-white/10 pb-3">
                    <Globe className="w-3.5 h-3.5 text-indigo-400" /> RINGKASAN GLOBAL
                    <span className="text-[#8F9FB3] text-[7px] ml-auto font-normal">(24 JAM TERAKHIR)</span>
                 </div>
                 <div className="space-y-3">
                   {[
                     { label: "Curah Hujan Ekstrem", val: "23 Wilayah", icon: CloudRain, color: "text-[#00aaff]" },
                     { label: "Badai Tropis / Siklon", val: "12 Sistem", icon: CloudLightning, color: "text-purple-400" },
                     { label: "Banjir Potensial", val: "14 Wilayah", icon: Waves, color: "text-blue-400" },
                     { label: "Gelombang Panas", val: "8 Wilayah", icon: ThermometerSun, color: "text-rose-400" },
                     { label: "Kebakaran Hutan", val: "5 Wilayah", icon: Flame, color: "text-amber-500" },
                   ].map((item, i) => (
                     <div key={i} className="flex justify-between items-center text-[10px]">
                       <div className="flex items-center gap-2 text-[#8F9FB3]">
                         <item.icon className={`w-3 h-3 ${item.color}`} />
                         {item.label}
                       </div>
                       <div className="text-white">{item.val}</div>
                     </div>
                   ))}
                 </div>
              </div>

              {/* Prakiraan 3 Hari */}
              <div className="bg-[#040C1A] border border-white/5 rounded-xl p-4">
                 <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-white mb-4 border-b border-white/10 pb-3">
                    <Activity className="w-3.5 h-3.5 text-indigo-400" /> PRAKIRAAN 3 HARI KE DEPAN
                 </div>
                 <div className="space-y-3">
                   {[
                     { date: "13 Agt 2026", threat: "Tinggi", threatColor: "text-rose-400", val: "17 Wilayah" },
                     { date: "14 Agt 2026", threat: "Sedang", threatColor: "text-amber-400", val: "12 Wilayah" },
                     { date: "15 Agt 2026", threat: "Rendah", threatColor: "text-emerald-400", val: "9 Wilayah" },
                   ].map((item, i) => (
                     <div key={i} className="flex justify-between items-center text-[10px]">
                       <div className="text-[#8F9FB3] font-mono">{item.date}</div>
                       <div className={`flex items-center gap-1 ${item.threatColor} font-bold`}><AlertTriangle className="w-3 h-3" /> {item.threat}</div>
                       <div className="text-white">{item.val}</div>
                     </div>
                   ))}
                 </div>
                 <button className="w-full mt-4 py-2 border border-white/10 rounded text-[7px] tracking-widest uppercase hover:bg-white/5 transition-colors text-white">
                    LIHAT DETAIL PRAKIRAAN
                 </button>
              </div>

              {/* Informasi Satelit */}
              <div className="bg-[#040C1A] border border-white/5 rounded-xl p-4 flex-1">
                 <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-white mb-4 border-b border-white/10 pb-3">
                    <Radio className="w-3.5 h-3.5 text-indigo-400" /> INFORMASI SATELIT
                 </div>
                 <div className="space-y-4">
                    {/* Sat 1 */}
                    <div>
                       <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2 text-[10px] text-white font-bold">
                             <Radio className="w-3 h-3 text-indigo-400" /> NOAA-20
                          </div>
                          <div className="text-[7px] uppercase tracking-widest text-[#8F9FB3]">ACTIVE</div>
                       </div>
                       <div className="space-y-1.5 pl-5">
                          <div className="flex justify-between text-[9px]">
                             <span className="text-[#8F9FB3]">Orbit</span><span className="text-white">Polar</span>
                          </div>
                          <div className="flex justify-between text-[9px]">
                             <span className="text-[#8F9FB3]">Ketinggian</span><span className="text-white">824 km</span>
                          </div>
                          <div className="flex justify-between text-[9px]">
                             <span className="text-[#8F9FB3]">Resolusi</span><span className="text-white">1.1 km</span>
                          </div>
                          <div className="flex justify-between text-[9px]">
                             <span className="text-[#8F9FB3]">Waktu Lintas</span><span className="text-white font-mono">18:45 UTC</span>
                          </div>
                       </div>
                    </div>
                    {/* Sat 2 */}
                    <div>
                       <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2 text-[10px] text-white font-bold">
                             <Radio className="w-3 h-3 text-indigo-400" /> METOP-B
                          </div>
                          <div className="text-[7px] uppercase tracking-widest text-[#8F9FB3]">ACTIVE</div>
                       </div>
                       <div className="space-y-1.5 pl-5">
                          <div className="flex justify-between text-[9px]">
                             <span className="text-[#8F9FB3]">Orbit</span><span className="text-white">Polar</span>
                          </div>
                          <div className="flex justify-between text-[9px]">
                             <span className="text-[#8F9FB3]">Ketinggian</span><span className="text-white">817 km</span>
                          </div>
                          <div className="flex justify-between text-[9px]">
                             <span className="text-[#8F9FB3]">Resolusi</span><span className="text-white">2.5 km</span>
                          </div>
                          <div className="flex justify-between text-[9px]">
                             <span className="text-[#8F9FB3]">Waktu Lintas</span><span className="text-white font-mono">18:40 UTC</span>
                          </div>
                       </div>
                    </div>
                 </div>
                 <button className="w-full mt-5 py-2 border border-white/10 rounded text-[7px] tracking-widest uppercase hover:bg-white/5 transition-colors text-indigo-300">
                    LIHAT SEMUA SATELIT
                 </button>
              </div>

           </div>

           {/* MAIN MAP (Col 4-12) */}
           <div className="lg:col-span-9 bg-[#040C1A] border border-white/5 rounded-xl p-2 flex flex-col relative">
              {/* Map Toolbar */}
              <div className="flex justify-between items-center p-3">
                 <div className="flex items-center gap-4 text-[9px] uppercase tracking-widest font-bold">
                    <button className="flex items-center gap-2 text-indigo-400"><Globe className="w-3.5 h-3.5" /> PETA GLOBAL</button>
                    <button className="flex items-center gap-2 text-[#8F9FB3] hover:text-white transition-colors"><Droplets className="w-3.5 h-3.5" /> PRESIPITASI</button>
                    <button className="flex items-center gap-2 text-[#8F9FB3] hover:text-white transition-colors"><CloudRain className="w-3.5 h-3.5" /> AWAN (CLOUD COVER)</button>
                    <button className="flex items-center gap-2 text-[#8F9FB3] hover:text-white transition-colors"><Thermometer className="w-3.5 h-3.5" /> SUHU PERMUKAAN</button>
                    <button className="flex items-center gap-2 text-[#8F9FB3] hover:text-white transition-colors"><Wind className="w-3.5 h-3.5" /> ANGIN</button>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                       <span className="text-[7px] text-[#8F9FB3] uppercase tracking-widest">Intensitas Curah Hujan (mm/h)</span>
                       {/* Gradient Bar Mockup */}
                       <div className="w-48 h-1.5 rounded-full bg-gradient-to-r from-blue-500 via-green-500 to-red-600 relative">
                         <div className="absolute top-2 w-full flex justify-between text-[6px] text-white/50">
                           <span>0</span><span>0.1</span><span>2.5</span><span>7.5</span><span>15</span><span>30</span><span>50+</span>
                         </div>
                       </div>
                    </div>
                    <div className="w-px h-6 bg-white/10 mx-2" />
                    <button className="flex items-center gap-2 text-[9px] text-white border border-white/10 px-3 py-1.5 rounded hover:bg-white/5">
                       LAPISAN DATA <span className="text-indigo-400">SEMUA LAPISAN</span> <ChevronDown className="w-3 h-3" />
                    </button>
                 </div>
              </div>

              {/* The Leaflet Map Container */}
              <div className="flex-1 min-h-[500px] relative rounded-lg overflow-hidden border border-white/5 bg-[#0a0f18] z-0">
                 <Map 
                   center={[20, 40]} // Overview center
                   zoom={3} 
                   scrollWheelZoom={true}
                   className="w-full h-full bg-[#0a0f18] opacity-70"
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
                       <Tile
                         url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                       />
                     </BaseLayer>
                   </LayerCtrl>
                 </Map>

                 {/* Stunning Generated Precipitation Overlay */}
                 <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-80 z-0">
                    <img src="/assets/precipitation_map.png" alt="Precipitation Data" className="w-full h-full object-cover scale-105" />
                 </div>

                 {/* Dark Vignette to blend map edges */}
                 <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(4,12,26,1)] z-10" />

                 {/* Mock UI Markers on Map */}
                 <div className="absolute inset-0 pointer-events-none z-20 p-4">
                    {/* Sample Storm Markers */}
                    <div className="absolute top-[35%] left-[25%] flex items-center gap-1.5 bg-black/60 backdrop-blur-sm border border-white/10 p-1.5 rounded-lg shadow-lg">
                       <CloudLightning className="w-4 h-4 text-purple-400 animate-pulse" />
                       <div>
                          <div className="text-[7px] text-white font-bold leading-none mb-0.5">TS ERNESTO</div>
                          <div className="text-[6px] text-[#8F9FB3]">90 km/h • Category 1</div>
                       </div>
                    </div>
                    <div className="absolute top-[45%] left-[55%] flex items-center gap-1.5 bg-black/60 backdrop-blur-sm border border-white/10 p-1.5 rounded-lg shadow-lg">
                       <CloudLightning className="w-4 h-4 text-rose-400 animate-pulse" />
                       <div>
                          <div className="text-[7px] text-white font-bold leading-none mb-0.5">TC BIPARJOY</div>
                          <div className="text-[6px] text-[#8F9FB3]">120 km/h • Category 2</div>
                       </div>
                    </div>
                    <div className="absolute top-[40%] right-[10%] flex items-center gap-1.5 bg-black/60 backdrop-blur-sm border border-white/10 p-1.5 rounded-lg shadow-lg">
                       <CloudLightning className="w-4 h-4 text-rose-500 animate-pulse" />
                       <div>
                          <div className="text-[7px] text-white font-bold leading-none mb-0.5">TY KHANUN</div>
                          <div className="text-[6px] text-[#8F9FB3]">140 km/h • Category 3</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* ═══ BOTTOM ROW ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           {/* Peringatan Dini */}
           <div className="bg-[#040C1A] border border-white/5 rounded-xl p-4 flex flex-col">
              <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-white mb-4 border-b border-white/10 pb-3">
                 <AlertOctagon className="w-3.5 h-3.5 text-rose-500" /> PERINGATAN DINI (EARLY WARNING)
              </div>
              <div className="flex-1">
                 <div className="grid grid-cols-12 text-[6px] uppercase tracking-widest text-[#8F9FB3] mb-2 pb-1 border-b border-white/5">
                    <div className="col-span-4">WILAYAH</div>
                    <div className="col-span-3">JENIS</div>
                    <div className="col-span-2">TINGKAT</div>
                    <div className="col-span-3 text-right">STATUS</div>
                 </div>
                 <div className="space-y-2.5">
                    {[
                      { w: "Kerala, India", j: "Banjir Bandang", t: "Tinggi", tc: "text-rose-500", st: "Aktif", stc: "text-rose-500" },
                      { w: "Mindanao, PH", j: "Badai Tropis", t: "Tinggi", tc: "text-rose-500", st: "Aktif", stc: "text-rose-500" },
                      { w: "Yogyakarta, ID", j: "Hujan Lebat", t: "Sedang", tc: "text-amber-500", st: "Waspada", stc: "text-amber-500" },
                      { w: "Chiang Rai, TH", j: "Banjir", t: "Sedang", tc: "text-amber-500", st: "Waspada", stc: "text-amber-500" },
                      { w: "Lombok, ID", j: "Gelombang", t: "Sedang", tc: "text-amber-500", st: "Waspada", stc: "text-amber-500" },
                    ].map((row, i) => (
                      <div key={i} className="grid grid-cols-12 text-[8px] items-center">
                         <div className="col-span-4 text-white truncate pr-2">{row.w}</div>
                         <div className="col-span-3 text-[#8F9FB3] truncate">{row.j}</div>
                         <div className={`col-span-2 ${row.tc} font-bold`}>{row.t}</div>
                         <div className={`col-span-3 text-right flex items-center justify-end gap-1 ${row.stc} font-bold`}>
                           <div className={`w-1.5 h-1.5 rounded-full bg-current ${row.st === 'Aktif' ? 'animate-pulse' : ''}`} /> {row.st}
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
              <button className="w-full mt-4 py-2 border border-white/10 rounded text-[7px] tracking-widest uppercase hover:bg-white/5 transition-colors text-indigo-300">
                 LIHAT SEMUA PERINGATAN
              </button>
           </div>

           {/* Data Real-Time */}
           <div className="bg-[#040C1A] border border-white/5 rounded-xl p-4 flex flex-col">
              <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-white mb-4 border-b border-white/10 pb-3">
                 <Clock className="w-3.5 h-3.5 text-indigo-400" /> DATA REAL-TIME (GLOBAL)
              </div>
              <div className="space-y-4 flex-1">
                 {[
                   { l: "Curah Hujan (Rata-rata)", v: "2.48 mm/h", i: Droplets, color: "text-[#00aaff]" },
                   { l: "Kelembapan Udara", v: "78%", i: Waves, color: "text-blue-300" },
                   { l: "Tekanan Udara", v: "1011 hPa", i: Activity, color: "text-indigo-400" },
                   { l: "Kecepatan Angin (Rata-rata)", v: "26 km/h", i: Wind, color: "text-emerald-400" },
                   { l: "Arah Angin Dominan", v: "Barat Daya", i: Compass, color: "text-amber-400" },
                   { l: "Indeks UV Global", v: "5 (Sedang)", i: Sun, color: "text-rose-400" },
                 ].map((x, i) => (
                   <div key={i} className="flex justify-between items-center text-[9px]">
                      <div className="flex items-center gap-2 text-[#8F9FB3]"><x.i className={`w-3.5 h-3.5 ${x.color}`} /> {x.l}</div>
                      <div className={`font-mono font-bold ${x.v.includes('Sedang') ? 'text-rose-400' : 'text-white'}`}>{x.v}</div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Kualitas Udara */}
           <div className="bg-[#040C1A] border border-white/5 rounded-xl p-4 flex flex-col">
              <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-white mb-4 border-b border-white/10 pb-3">
                 <Wind className="w-3.5 h-3.5 text-indigo-400" /> KUALITAS UDARA (AQI)
              </div>
              <div className="space-y-4 flex-1">
                 {[
                   { c: "New Delhi, India", v: 156, st: "Tidak Sehat", color: "text-rose-500", bg: "bg-rose-500" },
                   { c: "Beijing, China", v: 89, st: "Sedang", color: "text-amber-500", bg: "bg-amber-500" },
                   { c: "Jakarta, Indonesia", v: 62, st: "Sedang", color: "text-amber-500", bg: "bg-amber-500" },
                   { c: "Los Angeles, USA", v: 45, st: "Baik", color: "text-emerald-500", bg: "bg-emerald-500" },
                   { c: "London, UK", v: 32, st: "Baik", color: "text-emerald-500", bg: "bg-emerald-500" },
                 ].map((x, i) => (
                   <div key={i} className="flex justify-between items-center text-[9px]">
                      <div className="flex items-center gap-2 text-[#8F9FB3]">
                         <div className={`w-2 h-2 rounded-full ${x.bg}`} /> {x.c}
                      </div>
                      <div className="flex items-center gap-3">
                         <span className={`font-mono font-bold ${x.color}`}>{x.v}</span>
                         <span className={`text-[7px] ${x.color} uppercase tracking-widest w-12 text-right`}>{x.st}</span>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-4 py-2 border border-white/10 rounded text-[7px] tracking-widest uppercase hover:bg-white/5 transition-colors text-indigo-300">
                 LIHAT PETA KUALITAS UDARA
              </button>
           </div>

           {/* Fenomena Atmosfer */}
           <div className="bg-[#040C1A] border border-white/5 rounded-xl p-4 flex flex-col">
              <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-white mb-4 border-b border-white/10 pb-3">
                 <Layers className="w-3.5 h-3.5 text-indigo-400" /> FENOMENA ATMOSFER
              </div>
              <div className="space-y-4 flex-1">
                 {[
                   { l: "MJO Phase", v: "Phase 4 (Active)", i: Activity },
                   { l: "ENSO Status", v: "El Niño (Weak)", i: Waves },
                   { l: "SOI Index", v: "-0.8", i: Activity },
                   { l: "IOD Status", v: "Netral", i: Compass },
                   { l: "Polarisasi Jet Stream", v: "Normal", i: Wind },
                 ].map((x, i) => (
                   <div key={i} className="flex justify-between items-center text-[9px]">
                      <div className="flex items-center gap-2 text-[#8F9FB3]"><x.i className="w-3.5 h-3.5 text-[#8F9FB3]" /> {x.l}</div>
                      <div className="text-white font-mono">{x.v}</div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-4 py-2 border border-white/10 rounded text-[7px] tracking-widest uppercase hover:bg-white/5 transition-colors text-indigo-300">
                 LIHAT ANALISIS LENGKAP
              </button>
           </div>
        </div>

      </div>
    </div>
  )
}
