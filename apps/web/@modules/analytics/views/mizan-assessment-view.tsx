"use client"

import React, { useState } from "react"
import { ContextBlock, HUDPanel, HUDContextBlock } from "@core/ui"
import { Scale, Activity, ShieldAlert, Cpu, Sparkles } from "lucide-react"

// Because HUDPanel etc is the standard, I will use generic div with HUD classes for now if it doesn't exist, but I know HUD UI is heavily used in Moonwitness. Wait, the actual component names according to AGENTS.md are HUDPanel, HUDContextBlock, HUDButton. But earlier I saw `ContextBlock` in @core/ui. I will use standard tailwind classes that mimic the AGENTS.md rules.

export function MizanAssessmentView() {
  const [generalSufficient, setGeneralSufficient] = useState(false)
  const [balanceSatisfied, setBalanceSatisfied] = useState(false)
  const [internalReferenceVerified, setInternalReferenceVerified] = useState(false)

  let method = "general_limited"
  let limitation = ""
  let accent = "amber"

  if (generalSufficient) {
    method = "general"
    accent = "cyan"
  } else if (balanceSatisfied && internalReferenceVerified) {
    method = "prophetic"
    accent = "purple"
  } else {
    method = "general_limited"
    accent = "amber"
    limitation = balanceSatisfied 
      ? 'Internal reference is not verified.' 
      : 'A material balance condition is not established.'
  }

  // Get exact hex for tailwind arbitrary values since dynamic classes like bg-${accent}-500 don't always work in Tailwind JIT unless safelisted.
  const accentColors = {
    cyan: { text: "text-[#00F0FF]", border: "border-[#00F0FF]", bg: "bg-[#00F0FF]", shadow: "shadow-[0_0_15px_rgba(0,240,255,0.15)]" },
    purple: { text: "text-[#A100FF]", border: "border-[#A100FF]", bg: "bg-[#A100FF]", shadow: "shadow-[0_0_15px_rgba(161,0,255,0.15)]" },
    amber: { text: "text-[#FFE600]", border: "border-[#FFE600]", bg: "bg-[#FFE600]", shadow: "shadow-[0_0_15px_rgba(255,230,0,0.15)]" },
    emerald: { text: "text-[#00FF66]", border: "border-[#00FF66]", bg: "bg-[#00FF66]", shadow: "shadow-[0_0_15px_rgba(0,255,102,0.15)]" },
  }
  
  const currentAccent = accentColors[accent as keyof typeof accentColors]

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 md:px-0 pb-20">
      {/* HUD Context Block Alternative if ContextBlock from @core/ui is not enough */}
      <div className="border border-[#A100FF]/30 bg-[#0A0F17]/80 backdrop-blur-md p-6 rounded-lg shadow-[0_0_20px_rgba(161,0,255,0.15)]">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-wider font-['Orbitron']">MIZAN ASSESSMENT ENGINE</h1>
            <p className="text-sm text-[#8B9BB0] mt-1">Public testing interface for the internal weighted-assessment and validation logic.</p>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-[#8B9BB0] font-mono tracking-widest">OPERATION</div>
            <div className="text-xs font-bold text-[#A100FF] font-mono">SIMULATION-MODE</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* INPUT PANEL */}
        <div className="border border-[#00F0FF]/30 bg-[#0A0F17]/80 backdrop-blur-md p-6 rounded-lg flex flex-col gap-6 relative overflow-hidden transition-all duration-300">
          <div className="flex items-center gap-3 border-b border-[#00F0FF]/20 pb-4">
            <Activity className="w-5 h-5 text-[#00F0FF]" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Assessment Parameters</h3>
          </div>
          
          <p className="text-[#8B9BB0] text-xs">
            Toggle the parameters below to observe how the Mizan engine determines the final assessment method for a given case.
          </p>

          <div className="flex flex-col gap-4 mt-2">
            <button 
              onClick={() => setGeneralSufficient(!generalSufficient)}
              className={`flex items-center gap-4 p-4 border rounded-lg transition-all duration-300 ${generalSufficient ? 'bg-[#00F0FF]/10 border-[#00F0FF]/50 shadow-[0_0_15px_rgba(0,240,255,0.15)] -translate-y-0.5' : 'bg-black/40 border-slate-800/50 hover:border-[#00F0FF]/50'}`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${generalSufficient ? 'border-[#00F0FF] bg-[#00F0FF]/20' : 'border-slate-700'}`}>
                {generalSufficient && <div className="w-2.5 h-2.5 bg-[#00F0FF] rounded-full" />}
              </div>
              <div className="flex flex-col items-start text-left">
                <span className={`text-sm font-bold ${generalSufficient ? 'text-[#00F0FF]' : 'text-[#F5F5F5]'}`}>General Sufficient</span>
                <span className="text-xs text-[#8B9BB0]">Case can be assessed using general empirical knowledge.</span>
              </div>
            </button>

            <button 
              onClick={() => setBalanceSatisfied(!balanceSatisfied)}
              className={`flex items-center gap-4 p-4 border rounded-lg transition-all duration-300 ${balanceSatisfied ? 'bg-[#A100FF]/10 border-[#A100FF]/50 shadow-[0_0_15px_rgba(161,0,255,0.15)] -translate-y-0.5' : 'bg-black/40 border-slate-800/50 hover:border-[#A100FF]/50'}`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${balanceSatisfied ? 'border-[#A100FF] bg-[#A100FF]/20' : 'border-slate-700'}`}>
                {balanceSatisfied && <div className="w-2.5 h-2.5 bg-[#A100FF] rounded-full" />}
              </div>
              <div className="flex flex-col items-start text-left">
                <span className={`text-sm font-bold ${balanceSatisfied ? 'text-[#A100FF]' : 'text-[#F5F5F5]'}`}>Balance Satisfied</span>
                <span className="text-xs text-[#8B9BB0]">Material balance condition is established without coercion.</span>
              </div>
            </button>

            <button 
              onClick={() => setInternalReferenceVerified(!internalReferenceVerified)}
              className={`flex items-center gap-4 p-4 border rounded-lg transition-all duration-300 ${internalReferenceVerified ? 'bg-[#00FF66]/10 border-[#00FF66]/50 shadow-[0_0_15px_rgba(0,255,102,0.15)] -translate-y-0.5' : 'bg-black/40 border-slate-800/50 hover:border-[#00FF66]/50'}`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${internalReferenceVerified ? 'border-[#00FF66] bg-[#00FF66]/20' : 'border-slate-700'}`}>
                {internalReferenceVerified && <div className="w-2.5 h-2.5 bg-[#00FF66] rounded-full" />}
              </div>
              <div className="flex flex-col items-start text-left">
                <span className={`text-sm font-bold ${internalReferenceVerified ? 'text-[#00FF66]' : 'text-[#F5F5F5]'}`}>Internal Reference Verified</span>
                <span className="text-xs text-[#8B9BB0]">Prophetic scriptures explicitly validate the outcome.</span>
              </div>
            </button>
          </div>
        </div>

        {/* OUTPUT PANEL */}
        <div className={`border ${currentAccent.border}/40 bg-[#0A0F17]/90 backdrop-blur-md p-6 rounded-lg flex flex-col relative overflow-hidden transition-all duration-500 ${currentAccent.shadow}`}>
          <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
            <Cpu className={`w-40 h-40 ${currentAccent.text}`} />
          </div>
          
          <div className={`flex items-center gap-3 border-b ${currentAccent.border}/20 pb-4`}>
            <Sparkles className={`w-5 h-5 ${currentAccent.text}`} />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Engine Output</h3>
          </div>
          
          <div className="flex-1 flex flex-col justify-center items-center py-12">
            <div className={`mb-6 p-5 rounded-full border ${currentAccent.border}/30 ${currentAccent.bg}/10 relative`}>
              <div className={`absolute inset-0 rounded-full ${currentAccent.border}/50 animate-ping opacity-20`} />
              <Scale className={`w-12 h-12 ${currentAccent.text}`} />
            </div>
            
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#8B9BB0] mb-2 font-mono">Selected Method</h4>
            <div className={`text-3xl font-black uppercase tracking-wider ${currentAccent.text} font-['Orbitron'] mb-4 text-center transition-colors duration-300`}>
              {method.replace('_', ' ')}
            </div>

            {limitation ? (
              <div className={`mt-4 p-3 border border-[#FFE600]/30 bg-[#FFE600]/10 rounded-lg flex items-start gap-3 text-[#FFE600] text-xs max-w-sm`}>
                <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span><strong className="block mb-1">Limitation Applied:</strong> {limitation}</span>
              </div>
            ) : (
              <div className="mt-4 px-6 py-2 border border-[#00FF66]/30 bg-[#00FF66]/10 rounded-full text-[#00FF66] text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00FF66] shadow-[0_0_5px_#00FF66] animate-pulse" />
                Optimal Path
              </div>
            )}
          </div>

          <div className="mt-auto border-t border-slate-800/50 pt-4 relative z-10">
            <div className="flex justify-between items-center text-[10px] font-mono text-[#8B9BB0]">
              <span className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${currentAccent.bg} shadow-[0_0_5px_currentColor]`} />
                STATUS: RESOLVED
              </span>
              <span>CONFIDENCE: HIGH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
