"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@moon/client"
import { DashboardHeader, DashboardLoading, DashboardMainPanels, DashboardMetrics, DashboardSidebar, DashboardUnavailable, type DashboardData, type PolyglotService } from "./dashboard-sections"
type Response = { success: boolean; status: "success" | "partial" | "unavailable"; data: DashboardData }

export function DashboardOverview() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [polyglotServices, setPolyglotServices] = useState<PolyglotService[]>([
    { name: "API Gateway (Node.js)", url: "/health/live", port: 4000, status: "checking" },
    { name: "Celestial Engine (@moon/compute)", url: "/api/services/celestial/health", port: 4000, status: "checking" },
    { name: "AI Knowledge Agent (@moon/witness)", url: "/api/services/ai/health", port: 4000, status: "checking" },
    { name: "PostgreSQL Database", url: "/db/status", port: 5432, status: "checking" },
  ])

  useEffect(() => {
    apiClient
      .get<Response>("/api/command-center/dashboard")
      .then((response) => {
        if (response.data?.success) setData(response.data.data)
      })
      .catch((error) => console.error("Failed to load dashboard", error))
      .finally(() => setLoading(false))

    const checkServices = async () => {
      const updated = await Promise.all(
        polyglotServices.map(async (svc) => {
          const t0 = performance.now()
          try {
            const res = await apiClient.get(svc.url, { timeout: 4000 })
            const latencyMs = Math.round(performance.now() - t0)
            const isOk = res.status >= 200 && res.status < 300
            return {
              ...svc,
              status: isOk ? ("online" as const) : ("offline" as const),
              latencyMs,
            }
          } catch {
            return { ...svc, status: "offline" as const }
          }
        })
      )
      setPolyglotServices(updated)
    }

    checkServices()
    const interval = setInterval(checkServices, 20000)
    return () => clearInterval(interval)
  }, [])


  if (loading) {
    return <DashboardLoading />
  }

  if (!data) {
    return <DashboardUnavailable />
  }

  const missions = data.todayMission ?? []
  const prayers = data.todayPrayer ?? []
  const feed = data.knowledgeFeed ?? []
  const projects = data.activeProjects ?? []
  const monitoring = data.globalMonitoring ?? []
  const moon = data.moonObservatory ?? {}
  const completed = missions.filter((mission) => mission.status === "done").length

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 font-sans">
      <DashboardHeader />
      <DashboardMetrics data={data} missions={missions} projects={projects} prayers={prayers} completed={completed} />

      {/* Main Content Grid */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <DashboardMainPanels missions={missions} prayers={prayers} feed={feed} />

        {/* Sidebar Column */}
        <DashboardSidebar moon={moon} services={polyglotServices} />
      </div>
    </div>
  )
}
