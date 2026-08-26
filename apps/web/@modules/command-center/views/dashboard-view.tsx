"use client"

import React, { useEffect, useState } from "react"
import { apiClient } from "@core/api/client"
/* eslint-disable-next-line no-restricted-imports -- Standard loader icon for Command Center dashboard */
import { Loader2 } from "lucide-react"

// Import Widgets
import { ErpHeroBanner } from "@core/widgets/command-center/command-center-hero-banner"
import { ErpDailyMetrics } from "@core/widgets/command-center/command-center-daily-metrics"
import { ErpKnowledgeFeed } from "@core/widgets/command-center/command-center-knowledge-feed"
import { ErpProjectsTasks } from "@core/widgets/command-center/command-center-projects-tasks"
import { ErpRightSidebar } from "@core/widgets/command-center/command-center-right-sidebar"
import { ZakatCalculatorWidget } from "@core/widgets/command-center/zakat-calculator-widget"
import { InfaqTrackerWidget } from "@core/widgets/command-center/infaq-tracker-widget"
import { MutabaahWidget } from "@core/widgets/command-center/mutabaah-widget"
import { MosqueRadarWidget } from "@core/widgets/command-center/mosque-radar-widget"
import { SpiritualReportWidget } from "@core/widgets/command-center/spiritual-report-widget"

type DashboardData = any

export function ERPDashboardView() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await apiClient.get<{
          success: boolean
          data: DashboardData
        }>("/api/command-center/dashboard")
        if (response.data?.success) {
          setData(response.data.data)
        }
      } catch (err) {
        console.error("Failed to load Command Center dashboard data:", err)
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  if (loading || !data) {
    return (
      <div className="bg-space flex min-h-screen items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4 text-cyan-400">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="font-mono text-xs tracking-widest uppercase">
            Loading Telemetry...
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* 
        GRID ARCHITECTURE
        - Left: Main Content (Hero, Metrics, Feed, Projects) - takes 8 columns on xl
        - Right: Sidebar (Moon, Monitor, Status, Actions) - takes 4 columns on xl
      */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Main Center Column (xl:col-span-8) */}
        <main className="space-y-6 xl:col-span-8">
          {/* Row 1: Hero Banner */}
          <ErpHeroBanner profile={data.missionStatus} />

          {/* Row 2: Daily Metrics (Mission, Prayer, AI, Moon) */}
          <ErpDailyMetrics
            missions={data.todayMission}
            prayers={data.todayPrayer}
            briefings={data.aiBriefing}
            moon={data.moonObservatory}
          />

          {/* Row 3: Grid for Feed and Projects/Tasks */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <ErpKnowledgeFeed feed={data.knowledgeFeed} />
            </div>
            <div className="lg:col-span-7">
              <ErpProjectsTasks
                projects={data.activeProjects}
                tasks={data.tasksOverview}
              />
            </div>
          </div>
          {/* Row 4: Finance & Devotion */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            <MutabaahWidget />
            <ZakatCalculatorWidget />
            <InfaqTrackerWidget />
            <MosqueRadarWidget />
          </div>
          {/* Row 5: Spiritual Report */}
          <div className="grid grid-cols-1 gap-6">
            <SpiritualReportWidget />
          </div>
        </main>

        {/* Aside Right Column (xl:col-span-4) */}
        <aside className="xl:col-span-4">
          <ErpRightSidebar
            moon={data.moonObservatory}
            monitoring={data.globalMonitoring}
            status={data.missionStatus}
          />
        </aside>
      </div>
    </>
  )
}
