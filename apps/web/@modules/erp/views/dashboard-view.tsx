"use client"

import React, { useEffect, useState } from "react"
import { apiClient } from "@core/api/client"
/* eslint-disable-next-line no-restricted-imports -- Standard loader icon for ERP dashboard */
import { Loader2 } from "lucide-react"

// Import Widgets
import { ErpHeroBanner } from "@core/widgets/erp/erp-hero-banner"
import { ErpDailyMetrics } from "@core/widgets/erp/erp-daily-metrics"
import { ErpKnowledgeFeed } from "@core/widgets/erp/erp-knowledge-feed"
import { ErpProjectsTasks } from "@core/widgets/erp/erp-projects-tasks"
import { ErpRightSidebar } from "@core/widgets/erp/erp-right-sidebar"

type DashboardData = any

export function ERPDashboardView() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await apiClient.get<{ success: boolean; data: DashboardData }>("/api/erp/dashboard")
        if (response.data?.success) {
          setData(response.data.data)
        }
      } catch (err) {
        console.error("Failed to load ERP dashboard data:", err)
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  if (loading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-space p-8">
        <div className="flex flex-col items-center gap-4 text-cyan-400">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="font-mono text-xs uppercase tracking-widest">Loading Telemetry...</p>
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
              <ErpProjectsTasks projects={data.activeProjects} tasks={data.tasksOverview} />
            </div>
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
