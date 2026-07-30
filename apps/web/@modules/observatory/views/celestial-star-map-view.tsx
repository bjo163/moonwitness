"use client"

import { useState, useEffect } from "react"
import { 
  Crosshair, 
  MapPin, 
  Clock, 
  Settings, 
  Globe, 
  Activity, 
  Compass, 
  Telescope,
  Rocket,
  CircleDot,
  Radio,
  Maximize2,
  Calendar,
  AlertTriangle,
  Sun,
  Moon,
  ChevronRight,
  Database,
  CloudLightning
} from "lucide-react"

export function CelestialStarMapView() {
  const [mounted, setMounted] = useState(false)
  const [now, setNow] = useState(new Date())
  
  // Interactive States
  const [activeTab, setActiveTab] = useState("ALL")
  const [viewMode, setViewMode] = useState("3D SPHERE")
  const [starMag, setStarMag] = useState(5) // 1 to 5
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  
  const [controls, setControls] = useState({
    autoRotate: true,
    showConstellations: true,
    showOrbits: true,
    showGrid: true
  })

  // Simulated Coordinates
  const [raOffset, setRaOffset] = useState(0)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setNow(new Date())
      if (controls.autoRotate) {
        setRaOffset(prev => prev + 0.01)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [controls.autoRotate])

  if (!mounted) return <div className="min-h-screen bg-[#020813] flex items-center justify-center text-indigo-500 font-mono text-sm tracking-widest">INITIALIZING CELESTIAL ENGINE...</div>

  // Format Time
  const timeString = now.toISOString().split("T")[1].split(".")[0]
  const localTimeString = now.toTimeString().split(" ")[0]
  
  // Simulated RA change
  const baseRaSeconds = 40.24 + raOffset
  const raSeconds = (baseRaSeconds % 60).toFixed(2).padStart(5, '0')
  const raMinutes = (35 + Math.floor(baseRaSeconds / 60)) % 60
  const raHours = (8 + Math.floor((35 + Math.floor(baseRaSeconds / 60)) / 60)) % 24

  const toggleControl = (key: keyof typeof controls) => {
    setControls(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="bg-[#020813] text-[#8F9FB3] font-sans min-h-screen p-4 selection:bg-indigo-500/30 flex flex-col">
      <div className="max-w-[1800px] mx-auto space-y-4 flex-1 flex flex-col">
        
        {/* ═══ HEADER BAR ═══ */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4 shrink-0">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                 <Globe className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-white font-bold tracking-widest uppercase text-lg">
                  CELESTIAL STAR MAP (PLANETARIUM)
                </h1>
                <p className="text-[10px] mt-1 text-[#8F9FB3]">
                  Simulasi interaktif rotasi bola langit (Celestial Sphere). Melacak anomali konstelasi, pulsar, dan koordinat orbit benda-benda langit secara mekanis.
                </p>
              </div>
           </div>
           <div className="flex items-center gap-6 shrink-0">
             <div className="text-right border-r border-white/10 pr-6">
                <div className="text-[8px] uppercase tracking-widest text-[#8F9FB3] mb-1">OPERATION MODE</div>
                <div className="text-white text-[10px] font-bold uppercase tracking-widest">ASTRO-NAVIGATION</div>
             </div>
             <div className="text-right border-r border-white/10 pr-6">
                <div className="text-[8px] uppercase tracking-widest text-[#8F9FB3] mb-1">SYSTEM STATUS</div>
                <div className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest flex items-center justify-end gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> ONLINE
                </div>
             </div>
             <div className="text-right border-r border-white/10 pr-6">
                <div className="text-[8px] uppercase tracking-widest text-[#8F9FB3] mb-1">DATA SOURCE</div>
                <div className="text-white text-[10px] font-bold uppercase tracking-widest">GAIA DR3 • ESA • NASA</div>
             </div>
             <div className="text-right relative">
                <div className="text-[8px] uppercase tracking-widest text-[#8F9FB3] mb-1">LAST UPDATE</div>
                <div className="text-white text-[10px] font-mono tracking-widest">
                  12 Aug 2026<br/>{timeString} UTC+0
                </div>
             </div>
             <div className="opacity-70 mix-blend-screen -ml-4 pointer-events-none relative w-16 h-16">
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
                <img src="/assets/celestial_sphere.png" alt="Globe" className="w-full h-full object-cover scale-150 relative z-10" />
             </div>
           </div>
        </div>

        {/* ═══ MAIN GRID ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
           
           {/* ◄◄◄ LEFT SIDEBAR (Col 1-3) ◄◄◄ */}
           <div className="lg:col-span-3 flex flex-col gap-4 overflow-y-auto pr-1 custom-scrollbar">
              
              {/* Celestial Coordinates */}
              <div className="bg-[#040C1A] border border-white/5 rounded-xl p-4 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                 <div className="flex justify-between items-center mb-5 relative z-10">
                    <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-white">
                       CELESTIAL COORDINATES
                    </div>
                    <Crosshair className={`w-3.5 h-3.5 text-indigo-400 ${controls.autoRotate ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
                 </div>
                 <div className="space-y-4 relative z-10">
                    <div>
                       <div className="flex items-center gap-2 text-[7px] uppercase tracking-widest text-indigo-400 mb-1">
                          <Compass className="w-2.5 h-2.5" /> RIGHT ASCENSION (RA)
                       </div>
                       <div className="text-white font-mono text-xl tracking-wider">
                          {raHours.toString().padStart(2, '0')}h {raMinutes.toString().padStart(2, '0')}m {raSeconds}s
                       </div>
                    </div>
                    <div>
                       <div className="flex items-center gap-2 text-[7px] uppercase tracking-widest text-indigo-400 mb-1">
                          <Compass className="w-2.5 h-2.5" /> DECLINATION (DEC)
                       </div>
                       <div className="text-white font-mono text-xl tracking-wider">+12° 42' 03.12"</div>
                    </div>
                    <div className="w-full h-px bg-white/5 my-2" />
                    <div>
                       <div className="text-[7px] uppercase tracking-widest text-[#8F9FB3] mb-1">ECLIPTIC LATITUDE</div>
                       <div className="text-white font-mono text-base">+04° 21' 17.45"</div>
                    </div>
                    <div>
                       <div className="text-[7px] uppercase tracking-widest text-[#8F9FB3] mb-1">ECLIPTIC LONGITUDE</div>
                       <div className="text-white font-mono text-base">128° 17' 33.88"</div>
                    </div>
                    <div className="w-full h-px bg-white/5 my-2" />
                    <div className="flex justify-between">
                       <div>
                          <div className="text-[7px] uppercase tracking-widest text-[#8F9FB3] mb-1">GALACTIC l</div>
                          <div className="text-white font-mono text-base">205.81°</div>
                       </div>
                       <div className="text-right">
                          <div className="text-[7px] uppercase tracking-widest text-[#8F9FB3] mb-1">GALACTIC b</div>
                          <div className="text-white font-mono text-base">+25.19°</div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Time & Location */}
              <div className="bg-[#040C1A] border border-white/5 rounded-xl p-4">
                 <div className="text-[9px] font-bold tracking-widest uppercase text-white mb-4">TIME & LOCATION</div>
                 <div className="space-y-3">
                   {[
                     { l: "DATE", v: "12 Aug 2026", i: Calendar },
                     { l: "TIME (UTC)", v: timeString, i: Clock },
                     { l: "LOCAL TIME", v: `${localTimeString} WIB`, i: Clock },
                     { l: "LOCATION", v: "Jakarta, Indonesia", i: MapPin },
                     { l: "LAT / LON", v: "-6.2088° / 106.8456°", i: Globe },
                     { l: "ELEVATION", v: "27 m", i: Crosshair },
                   ].map((item, i) => (
                     <div key={i} className="flex items-center text-[10px]">
                       <div className="flex items-center gap-2 text-[#8F9FB3] w-28 shrink-0">
                         <item.i className="w-3 h-3 text-indigo-500/70" /> {item.l}
                       </div>
                       <div className="text-white font-mono">{item.v}</div>
                     </div>
                   ))}
                 </div>
              </div>

              {/* View Controls */}
              <div className="bg-[#040C1A] border border-white/5 rounded-xl p-4 flex-1">
                 <div className="text-[9px] font-bold tracking-widest uppercase text-white mb-4">VIEW CONTROLS</div>
                 <div className="space-y-3">
                   {[
                     { l: "AUTO ROTATE", key: "autoRotate" },
                     { l: "SHOW CONSTELLATIONS", key: "showConstellations" },
                     { l: "SHOW ORBITS", key: "showOrbits" },
                     { l: "SHOW GRID", key: "showGrid" },
                   ].map((item, i) => {
                     const active = controls[item.key as keyof typeof controls]
                     return (
                       <div key={i} className="flex justify-between items-center text-[10px]">
                         <div className="text-[#8F9FB3] tracking-widest uppercase">{item.l}</div>
                         <button 
                           onClick={() => toggleControl(item.key as keyof typeof controls)}
                           className={`px-2 py-0.5 rounded text-[8px] font-bold transition-colors ${active ? 'bg-[#00aaff]/20 text-[#00aaff] border border-[#00aaff]/30' : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'}`}>
                            {active ? 'ON' : 'OFF'}
                         </button>
                       </div>
                     )
                   })}
                   <div className="flex justify-between items-center text-[10px] pt-1">
                       <div className="text-[#8F9FB3] tracking-widest uppercase">LABELS</div>
                       <button className="px-2 py-0.5 rounded text-[8px] font-bold bg-[#00aaff]/20 text-[#00aaff] border border-[#00aaff]/30 flex items-center gap-1 hover:bg-[#00aaff]/30 transition-colors">
                          MEDIUM <ChevronRight className="w-2.5 h-2.5 rotate-90" />
                       </button>
                   </div>
                 </div>
                 <button 
                   onClick={() => setRaOffset(0)}
                   className="w-full mt-5 py-2 border border-white/10 rounded text-[7px] tracking-widest uppercase hover:bg-white/5 transition-colors text-[#8F9FB3]">
                    RESET VIEW
                 </button>
              </div>

           </div>

           {/* ■■■ CENTER SPHERE (Col 4-9) ■■■ */}
           <div className="lg:col-span-6 bg-[#040C1A] border border-white/5 rounded-xl flex flex-col relative overflow-hidden h-full min-h-[500px]">
              
              {/* Header Tabs */}
              <div className="flex justify-between items-center p-4 relative z-10 border-b border-white/5 bg-black/40 backdrop-blur-sm">
                 <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-white">
                    <Maximize2 className="w-3.5 h-3.5 text-[#00aaff]" /> CELESTIAL SPHERE VIEW
                 </div>
                 <div className="flex gap-1 text-[8px] tracking-widest uppercase font-bold">
                    {["ALL", "STARS", "CONSTELLATIONS", "PLANETS", "DEEP SKY"].map(tab => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1.5 rounded transition-colors ${activeTab === tab ? 'bg-white/10 text-white' : 'text-[#8F9FB3] hover:text-white'}`}>
                        {tab}
                      </button>
                    ))}
                 </div>
              </div>

              {/* The Globe Graphic */}
              <div className="flex-1 relative flex items-center justify-center p-8 z-0">
                 {/* Glow Behind */}
                 <div className="absolute inset-0 bg-[#00aaff]/5 blur-[100px] rounded-full pointer-events-none scale-50" />
                 
                 {/* The 3D Sphere */}
                 <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                   <div 
                     className="w-full h-full relative transition-transform duration-300 ease-out"
                     style={{ transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)` }}
                   >
                     <img 
                       src="/assets/celestial_sphere.png" 
                       alt="Celestial Sphere" 
                       className="w-full h-full object-contain mix-blend-screen drop-shadow-[0_0_30px_rgba(0,170,255,0.3)] transition-opacity duration-500"
                       style={{ 
                         maskImage: 'radial-gradient(circle, black 70%, transparent 100%)', 
                         WebkitMaskImage: 'radial-gradient(circle, black 70%, transparent 100%)',
                         opacity: viewMode === '2D SKY' ? 0.4 : 0.9 
                       }}
                     />
                   </div>
                 </div>

                 {/* North/South/East/West Labels */}
                 <div className="absolute top-4 text-[#00aaff] font-bold font-mono text-sm">N</div>
                 <div className="absolute bottom-4 text-[#00aaff] font-bold font-mono text-sm">S</div>
                 <div className="absolute left-6 text-emerald-400 font-bold font-mono text-sm">E</div>
                 <div className="absolute right-6 text-emerald-400 font-bold font-mono text-sm">W</div>

                 {/* D-Pad Controls (Left) */}
                 <div className="absolute left-6 bottom-16 flex flex-col items-center gap-2 z-10 bg-black/40 backdrop-blur-md p-2 rounded-xl border border-white/10 shadow-lg">
                    <div className="grid grid-cols-3 gap-1">
                       <div/>
                       <button onClick={() => setPan(p => ({ ...p, y: p.y + 20 }))} className="w-6 h-6 border border-white/10 rounded flex items-center justify-center text-[#8F9FB3] hover:bg-[#00aaff]/20 hover:text-[#00aaff] transition-colors"><ChevronRight className="w-3 h-3 -rotate-90" /></button>
                       <div/>
                       <button onClick={() => setPan(p => ({ ...p, x: p.x + 20 }))} className="w-6 h-6 border border-white/10 rounded flex items-center justify-center text-[#8F9FB3] hover:bg-[#00aaff]/20 hover:text-[#00aaff] transition-colors"><ChevronRight className="w-3 h-3 rotate-180" /></button>
                       <button onClick={() => { setPan({x: 0, y: 0}); setZoom(1); toggleControl('autoRotate') }} className="w-6 h-6 border border-white/10 rounded flex items-center justify-center text-[#8F9FB3] hover:bg-[#00aaff]/20 hover:text-[#00aaff] transition-colors">
                          <CircleDot className={`w-3 h-3 ${controls.autoRotate ? 'text-[#00aaff] animate-pulse' : ''}`} />
                       </button>
                       <button onClick={() => setPan(p => ({ ...p, x: p.x - 20 }))} className="w-6 h-6 border border-white/10 rounded flex items-center justify-center text-[#8F9FB3] hover:bg-[#00aaff]/20 hover:text-[#00aaff] transition-colors"><ChevronRight className="w-3 h-3" /></button>
                       <div/>
                       <button onClick={() => setPan(p => ({ ...p, y: p.y - 20 }))} className="w-6 h-6 border border-white/10 rounded flex items-center justify-center text-[#8F9FB3] hover:bg-[#00aaff]/20 hover:text-[#00aaff] transition-colors"><ChevronRight className="w-3 h-3 rotate-90" /></button>
                       <div/>
                    </div>
                    <div className="flex flex-col gap-1 mt-2 w-full">
                       <button onClick={() => setZoom(z => Math.min(z + 0.2, 3))} className="w-full h-6 border border-white/10 rounded flex items-center justify-center text-[#8F9FB3] hover:bg-white/5 active:bg-white/10">+</button>
                       <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))} className="w-full h-6 border border-white/10 rounded flex items-center justify-center text-[#8F9FB3] hover:bg-white/5 active:bg-white/10">-</button>
                    </div>
                 </div>
              </div>

              {/* Bottom Controls */}
              <div className="p-4 border-t border-white/5 bg-black/40 backdrop-blur-sm flex justify-between items-center relative z-10">
                 <div>
                    <div className="text-[7px] font-bold tracking-widest uppercase text-[#8F9FB3] mb-2">STAR MAGNITUDE</div>
                    <div className="flex gap-3 items-center">
                       {[1, 2, 3, 4, 5].map(mag => (
                         <button 
                           key={mag}
                           onClick={() => setStarMag(mag)}
                           className={`rounded-full transition-all hover:scale-150 ${starMag >= mag ? 'bg-white shadow-[0_0_5px_white]' : 'bg-white/20'}`}
                           style={{ width: `${8 - mag}px`, height: `${8 - mag}px` }}
                         />
                       ))}
                       <span className="text-[8px] font-mono text-[#8F9FB3] ml-2">2 3 4 5 6+</span>
                    </div>
                 </div>
                 <div>
                    <div className="text-[7px] font-bold tracking-widest uppercase text-[#8F9FB3] mb-2 text-right">VIEW MODE</div>
                    <div className="flex gap-1 p-0.5 bg-black rounded border border-white/10">
                       <button 
                         onClick={() => setViewMode("3D SPHERE")}
                         className={`px-4 py-1.5 text-[8px] font-bold tracking-widest uppercase rounded transition-colors ${viewMode === '3D SPHERE' ? 'bg-[#00aaff]/20 text-[#00aaff]' : 'text-[#8F9FB3] hover:text-white'}`}>
                          3D SPHERE
                       </button>
                       <button 
                         onClick={() => setViewMode("2D SKY")}
                         className={`px-4 py-1.5 text-[8px] font-bold tracking-widest uppercase rounded transition-colors ${viewMode === '2D SKY' ? 'bg-[#00aaff]/20 text-[#00aaff]' : 'text-[#8F9FB3] hover:text-white'}`}>
                          2D SKY
                       </button>
                    </div>
                 </div>
              </div>

           </div>

           {/* ►►► RIGHT SIDEBAR (Col 10-12) ►►► */}
           <div className="lg:col-span-3 flex flex-col gap-4 overflow-y-auto pl-1 custom-scrollbar">
              
              {/* Tracked Objects */}
              <div className="bg-[#040C1A] border border-white/5 rounded-xl p-4">
                 <div className="flex justify-between items-end mb-4 border-b border-white/10 pb-3">
                    <div className="text-[9px] font-bold tracking-widest uppercase text-white">TRACKED OBJECTS</div>
                    <div className="text-xl font-mono font-bold text-white leading-none">732</div>
                 </div>
                 <div className="space-y-4">
                   {[
                     { n: "ISS (ZARYA)", i: Rocket, c: "text-[#00aaff]", m: "-1.2", a: "32.4°", az: "145.6°", r: "423 km" },
                     { n: "HUBBLE TELESCOPE", i: Telescope, c: "text-indigo-400", m: "1.1", a: "18.7°", az: "201.3°", r: "541 km" },
                     { n: "JUPITER", i: Globe, c: "text-amber-500", m: "-2.6", a: "28.3°", az: "120.7°", r: "6.12 AU" },
                     { n: "SATURN", i: Globe, c: "text-orange-400", m: "0.4", a: "16.1°", az: "210.2°", r: "9.64 AU" },
                     { n: "MARS", i: Globe, c: "text-rose-500", m: "0.8", a: "22.9°", az: "89.4°", r: "2.01 AU" },
                   ].map((x, i) => (
                     <div key={i} className="flex gap-3 items-center group cursor-pointer">
                        <div className={`w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors`}>
                           <x.i className={`w-4 h-4 ${x.c}`} />
                        </div>
                        <div className="flex-1">
                           <div className="text-[9px] font-bold tracking-widest uppercase text-white mb-1.5 group-hover:text-indigo-300 transition-colors">{x.n}</div>
                           <div className="grid grid-cols-4 gap-2 text-[7px] text-[#8F9FB3] uppercase tracking-widest">
                              <div><div className="mb-0.5">MAG</div><div className="text-white font-mono flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-emerald-400"/>{x.m}</div></div>
                              <div><div className="mb-0.5">ALT</div><div className="text-white font-mono">{x.a}</div></div>
                              <div><div className="mb-0.5">AZ</div><div className="text-white font-mono">{x.az}</div></div>
                              <div className="text-right"><div className="mb-0.5">DIST</div><div className="text-white font-mono">{x.r}</div></div>
                           </div>
                        </div>
                     </div>
                   ))}
                 </div>
                 <button className="w-full mt-4 py-2 border-t border-white/10 text-[7px] tracking-widest uppercase hover:text-white transition-colors text-indigo-400 flex justify-center items-center gap-1">
                    VIEW ALL OBJECTS <ChevronRight className="w-3 h-3" />
                 </button>
              </div>

              {/* Upcoming Events */}
              <div className="bg-[#040C1A] border border-white/5 rounded-xl p-4 flex-1">
                 <div className="text-[9px] font-bold tracking-widest uppercase text-white mb-4 border-b border-white/10 pb-3">
                    UPCOMING EVENTS
                 </div>
                 <div className="space-y-4">
                   {[
                     { t: "PERSEID METEOR SHOWER", d: "12-13 Aug 2026", time: "PEAK", c: "text-amber-400", i: CloudLightning },
                     { t: "MOON - JUPITER CONJUNCTION", d: "14 Aug 2026", time: "03:30 UTC", c: "text-white", i: Moon },
                     { t: "MARS OPPOSITION", d: "21 Aug 2026", time: "08:22 UTC", c: "text-rose-500", i: Globe },
                     { t: "NEW MOON", d: "23 Aug 2026", time: "08:06 UTC", c: "text-[#8F9FB3]", i: CircleDot },
                     { t: "SATURN AT OPPOSITION", d: "27 Aug 2026", time: "05:12 UTC", c: "text-orange-400", i: Globe },
                   ].map((x, i) => (
                     <div key={i} className="flex justify-between items-center text-[10px] group cursor-pointer">
                        <div className="flex gap-3 items-center">
                           <x.i className={`w-4 h-4 ${x.c} group-hover:scale-110 transition-transform`} />
                           <div>
                              <div className="text-white font-bold tracking-widest uppercase text-[8px] leading-tight mb-0.5 group-hover:text-indigo-300 transition-colors">{x.t}</div>
                              <div className="text-[7px] text-[#8F9FB3] font-mono">{x.d}</div>
                           </div>
                        </div>
                        <div className="text-white font-mono text-[9px] group-hover:text-indigo-300">{x.time}</div>
                     </div>
                   ))}
                 </div>
                 <button className="w-full mt-5 py-2 border-t border-white/10 text-[7px] tracking-widest uppercase hover:text-white transition-colors text-indigo-400 flex justify-center items-center gap-1">
                    VIEW ALL EVENTS <ChevronRight className="w-3 h-3" />
                 </button>
              </div>
           </div>

        </div>

        {/* ═══ BOTTOM ROW GRID (12 Cols) ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 shrink-0">
           
           {/* Deep Sky */}
           <div className="md:col-span-3 bg-[#040C1A] border border-white/5 rounded-xl p-4 flex flex-col">
              <div className="flex justify-between items-center text-[9px] font-bold tracking-widest uppercase text-white mb-4 border-b border-white/10 pb-3">
                 <span>DEEP SKY HIGHLIGHTS</span>
                 <span className="text-[#8F9FB3] text-[7px] hover:text-white cursor-pointer transition-colors">VIEW ALL</span>
              </div>
              <div className="space-y-3 flex-1">
                 {[
                   { n: "Andromeda Galaxy (M31)", dist: "2.54 Mly", m: "3.4" },
                   { n: "Orion Nebula (M42)", dist: "1,344 ly", m: "4.0" },
                   { n: "Pleiades (M45)", dist: "444 ly", m: "1.6" },
                   { n: "Sombrero Galaxy (M104)", dist: "28.7 Mly", m: "8.0" },
                 ].map((x, i) => (
                   <div key={i} className="flex gap-2 items-center group cursor-pointer">
                      <div className="w-10 h-7 rounded bg-black border border-white/10 overflow-hidden relative shrink-0">
                         <img src="/assets/deep_sky.png" className="w-full h-full object-cover mix-blend-screen scale-150 group-hover:scale-125 transition-transform" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="text-[9px] text-white truncate group-hover:text-indigo-300 transition-colors">{x.n}</div>
                         <div className="text-[7px] text-[#8F9FB3] font-mono">{x.dist}</div>
                      </div>
                      <div className="text-[7px] font-mono text-white whitespace-nowrap">MAG {x.m}</div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Pulsar Monitor */}
           <div className="md:col-span-3 bg-[#040C1A] border border-white/5 rounded-xl p-4 flex flex-col">
              <div className="flex justify-between items-center text-[9px] font-bold tracking-widest uppercase text-white mb-4 border-b border-white/10 pb-3">
                 <span>PULSAR MONITOR</span>
                 <span className="text-[#8F9FB3] text-[7px] hover:text-white cursor-pointer transition-colors">VIEW ALL</span>
              </div>
              <div className="flex-1">
                 <div className="grid grid-cols-12 gap-2 text-[6px] uppercase tracking-widest text-[#8F9FB3] mb-2">
                    <div className="col-span-5">PULSAR</div>
                    <div className="col-span-3">PERIOD</div>
                    <div className="col-span-2">MAG</div>
                    <div className="col-span-2 text-right">STATUS</div>
                 </div>
                 <div className="space-y-2.5">
                   {[
                     { n: "PSR B0833-45 (Vela)", p: "89 ms", m: "23.6", s: "STABLE", sc: "text-emerald-400" },
                     { n: "PSR B1937+21", p: "1.56 ms", m: "23.8", s: "STABLE", sc: "text-emerald-400" },
                     { n: "PSR J0437-4715", p: "5.76 ms", m: "24.1", s: "MONITOR", sc: "text-amber-400" },
                     { n: "PSR B0531+21 (Crab)", p: "33 ms", m: "16.5", s: "ACTIVE", sc: "text-emerald-400" },
                     { n: "PSR J0737-3039A", p: "22.7 ms", m: "23.4", s: "STABLE", sc: "text-emerald-400" },
                   ].map((x, i) => (
                     <div key={i} className="grid grid-cols-12 gap-2 text-[8px] items-center hover:bg-white/5 cursor-pointer rounded -mx-1 px-1 py-0.5 transition-colors">
                        <div className="col-span-5 text-white truncate">{x.n}</div>
                        <div className="col-span-3 text-white font-mono">{x.p}</div>
                        <div className="col-span-2 text-white font-mono">{x.m}</div>
                        <div className={`col-span-2 text-right font-bold tracking-widest text-[6px] uppercase ${x.sc} flex items-center justify-end gap-1`}>
                           {x.s === 'ACTIVE' && <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />}
                           {x.s}
                        </div>
                     </div>
                   ))}
                 </div>
              </div>
           </div>

           {/* Alerts */}
           <div className="md:col-span-2 bg-[#040C1A] border border-white/5 rounded-xl p-4 flex flex-col">
              <div className="flex justify-between items-center text-[9px] font-bold tracking-widest uppercase text-white mb-4 border-b border-white/10 pb-3">
                 <span>CONSTELLATION ALERTS</span>
                 <span className="text-[#8F9FB3] text-[7px] hover:text-white cursor-pointer transition-colors">VIEW ALL</span>
              </div>
              <div className="space-y-3 flex-1">
                 <div className="flex gap-2 items-start cursor-pointer group">
                    <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div className="flex-1">
                       <div className="flex justify-between items-center mb-0.5">
                          <span className="text-[9px] font-bold text-white tracking-widest uppercase group-hover:text-amber-400 transition-colors">DRACO</span>
                          <span className="text-[6px] px-1 py-0.5 bg-amber-500/20 text-amber-500 border border-amber-500/20 rounded font-bold">MEDIUM</span>
                       </div>
                       <div className="text-[7px] text-[#8F9FB3]">Anomali pergerakan bintang terdeteksi</div>
                       <div className="text-[6px] text-white/40 font-mono mt-0.5">12 Aug 2026 18:22 UTC</div>
                    </div>
                 </div>
                 <div className="flex gap-2 items-start cursor-pointer group">
                    <Activity className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div className="flex-1">
                       <div className="flex justify-between items-center mb-0.5">
                          <span className="text-[9px] font-bold text-white tracking-widest uppercase group-hover:text-emerald-400 transition-colors">ORION</span>
                          <span className="text-[6px] px-1 py-0.5 bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 rounded font-bold">LOW</span>
                       </div>
                       <div className="text-[7px] text-[#8F9FB3]">Peningkatan aktivitas nebulosa</div>
                       <div className="text-[6px] text-white/40 font-mono mt-0.5">12 Aug 2026 15:47 UTC</div>
                    </div>
                 </div>
                 <div className="flex gap-2 items-start cursor-pointer group">
                    <AlertTriangle className="w-3 h-3 text-rose-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div className="flex-1">
                       <div className="flex justify-between items-center mb-0.5">
                          <span className="text-[9px] font-bold text-white tracking-widest uppercase group-hover:text-rose-400 transition-colors">SCORPIUS</span>
                          <span className="text-[6px] px-1 py-0.5 bg-rose-500/20 text-rose-500 border border-rose-500/20 rounded font-bold">HIGH</span>
                       </div>
                       <div className="text-[7px] text-[#8F9FB3]">Perubahan kecerlangan Antares</div>
                       <div className="text-[6px] text-white/40 font-mono mt-0.5">12 Aug 2026 14:11 UTC</div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Indices */}
           <div className="md:col-span-2 bg-[#040C1A] border border-white/5 rounded-xl p-4 flex flex-col">
              <div className="flex justify-between items-center text-[9px] font-bold tracking-widest uppercase text-white mb-4 border-b border-white/10 pb-3">
                 <span>ASTRONOMICAL INDICES</span>
              </div>
              <div className="space-y-4 flex-1">
                 {[
                   { l: "Kp Index", v: "1.67", s: "LOW", sc: "text-[#00aaff]" },
                   { l: "Solar Flux (F10.7)", v: "143 sfu", s: "NORMAL", sc: "text-emerald-400" },
                   { l: "Aurora Probability", v: "12%", s: "LOW", sc: "text-[#00aaff]" },
                   { l: "Geomagnetic Field (nT)", v: "-18.6", s: "NORMAL", sc: "text-emerald-400" },
                   { l: "Cosmic Ray Flux", v: "3820", s: "NORMAL", sc: "text-emerald-400" },
                 ].map((x, i) => (
                   <div key={i} className="flex justify-between items-center text-[9px] hover:bg-white/5 cursor-pointer rounded -mx-1 px-1 py-0.5 transition-colors">
                      <div className="text-[#8F9FB3]">{x.l}</div>
                      <div className="flex items-center gap-3">
                         <span className="text-white font-mono">{x.v}</span>
                         <span className={`text-[6px] font-bold tracking-widest uppercase ${x.sc} w-8 text-right`}>{x.s}</span>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-2 py-2 border-t border-white/10 text-[7px] tracking-widest uppercase hover:text-white transition-colors text-indigo-400 flex justify-center items-center gap-1">
                 VIEW FULL INDICES <ChevronRight className="w-3 h-3" />
              </button>
           </div>

           {/* Quick Nav */}
           <div className="md:col-span-2 bg-[#040C1A] border border-white/5 rounded-xl p-4 flex flex-col">
              <div className="flex justify-between items-center text-[9px] font-bold tracking-widest uppercase text-white mb-4 border-b border-white/10 pb-3">
                 <span>QUICK NAVIGATION</span>
              </div>
              <div className="grid grid-cols-4 gap-2 flex-1">
                 {[
                   { l: "SOLAR SYSTEM", i: Sun },
                   { l: "STAR CATALOG", i: Crosshair },
                   { l: "GALAXY MAP", i: Globe },
                   { l: "ORBIT SIMULATOR", i: TargetIcon },
                   { l: "TELESCOPE VIEW", i: Telescope },
                   { l: "MISSION CONTROL", i: Rocket },
                   { l: "SPACE WEATHER", i: CloudLightning },
                   { l: "DATA ARCHIVE", i: Database },
                 ].map((x, i) => (
                   <div key={i} className="flex flex-col items-center justify-center gap-2 p-2 border border-white/5 rounded hover:bg-white/5 hover:border-indigo-500/30 cursor-pointer group transition-all text-center h-14">
                      <x.i className="w-4 h-4 text-[#8F9FB3] group-hover:text-indigo-400 group-hover:scale-110 transition-all" />
                      <div className="text-[5px] uppercase tracking-widest text-[#8F9FB3] group-hover:text-white leading-tight">{x.l}</div>
                   </div>
                 ))}
              </div>
           </div>

        </div>

        {/* ═══ FOOTER ═══ */}
        <div className="flex justify-between items-center pt-2 px-2 text-[7px] uppercase tracking-widest text-[#8F9FB3] shrink-0">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> CONNECTED TO ASTRONOMICAL NETWORK</div>
              <div className="flex items-center gap-1.5"><Globe className="w-2.5 h-2.5" /> LATENCY <span className="text-white font-mono">42ms</span></div>
           </div>
           <div className="tracking-[0.3em] font-bold opacity-50">"WHEN THE MOON WITNESSES, WE SHARE MESSAGES."</div>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> DATA SYNCHRONIZED</div>
              <div className="flex items-center gap-1.5"><Clock className="w-2.5 h-2.5" /> <span className="text-white font-mono">{timeString} UTC+0</span></div>
           </div>
        </div>

      </div>
    </div>
  )
}

function TargetIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}
