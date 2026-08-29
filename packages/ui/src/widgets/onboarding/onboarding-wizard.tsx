"use client"

import React, { useState } from "react"
import { useMounted, useLocalStorage } from "@workspace/hooks"
import {
  Shield,
  Orbit,
  ArrowRight,
  Check,
  Compass,
  BookOpen,
} from "lucide-react"

const STEPS = [
  {
    title: "GETTING STARTED",
    subtitle: "Welcome to MoonWitness OS",
    description:
      "You have accessed the Global Knowledge Platform & Observatory. This unified system connects you to the Quran, Hadith, celestial calculations, and spiritual insights in real-time.",
    icon: Orbit,
  },
  {
    title: "OBSERVATION DASHBOARD",
    subtitle: "Command & Control",
    description:
      "Navigate through the Command Center dashboard to view live Qibla radar, prayer times, and global monitoring systems. Everything is designed for precision and focus.",
    icon: Compass,
  },
  {
    title: "DIVINE SCRIPTURES",
    subtitle: "Uncorrupted Truth",
    description:
      "Access 114 Surahs, authentic Hadith collections, and the beautiful names of Allah (Asmaul Husna) directly from your platform.",
    icon: BookOpen,
  },
  {
    title: "SYSTEM READY",
    subtitle: "Setup Complete",
    description:
      "Your platform is now active. May peace and guidance be upon you.",
    icon: Shield,
  },
]

export function OnboardingWizard() {
  const mounted = useMounted()
  const [step, setStep] = useState(0)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] =
    useLocalStorage<boolean>("mw_onboarding_completed", false)

  if (!mounted || hasCompletedOnboarding) return null

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1)
    } else {
      setHasCompletedOnboarding(true)
    }
  }

  const current = STEPS[step]
  if (!current) return null
  const Icon = current.icon
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-card/90 p-4 backdrop-blur-md">
      <div className="rounded-xl bg-card bg-background/95 relative w-full max-w-2xl animate-in border border-border p-8 shadow-sm duration-500 fade-in zoom-in">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 w-full bg-card">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-border bg-primary/10 shadow-sm transition-all">
            <Icon className="h-10 w-10 text-primary" />
          </div>

          <h4 className="mb-2 font-mono text-sm tracking-[0.3em] text-primary">
            STEP 0{step + 1} // {current.title}
          </h4>
          <h2 className="mb-4 font-sans text-3xl font-black text-foreground uppercase drop-shadow-md">
            {current.subtitle}
          </h2>
          <p className="mb-10 max-w-lg font-mono text-xs leading-relaxed text-foreground">
            {current.description}
          </p>

          <div className="flex w-full items-center justify-between border-t border-border pt-6">
            <button
              onClick={() => setHasCompletedOnboarding(true)}
              className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground"
            >
              SKIP SEQUENCE
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 rounded-none border border-border bg-primary/10 px-6 py-3 font-mono text-xs font-bold tracking-widest text-primary uppercase shadow-sm transition-all hover:bg-primary hover:text-foreground hover:shadow-sm"
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
