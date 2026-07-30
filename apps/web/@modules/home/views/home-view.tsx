"use client"

import React from "react"

import { HomeHeroSection } from "./01-home-hero-section"
import { HomeObservatorySection } from "./02-home-observatory-section"
import { HomeKnowledgeSection } from "./03-home-knowledge-section"
import { HomeHistorySection } from "./04-home-history-section"
import { HomeAstronomySection } from "./05-home-astronomy-section"
import { HomeAnalyticsSection } from "./06-home-analytics-section"
import { HomeMissionSection } from "./07-home-mission-section"
import { HomeFooterSection } from "./08-home-footer-section"

export function HomeView() {
  return (
    <div className="bg-space flex min-h-screen flex-col overflow-x-hidden font-sans text-foreground selection:bg-cyan-500 selection:text-black">
      {/* 1. HERO SECTION */}
      <HomeHeroSection />

      {/* 2. OBSERVATORY SECTION */}
      <HomeObservatorySection />

      {/* 3. KNOWLEDGE SECTION */}
      <HomeKnowledgeSection />

      {/* 4. HISTORY SECTION */}
      <HomeHistorySection />

      {/* 5. ASTRONOMY SECTION */}
      <HomeAstronomySection />

      {/* 6. ANALYTICS SECTION */}
      <HomeAnalyticsSection />

      {/* 7. MISSION SECTION */}
      <HomeMissionSection />

      {/* 8. FOOTER SECTION */}
      <HomeFooterSection />
    </div>
  )
}
