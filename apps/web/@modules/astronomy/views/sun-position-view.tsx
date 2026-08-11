"use client"

import React, { useState, useEffect } from "react"
import {
  Sun,
  CloudSun,
  Activity,
  Battery,
  Wind,
  Heart,
  Smile,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Compass,
  MapPin,
  Target,
  ArrowRight,
  TrendingUp,
  Cpu,
  HardDrive,
  Network,
  Globe,
  Settings,
  Bell,
  Calendar,
  ChevronRight,
  Droplets,
  Shield,
  Eye,
  BookOpen,
  Sunrise
} from "lucide-react"

export function SunPositionView() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#020813] font-sans text-white p-4 md:p-6 select-none overflow-x-hidden">
      
      {/* ═══ HEADER ROW ═══ */}
      <div className="mb-6 grid grid-cols-1 lg:grid-cols-12 gap-8 relative rounded-2xl border border-white/10 bg-[#020813] overflow-hidden min-h-[450px] p-6 md:p-10">
        
        {/* Column 1: The Divine Figure (Span 4) */}
        <div className="relative lg:col-span-4 flex items-end justify-center min-h-[400px]">
          {/* Background Ambient Glow */}
          <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[80px]"></div>
          
          {/* Intense Sun Behind Figure */}
          <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] bg-yellow-400 rounded-full blur-[6px] shadow-[0_0_120px_50px_rgba(251,191,36,0.8)] mix-blend-screen"></div>
          {/* Inner Bright Sun */}
          <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] bg-white rounded-full blur-[8px] opacity-90 mix-blend-screen"></div>
          
          {/* Outer Sun Corona */}
          <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border-[1px] border-yellow-300/40 shadow-[0_0_30px_rgba(251,191,36,0.2)_inset]"></div>
          
          {/* Floor Ring */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[320px] h-[60px] border-[3px] border-amber-400 rounded-[100%] blur-[2px] shadow-[0_0_30px_rgba(251,191,36,0.8)]"></div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[320px] h-[60px] border-[1px] border-white/80 rounded-[100%] blur-[0px]"></div>
          
          {/* Dark floor fade to hide figure cut-off */}
          <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-[#020813] to-transparent z-20"></div>

          <img 
             src="/assets/hero/24-hero.png" 
             alt="Divine Figure" 
             className="relative z-10 h-[100%] max-h-[420px] w-auto object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]"
             style={{ objectPosition: 'bottom center' }}
          />
        </div>

        {/* Column 2: Center Content (Span 4) */}
        <div className="relative z-10 lg:col-span-4 flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-wider text-white mb-2 drop-shadow-md">
            SUNLIGHT INTELLIGENT
          </h1>
          <h2 className="text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase mb-6">
            Your Daily Source of Light, Energy & Life
          </h2>
          <p className="text-[11px] leading-relaxed text-white/60 mb-6 max-w-sm">
            Like the radiant light that touched the blind and gave life, the Sun is a mercy for all creation. Use sunlight wisely, live healthy, stay grateful.
          </p>
          <div className="p-4 rounded-lg border border-amber-500/30 bg-black/40 max-w-sm relative overflow-hidden mt-2">
            <div className="flex items-start gap-3">
              <Sun className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[9px] font-mono leading-relaxed text-cyan-200">
                  "I AM THE LIGHT OF THE WORLD. WHOEVER FOLLOWS ME WILL NEVER WALK IN DARKNESS, BUT WILL HAVE THE LIGHT OF LIFE."
                </p>
                <span className="text-cyan-500 mt-2 block text-[8px] tracking-widest uppercase">- JOHN 8:12</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Right Data (Span 4, split into 2) */}
        <div className="relative z-10 lg:col-span-4 grid grid-cols-2 gap-6">
          {/* Sub-col 1: Mission Status */}
          <div className="flex flex-col justify-center gap-4">
             <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-2">
               <Target className="h-3 w-3 text-cyan-500" />
               <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest">MISSION STATUS</span>
               <span className="ml-auto flex items-center gap-1.5 text-[8px] font-bold text-emerald-400 uppercase"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div> LIVE</span>
             </div>
             
             {[
               { l: "Operation Protocol", v: "SUNLIGHT-INTEL", c: "text-white" },
               { l: "System Sync", v: "ONLINE", c: "text-emerald-400" },
               { l: "Global Time", v: "30 JULY 2026\n22:18:45 UTC+7", c: "text-white" },
               { l: "Quran Reference", v: "Q.S. An-Nur (24:35)", c: "text-white" },
               { l: "Last Sync", v: "1 MINUTE AGO", c: "text-white/50" },
             ].map((d, i) => (
               <div key={i} className="flex justify-between items-start gap-2">
                 <div className="flex items-center gap-2">
                   <Target className="h-3 w-3 text-[#8F9FB3]" />
                   <span className="text-[7px] text-[#8F9FB3] tracking-widest uppercase">{d.l}</span>
                 </div>
                 <span className={`text-[7px] font-mono whitespace-pre-line text-right ${d.c}`}>{d.v}</span>
               </div>
             ))}

             <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 border border-cyan-500/30 rounded bg-transparent text-[8px] uppercase tracking-widest text-cyan-400 hover:bg-cyan-500/10 transition-colors group">
                VIEW FULL BRIEFING <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
             </button>
          </div>

          {/* Sub-col 2: Arabic Verse */}
          <div className="flex flex-col justify-center border-l border-white/5 pl-6">
             <h3 className="font-arabic text-2xl text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)] leading-loose text-right mb-4">
               اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ
             </h3>
             <p className="text-[9px] text-cyan-400 mb-4 leading-relaxed">
               Allah is the Light of the Heavens and the Earth.
             </p>
             <p className="text-[8px] text-white/50 leading-relaxed">
               The sun runs on its course for a specified term.<br/><span className="text-[#8F9FB3] mt-2 block">- Q.S. Ya-Sin (36:38)</span>
             </p>
          </div>
        </div>
      </div>

      {/* ═══ TOP METRICS ROW ═══ */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
        {[
          { label: "SUNLIGHT NOW", value: "782", unit: "W/m²", desc: "GOOD EXPOSURE", icon: Sun, color: "text-amber-400" },
          { label: "UV INDEX", value: "5", unit: "", desc: "MODERATE", icon: Target, color: "text-amber-400" },
          { label: "VITAMIN D TODAY", value: "92%", unit: "", desc: "GOOD LEVEL", icon: Activity, color: "text-amber-400" },
          { label: "SUN ENERGY", value: "846", unit: "kWh/m²", desc: "HIGH INTENSITY", icon: Zap, color: "text-amber-400" },
          { label: "AIR QUALITY", value: "42", unit: "", desc: "GOOD", icon: Wind, color: "text-amber-400" },
          { label: "CIRCADIAN SCORE", value: "87%", unit: "", desc: "ALIGNED", icon: Clock, color: "text-amber-400" },
          { label: "MOOD BOOST", value: "84%", unit: "", desc: "POSITIVE", icon: Smile, color: "text-amber-400" },
          { label: "SPIRITUAL LIGHT", value: "99.7%", unit: "", desc: "CONNECTED", icon: Heart, color: "text-amber-400" },
        ].map((m, i) => (
          <div key={i} className="flex flex-col justify-center items-center p-4 bg-[#040C1A] border border-white/5 rounded-xl hover:border-amber-500/20 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <m.icon className={`h-4 w-4 ${m.color} drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]`} />
              <span className="text-[8px] text-[#8F9FB3] tracking-widest uppercase">{m.label}</span>
            </div>
            <div className="text-2xl font-black font-mono text-white mb-1">
              {m.value} <span className="text-xs text-white/50">{m.unit}</span>
            </div>
            <div className="text-[7px] tracking-widest text-white/40 uppercase">{m.desc}</div>
          </div>
        ))}
      </div>

      {/* ═══ CORE VISUALIZATIONS ROW ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* Solar Arc Trajectory */}
        <div className="lg:col-span-5 bg-[#040C1A] border border-white/5 rounded-xl p-5 relative overflow-hidden flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-[10px] font-bold tracking-widest text-white uppercase mb-1">SOLAR ARC TRAJECTORY</h3>
              <p className="text-[9px] text-[#8F9FB3]">Real-time sun path based on your location</p>
            </div>
            <div className="flex items-center gap-2 bg-rose-500/10 px-2 py-1 rounded">
              <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-[8px] text-rose-500 tracking-widest font-bold">LIVE</span>
            </div>
          </div>
          
          <div className="relative min-h-[220px] w-full mt-4 flex items-end">
            {/* The Glowing Arc */}
            <svg viewBox="0 0 100 50" className="w-full h-full absolute inset-x-0 bottom-10 overflow-visible drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
              <path d="M 5 45 Q 50 -10 95 45" fill="none" stroke="url(#arcGradient)" strokeWidth="1" strokeDasharray="2 1" />
              <path d="M 5 45 Q 27.5 17 50 17.5" fill="none" stroke="#facc15" strokeWidth="1.5" />
              <defs>
                <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="30%" stopColor="#f59e0b" />
                  <stop offset="70%" stopColor="#ea580c" />
                  <stop offset="100%" stopColor="#1e3a8a" />
                </linearGradient>
              </defs>
              
              {/* Nodes along the arc */}
              <circle cx="5" cy="45" r="1.5" fill="#3b82f6" />
              <circle cx="27.5" cy="27" r="1.5" fill="#eab308" />
              <circle cx="50" cy="17.5" r="4" fill="#facc15" className="drop-shadow-[0_0_8px_rgba(250,204,21,1)]" />
              <circle cx="72.5" cy="27" r="1.5" fill="#ea580c" />
              <circle cx="95" cy="45" r="1.5" fill="#1e3a8a" />
            </svg>
            
            {/* Mountain / Terrain Silhouette Mock */}
            <div className="absolute bottom-6 inset-x-0 h-16 bg-gradient-to-t from-[#020813] to-transparent opacity-90 z-0 border-b border-amber-500/20"></div>
            
            {/* Time Labels */}
            <div className="absolute top-[5px] left-[50%] -translate-x-1/2 flex flex-col items-center z-10">
              <span className="text-[12px] font-mono text-white">12:07</span>
              <span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest">SOLAR NOON</span>
            </div>
            
            {/* Shifted down to avoid overlapping the line */}
            <div className="absolute top-[60%] left-[25%] -translate-x-1/2 flex flex-col items-center z-10">
              <span className="text-[10px] font-mono text-white">09:18</span>
              <span className="text-[7px] font-bold text-white/50 uppercase tracking-widest">MORNING</span>
            </div>
            
            {/* Shifted down to avoid overlapping the line */}
            <div className="absolute top-[60%] right-[25%] translate-x-1/2 flex flex-col items-center z-10">
              <span className="text-[10px] font-mono text-white">15:02</span>
              <span className="text-[7px] font-bold text-white/50 uppercase tracking-widest">AFTERNOON</span>
            </div>
            
            <div className="absolute bottom-[2px] left-2 flex flex-col items-start z-10">
              <span className="text-[10px] font-mono text-white">05:46</span>
              <span className="text-[7px] font-bold text-white/50 uppercase tracking-widest">SUNRISE</span>
            </div>
            
            <div className="absolute bottom-[2px] right-2 flex flex-col items-end z-10">
              <span className="text-[10px] font-mono text-white">18:28</span>
              <span className="text-[7px] font-bold text-white/50 uppercase tracking-widest">SUNSET</span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/5 text-[9px]">
            <div>
              <div className="text-[#8F9FB3] uppercase tracking-widest mb-1">LOCATION</div>
              <div className="font-mono text-white">-6.251, 107.873</div>
            </div>
            <div>
              <div className="text-[#8F9FB3] uppercase tracking-widest mb-1">DATE</div>
              <div className="font-mono text-white">30 JULY 2026</div>
            </div>
            <div>
              <div className="text-[#8F9FB3] uppercase tracking-widest mb-1">DAY LENGTH</div>
              <div className="font-mono text-white">12h 42m</div>
            </div>
            <div>
              <div className="text-[#8F9FB3] uppercase tracking-widest mb-1">NEXT SUNRISE</div>
              <div className="font-mono text-white">05:46:12</div>
            </div>
          </div>
        </div>

        {/* Sunlight Exposure Recommendation */}
        <div className="lg:col-span-3 bg-[#040C1A] border border-white/5 rounded-xl p-5 flex flex-col">
          <div className="mb-6">
            <h3 className="text-[10px] font-bold tracking-widest text-white uppercase mb-1">SUNLIGHT EXPOSURE RECOMMENDATION</h3>
            <p className="text-[9px] text-[#8F9FB3]">Based on your skin type & UV Index</p>
          </div>
          
          <div className="flex justify-center mt-6 mb-8 relative">
             <div className="w-32 h-32 rounded-full border-[6px] border-[#0F172A] flex items-center justify-center relative shadow-[0_0_30px_rgba(251,191,36,0.15)]">
                {/* Simulated SVG progress arc for the orange circle */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="50%" cy="50%" r="46%" fill="none" stroke="#f59e0b" strokeWidth="6" strokeDasharray="300" strokeDashoffset="100" strokeLinecap="round" />
                </svg>
                <div className="text-center">
                  <div className="text-2xl font-black text-white">15 - 30</div>
                  <div className="text-[7px] font-bold text-amber-500 tracking-widest uppercase">MINUTES</div>
                  <div className="text-[6px] text-white/50 tracking-widest uppercase mt-1">RECOMMENDED</div>
                  <div className="text-[6px] text-white/50 tracking-widest uppercase">DAILY EXPOSURE</div>
                </div>
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 mb-4">
             <div className="text-center">
               <div className="text-[7px] text-[#8F9FB3] tracking-widest uppercase mb-1">OPTIMAL TIME</div>
               <div className="text-[10px] font-mono text-white">07:00 - 10:00</div>
             </div>
             <div className="text-center border-l border-white/10">
               <div className="text-[10px] font-mono text-white mt-3">15:30 - 17:30</div>
             </div>
          </div>
          
          <ul className="space-y-2 mt-6">
            <li className="flex gap-2 text-[8px] items-start">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-0.5 shrink-0" />
               <span className="text-white/70">Avoid peak UV (10:00 - 15:00)</span>
            </li>
            <li className="flex gap-2 text-[8px] items-start">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-0.5 shrink-0" />
               <span className="text-white/70">Use sunscreen if &gt; 30 minutes</span>
            </li>
            <li className="flex gap-2 text-[8px] items-start">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-0.5 shrink-0" />
               <span className="text-white/70">Stay hydrated & wear light clothing</span>
            </li>
          </ul>
        </div>

        {/* Vitamin D Synthesis */}
        <div className="lg:col-span-4 bg-[#040C1A] border border-white/5 rounded-xl p-5 flex flex-col">
          <div className="mb-6">
            <h3 className="text-[10px] font-bold tracking-widest text-white uppercase mb-1">VITAMIN D SYNTHESIS</h3>
            <p className="text-[9px] text-[#8F9FB3]">How your body produces Vitamin D from sunlight</p>
          </div>
          
          <div className="flex gap-6 mt-6">
            {/* Left Graphics */}
            <div className="flex flex-col items-center gap-2 mt-2">
               <Sun className="h-6 w-6 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
               <div className="w-[1px] h-8 bg-white/10"></div>
               <div className="h-4 w-4 border-[2px] border-rose-400/80 rounded-sm"></div>
               <div className="w-[1px] h-8 bg-white/10"></div>
               <div className="h-4 w-4 rounded-full border-[2px] border-red-500/80"></div>
               <div className="w-[1px] h-8 bg-white/10"></div>
               <div className="h-4 w-6 rounded-full border-[2px] border-amber-600/80"></div>
            </div>
            
            {/* Right Text */}
            <div className="flex flex-col gap-8 w-full">
               <div>
                 <div className="text-[8px] font-bold tracking-widest text-white uppercase">SUNLIGHT</div>
                 <div className="text-[7px] text-white/50">UVB</div>
               </div>
               <div>
                 <div className="text-[8px] font-bold tracking-widest text-white uppercase">SKIN</div>
                 <div className="text-[7px] text-white/50">7-Dehydrocholesterol</div>
               </div>
               <div>
                 <div className="text-[8px] font-bold tracking-widest text-white uppercase">LIVER</div>
                 <div className="text-[7px] text-white/50">Calcidiol</div>
               </div>
               <div>
                 <div className="flex justify-between items-end">
                   <div>
                     <div className="text-[8px] font-bold tracking-widest text-white uppercase">KIDNEY</div>
                     <div className="text-[7px] text-white/50">Active Vitamin D</div>
                   </div>
                   <div className="text-right">
                     <div className="text-[7px] text-[#8F9FB3] tracking-widest uppercase mb-1">DAILY NEED</div>
                     <div className="text-[10px] font-mono font-bold text-amber-400">600 - 800 IU</div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
        
      </div>

      {/* ═══ DATA MONITORING ROW ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        
        {/* Vitamin D Level Monitor */}
        <div className="bg-[#040C1A] border border-white/5 rounded-xl p-5 flex flex-col items-center justify-between">
          <div className="w-full mb-4 text-left">
            <h3 className="text-[10px] font-bold tracking-widest text-white uppercase mb-1">VITAMIN D LEVEL MONITOR</h3>
            <p className="text-[9px] text-[#8F9FB3]">Blood 25(OH)D Estimate</p>
          </div>
          
          <div className="relative w-36 h-36 flex items-center justify-center mt-2 mb-6">
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#1E293B" strokeWidth="8" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="#34D399" strokeWidth="8" strokeDasharray="283" strokeDashoffset="23" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
            </svg>
            <div className="text-center relative z-10">
              <div className="text-4xl font-black font-mono text-white">92<span className="text-lg">%</span></div>
              <div className="text-[8px] text-emerald-400 tracking-widest uppercase font-bold mt-1">OPTIMAL</div>
            </div>
          </div>
          
          <div className="w-full flex justify-center gap-6 text-[8px] text-[#8F9FB3]">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded bg-rose-500" /> 0-20% Deficient</div>
              <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded bg-amber-500" /> 21-30% Insufficient</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded bg-emerald-400" /> 31-60% Sufficient</div>
              <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded bg-emerald-600" /> 61-100% Optimal</div>
            </div>
          </div>
          <p className="text-[9px] text-center text-white/50 mt-6 leading-relaxed">Keep your level in optimal range for better health & immunity.</p>
        </div>

        {/* Sunlight Benefits */}
        <div className="bg-[#040C1A] border border-white/5 rounded-xl p-5">
          <div className="mb-6">
            <h3 className="text-[10px] font-bold tracking-widest text-white uppercase mb-1">SUNLIGHT BENEFITS</h3>
            <p className="text-[9px] text-[#8F9FB3]">Powered by Sunlight & Science</p>
          </div>
          <div className="space-y-5">
            {[
              { t: "VITAMIN D PRODUCTION", d: "Strengthens bones, immune system, and mood.", i: Activity },
              { t: "SEROTONIN BOOST", d: "Improves mood, reduces stress and anxiety.", i: Smile },
              { t: "CIRCADIAN RHYTHM", d: "Regulates sleep-wake cycle and hormone balance.", i: Clock },
              { t: "NATURAL ENERGY", d: "Improves focus, productivity and alertness.", i: Zap },
              { t: "SKIN HEALTH", d: "Helps skin cell growth, repair and protection.", i: Heart },
            ].map((b, i) => (
              <div key={i} className="flex gap-3 items-start">
                <b.i className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[9px] font-bold text-white uppercase tracking-widest mb-0.5">{b.t}</div>
                  <div className="text-[8px] text-[#8F9FB3] leading-relaxed">{b.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Sunlight Exposure */}
        <div className="bg-[#040C1A] border border-white/5 rounded-xl p-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-[10px] font-bold tracking-widest text-white uppercase mb-1">TODAY'S SUNLIGHT EXPOSURE</h3>
            <p className="text-[9px] text-[#8F9FB3]">Daily Sunlight Exposure Tracker</p>
          </div>
          
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-3xl font-black font-mono text-white">10.2 <span className="text-sm font-normal text-[#8F9FB3]">hrs</span></div>
              <div className="text-[8px] text-emerald-400 tracking-widest uppercase font-bold mt-1">DAILY AVERAGE</div>
            </div>
            <div className="flex gap-1 text-[8px] font-mono">
              <div className="px-1.5 py-0.5 bg-white/10 rounded">7D</div>
              <div className="px-1.5 py-0.5 text-white/30 hover:bg-white/5 rounded cursor-pointer">30D</div>
              <div className="px-1.5 py-0.5 text-white/30 hover:bg-white/5 rounded cursor-pointer">90D</div>
            </div>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-2 h-32 relative">
             <div className="absolute inset-0 border-b border-white/10" />
             {/* Bars */}
             {[
               { l: "FRI", v: 6.1, h: "50%" },
               { l: "SAT", v: 7.3, h: "60%" },
               { l: "SUN", v: 8.0, h: "70%" },
               { l: "MON", v: 9.5, h: "85%" },
               { l: "TUE", v: 10.2, h: "100%", act: true },
               { l: "WED", v: 8.7, h: "75%" },
               { l: "THU", v: 7.1, h: "55%" },
             ].map((b, i) => (
               <div key={i} className="flex flex-col items-center w-full z-10 group">
                 <div className="text-[8px] font-mono text-white mb-2 opacity-0 group-hover:opacity-100 transition-opacity">{b.v}</div>
                 <div className={`w-full max-w-[14px] rounded-t-sm transition-all duration-1000 ${b.act ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'bg-cyan-600/50 hover:bg-cyan-500/80'}`} style={{ height: b.h }} />
                 <div className="text-[7px] text-[#8F9FB3] mt-2 font-mono">{b.l}</div>
               </div>
             ))}
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-white/5 text-[9px]">
            <div>
              <div className="text-[#8F9FB3] uppercase tracking-widest mb-1">GOAL</div>
              <div className="font-mono text-white">8.0 hrs</div>
            </div>
            <div>
              <div className="text-[#8F9FB3] uppercase tracking-widest mb-1">ACHIEVED</div>
              <div className="font-mono text-white text-emerald-400">10.2 hrs</div>
            </div>
            <div>
              <div className="text-[#8F9FB3] uppercase tracking-widest mb-1">CONSISTENCY</div>
              <div className="font-mono text-white">92%</div>
            </div>
          </div>
        </div>

        {/* Sunlight & Mood Boost */}
        <div className="bg-[#040C1A] border border-white/5 rounded-xl p-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-[10px] font-bold tracking-widest text-white uppercase mb-1">SUNLIGHT & MOOD BOOST</h3>
            <p className="text-[9px] text-[#8F9FB3]">Light exposure vs mood correlation</p>
          </div>
          
          <div className="flex-1 relative mt-4 min-h-[140px]">
            {/* SVG Line Chart Mock */}
            <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
              <path d="M 0 90 L 30 75 L 60 65 L 90 40 L 120 45 L 150 20 L 180 15 L 200 10" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]" />
              <path d="M 0 85 L 30 70 L 60 70 L 90 55 L 120 50 L 150 35 L 180 40 L 200 30" fill="none" stroke="#60A5FA" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="absolute inset-x-0 bottom-0 border-b border-white/10 flex justify-between text-[7px] font-mono text-[#8F9FB3] px-1 pb-1">
              <span>0</span><span>5</span><span>10</span><span>15</span><span>20</span><span>25</span><span>30</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-8 pt-4 border-t border-white/5">
             <div>
               <div className="text-[8px] text-[#8F9FB3] tracking-widest uppercase mb-1">MOOD SCORE</div>
               <div className="text-2xl font-mono font-bold text-white">84%</div>
               <div className="text-[8px] text-emerald-400 tracking-widest uppercase font-bold mt-1">POSITIVE</div>
             </div>
             <div>
               <div className="text-[8px] text-[#8F9FB3] tracking-widest uppercase mb-1">ENERGY LEVEL</div>
               <div className="text-2xl font-mono font-bold text-white">76%</div>
               <div className="text-[8px] text-amber-400 tracking-widest uppercase font-bold mt-1">HIGH</div>
             </div>
          </div>
        </div>
        
      </div>

      {/* ═══ TOOLKITS & ACTIONS ROW ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* Toolkits */}
        <div className="lg:col-span-6 bg-[#040C1A] border border-white/5 rounded-xl p-5">
          <div className="mb-6">
            <h3 className="text-[10px] font-bold tracking-widest text-white uppercase mb-1">SUNLIGHT INTELLIGENT TOOLKITS</h3>
            <p className="text-[9px] text-[#8F9FB3]">Operational tools to optimize your light, health & life</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
             {[
               { l: "SUN TRACKER", d: "Track sun position in real-time", i: Target },
               { l: "UV ALERT SYSTEM", d: "Get notified for high UV index", i: AlertTriangle },
               { l: "VITAMIN D CALCULATOR", d: "Estimate your daily Vitamin D needs", i: Activity },
               { l: "EXPOSURE REMINDER", d: "Smart reminder for sunlight", i: Bell },
               { l: "DAILY LIGHT REPORT", d: "View your sunlight report & insights", i: BookOpen },
               { l: "SKIN TYPE GUIDE", d: "Find safe exposure time for your skin", i: Shield },
               { l: "CIRCADIAN OPTIMIZER", d: "Optimize your daily rhythm", i: Clock },
               { l: "SLEEP CYCLE GUIDE", d: "Auto-sync light with your sleep", i: Eye },
               { l: "HEALTH INSIGHTS", d: "AI-powered health recommendations", i: Heart },
               { l: "WELLNESS SCORE", d: "Overall sunlight wellness score", i: Smile },
             ].map((t, i) => (
               <div key={i} className="flex gap-3 p-3 rounded-xl border border-white/5 hover:border-amber-500/30 hover:bg-amber-500/5 transition-colors cursor-pointer group">
                 <t.i className="h-5 w-5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                 <div>
                   <div className="text-[8px] font-bold text-white uppercase tracking-widest mb-1">{t.l}</div>
                   <div className="text-[7px] text-[#8F9FB3] leading-relaxed">{t.d}</div>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Spiritual Light Connection */}
        <div className="lg:col-span-3 bg-[#040C1A] border border-white/5 rounded-xl p-5 relative overflow-hidden group flex flex-col justify-between">
          <div className="mb-4 relative z-10">
            <h3 className="text-[10px] font-bold tracking-widest text-white uppercase mb-1">SPIRITUAL LIGHT CONNECTION</h3>
            <p className="text-[9px] text-[#8F9FB3]">Align your heart with the Light</p>
          </div>
          
          <ul className="space-y-4 mt-6 relative z-10">
            <li className="flex items-start gap-3">
               <div className="h-4 w-4 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                 <Sun className="h-2 w-2 text-amber-500" />
               </div>
               <span className="text-[9px] text-white/80 leading-relaxed pt-0.5">Reflect on gratitude daily</span>
            </li>
            <li className="flex items-start gap-3">
               <div className="h-4 w-4 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                 <Sun className="h-2 w-2 text-amber-500" />
               </div>
               <span className="text-[9px] text-white/80 leading-relaxed pt-0.5">Seek the Light in knowledge</span>
            </li>
            <li className="flex items-start gap-3">
               <div className="h-4 w-4 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                 <Sun className="h-2 w-2 text-amber-500" />
               </div>
               <span className="text-[9px] text-white/80 leading-relaxed pt-0.5">Spread kindness & mercy</span>
            </li>
            <li className="flex items-start gap-3">
               <div className="h-4 w-4 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                 <Sun className="h-2 w-2 text-amber-500" />
               </div>
               <span className="text-[9px] text-white/80 leading-relaxed pt-0.5">Live with purpose & truth</span>
            </li>
            <li className="flex items-start gap-3">
               <div className="h-4 w-4 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                 <Sun className="h-2 w-2 text-amber-500" />
               </div>
               <span className="text-[9px] text-white/80 leading-relaxed pt-0.5">Be a light for others</span>
            </li>
          </ul>
          
          <div className="mt-8 pt-4 border-t border-white/5 relative z-10">
            <p className="text-[10px] font-mono text-amber-400 leading-relaxed italic">
              "The true light shines in the heart that beats the truth."
            </p>
            <p className="text-[7px] text-[#8F9FB3] tracking-widest uppercase mt-2">
              - INSPIRED BY AR-RUH (17:85)
            </p>
          </div>
          
          {/* Subtle Silhouette Background */}
          <div className="absolute bottom-[-10%] right-[-10%] w-[180px] h-[180px] opacity-10 transition-opacity duration-700 group-hover:opacity-30 pointer-events-none">
             <img src="/assets/hero/24-hero.png" alt="Silhouette" className="w-full h-full object-contain" />
          </div>
          <div className="absolute bottom-0 right-0 w-[180px] h-[100px] bg-gradient-to-t from-[#040C1A] to-transparent pointer-events-none" />
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-3 bg-[#040C1A] border border-white/5 rounded-xl p-5 flex flex-col">
          <div className="mb-6">
            <h3 className="text-[10px] font-bold tracking-widest text-white uppercase mb-1">QUICK ACTIONS</h3>
          </div>
          <div className="flex-1 flex flex-col gap-3">
            {[
              { l: "START SUN EXPOSURE TIMER", i: Clock },
              { l: "CHECK VITAMIN D LEVEL", i: Activity },
              { l: "VIEW SUNLIGHT REPORT", i: BookOpen },
              { l: "SYNC WITH WEARABLES", i: Zap },
              { l: "SET DAILY REMINDER", i: Bell },
            ].map((q, i) => (
              <button key={i} className="w-full flex items-center justify-between p-4 rounded-lg border border-white/5 hover:border-amber-500/30 hover:bg-amber-500/5 transition-colors group">
                <div className="flex items-center gap-3">
                  <q.i className="h-4 w-4 text-amber-400" />
                  <span className="text-[9px] font-bold text-white uppercase tracking-widest">{q.l}</span>
                </div>
                <ChevronRight className="h-3 w-3 text-[#8F9FB3] group-hover:text-amber-400" />
              </button>
            ))}
          </div>
        </div>
        
      </div>

      {/* ═══ ANALYTICS & SYSTEMS ROW ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* Recent Activity */}
        <div className="lg:col-span-3 bg-[#040C1A] border border-white/5 rounded-xl p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-bold tracking-widest text-white uppercase">RECENT ACTIVITY</h3>
            <span className="text-[7px] text-emerald-400 tracking-widest font-bold bg-emerald-400/10 px-2 py-0.5 rounded flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/> LIVE FEED
            </span>
          </div>
          <div className="grid grid-cols-12 text-[7px] text-[#8F9FB3] uppercase tracking-widest mb-3 border-b border-white/10 pb-2">
            <div className="col-span-3">TIME</div>
            <div className="col-span-6">ACTIVITY</div>
            <div className="col-span-3 text-right">STATUS</div>
          </div>
          <div className="space-y-4">
            {[
              { t: "22:17", a: "Sun Exposure Logged", s: "Optimal", c: "text-emerald-400" },
              { t: "22:16", a: "Vitamin D Level Checked", s: "Optimal", c: "text-emerald-400" },
              { t: "22:15", a: "UV Index Alert (Moderate)", s: "Active", c: "text-rose-400" },
              { t: "22:14", a: "Daily Light Report Generated", s: "Completed", c: "text-emerald-400" },
              { t: "22:13", a: "Health Insight Updated", s: "New", c: "text-emerald-400" },
            ].map((r, i) => (
              <div key={i} className="grid grid-cols-12 text-[9px] items-center">
                <div className="col-span-3 font-mono text-white/50">{r.t}</div>
                <div className="col-span-6 text-white truncate pr-2">{r.a}</div>
                <div className={`col-span-3 text-right font-bold tracking-wider ${r.c}`}>{r.s}</div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 pt-4 border-t border-white/5 text-[8px] uppercase tracking-widest text-amber-400 hover:text-white transition-colors flex justify-center items-center gap-1">
            VIEW ALL ACTIVITY <ArrowRight className="h-2.5 w-2.5" />
          </button>
        </div>

        {/* Light Impact Analytics */}
        <div className="lg:col-span-4 bg-[#040C1A] border border-white/5 rounded-xl p-5 flex flex-col">
          <div className="mb-5">
            <h3 className="text-[10px] font-bold tracking-widest text-white uppercase mb-1">LIGHT IMPACT ANALYTICS</h3>
            <p className="text-[9px] text-[#8F9FB3]">30 DAYS OVERVIEW</p>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div>
              <div className="text-[7px] text-[#8F9FB3] tracking-widest uppercase mb-1 leading-tight">HEALTH IMPROVEMENT</div>
              <div className="text-sm font-bold text-emerald-400 flex items-center gap-1"><TrendingUp className="h-3 w-3"/> 24%</div>
            </div>
            <div>
              <div className="text-[7px] text-[#8F9FB3] tracking-widest uppercase mb-1 leading-tight">MOOD ENHANCEMENT</div>
              <div className="text-sm font-bold text-emerald-400 flex items-center gap-1"><TrendingUp className="h-3 w-3"/> 31%</div>
            </div>
            <div>
              <div className="text-[7px] text-[#8F9FB3] tracking-widest uppercase mb-1 leading-tight">ENERGY BOOST</div>
              <div className="text-sm font-bold text-emerald-400 flex items-center gap-1"><TrendingUp className="h-3 w-3"/> 19%</div>
            </div>
            <div>
              <div className="text-[7px] text-[#8F9FB3] tracking-widest uppercase mb-1 leading-tight">SLEEP QUALITY</div>
              <div className="text-sm font-bold text-emerald-400 flex items-center gap-1"><TrendingUp className="h-3 w-3"/> 28%</div>
            </div>
          </div>
          
          <div className="flex-1 border-t border-white/5 pt-4">
            <div className="flex justify-between text-[8px] text-[#8F9FB3] tracking-widest uppercase mb-3">
              <span className="flex items-center gap-1"><div className="w-2 h-0.5 bg-emerald-500" /> Health</span>
              <span className="flex items-center gap-1"><div className="w-2 h-0.5 bg-blue-500" /> Mood</span>
              <span className="flex items-center gap-1"><div className="w-2 h-0.5 bg-amber-500" /> Energy</span>
              <span className="flex items-center gap-1"><div className="w-2 h-0.5 bg-purple-500" /> Sleep</span>
            </div>
            {/* Simple CSS Grid Chart Mockup */}
            <div className="flex items-end justify-between h-20 w-full opacity-60">
               {[45, 60, 80, 50, 95, 70, 85, 40, 65, 90, 55, 75].map((h, i) => (
                 <div key={i} className="w-3 bg-gradient-to-t from-emerald-900 to-emerald-400 rounded-t-sm transition-all hover:opacity-100 cursor-pointer" style={{ height: `${h}%` }} />
               ))}
            </div>
            <div className="flex justify-between text-[7px] font-mono text-white/30 mt-2">
              <span>1</span><span>5</span><span>10</span><span>15</span><span>20</span><span>25</span><span>30</span>
            </div>
          </div>
        </div>

        {/* System Resources */}
        <div className="lg:col-span-2 bg-[#040C1A] border border-white/5 rounded-xl p-5 flex flex-col">
          <div className="mb-6">
            <h3 className="text-[10px] font-bold tracking-widest text-white uppercase mb-1">SYSTEM RESOURCES</h3>
            <p className="text-[9px] text-[#8F9FB3]">Operational Status</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { l: "CPU", v: 23, c: "text-cyan-400", s: "#22D3EE" },
              { l: "RAM", v: 48, c: "text-amber-400", s: "#FBBF24" },
              { l: "DISK", v: 61, c: "text-emerald-400", s: "#34D399" },
              { l: "NET", v: 18, c: "text-rose-400", s: "#FB7185" }
            ].map((r, i) => (
              <div key={i} className="flex flex-col items-center">
                 <div className="w-12 h-12 relative mb-2 flex items-center justify-center">
                   <svg viewBox="0 0 36 36" className="absolute inset-0 w-full h-full -rotate-90">
                     <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                     <circle cx="18" cy="18" r="16" fill="none" stroke={r.s} strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - r.v} strokeLinecap="round" />
                   </svg>
                   <div className={`text-[9px] font-bold font-mono ${r.c}`}>{r.v}%</div>
                 </div>
                 <div className="text-[7px] text-[#8F9FB3] tracking-widest uppercase">{r.l}</div>
              </div>
            ))}
          </div>
          <div className="space-y-3 text-[8px] text-white/70 mt-auto pt-4 border-t border-white/5">
             <div className="flex justify-between items-center">
               <span className="flex items-center gap-1.5"><Globe className="h-3 w-3 text-emerald-400" /> DATABASE HEALTH</span>
               <span className="text-emerald-400 font-mono">100%</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="flex items-center gap-1.5"><HardDrive className="h-3 w-3 text-emerald-400" /> BACKUP STATUS</span>
               <span className="text-emerald-400 font-mono">Up to date</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="flex items-center gap-1.5"><Shield className="h-3 w-3 text-emerald-400" /> SECURITY LEVEL</span>
               <span className="text-emerald-400 font-mono">MAXIMUM</span>
             </div>
          </div>
        </div>

        {/* Global Sunlight Map */}
        <div className="lg:col-span-3 bg-[#040C1A] border border-white/5 rounded-xl p-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-[10px] font-bold tracking-widest text-white uppercase mb-1">GLOBAL SUNLIGHT MAP</h3>
            <p className="text-[9px] text-[#8F9FB3]">Real-time Sunlight Intensity</p>
          </div>
          <div className="flex-1 bg-[#020813] rounded-lg border border-white/5 relative overflow-hidden flex items-center justify-center">
            {/* SVG Map Silhouette */}
            <svg viewBox="0 0 800 400" fill="currentColor" className="w-full text-emerald-900/30">
               <path d="M150 100 Q 200 80 250 120 T 350 150 Q 400 120 450 180 T 550 200 Q 600 150 700 180 L 700 300 L 150 300 Z" />
               <path d="M300 50 Q 350 30 400 80 T 500 120 Q 550 80 600 140 T 750 160 Q 800 100 850 120 L 850 50 L 300 50 Z" />
               {/* Bright spots */}
               <circle cx="450" cy="180" r="150" fill="url(#sunGlow)" />
               <defs>
                 <radialGradient id="sunGlow">
                   <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.6" />
                   <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.2" />
                   <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
                 </radialGradient>
               </defs>
            </svg>
            <div className="absolute inset-x-0 bottom-2 flex justify-between px-4 text-[7px] tracking-widest uppercase text-white/50 bg-black/40 py-1 backdrop-blur-sm">
              <span className="flex items-center gap-1.5"><div className="w-2 h-0.5 bg-emerald-900" /> LOW</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-0.5 bg-emerald-500" /> MODERATE</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-0.5 bg-amber-400" /> HIGH</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-0.5 bg-rose-500" /> EXTREME</span>
            </div>
          </div>
          <button className="mt-4 text-[8px] uppercase tracking-widest text-amber-400 hover:text-white transition-colors text-right flex justify-end items-center gap-1">
            VIEW DETAILED MAP <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        
      </div>

      {/* ═══ ADVANCED SCI-FI ASTRONOMY ROW ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* Qibla Solar Alignment */}
        <div className="lg:col-span-4 bg-[#040C1A] border border-white/5 rounded-xl p-5 flex flex-col relative overflow-hidden group">
          <div className="mb-4 relative z-10">
            <h3 className="text-[10px] font-bold tracking-widest text-white uppercase mb-1">QIBLA SOLAR ALIGNMENT</h3>
            <p className="text-[9px] text-[#8F9FB3]">Sun's relation to the Sacred Mosque</p>
          </div>
          
          <div className="relative h-40 w-full my-4 flex items-center justify-center">
             {/* Sci-Fi Compass SVG */}
             <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-[spin_60s_linear_infinite] opacity-30">
               <circle cx="100" cy="100" r="90" fill="none" stroke="#FBBF24" strokeWidth="1" strokeDasharray="4 8" />
               <circle cx="100" cy="100" r="70" fill="none" stroke="#34D399" strokeWidth="0.5" strokeDasharray="1 4" />
             </svg>
             
             {/* Center Kaaba representation */}
             <div className="w-10 h-10 bg-[#0F172A] border-[2px] border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.3)] rotate-45 z-10 flex items-center justify-center relative">
               <div className="w-6 h-6 border border-amber-400/30" />
               <div className="absolute -top-6 -right-6 text-[6px] font-mono text-emerald-400">21.42° N</div>
             </div>
             
             {/* Sun pointing line */}
             <div className="absolute top-1/2 left-1/2 w-32 h-[1px] bg-gradient-to-r from-amber-500 to-transparent -translate-y-1/2 origin-left -rotate-[22deg] z-0">
               <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-amber-400 rounded-full blur-[3px]" />
             </div>
          </div>
          
          <div className="mt-auto relative z-10">
            <div className="grid grid-cols-5 text-[7px] text-[#8F9FB3] tracking-widest uppercase mb-2 border-b border-white/5 pb-2">
               <div>FAJR</div><div className="text-center">DHUHR</div><div className="text-center">ASR</div><div className="text-center">MAGHRIB</div><div className="text-right">ISHA</div>
            </div>
            <div className="grid grid-cols-5 text-[8px] font-mono text-white">
               <div>-18.0°</div><div className="text-center text-amber-400 font-bold">PEAK</div><div className="text-center">SHADOW</div><div className="text-center">0.0°</div><div className="text-right">-18.0°</div>
            </div>
          </div>
        </div>

        {/* Electromagnetic Spectrum */}
        <div className="lg:col-span-4 bg-[#040C1A] border border-white/5 rounded-xl p-5 flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <h3 className="text-[10px] font-bold tracking-widest text-white uppercase mb-1">ELECTROMAGNETIC SPECTRUM</h3>
              <p className="text-[9px] text-[#8F9FB3]">Real-time solar frequency monitor</p>
            </div>
            <span className="text-[7px] text-cyan-400 tracking-widest font-bold bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">
              UVA/UVB SAFE
            </span>
          </div>
          
          <div className="flex-1 relative flex flex-col justify-center my-4 opacity-80">
            {/* Waveform 1 */}
            <svg viewBox="0 0 300 50" className="w-full h-12 overflow-visible">
               <path d="M 0 25 Q 15 0 30 25 T 60 25 T 90 25 T 120 25 T 150 25 T 180 25 T 210 25 T 240 25 T 270 25 T 300 25" fill="none" stroke="#FBBF24" strokeWidth="1.5" className="animate-[pulse_2s_ease-in-out_infinite]" />
               <text x="5" y="10" fill="#FBBF24" fontSize="8" fontFamily="monospace">VISIBLE (400-700nm)</text>
            </svg>
            {/* Waveform 2 */}
            <svg viewBox="0 0 300 50" className="w-full h-12 overflow-visible mt-2">
               <path d="M 0 25 Q 5 10 10 25 T 20 25 T 30 25 T 40 25 T 50 25 T 60 25 T 70 25 T 80 25 T 90 25 T 100 25 T 110 25 T 120 25 T 130 25 T 140 25 T 150 25 T 160 25 T 170 25 T 180 25 T 190 25 T 200 25 T 210 25 T 220 25 T 230 25 T 240 25 T 250 25 T 260 25 T 270 25 T 280 25 T 290 25 T 300 25" fill="none" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="2 1" />
               <text x="5" y="10" fill="#8B5CF6" fontSize="8" fontFamily="monospace">ULTRAVIOLET (10-400nm)</text>
            </svg>
            {/* Waveform 3 */}
            <svg viewBox="0 0 300 50" className="w-full h-12 overflow-visible mt-2">
               <path d="M 0 25 Q 40 -10 80 25 T 160 25 T 240 25 T 320 25" fill="none" stroke="#EF4444" strokeWidth="2" opacity="0.6" />
               <text x="5" y="10" fill="#EF4444" fontSize="8" fontFamily="monospace">INFRARED (&gt;700nm)</text>
            </svg>
          </div>
          
          <div className="mt-auto grid grid-cols-2 gap-4 border-t border-white/5 pt-4 text-[9px] relative z-10">
             <div>
               <div className="text-[#8F9FB3] tracking-widest uppercase mb-1">SOLAR FLARE STATUS</div>
               <div className="font-mono text-emerald-400 font-bold">CLASS A (NORMAL)</div>
             </div>
             <div className="text-right">
               <div className="text-[#8F9FB3] tracking-widest uppercase mb-1">OZONE BLOCKING</div>
               <div className="font-mono text-cyan-400 font-bold">98.5% EFFICIENT</div>
             </div>
          </div>
        </div>

        {/* Cellular Photon Absorption */}
        <div className="lg:col-span-4 bg-[#040C1A] border border-white/5 rounded-xl p-5 flex flex-col relative overflow-hidden group">
          <div className="mb-4 relative z-10">
            <h3 className="text-[10px] font-bold tracking-widest text-white uppercase mb-1">CELLULAR PHOTON ABSORPTION</h3>
            <p className="text-[9px] text-[#8F9FB3]">Near-Infrared impact on Mitochondria</p>
          </div>
          
          <div className="flex-1 relative flex items-center justify-center min-h-[140px] my-2">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.1)_0%,transparent_70%)]" />
             
             {/* Cell Mockup */}
             <div className="w-32 h-16 rounded-[40px] border border-rose-500/30 flex items-center justify-center relative overflow-hidden bg-rose-500/5">
                {/* Internal zig-zag (Cristae) */}
                <svg viewBox="0 0 100 40" className="absolute inset-0 w-full h-full opacity-50">
                  <path d="M 10 20 L 20 10 L 30 30 L 40 10 L 50 30 L 60 10 L 70 30 L 80 10 L 90 20" fill="none" stroke="#FB7185" strokeWidth="2" strokeLinejoin="round" />
                </svg>
                <div className="relative z-10 px-3 py-1 bg-black/60 rounded text-[7px] font-bold text-rose-300 tracking-widest border border-rose-500/20 backdrop-blur-sm">MITOCHONDRIA</div>
             </div>
             
             {/* Photons hitting */}
             <div className="absolute left-[10%] top-1/2 -translate-y-1/2 flex gap-1 animate-pulse">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,1)]" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,1)]" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,1)]" />
             </div>
             
             {/* ATP Output */}
             <div className="absolute right-[15%] top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
                <div className="w-4 h-4 bg-emerald-500/20 rounded border border-emerald-500/50 flex items-center justify-center text-[5px] text-emerald-400 font-black animate-bounce">ATP</div>
                <div className="w-4 h-4 bg-emerald-500/20 rounded border border-emerald-500/50 flex items-center justify-center text-[5px] text-emerald-400 font-black animate-bounce delay-75">ATP</div>
             </div>
          </div>
          
          <div className="mt-auto border-t border-white/5 pt-4 z-10">
            <p className="text-[8px] text-white/60 leading-relaxed text-center">
              Red and near-infrared light (600-900nm) penetrates skin and stimulates <span className="text-rose-400 font-bold">Cytochrome C Oxidase</span> in mitochondria, increasing ATP (cellular energy) production.
            </p>
          </div>
        </div>
        
      </div>

      {/* ═══ FOOTER ROW ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-[#040C1A] border border-white/5 rounded-xl p-6 flex items-start gap-4">
          <Sun className="h-8 w-8 text-amber-400 shrink-0" />
          <div>
            <div className="text-[10px] font-bold text-white uppercase tracking-widest mb-1.5">DAILY LIGHT REMINDER</div>
            <p className="text-[9px] text-[#8F9FB3] leading-relaxed mb-3">
              Don't forget to get 15-30 minutes of sunlight every morning. Your body, mind, and soul need it.
            </p>
            <button className="text-[8px] text-emerald-400 font-bold tracking-widest uppercase hover:text-emerald-300 transition-colors flex items-center gap-1">
              <Bell className="h-3 w-3" /> SET REMINDER
            </button>
          </div>
        </div>
        
        <div className="bg-[#040C1A] border border-white/5 rounded-xl p-6">
           <div className="text-[10px] font-bold text-white uppercase tracking-widest mb-2">PROPHETIC WISDOM</div>
           <p className="text-[10px] text-[#8F9FB3] leading-relaxed italic">
             "The example of the believers in their mutual love, mercy and compassion is like one body; when one part suffers, the whole body responds with wakefulness and fever."
           </p>
           <div className="text-[8px] text-amber-400 tracking-widest mt-3 uppercase">- Sahih Bukhari (6011)</div>
        </div>
        
        <div className="bg-[#040C1A] border border-white/5 rounded-xl p-6">
           <div className="text-[10px] font-bold text-white uppercase tracking-widest mb-2">ANCIENT WISDOM</div>
           <p className="text-[10px] text-[#8F9FB3] leading-relaxed italic">
             "Sunlight is the best medicine. It heals the body, uplifts the spirit, and illuminates the soul."
           </p>
        </div>
        
        <div className="bg-[#040C1A] border border-white/5 rounded-xl p-6 flex justify-between items-center relative overflow-hidden group cursor-pointer">
           <div className="relative z-10">
             <div className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">COUNTDOWN TO NEXT SUNRISE</div>
             <p className="text-[9px] text-[#8F9FB3] leading-relaxed mb-4">Prepare for another day of light</p>
             <div className="flex gap-4 font-mono text-3xl md:text-4xl font-black text-white">
                <div className="flex flex-col items-center">07<span className="text-[7px] font-sans text-amber-400 tracking-widest mt-1">HOURS</span></div>
                <div className="text-[#8F9FB3] animate-pulse">:</div>
                <div className="flex flex-col items-center">27<span className="text-[7px] font-sans text-amber-400 tracking-widest mt-1">MINUTES</span></div>
                <div className="text-[#8F9FB3] animate-pulse">:</div>
                <div className="flex flex-col items-center text-amber-400">26<span className="text-[7px] font-sans text-[#8F9FB3] tracking-widest mt-1">SECONDS</span></div>
             </div>
           </div>
           <div className="relative z-10 flex flex-col items-center mr-2 lg:mr-6 transition-transform group-hover:scale-110">
             <Sunrise className="h-8 w-8 text-amber-400 mb-2 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
             <div className="text-[8px] font-bold text-amber-400 tracking-widest uppercase">Next Sunrise</div>
           </div>
           
           <div className="absolute right-0 bottom-0 top-0 w-48 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
        </div>
        
      </div>

    </div>
  )
}
