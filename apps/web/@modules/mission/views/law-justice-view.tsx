"use client"

import React from "react"
import { Scale, Shield, Users, ArrowRight, Gavel, FileText, CheckCircle2 } from "lucide-react"

export function LawJusticeView() {
  return (
    <div className="min-h-screen bg-[#020813] font-sans text-white p-4 md:p-8 select-none">
      
      {/* ═══ HEADER ROW ═══ */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#040C1A] border border-white/5 rounded-2xl p-8 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none translate-y-1/2 -translate-x-1/2" />
        
        <div className="lg:col-span-7 relative z-10 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Scale className="h-6 w-6 text-emerald-400" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase">UMBRELLA MODULE</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-wider leading-tight">
            LAW, JUSTICE &<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">LIBERATION</span>
          </h1>
          
          <p className="text-sm text-[#8F9FB3] leading-relaxed max-w-xl mb-8">
            "And let not the hatred of others to you make you swerve to wrong and depart from justice. Be just: that is next to piety." (Q.S. Al-Ma'idah: 8)
          </p>
          
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-[#020813] text-[10px] font-bold tracking-widest uppercase rounded flex items-center gap-2 transition-colors">
              <Gavel className="h-4 w-4" /> INITIATE ADVOCACY
            </button>
            <button className="px-6 py-3 bg-transparent border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-white text-[10px] font-bold tracking-widest uppercase rounded flex items-center gap-2 transition-colors">
              <FileText className="h-4 w-4" /> LEGAL MANIFESTO
            </button>
          </div>
        </div>
        
        <div className="lg:col-span-5 relative z-10 flex items-center justify-center">
          {/* Abstract Scales SVG Mockup */}
          <div className="relative w-full aspect-square max-w-[400px]">
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <defs>
                <linearGradient id="scaleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
              {/* Central Pillar */}
              <rect x="98" y="40" width="4" height="120" fill="url(#scaleGrad)" rx="2" />
              {/* Base */}
              <path d="M 70 160 L 130 160 L 140 180 L 60 180 Z" fill="rgba(16,185,129,0.2)" stroke="url(#scaleGrad)" strokeWidth="1" />
              {/* Beam */}
              <rect x="40" y="60" width="120" height="4" fill="url(#scaleGrad)" rx="2" />
              {/* Left Pan Chains */}
              <line x1="42" y1="64" x2="20" y2="120" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <line x1="42" y1="64" x2="64" y2="120" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              {/* Right Pan Chains */}
              <line x1="158" y1="64" x2="136" y2="120" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <line x1="158" y1="64" x2="180" y2="120" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              {/* Left Pan */}
              <path d="M 10 120 Q 42 140 74 120 Z" fill="rgba(6,182,212,0.3)" stroke="url(#scaleGrad)" strokeWidth="1" />
              {/* Right Pan */}
              <path d="M 126 120 Q 158 140 190 120 Z" fill="rgba(6,182,212,0.3)" stroke="url(#scaleGrad)" strokeWidth="1" />
              
              {/* Glowing Nodes */}
              <circle cx="100" cy="40" r="8" fill="#10B981" className="animate-pulse drop-shadow-[0_0_10px_rgba(16,185,129,1)]" />
              <circle cx="42" cy="62" r="4" fill="#06B6D4" />
              <circle cx="158" cy="62" r="4" fill="#06B6D4" />
            </svg>
            
            {/* Overlay Text */}
            <div className="absolute top-[35%] left-[10%] text-center">
               <div className="text-[20px] font-bold text-white">42%</div>
               <div className="text-[6px] uppercase tracking-widest text-emerald-400">JUSTICE INDEX</div>
            </div>
            <div className="absolute top-[35%] right-[10%] text-center">
               <div className="text-[20px] font-bold text-white">58%</div>
               <div className="text-[6px] uppercase tracking-widest text-emerald-400">LIBERATION</div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ THREE PILLARS ROW ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            t: "UNIVERSAL JUSTICE",
            d: "Ensuring fair treatment, equal rights, and unbiased trials for all humanity regardless of background.",
            i: Scale,
            c: "text-emerald-400",
            bg: "bg-emerald-400/10",
            bc: "border-emerald-500/30"
          },
          {
            t: "LIBERATION OF OPPRESSED",
            d: "Actively breaking the systemic chains of the Mustadhafin (the marginalized and oppressed).",
            i: Shield,
            c: "text-cyan-400",
            bg: "bg-cyan-400/10",
            bc: "border-cyan-500/30"
          },
          {
            t: "HUMAN RIGHTS ADVOCACY",
            d: "Providing immediate legal aid, resources, and protection for those facing tyrannical systems.",
            i: Users,
            c: "text-blue-400",
            bg: "bg-blue-400/10",
            bc: "border-blue-500/30"
          }
        ].map((p, i) => (
          <div key={i} className="bg-[#040C1A] border border-white/5 rounded-xl p-6 hover:border-white/20 transition-colors group">
            <div className={`w-12 h-12 rounded-lg ${p.bg} ${p.bc} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <p.i className={`h-6 w-6 ${p.c}`} />
            </div>
            <h3 className="text-sm font-bold text-white tracking-widest mb-3 uppercase">{p.t}</h3>
            <p className="text-[11px] text-[#8F9FB3] leading-relaxed mb-6">
              {p.d}
            </p>
            <button className={`text-[9px] ${p.c} font-bold tracking-widest uppercase flex items-center gap-1 group/btn`}>
              EXPLORE INITIATIVE <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>
      
      {/* ═══ DATA INTELLIGENCE ROW ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Cases */}
        <div className="lg:col-span-8 bg-[#040C1A] border border-white/5 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-bold text-white tracking-widest uppercase">ACTIVE LIBERATION FRONTS</h3>
            <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded font-bold uppercase tracking-widest border border-emerald-500/30">
              3 HIGH PRIORITY
            </span>
          </div>
          
          <div className="space-y-4">
            {[
              { region: "Gaza Legal Defense", status: "Active Filing", progress: 75, cases: "12,450", color: "bg-emerald-500" },
              { region: "Uyghur Human Rights", status: "Investigating", progress: 45, cases: "8,300", color: "bg-cyan-500" },
              { region: "Sudan Refugee Aid", status: "Intervention", progress: 60, cases: "5,120", color: "bg-blue-500" },
            ].map((c, i) => (
              <div key={i} className="p-4 bg-[#020813] border border-white/5 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div>
                   <div className="text-[11px] font-bold text-white uppercase tracking-widest mb-1">{c.region}</div>
                   <div className="text-[9px] text-[#8F9FB3]">{c.cases} Affected Individuals</div>
                 </div>
                 <div className="flex-1 w-full max-w-xs">
                   <div className="flex justify-between text-[8px] uppercase tracking-widest mb-1.5">
                     <span className="text-white/70">{c.status}</span>
                     <span className="text-white">{c.progress}%</span>
                   </div>
                   <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                     <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.progress}%` }} />
                   </div>
                 </div>
                 <button className="px-4 py-2 border border-white/10 rounded text-[8px] font-bold text-white hover:bg-white/5 transition-colors uppercase tracking-widest">
                   View Docket
                 </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Strategic Directives */}
        <div className="lg:col-span-4 bg-[#040C1A] border border-white/5 rounded-xl p-6 flex flex-col">
          <div className="mb-6">
            <h3 className="text-[10px] font-bold text-white tracking-widest uppercase">STRATEGIC DIRECTIVES</h3>
            <p className="text-[9px] text-[#8F9FB3] mt-1">Core tenets of prophetic justice</p>
          </div>
          
          <div className="space-y-4 flex-1">
             {[
               "Uphold truth unequivocally",
               "Protect the weak and voiceless",
               "Reject systemic tyranny",
               "Ensure equitable resource distribution",
               "Foster restorative justice"
             ].map((d, i) => (
               <div key={i} className="flex gap-3 items-start">
                 <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                 <span className="text-[10px] text-white/80 leading-relaxed">{d}</span>
               </div>
             ))}
          </div>
          
          <div className="mt-6 pt-5 border-t border-white/10">
             <div className="text-[8px] text-[#8F9FB3] uppercase tracking-widest mb-1">UMBRELLA COMMANDER</div>
             <div className="text-[10px] font-mono text-emerald-400 font-bold">ALLIANCE OF THE JUST</div>
          </div>
        </div>
        
      </div>
      
    </div>
  )
}
