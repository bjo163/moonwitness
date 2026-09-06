"use client"

import { LawJusticeHero } from "./law-justice-hero"
import {
  JusticePillars,
  LiberationFronts,
  StrategicDirectives,
} from "./law-justice-panels"

export function LawJusticeView() {
  return (
    <div className="min-h-screen bg-card p-4 font-sans text-foreground select-none md:p-8">
      <LawJusticeHero />
      <JusticePillars />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <LiberationFronts />
        <StrategicDirectives />
      </div>
    </div>
  )
}
