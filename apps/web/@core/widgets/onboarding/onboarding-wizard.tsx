"use client"
import { useMounted } from "@core/hooks"

import React, { useState, useEffect } from "react"
import { useMoonStore } from "@core/store/moon-store"
import { Shield, Orbit, ArrowRight, Check, Compass, BookOpen } from "lucide-react"

const STEPS = [
  {
    title: "INITIATING SEQUENCE",
    subtitle: "Welcome to MoonWitness OS",
    description: "You have accessed the Global Divine Observatory. This tactical interface connects you to the Quran, Hadith, and global spiritual telemetry in real-time.",
    icon: Orbit
  },
  {
    title: "TACTICAL HUD",
    subtitle: "Command & Control",
    description: "Navigate through the ERP dashboard to view live Qibla radar, prayer times, and global monitoring systems. Everything is designed for precision and focus.",
    icon: Compass
  },
  {
    title: "DIVINE SCRIPTURES",
    subtitle: "Uncorrupted Truth",
    description: "Access 114 Surahs, authentic Hadith collections, and the beautiful names of Allah (Asmaul Husna) directly from your terminal.",
    icon: BookOpen
  },
  {
    title: "SYSTEM READY",
    subtitle: "Clearance Granted",
    description: "Your session is now active. May peace and guidance be upon you.",
    icon: Shield
  }
]

export function OnboardingWizard() {
  const mounted = useMounted()
  const [step, setStep] = useState(0)
  const hasCompletedOnboarding = useMoonStore(s => s.hasCompletedOnboarding)
  const completeOnboarding = useMoonStore(s => s.completeOnboarding)

  
  if (!mounted || hasCompletedOnboarding) return null

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      completeOnboarding()
    }
  }

  const current = STEPS[step]
  if (!current) return null
  const Icon = current.icon
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
      <div className="panel-clip relative w-full max-w-2xl border border-cyan-500/30 bg-space/95 p-8 shadow-[0_0_50px_rgba(0,240,255,0.15)] animate-in fade-in zoom-in duration-500">
        
        {/* Progress Bar */}
        <div className="absolute left-0 top-0 h-1 w-full bg-black/40">
          <div 
            className="h-full bg-cyan-400 transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_30px_rgba(0,240,255,0.2)] transition-all">
            <Icon className="h-10 w-10 text-cyan-400" />
          </div>

          <h4 className="font-mono text-sm tracking-[0.3em] text-cyan-500 mb-2">
            STEP 0{step + 1} // {current.title}
          </h4>
          <h2 className="font-sans text-3xl font-black text-white uppercase drop-shadow-md mb-4">
            {current.subtitle}
          </h2>
          <p className="font-mono text-xs leading-relaxed text-slate-300 max-w-lg mb-10">
            {current.description}
          </p>

          <div className="flex w-full items-center justify-between border-t border-cyan-500/20 pt-6">
            <button
              onClick={completeOnboarding}
              className="font-mono text-[10px] text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
            >
              SKIP SEQUENCE
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 rounded-none border border-cyan-400 bg-cyan-500/20 px-6 py-3 font-mono text-xs font-bold text-cyan-300 uppercase tracking-widest transition-all hover:bg-cyan-500 hover:text-black shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)]"
            >
              {step === STEPS.length - 1 ? (
                <>
                  INITIALIZE <Check className="h-4 w-4" />
                </>
              ) : (
                <>
                  PROCEED <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
