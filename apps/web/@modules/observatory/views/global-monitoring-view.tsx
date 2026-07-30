"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
/* eslint-disable-next-line no-restricted-imports -- Standard icons for global intelligence dashboard */
import {
  Globe2,
  Moon,
  Activity,
  Bot,
  CheckCircle2,
  Hexagon,
  MessageSquare,
  Plane,
  Sun,
  Users,
  ShieldAlert,
  Wifi,
  Anchor,
  Cloud,
  DollarSign
} from "lucide-react"

import { useOSStore } from "@core/store/os-store"

// Monitoring Widgets (Categorized)
import { GlobalStatusWidget } from "@core/widgets/monitoring/global-status-widget"
import { RootCauseWidget } from "@core/widgets/monitoring/root-cause-widget"
import { LiveWorldMapWidget } from "@core/widgets/monitoring/map/live-world-map-widget"
import { PlanetarySeismicWidget } from "@core/widgets/monitoring/seismic/planetary-seismic-widget"
import { AviationTrafficWidget } from "@core/widgets/monitoring/aviation/aviation-traffic-widget"
import { SpaceWeatherWidget } from "@core/widgets/monitoring/space-weather/space-weather-widget"
import { GlobalPrayerNetworkWidget } from "@core/widgets/monitoring/spiritual/global-prayer-network-widget"
import { MaritimeTrafficWidget } from "@core/widgets/monitoring/maritime/maritime-traffic-widget"
import { GlobalClimateWidget } from "@core/widgets/monitoring/climate/global-climate-widget"
import { FinancialMarketsWidget } from "@core/widgets/monitoring/economy/financial-markets-widget"

// Humanity & Cyber Widgets
import { GlobalPopulationWidget } from "@core/widgets/monitoring/demographic/global-population-widget"
import { DigitalConsciousnessWidget } from "@core/widgets/monitoring/internet/digital-consciousness-widget"
import { TrendingTopicsWidget } from "@core/widgets/monitoring/internet/trending-topics-widget"
import { SocialMediaTrendsWidget } from "@core/widgets/monitoring/internet/social-media-trends-widget"
import { CyberThreatMonitorWidget } from "@core/widgets/monitoring/cyber/cyber-threat-monitor-widget"

// Management Widgets
import { ActionCenterWidget } from "@core/widgets/management/action-center-widget"
import { ProjectPortfolioWidget } from "@core/widgets/management/project-portfolio-widget"
import { TaskCenterWidget } from "@core/widgets/management/task-center-widget"
import { MissionCommandWidget } from "@core/widgets/management/mission-command-widget"
import { RecommendationEngineWidget } from "@core/widgets/intelligence/recommendation-engine-widget"
import { KhidraCommandWidget } from "@core/widgets/intelligence/khidra-command-widget"
import { IntelBriefingWidget } from "@core/widgets/intelligence/intel-briefing-widget"

const PROGRESS_SEGMENTS = 20

type MonitoringCategory = "ALL" | "SEISMIC" | "AVIATION" | "MARITIME" | "SPACE_WEATHER" | "CLIMATE" | "SPIRITUAL" | "DEMOGRAPHIC" | "INTERNET" | "CYBER" | "ECONOMY"

import { useGlobalMonitoring } from "@core/api/hooks/use-global-monitoring"

