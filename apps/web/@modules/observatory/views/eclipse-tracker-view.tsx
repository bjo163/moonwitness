"use client"

import { useState, useEffect } from "react"
import { 
  Moon, 
  Sun, 
  Clock, 
  Compass, 
  Globe, 
  Settings, 
  Calendar,
  Activity,
  CheckCircle2,
  Camera,
  MapPin,
  ArrowRight,
  Download,
  AlertTriangle,
  Info,
  Circle,
  Eye,
  ShieldAlert,
  Target,
  FileText,
  BookOpen
} from "lucide-react"

type EclipseData = {
  id: string
  date: string
  type: string
  location: string
  duration: string
  timestamp: number
  magnitude: string
  coverage: string
}

const UPCOMING_ECLIPSES: EclipseData[] = [
  {
    id: "ecl-1",
    date: "AUGUST 12, 2026",
    type: "TOTAL",
    location: "Arctic, Greenland, Iceland, Spain",
    duration: "2m 17s",
    timestamp: new Date("2026-08-12T18:47:32Z").getTime(),
    magnitude: "1.044",
    coverage: "100%"
  }
]

export function EclipseTrackerView() {
  const [dailyData, setDailyData] = useState<any>(null)
  const [now, setNow] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setNow(Date.now())
    const interval = setInterval(() => setNow(Date.now()), 1000)
    
    const fetchDaily = async () => {
      try {
        const res = await fetch("/api/daily")
        const json = await res.json()
        setDailyData(json)
      } catch (e) {
        console.error("Failed to fetch daily data", e)
      }
    }
    fetchDaily()
    
    return () => clearInterval(interval)
  }, [])

  if (!isMounted) return <div className="min-h-screen bg-[#020813] flex items-center justify-center text-indigo-500 font-mono text-sm tracking-widest">INITIALIZING ORBITAL RADAR...</div>

  const nextEclipse = UPCOMING_ECLIPSES[0]
  const timeDiff = Math.max(0, nextEclipse.timestamp - now)
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((timeDiff / 1000 / 60) % 60)
  const seconds = Math.floor((timeDiff / 1000) % 60)

  return (
    <div className="bg-[#020813] text-[#8F9FB3] font-sans min-h-screen p-4 selection:bg-indigo-500/30">
      <div className="max-w-[1400px] mx-auto space-y-4">
        
        {/* ═══ HEADER BAR ═══ */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                 <Settings className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-white font-bold tracking-widest uppercase text-lg">
                  ECLIPSE TRACKER (KUSUF/KHUSUF RADAR)
                </h1>
                <p className="text-[10px] mt-1 text-[#8F9FB3]">
                  Sistem pemantauan gerhana matahari dan bulan berbasis data NASA. 
                  Modul ini mendeteksi anomali cahaya bintang dan memberikan rekomendasi waktu shalat gerhana (Kusuf/Khusuf).
                </p>
              </div>
           </div>
           <div className="flex items-center gap-6 shrink-0">
             <div className="text-right">
                <div className="text-[8px] uppercase tracking-widest text-[#8F9FB3] mb-1">OPERATION MODE</div>
                <div className="text-white text-[10px] font-bold uppercase tracking-widest">ORBITAL-ALIGNMENT</div>
             </div>
             <div className="text-right">
                <div className="text-[8px] uppercase tracking-widest text-[#8F9FB3] mb-1">SYSTEM STATUS</div>
                <div className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest flex items-center justify-end gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   ONLINE
                </div>
             </div>
           </div>
        </div>

        {/* ═══ TOP ROW: 12-COL GRID ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
           
           {/* LEFT: Current Eclipse Block (Col 1-4) */}
           <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-[#040C1A] border border-white/5 rounded-xl p-5 flex-1 relative overflow-hidden">
                 <div className="flex items-center gap-2 text-indigo-400 text-[9px] font-bold tracking-widest uppercase mb-4">
                   <Activity className="w-3.5 h-3.5" /> CURRENT ECLIPSE 
                   <span className="text-emerald-400 flex items-center gap-1 ml-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> LIVE</span>
                 </div>
                 
                 <div className="flex items-center gap-4 mb-6 mt-6 relative z-10">
                    <div className="w-36 h-36 shrink-0 relative flex items-center justify-center -ml-4">
                       <div className="absolute inset-0 bg-indigo-500/10 blur-2xl rounded-full" />
                       <img 
                         src="/assets/eclipse_total.png" 
                         alt="Eclipse" 
                         className="w-full h-full object-cover mix-blend-screen" 
                         style={{ 
                           maskImage: 'radial-gradient(circle, black 50%, transparent 75%)', 
                           WebkitMaskImage: 'radial-gradient(circle, black 50%, transparent 75%)' 
                         }} 
                       />
                    </div>
                    <div className="relative z-20">
                       <div className="bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-[8px] font-bold tracking-widest uppercase px-2 py-0.5 rounded w-max mb-2">
                         TOTAL SOLAR ECLIPSE
                       </div>
                       <h2 className="text-2xl font-black text-white tracking-wider leading-tight">{nextEclipse.date}</h2>
                       <div className="text-xs text-white font-mono mt-1 mb-2">18:47:32 UTC+0</div>
                       <div className="flex items-center gap-1 text-[9px] text-emerald-400 uppercase tracking-widest leading-snug">
                          <MapPin className="w-3 h-3 shrink-0" /> {nextEclipse.location}
                       </div>
                    </div>
                 </div>

                 {/* Countdown */}
                 <div className="flex gap-2 mb-6 relative z-10">
                    {[
                      { val: days.toString().padStart(2, '0'), label: "DAYS" },
                      { val: hours.toString().padStart(2, '0'), label: "HOURS" },
                      { val: minutes.toString().padStart(2, '0'), label: "MINS" },
                      { val: seconds.toString().padStart(2, '0'), label: "SECS" }
                    ].map(t => (
                      <div key={t.label} className="bg-black/40 border border-white/10 rounded w-14 py-2 flex flex-col items-center flex-1">
                         <span className="text-base font-mono font-bold text-white">{t.val}</span>
                         <span className="text-[6px] text-[#8F9FB3] tracking-widest uppercase mt-0.5">{t.label}</span>
                      </div>
                    ))}
                 </div>

                 {/* Stats */}
                 <div className="grid grid-cols-4 gap-2 text-center border-t border-white/5 pt-4 mb-4 relative z-10">
                    <div>
                      <div className="text-[7px] uppercase tracking-widest text-[#8F9FB3] mb-1">MAGNITUDE</div>
                      <div className="text-white font-mono font-bold text-xs">{nextEclipse.magnitude}</div>
                    </div>
                    <div>
                      <div className="text-[7px] uppercase tracking-widest text-[#8F9FB3] mb-1">MAX COVERAGE</div>
                      <div className="text-emerald-400 font-mono font-bold text-xs">{nextEclipse.coverage}</div>
                    </div>
                    <div>
                      <div className="text-[7px] uppercase tracking-widest text-[#8F9FB3] mb-1">DURATION</div>
                      <div className="text-white font-mono font-bold text-xs">{nextEclipse.duration}</div>
                    </div>
                    <div>
                      <div className="text-[7px] uppercase tracking-widest text-[#8F9FB3] mb-1">TYPE</div>
                      <div className="text-indigo-400 font-bold text-xs uppercase">{nextEclipse.type}</div>
                    </div>
                 </div>

                 <div className="bg-indigo-900/20 border border-indigo-500/30 rounded p-3 relative z-10 mt-auto">
                    <div className="flex items-center gap-2 text-white font-bold text-[9px] uppercase tracking-widest mb-1">
                       <ShieldAlert className="w-3 h-3 text-indigo-400" /> PERSIAPAN SHALAT KUSUF (GERHANA)
                    </div>
                    <p className="text-[9px] text-indigo-200/70 leading-relaxed">
                       Gerhana matahari total akan segera melintasi area yang ditentukan. Anjuran kuat untuk melaksanakan shalat gerhana dan memperbanyak istighfar saat fenomena berlangsung.
                    </p>
                 </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold">
                 <div className="flex items-center gap-2 text-white shrink-0 mr-2">
                    <Activity className="w-3 h-3 text-indigo-400" /> ECLIPSE TYPE COMPARISON
                 </div>
                 <button className="flex-1 py-2 border-b-2 border-indigo-500 text-indigo-400 text-center">SOLAR ECLIPSE</button>
                 <button className="flex-1 py-2 border-b-2 border-transparent text-[#8F9FB3] hover:text-white transition-colors text-center">LUNAR ECLIPSE</button>
              </div>
           </div>

           {/* CENTER: Summary & Map (Col 5-9) */}
           <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-[#040C1A] border border-white/5 rounded-xl p-5">
                 <div className="text-[9px] font-bold tracking-widest uppercase text-white mb-5">ECLIPSE SUMMARY</div>
                 <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="flex items-center gap-2">
                       <Sun className="w-6 h-6 text-amber-500" />
                       <div>
                         <div className="text-[7px] uppercase tracking-widest text-[#8F9FB3]">EVENT TYPE</div>
                         <div className="text-[10px] text-white font-bold leading-tight mt-0.5">Total Solar Eclipse</div>
                       </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <Compass className="w-6 h-6 text-indigo-400" />
                       <div>
                         <div className="text-[7px] uppercase tracking-widest text-[#8F9FB3]">NODE</div>
                         <div className="text-[10px] text-white font-bold mt-0.5">Descending</div>
                       </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <BookOpen className="w-6 h-6 text-indigo-400" />
                       <div>
                         <div className="text-[7px] uppercase tracking-widest text-[#8F9FB3]">SAROS SERIES</div>
                         <div className="text-[10px] text-white font-bold mt-0.5">137</div>
                       </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <Activity className="w-6 h-6 text-purple-400" />
                       <div>
                         <div className="text-[7px] uppercase tracking-widest text-[#8F9FB3]">GAMMA</div>
                         <div className="text-[10px] text-white font-bold mt-0.5">0.3581</div>
                       </div>
                    </div>
                 </div>

                 {/* Timeline */}
                 <div className="relative px-2 mb-2">
                    <div className="absolute top-[9px] left-6 right-6 h-px bg-white/10 z-0" />
                    <div className="relative z-10 flex justify-between text-center">
                       {[
                         { phase: "P1", name: "Partial Start", time: "16:43 UTC" },
                         { phase: "U1", name: "Totality Begin", time: "18:45 UTC" },
                         { phase: "MAX", name: "Maximum Eclipse", time: "18:47 UTC", highlight: true },
                         { phase: "U4", name: "Totality End", time: "18:48 UTC" },
                         { phase: "P4", name: "Partial End", time: "20:49 UTC" }
                       ].map((p, i) => (
                         <div key={i} className="flex flex-col items-center">
                            <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center text-[6px] font-bold mb-2 ${p.highlight ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.8)] ring-4 ring-purple-500/20' : 'bg-[#040C1A] border border-indigo-500/50 text-indigo-400'}`}>
                               {p.phase}
                            </div>
                            <div className={`text-[7px] uppercase tracking-widest leading-tight ${p.highlight ? 'text-purple-400 font-bold' : 'text-[#8F9FB3]'}`}>{p.name}</div>
                            <div className="text-[8px] font-mono text-white/50 mt-0.5">{p.time}</div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Visibility Map */}
              <div className="bg-[#040C1A] border border-white/5 rounded-xl p-5 flex-1 flex flex-col">
                 <div className="text-[9px] font-bold tracking-widest uppercase text-white mb-4">VISIBILITY MAP</div>
                 <div className="flex-1 relative border border-white/5 rounded-lg overflow-hidden bg-black flex items-center justify-center min-h-[160px] mb-4">
                    <div className="absolute inset-0 opacity-40 mix-blend-screen" style={{ backgroundImage: 'url("/assets/world-map.svg")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                    <div className="absolute w-[120%] h-16 bg-purple-500/20 rotate-[18deg] blur-xl" />
                    <div className="absolute w-[120%] h-1 bg-purple-500/80 rotate-[18deg] shadow-[0_0_15px_rgba(168,85,247,1)]" />
                    
                    <div className="absolute right-3 top-3 bg-black/80 backdrop-blur border border-white/10 p-3 rounded text-[6px] uppercase tracking-widest space-y-2">
                       <div className="flex items-center gap-2"><div className="w-2 h-2 bg-purple-500" /> Path of Totality</div>
                       <div className="flex items-center gap-2"><div className="w-2 h-2 bg-indigo-500/60" /> {">"} 90% Visibility</div>
                       <div className="flex items-center gap-2"><div className="w-2 h-2 bg-indigo-500/30" /> 50% - 90% Visibility</div>
                       <div className="flex items-center gap-2"><div className="w-2 h-2 bg-indigo-500/10" /> {"<"} 50% Visibility</div>
                       <div className="flex items-center gap-2"><div className="w-2 h-2 border border-white/20" /> Not Visible</div>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-4 gap-2">
                    <div className="flex gap-2 items-start">
                       <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                       <div>
                         <div className="text-[6px] uppercase tracking-widest text-[#8F9FB3]">BEST VIEW</div>
                         <div className="text-[9px] text-white font-bold leading-tight mt-0.5">Greenland</div>
                         <div className="text-[7px] text-emerald-400 mt-0.5">100% Totality</div>
                       </div>
                    </div>
                    <div className="flex gap-2 items-start">
                       <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                       <div>
                         <div className="text-[6px] uppercase tracking-widest text-[#8F9FB3]">DURATION (MAX)</div>
                         <div className="text-[10px] text-white font-mono mt-0.5">2m 17s</div>
                       </div>
                    </div>
                    <div className="flex gap-2 items-start">
                       <Target className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                       <div>
                         <div className="text-[6px] uppercase tracking-widest text-[#8F9FB3]">ELEVATION (MAX)</div>
                         <div className="text-[10px] text-white font-mono mt-0.5">63.4°</div>
                       </div>
                    </div>
                    <div className="flex gap-2 items-start">
                       <Sun className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                       <div>
                         <div className="text-[6px] uppercase tracking-widest text-[#8F9FB3]">SUN ALTITUDE</div>
                         <div className="text-[10px] text-white font-mono mt-0.5">38.7°</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* RIGHT: Details & Guide (Col 10-12) */}
           <div className="lg:col-span-3 flex flex-col gap-4">
              <div className="bg-[#040C1A] border border-white/5 rounded-xl p-5 flex-1">
                 <div className="text-[9px] font-bold tracking-widest uppercase text-white mb-5">ECLIPSE DETAILS</div>
                 <div className="space-y-3">
                   {[
                     { label: "Date", val: "August 12, 2026", icon: Calendar },
                     { label: "Hijri Date", val: "29 Safar 1448 H", icon: Moon },
                     { label: "Type", val: "Total Solar Eclipse", icon: Circle },
                     { label: "Saros Series", val: "137 (Member 23 of 72)", icon: Activity },
                     { label: "Path Width", val: "258 km", icon: Target },
                     { label: "Shadow Speed", val: "1,863 km/h", icon: Globe },
                     { label: "Moon Angular Size", val: "31.6'", icon: Moon },
                     { label: "Sun Angular Size", val: "31.5'", icon: Sun },
                     { label: "Delta T", val: "69.2 s", icon: Clock },
                   ].map((item, i) => (
                     <div key={i} className="flex justify-between items-center text-[10px]">
                       <div className="flex items-center gap-2 text-[#8F9FB3]">
                         <item.icon className="w-3 h-3" />
                         {item.label}
                       </div>
                       <div className="text-white font-mono text-[9px]">{item.val}</div>
                     </div>
                   ))}
                 </div>
              </div>
              
              <div className="bg-[#040C1A] border border-white/5 rounded-xl p-5">
                 <div className="text-[9px] font-bold tracking-widest uppercase text-white mb-4 border-b border-white/10 pb-3">SHALAT KUSUF GUIDE</div>
                 <div className="space-y-3">
                   <div className="flex justify-between items-center text-[8px] uppercase tracking-widest font-bold">
                     <div className="flex items-center gap-2 text-amber-500"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Mulai Gerhana (P1)</div>
                     <div className="text-white font-mono text-[9px]">16:43 UTC</div>
                   </div>
                   <div className="flex justify-between items-center text-[8px] uppercase tracking-widest font-bold bg-indigo-500/10 p-2 rounded border border-indigo-500/20">
                     <div className="flex items-center gap-2 text-indigo-300"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Disarankan Mulai Shalat</div>
                     <div className="text-white font-mono text-[9px]">18:30 UTC</div>
                   </div>
                   <div className="flex justify-between items-center text-[8px] uppercase tracking-widest font-bold">
                     <div className="flex items-center gap-2 text-purple-400"><div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" /> Puncak Gerhana (MAX)</div>
                     <div className="text-white font-mono text-[9px]">18:47 UTC</div>
                   </div>
                   <div className="flex justify-between items-center text-[8px] uppercase tracking-widest font-bold">
                     <div className="flex items-center gap-2 text-emerald-400"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Akhir Totalitas (U4)</div>
                     <div className="text-white font-mono text-[9px]">18:48 UTC</div>
                   </div>
                   <div className="flex justify-between items-center text-[8px] uppercase tracking-widest font-bold">
                     <div className="flex items-center gap-2 text-[#8F9FB3]"><div className="w-1.5 h-1.5 rounded-full bg-[#8F9FB3]" /> Akhir Gerhana (P4)</div>
                     <div className="text-white font-mono text-[9px]">20:49 UTC</div>
                   </div>
                 </div>
                 <button className="w-full mt-5 py-2 border border-white/10 rounded text-[7px] tracking-widest uppercase hover:bg-white/5 transition-colors flex items-center justify-center gap-2 text-indigo-300">
                    <BookOpen className="w-3 h-3" /> LIHAT PANDUAN LENGKAP
                 </button>
              </div>
           </div>
        </div>

        {/* ═══ MIDDLE ROW: 4 COLS ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
           {/* Projections */}
           <div className="md:col-span-3 bg-[#040C1A] border border-white/5 rounded-xl p-5 flex flex-col">
              <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-white mb-5">
                 <Calendar className="w-3.5 h-3.5 text-indigo-400" /> 10-YEAR ORBITAL PROJECTIONS
              </div>
              <div className="space-y-4 flex-1">
                 <div className="grid grid-cols-12 gap-2 text-[6px] uppercase tracking-widest text-[#8F9FB3] border-b border-white/10 pb-2">
                    <div className="col-span-4">DATE</div>
                    <div className="col-span-4">TYPE</div>
                    <div className="col-span-2 text-center">MAG.</div>
                    <div className="col-span-2 text-right">MAX DUR.</div>
                 </div>
                 {[
                   { d: "Feb 6, 2027", t: "Annular Solar", m: "0.964", md: "7m 51s", hl: false },
                   { d: "Aug 2, 2027", t: "Total Solar", m: "1.056", md: "6m 23s", hl: true },
                   { d: "Jan 26, 2028", t: "Annular Solar", m: "0.937", md: "10m 27s", hl: false },
                   { d: "Jan 22, 2028", t: "Total Solar", m: "1.104", md: "5m 10s", hl: true },
                   { d: "Jun 21, 2030", t: "Annular Solar", m: "0.941", md: "7m 06s", hl: false }
                 ].map((x, i) => (
                   <div key={i} className={`grid grid-cols-12 gap-2 text-[8px] items-center font-bold ${x.hl ? 'text-amber-400' : 'text-white'}`}>
                      <div className="col-span-4 font-mono truncate">{x.d}</div>
                      <div className="col-span-4 truncate">{x.t}</div>
                      <div className="col-span-2 text-center font-mono">{x.m}</div>
                      <div className="col-span-2 text-right font-mono">{x.md}</div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-4 text-[7px] uppercase tracking-widest text-indigo-400 hover:text-white transition-colors flex items-center justify-center gap-1 border-t border-white/5 pt-4">
                 LIHAT PROYEKSI 10 TAHUN LENGKAP <ArrowRight className="w-3 h-3" />
              </button>
           </div>

           {/* Astro Data */}
           <div className="md:col-span-3 bg-[#040C1A] border border-white/5 rounded-xl p-5 flex flex-col">
              <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-white mb-5">
                 <Activity className="w-3.5 h-3.5 text-indigo-400" /> ASTRO DATA (REAL-TIME)
              </div>
              <div className="space-y-4 flex-1">
                 {[
                   { l: "Solar Flux (F10.7)", v: "143 sfu", i: Sun },
                   { l: "Kp Index", v: "1.33 (Quiet)", i: Activity },
                   { l: "Sunspot Number", v: "78", i: Circle },
                   { l: "Solar Wind Speed", v: "402 km/s", i: ArrowRight },
                   { l: "IMF Bz", v: "-1.8 nT", i: Compass },
                   { l: "Geomagnetic Field", v: "Stable", i: Globe },
                 ].map((x, i) => (
                   <div key={i} className="flex justify-between items-center text-[9px]">
                      <div className="flex items-center gap-2 text-[#8F9FB3]"><x.i className="w-3.5 h-3.5" /> {x.l}</div>
                      <div className="text-white font-mono font-bold">{x.v}</div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Recommended Actions */}
           <div className="md:col-span-3 bg-[#040C1A] border border-white/5 rounded-xl p-5 flex flex-col">
              <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-white mb-5">
                 <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" /> RECOMMENDED ACTIONS
              </div>
              <div className="space-y-3 flex-1">
                 {[
                   { text: "Gunakan kacamata khusus gerhana", checked: true },
                   { text: "Hindari melihat matahari langsung", checked: true },
                   { text: "Siapkan tempat shalat yang nyaman", checked: true },
                   { text: "Perbanyak dzikir & istighfar", checked: true },
                   { text: "Catat pengamatan & dokumentasikan", checked: false },
                 ].map((x, i) => (
                   <div key={i} className="flex items-start gap-2 text-[9px] text-white">
                      <div className={`mt-0.5 w-3 h-3 rounded-full flex items-center justify-center shrink-0 border ${x.checked ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-white/20 text-transparent'}`}>
                        {x.checked && <CheckCircle2 className="w-2.5 h-2.5" />}
                      </div>
                      <span className={x.checked ? 'opacity-100 leading-snug' : 'opacity-50 leading-snug'}>{x.text}</span>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-4 py-2 border border-white/10 rounded text-[7px] tracking-widest uppercase hover:bg-white/5 transition-colors flex items-center justify-center gap-2 text-white">
                 <Download className="w-3 h-3" /> DOWNLOAD CHECKLIST
              </button>
           </div>

           {/* Science Insight */}
           <div className="md:col-span-3 bg-[#040C1A] border border-white/5 rounded-xl p-5 flex flex-col relative overflow-hidden">
              <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-white mb-4 z-10 relative">
                 <Info className="w-3.5 h-3.5 text-indigo-400" /> SCIENCE & INSIGHT
              </div>
              <p className="text-[9px] leading-relaxed text-[#8F9FB3] z-10 relative">
                 Gerhana matahari total terjadi ketika bulan berada di antara bumi dan matahari, menutupi seluruh permukaan matahari. Fenomena ini menjadi momen berharga untuk mempelajari korona matahari dan dinamika tata surya.
              </p>
              <button className="mt-auto text-[7px] uppercase tracking-widest text-indigo-400 hover:text-white transition-colors flex items-center gap-1 z-10 relative w-max">
                 PELAJARI LEBIH LANJUT <ArrowRight className="w-3 h-3" />
              </button>
              <div className="absolute -right-8 -bottom-8 w-40 h-40 opacity-40 mix-blend-screen pointer-events-none z-0">
                 <img 
                   src="/assets/eclipse_total.png" 
                   alt="Eclipse" 
                   className="w-full h-full object-cover" 
                   style={{ 
                     maskImage: 'radial-gradient(circle, black 50%, transparent 75%)', 
                     WebkitMaskImage: 'radial-gradient(circle, black 50%, transparent 75%)' 
                   }} 
                 />
              </div>
           </div>
        </div>

        {/* ═══ BOTTOM ROW: SCRIPTURES & COMMUNITY ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
           {/* Ayat */}
           <div className="md:col-span-3 bg-[#040C1A] border border-white/5 rounded-xl p-5 flex flex-col">
              <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-white mb-4">
                 <Moon className="w-3.5 h-3.5 text-indigo-400" /> AYAT TERKAIT
              </div>
              <div className="text-right text-xl text-white mb-3 font-arabic leading-[1.8] drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" dir="rtl">
                 {dailyData?.ayah?.textArabic || "وَالشَّمْسِ وَضُحَاهَا ۝ وَالْقَمَرِ إِذَا تَلَاهَا"}
              </div>
              <div className="text-[8px] text-[#8F9FB3] italic leading-relaxed mb-2">
                 "{dailyData?.ayah?.translationId || "Demi matahari dan sinarnya pada pagi hari, dan demi bulan apabila mengiringinya."}"
              </div>
              <div className="text-[7px] text-emerald-400 font-bold uppercase tracking-widest mb-4">
                 (QS. {dailyData?.ayah?.surahName || "Asy-Syams"}: {dailyData?.ayah?.ayahNumber || "1-2"})
              </div>
              <button className="mt-auto text-[7px] uppercase tracking-widest text-indigo-400 hover:text-white transition-colors flex items-center gap-1 justify-center border-t border-white/5 pt-4">
                 <BookOpen className="w-3 h-3" /> LIHAT SEMUA AYAT
              </button>
           </div>

           {/* Hadis */}
           <div className="md:col-span-3 bg-[#040C1A] border border-white/5 rounded-xl p-5 flex flex-col">
              <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-white mb-4">
                 <FileText className="w-3.5 h-3.5 text-indigo-400" /> HADIS TERKAIT
              </div>
              <div className="text-[8px] text-white leading-relaxed italic mb-3">
                 "{dailyData?.hadith?.textId || "Sesungguhnya matahari dan bulan adalah dua tanda di antara tanda-tanda (kebesaran) Allah. Keduanya tidak mengalami gerhana karena kematian atau kelahiran seseorang. Maka apabila kamu melihat gerhana, berdoalah kepada Allah, bertakbir, shalat, dan bersedekahlah."}"
              </div>
              <div className="text-[7px] text-[#8F9FB3] uppercase tracking-widest mb-4">
                 ({dailyData?.hadith?.bookName || "HR. Bukhari & Muslim"})
              </div>
              <button className="mt-auto text-[7px] uppercase tracking-widest text-indigo-400 hover:text-white transition-colors flex items-center gap-1 justify-center border-t border-white/5 pt-4">
                 <BookOpen className="w-3 h-3" /> LIHAT SEMUA HADIS
              </button>
           </div>

           {/* Gallery */}
           <div className="md:col-span-3 bg-[#040C1A] border border-white/5 rounded-xl p-5 flex flex-col">
              <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-white mb-4">
                 <Camera className="w-3.5 h-3.5 text-indigo-400" /> DOCUMENTATION GALLERY
              </div>
              <div className="flex gap-2 flex-1 items-center">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-full aspect-square rounded bg-black/50 border border-white/10 overflow-hidden relative group cursor-pointer">
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                         <Eye className="w-4 h-4 text-white" />
                      </div>
                      <img 
                        src="/assets/eclipse_total.png" 
                        alt="Gallery" 
                        className="w-full h-full object-cover mix-blend-screen opacity-70 scale-125" 
                        style={{ 
                          maskImage: 'radial-gradient(circle, black 50%, transparent 75%)', 
                          WebkitMaskImage: 'radial-gradient(circle, black 50%, transparent 75%)' 
                        }} 
                      />
                   </div>
                 ))}
                 <div className="w-full aspect-square rounded bg-indigo-900/20 border border-indigo-500/30 flex items-center justify-center cursor-pointer hover:bg-indigo-900/40 transition-colors">
                    <span className="text-white font-mono text-xs">+18</span>
                 </div>
              </div>
              <button className="mt-4 text-[7px] uppercase tracking-widest text-indigo-400 hover:text-white transition-colors flex items-center gap-1 justify-center border-t border-white/5 pt-4">
                 <Camera className="w-3 h-3" /> LIHAT GALERI LENGKAP
              </button>
           </div>

           {/* Community */}
           <div className="md:col-span-3 bg-[#040C1A] border border-white/5 rounded-xl p-5 flex flex-col">
              <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-white mb-4">
                 <Globe className="w-3.5 h-3.5 text-indigo-400" /> COMMUNITY OBSERVATION
              </div>
              <div className="flex-1 flex items-center justify-around text-center h-full">
                 <div>
                    <div className="text-3xl font-mono font-bold text-white mb-1">128</div>
                    <div className="text-[6px] uppercase tracking-widest text-[#8F9FB3]">OBSERVERS ONLINE</div>
                 </div>
                 <div className="w-px h-10 bg-white/10" />
                 <div>
                    <div className="text-3xl font-mono font-bold text-emerald-400 mb-1">306</div>
                    <div className="text-[6px] uppercase tracking-widest text-[#8F9FB3]">REPORTS TODAY</div>
                 </div>
              </div>
              <button className="mt-4 text-[7px] uppercase tracking-widest text-indigo-400 hover:text-white transition-colors flex items-center gap-1 justify-center border-t border-white/5 pt-4">
                 <MapPin className="w-3 h-3" /> LIHAT PETA OBSERVASI
              </button>
           </div>
        </div>

      </div>
    </div>
  )
}
