"use client"

import React, { useEffect, useState } from "react"
import { apiClient } from "@moon/client"
/* eslint-disable-next-line no-restricted-imports -- Standard loader icon for Command Center dashboard */
import { Loader2 } from "lucide-react"

import {
  HeroBanner,
  DailyMetrics,
  Feed,
  ProjectsTasks,
} from "@workspace/ui"
import {
  RightSidebar,
  ZakatCalculatorWidget,
  InfaqTrackerWidget,
  MutabaahWidget,
  MosqueRadarWidget,
  SpiritualReportWidget,
} from "@/components/dashboard/dashboard-widgets"

type DashboardResponse = {
  success: boolean
  data: {
    missionStatus: Record<string, any> | null
    todayMission: any[] | null
    todayPrayer: any[] | null
    aiBriefing: any[] | null
    knowledgeFeed: any[] | null
    activeProjects: any[] | null
    tasksOverview: any | null
    moonObservatory: Record<string, any> | null
    globalMonitoring: any[] | null
  }
}

type DashboardData = DashboardResponse["data"]

type MoonData = {
  phase: string
  illumination: string
  azimuth: string
  altitude: string
  distance: string
  visibility: string
}

export function DashboardView() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await apiClient.get<DashboardResponse>(
          "/api/command-center/dashboard"
        )
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
      <div className="bg-background flex min-h-screen items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4 text-primary">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="font-sans text-xs text-muted-foreground">
            Loading dashboard data...
          </p>
        </div>
      </div>
    )
  }

  const missions = data.todayMission ?? []
  const prayers = data.todayPrayer ?? []
  const briefings = data.aiBriefing ?? []
  const moon = (data.moonObservatory ?? {
    phase: "",
    illumination: "",
    azimuth: "",
    altitude: "",
    distance: "",
    visibility: "",
  }) as MoonData
  const feed = data.knowledgeFeed ?? []
  const projects = data.activeProjects ?? []
  const tasks = data.tasksOverview ?? {}

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
          <HeroBanner profile={data.missionStatus ?? undefined} />

          {/* Row 2: Daily Metrics (Mission, Prayer, AI, Moon) */}
          <DailyMetrics
            missions={missions}
            prayers={prayers}
            briefings={briefings}
            moon={moon}
          />

          {/* Row 3: Grid for Feed and Projects/Tasks */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Feed feed={feed} />
            </div>
            <div className="lg:col-span-7">
              <ProjectsTasks
                projects={projects}
                tasks={tasks}
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
          <div className="w-full shrink-0 xl:w-96">
            <RightSidebar
              moon={moon}
              monitoring={data.globalMonitoring ?? []}
              status={data.missionStatus ?? undefined}
            />
          </div>
        </aside>
      </div>
    </>
  )
}

export const ERPDashboardView = DashboardView