export function GlobalMonitoringView() {
  const [clockWIB, setClockWIB] = useState("00:00:00")
  const [activeCategory, setActiveCategory] = useState<MonitoringCategory>("ALL")
  const { earthquakes, globalPrayers, issPosition, spaceWeather, flights, trends, cyberAttacks, ships, isLoading } = useGlobalMonitoring()
  const { tickClock, systemStatus } = useOSStore()

  // Centralized clock ticking logic synced to the store
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const timeString = now.toLocaleTimeString("en-US", {
          hour12: false,
          timeZone: "Asia/Jakarta",
      }) + " WIB"
      setClockWIB(timeString)
      tickClock(timeString)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [tickClock])

  // Filter map data based on category
  const mapEarthquakes = (activeCategory === "ALL" || activeCategory === "SEISMIC") ? earthquakes : []
  const mapFlights = (activeCategory === "ALL" || activeCategory === "AVIATION") ? flights : []
  const mapIss = (activeCategory === "ALL" || activeCategory === "SPACE_WEATHER") ? issPosition : null
  const mapCyber = (activeCategory === "ALL" || activeCategory === "CYBER") ? cyberAttacks : []
  const mapShips = (activeCategory === "ALL" || activeCategory === "MARITIME") ? ships : []

  return (
    <section
      id="monitoring"
      className="bg-space border-success/30 relative z-10 overflow-hidden border-b py-20 font-mono text-foreground"
    >
      {/* ═══ LAYER 1: DEEP SPACE BACKGROUND ══════════════════════════════════ */}
      <div className="pointer-events-none absolute inset-0">
        <div className="theme-grid-bg absolute inset-0 opacity-30" />
        <div className="bg-radial-gradient from-success/10 absolute top-1/2 left-1/2 h-[1000px] w-[1500px] -translate-x-1/2 -translate-y-1/2 via-primary/5 to-transparent blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] space-y-4 px-4">
        {/* ═══ TOP HEADER ═════════════════════════════════════════════════════ */}
        <div className="flex flex-col items-center justify-between gap-4 border-b border-white/10 pb-4 xl:flex-row">
          <div className="flex items-center gap-4">
            <div className="bg-space inline-flex items-center gap-3 rounded-sm border-2 border-primary/60 px-3.5 py-1.5 text-xs font-black tracking-[0.25em] text-primary uppercase shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <span className="rounded-xs bg-primary px-1.5 py-0.5 font-black text-black">
                12
              </span>
              <span>GLOBAL MONITORING CENTER</span>
            </div>
            <h2 className="ml-2 font-mono text-sm font-black tracking-widest text-primary uppercase">
              Observe Humanity Through Knowledge
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-6">
            <div className="text-right">
              <div className="font-mono text-xl font-black tracking-widest text-white drop-shadow-[0_0_8px_#FFF]">
                {clockWIB}
              </div>
              <div className="mt-0.5 text-[9px] font-bold text-primary uppercase">
                {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
              </div>
            </div>
            <div className="border-l border-white/10 pl-6">
              <div className="text-[9px] font-bold text-white/50 uppercase">
                STATUS
              </div>
              {isLoading ? (
                <div className="mt-1 flex items-center gap-2 text-[10px] font-black text-warning">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-warning shadow-[0_0_10px_#FF9900]" />
                  SYNCHRONIZING APIs...
                </div>
              ) : (
                <div className="mt-1 flex items-center gap-2 text-[10px] font-black text-success">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-success shadow-[0_0_10px_#00FF66]" />
                  API SYNCED
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ═══ CATEGORY SELECTOR ═════════════════════════════════════════════ */}
        <div className="flex flex-wrap items-center gap-2 py-2">
          {[
            { id: "ALL", label: "ALL SYSTEMS", icon: Globe2 },
            { id: "SEISMIC", label: "SEISMIC", icon: Activity },
            { id: "AVIATION", label: "AVIATION", icon: Plane },
            { id: "MARITIME", label: "MARITIME", icon: Anchor },
            { id: "SPACE_WEATHER", label: "SPACE WEATHER", icon: Sun },
            { id: "CLIMATE", label: "CLIMATE", icon: Cloud },
            { id: "SPIRITUAL", label: "SPIRITUAL", icon: Moon },
            { id: "DEMOGRAPHIC", label: "DEMOGRAPHIC", icon: Users },
            { id: "INTERNET", label: "INTERNET", icon: Wifi },
            { id: "CYBER", label: "CYBER THREATS", icon: ShieldAlert },
            { id: "ECONOMY", label: "ECONOMY", icon: DollarSign }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as MonitoringCategory)}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm border text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${
                activeCategory === cat.id 
                  ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(0,240,255,0.2)]" 
                  : "bg-space border-white/10 text-white/50 hover:bg-white/5 hover:text-white"
              }`}
            >
              <cat.icon className={`h-3 w-3 ${activeCategory === cat.id ? "animate-pulse" : ""}`} />
              {cat.label}
            </button>
          ))}
        </div>

        {/* ═══ LAYER 2: DYNAMIC WIDGETS based on Category ════════════════════ */}
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12">
          {/* Always show Global Status */}
          <div className="flex flex-col gap-4 lg:col-span-3 xl:col-span-2">
            <GlobalStatusWidget />
          </div>

          {(activeCategory === "DEMOGRAPHIC") && (
            <div className="lg:col-span-9 xl:col-span-10 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <GlobalPopulationWidget />
            </div>
          )}
          
          {(activeCategory === "INTERNET") && (
            <div className="lg:col-span-9 xl:col-span-10 grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Force the layout to adapt for internet tab */}
              <div className="lg:col-span-8 xl:col-span-8 flex flex-col gap-4">
                <SocialMediaTrendsWidget />
                <DigitalConsciousnessWidget />
              </div>
              <div className="lg:col-span-4 xl:col-span-4">
                <TrendingTopicsWidget trends={trends} />
              </div>
            </div>
          )}

          {(activeCategory === "MARITIME") && (
            <div className="lg:col-span-9 xl:col-span-10">
              <MaritimeTrafficWidget ships={ships} />
            </div>
          )}

          {(activeCategory === "CLIMATE") && (
            <div className="lg:col-span-9 xl:col-span-10">
              <GlobalClimateWidget />
            </div>
          )}

          {(activeCategory === "ECONOMY") && (
            <div className="lg:col-span-9 xl:col-span-10">
              <FinancialMarketsWidget />
            </div>
          )}

          {/* Map is kept in the DOM to prevent Leaflet appendChild crashes on unmount, hidden via CSS when not needed */}
          <div className={`${(activeCategory === "DEMOGRAPHIC" || activeCategory === "INTERNET" || activeCategory === "CLIMATE" || activeCategory === "ECONOMY") ? "hidden" : "block"} lg:col-span-9 xl:col-span-10`}>
            <LiveWorldMapWidget earthquakes={mapEarthquakes} issPosition={mapIss} flights={mapFlights} cyberAttacks={mapCyber} ships={mapShips} />
          </div>

          {/* Conditional Widgets based on category */}
          {(activeCategory !== "DEMOGRAPHIC" && activeCategory !== "INTERNET" && activeCategory !== "CYBER" && activeCategory !== "MARITIME" && activeCategory !== "CLIMATE" && activeCategory !== "ECONOMY") && (
            <div className="flex flex-col gap-4 lg:col-span-3 xl:col-span-2">
              {(activeCategory === "ALL" || activeCategory === "SPACE_WEATHER") && (
                <SpaceWeatherWidget spaceWeather={spaceWeather} />
              )}
              {(activeCategory === "ALL" || activeCategory === "SPIRITUAL") && (
                <GlobalPrayerNetworkWidget globalPrayers={globalPrayers} />
              )}
            </div>
          )}
        </div>

        {/* ═══ LAYER 3: SECONDARY WIDGETS ════════════════════════════════════ */}
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12">
          {(activeCategory === "ALL" || activeCategory === "AVIATION") && (
            <AviationTrafficWidget flights={flights} />
          )}
          {(activeCategory === "ALL" || activeCategory === "SEISMIC") && (
            <PlanetarySeismicWidget earthquakes={earthquakes} />
          )}
          {(activeCategory === "ALL" || activeCategory === "CYBER") && (
            <CyberThreatMonitorWidget cyberAttacks={cyberAttacks} />
          )}
          {(activeCategory === "ALL") && (
            <>
              <GlobalPopulationWidget />
              <SocialMediaTrendsWidget />
              <DigitalConsciousnessWidget />
              <TrendingTopicsWidget trends={trends} />
              <GlobalClimateWidget />
              <FinancialMarketsWidget />
              <MaritimeTrafficWidget ships={ships} />
            </>
          )}
          {activeCategory === "ALL" && (
            <RootCauseWidget />
          )}
        </div>

        {/* ═══ LAYER 4: BOTTOM ROW (Actions + Projects + Tasks) ═══════════════ */}
        {activeCategory === "ALL" && (
          <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12">
            <RecommendationEngineWidget />
            <ActionCenterWidget />
            <ProjectPortfolioWidget />
            <TaskCenterWidget />
          </div>
        )}

        {/* ═══ LAYER 5: INTEL BRIEFING ROW ════════════════════════════════════ */}
        {activeCategory === "ALL" && (
          <div className="pt-2">
            <IntelBriefingWidget />
          </div>
        )}

        {/* ═══ LAYER 6: LOWEST COMMAND ROW ════════════════════════════════════ */}
        {activeCategory === "ALL" && (
          <div className="grid grid-cols-1 items-stretch gap-4 pt-2 lg:grid-cols-12">
            <KhidraCommandWidget />
            <MissionCommandWidget />
          </div>
        )}

        {/* ═══ FOOTER ═════════════════════════════════════════════════════════ */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-4 font-mono text-[9px] text-primary md:flex-row">
          <div className="flex items-center gap-3">
            <span className="font-bold tracking-widest text-primary uppercase">
              GLOBAL INTELLIGENCE CENTER
            </span>
            <div className="hidden border-l border-white/10 pl-3 font-sans text-white/50 normal-case italic lg:block">
              &quot;Knowledge without action is potential. Action without knowledge
              is risk. Together, they create a better world.&quot;
            </div>
          </div>

          <div className="flex items-center gap-6 font-bold tracking-widest uppercase">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-success h-4 w-4" />
              <span>
                DATA INTEGRITY <span className="text-success">100%</span>
              </span>
              {/* Progress bar */}
              <div className="bg-space ml-2 flex h-1.5 w-20 gap-0.5">
                {[...Array(PROGRESS_SEGMENTS)].map((_, i) => (
                  <div key={i} className="bg-success h-full flex-1" />
                ))}
              </div>
            </div>

            <div className="hidden xl:block">
              <span>LAST UPDATED</span>
              <br />
              <span className="text-white">26 May 2025 {clockWIB}</span>
            </div>

            <div>
              <span className="text-white">SYSTEM {systemStatus}</span>
              <br />
              <span className="text-success mt-0.5 flex items-center gap-1.5">
                <span className="bg-success h-1.5 w-1.5 animate-pulse rounded-full" />{" "}
                All systems operational
              </span>
            </div>

            <div className="text-right">
              <span className="font-black text-primary">MoonWitness OS</span>
              <br />
              <span className="text-[7px]">
                Global Divine Observatory System
              </span>
            </div>
            <Hexagon className="h-6 w-6 text-primary/50" />
          </div>
        </div>
      </div>
    </section>
  )
}
