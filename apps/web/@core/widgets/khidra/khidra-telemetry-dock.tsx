"use client"

import React, { useEffect, useState } from "react"
import { Network, Database, Lock, Hexagon } from "lucide-react"

const ANIM_DELAY_STEP_S = 0.05
const WAVEFORM_BAR_COUNT = 40
const WAVEFORM_HEIGHT_BASE = 20
const WAVEFORM_HEIGHT_MOD = 80
const WAVEFORM_PRNG_MULTI = 37
const NODE_CYCLE_INTERVAL_MS = 2000

export function KhidraTelemetryDock() {
  const [learningNodes, setLearningNodes] = useState([
    { label: "Reading Qur'an", active: true },
    { label: "Analyzing Patterns", active: false },
    { label: "Connecting Knowledge", active: false },
    { label: "Generating Insights", active: false },
    { label: "Updating Understanding", active: false },
  ])

  useEffect(() => {
    // Animate the active learning node
    let currentIndex = 0
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % learningNodes.length
      setLearningNodes((nodes) =>
        nodes.map((node, i) => ({
          ...node,
          active: i === currentIndex,
        }))
      )
    }, NODE_CYCLE_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [learningNodes.length])

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-12 w-full font-mono text-primary">
      {/* STATUS */}
      <div className="panel-glass col-span-12 rounded-lg p-4 sm:col-span-3 flex flex-col justify-between">
        <div className="mb-2 text-[10px] font-bold tracking-widest uppercase">
          KHIDRA STATUS
        </div>
        <div className="flex items-center gap-4">
          {/* Radar UI */}
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-primary/20">
            <div className="absolute h-12 w-12 rounded-full border border-primary/40" />
            <div className="absolute h-8 w-8 rounded-full border border-primary/60" />
            <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_#00FF41]" />
            <div className="absolute h-[1px] w-full bg-primary/20" />
            <div className="absolute h-full w-[1px] bg-primary/20" />
            {/* Sweep */}
            <div className="absolute h-1/2 w-1/2 origin-bottom-right animate-[spin_4s_linear_infinite] bg-gradient-to-tl from-primary/40 to-transparent right-[50%] bottom-[50%]" style={{ clipPath: "polygon(100% 100%, 0 0, 100% 0)" }} />
          </div>
          <div className="flex flex-col gap-1.5 text-[9px] font-medium tracking-widest uppercase w-full">
            <div className="flex justify-between border-b border-primary/10 pb-0.5">
              <span className="text-primary/60">UPTIME</span>
              <span className="font-bold">99.98%</span>
            </div>
            <div className="flex justify-between border-b border-primary/10 pb-0.5">
              <span className="text-primary/60">LEARNING</span>
              <span className="font-bold">Continuous</span>
            </div>
            <div className="flex justify-between border-b border-primary/10 pb-0.5">
              <span className="text-primary/60">MEMORY</span>
              <span className="font-bold">∞</span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary/60">MODE</span>
              <span className="font-bold">Adaptive</span>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVE LEARNING */}
      <div className="panel-glass col-span-12 rounded-lg p-4 sm:col-span-3 flex flex-col justify-between">
        <div className="mb-4 text-[10px] font-bold tracking-widest uppercase">
          ACTIVE LEARNING
        </div>
        {/* Fake Sine Wave Graph */}
        <div className="relative h-8 w-full border-b border-primary/20 overflow-hidden mb-4">
          <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="h-full w-full stroke-primary/30 fill-transparent stroke-[0.5px]">
             <path d="M0,10 Q10,0 20,10 T40,10 T60,10 T80,10 T100,10" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-between px-2">
            {learningNodes.map((node, i) => (
              <div key={i} className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${node.active ? 'bg-primary shadow-[0_0_8px_#00FF41] scale-150' : 'bg-primary/30'}`} />
            ))}
          </div>
        </div>
        <div className="flex justify-between text-[8px] tracking-widest uppercase text-primary/70 text-center">
          {learningNodes.map((node, i) => (
            <div key={i} className={`w-[20%] transition-colors duration-500 ${node.active ? 'text-primary font-bold drop-shadow-[0_0_3px_#00FF41]' : ''}`}>
              {node.label.split(' ').map((word, j) => <div key={j}>{word}</div>)}
            </div>
          ))}
        </div>
      </div>

      {/* LIVE KNOWLEDGE FLOW */}
      <div className="panel-glass col-span-12 rounded-lg p-4 sm:col-span-3 flex flex-col justify-between items-center text-center">
        <div className="mb-2 w-full text-left text-[10px] font-bold tracking-widest uppercase">
          LIVE KNOWLEDGE FLOW
        </div>
        <div className="relative flex-1 w-full flex items-center justify-center">
            {/* World Map Background (SVG dots) */}
            <div className="absolute inset-0 bg-[url('/assets/world-map.svg')] bg-contain bg-center bg-no-repeat opacity-20" />
            <div className="relative flex items-center justify-center">
              <div className="absolute h-16 w-16 animate-ping rounded-full border border-primary/30" />
              <Network className="h-6 w-6 text-primary drop-shadow-[0_0_8px_#00FF41]" />
            </div>
        </div>
        <div className="text-[8px] tracking-widest uppercase text-primary/60 mt-2">
          Real-time synchronization with global knowledge network
        </div>
      </div>

      {/* KHIDRA AVATAR & AUDIO */}
      <div className="panel-glass col-span-12 rounded-lg p-4 sm:col-span-3 flex flex-col justify-between relative overflow-hidden">
        <div className="mb-2 text-[10px] font-bold tracking-widest uppercase z-10">
          KHIDRA AVATAR
        </div>
        
        <div className="z-10 flex flex-col gap-4 text-[9px] font-medium tracking-widest uppercase mt-2">
          <div className="flex justify-between border-b border-primary/10 pb-1">
            <span className="text-primary/60">HOLOGRAM MODE</span>
            <span className="font-bold text-primary drop-shadow-[0_0_5px_#00FF41]">ACTIVE</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-primary/60">VOICE MODE</span>
            <div className="flex items-center justify-between">
              {/* Fake Audio Waveform */}
              <div className="flex items-end gap-[1px] h-3 w-[70%] overflow-hidden opacity-70">
                {Array.from({ length: WAVEFORM_BAR_COUNT }).map((_, i) => {
                  const heightPct = WAVEFORM_HEIGHT_BASE + ((i * WAVEFORM_PRNG_MULTI) % WAVEFORM_HEIGHT_MOD)
                  return (
                    <div key={i} className="w-0.5 bg-primary animate-[spectrumPulse_1s_ease_infinite_alternate]" style={{ animationDelay: `${i * ANIM_DELAY_STEP_S}s`, height: `${heightPct}%` }} />
                  )
                })}
              </div>
              <span className="font-bold text-primary drop-shadow-[0_0_5px_#00FF41]">ON</span>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full border border-primary/20 opacity-30" style={{ transform: "rotateX(70deg)" }}>
          <div className="absolute inset-2 rounded-full border border-primary/40" />
          <div className="absolute inset-4 rounded-full border border-primary/60" />
          <Hexagon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 text-primary" style={{ transform: "translate(-50%, -50%) rotateX(-70deg)" }} />
        </div>
      </div>
      
      {/* Bottom Sub-bar */}
      <div className="col-span-12 flex flex-col sm:flex-row justify-between items-center gap-4 bg-black/40 border border-primary/20 p-3 rounded-lg backdrop-blur-md text-[9px] font-bold tracking-widest uppercase">
         <div className="flex items-center gap-2">
           <Database className="h-4 w-4 text-primary" />
           <span className="text-white">&quot;Knowledge is a light that guides to truth. Khidra is here to walk with you.&quot;</span>
         </div>
         
         <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
             <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_5px_#00FF41]" />
             <span>SYSTEM SYNCHRONIZED</span>
           </div>
           
           <div className="flex items-center gap-3">
             <div className="flex flex-col text-right">
               <span className="text-primary/50 text-[7px]">KNOWLEDGE CORE</span>
               <span className="text-primary drop-shadow-[0_0_5px_#00FF41]">CONNECTED</span>
             </div>
             <Hexagon className="h-5 w-5 text-primary" />
           </div>
           
           <div className="flex items-center gap-2">
             <span className="text-primary/50 text-[7px]">DATA INTEGRITY</span>
             <div className="h-1 w-24 bg-primary/20 rounded-full overflow-hidden">
               <div className="h-full bg-primary w-full shadow-[0_0_5px_#00FF41]" />
             </div>
             <span className="text-primary">100%</span>
             <Lock className="h-3.5 w-3.5 text-primary/50 ml-1" />
           </div>
         </div>
      </div>
    </div>
  )
}
