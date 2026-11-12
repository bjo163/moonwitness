"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@moon/client"
import {
  DashboardHeader,
  DashboardLoading,
  DashboardMainPanels,
  DashboardMetrics,
  DashboardSidebar,
  DashboardUnavailable,
  type DashboardData,
  type PolyglotService,
} from "./dashboard-sections"

type DashboardResponse = {
  success: boolean
  status: "success" | "partial" | "unavailable"
  data: DashboardData
  generatedAt: string
}

const SERVICE_CHECKS: Omit<PolyglotService, "status">[] = [
  { name: "API Gateway", url: "/health/live", port: 4000 },
  {
    name: "Celestial Engine",
    url: "/api/services/celestial/health",
    port: 4000,
  },
  {
    name: "AI Knowledge Agent",
    url: "/api/services/ai/health",
    port: 4000,
  },
  {
    name: "PostgreSQL Database",
    url: "/api/external/db/status",
    port: 5432,
  },
]

export function DashboardOverview() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dashboardStatus, setDashboardStatus] =
    useState<DashboardResponse["status"]>("unavailable")
  const [generatedAt, setGeneratedAt] = useState<string | null>(null)
  const [polyglotServices, setPolyglotServices] = useState<PolyglotService[]>([
    ...SERVICE_CHECKS.map((service): PolyglotService => ({ ...service, status: "checking" })),
  ])

  useEffect(() => {
    let isActive = true

    const loadDashboard = async () => {
      try {
        const response = await apiClient.get<DashboardResponse>(
          "/api/command-center/dashboard"
        )
        if (!isActive) return

        if (response.data?.success && response.data.data) {
          setData(response.data.data)
          setDashboardStatus(response.data.status)
          setGeneratedAt(response.data.generatedAt)
        } else {
          setData(null)
          setDashboardStatus("unavailable")
          setGeneratedAt(null)
        }
      } catch {
        if (isActive) {
          setData(null)
          setDashboardStatus("unavailable")
          setGeneratedAt(null)
        }
      } finally {
        if (isActive) setLoading(false)
      }
    }

    const checkServices = async () => {
      const updated: PolyglotService[] = await Promise.all(
        SERVICE_CHECKS.map(async (service) => {
          const startedAt = performance.now()
          try {
            await apiClient.get(service.url, { timeout: 4000 })
            return {
              ...service,
              status: "online" as const,
              latencyMs: Math.round(performance.now() - startedAt),
            }
          } catch {
            const latencyMs = Math.round(performance.now() - startedAt)
            return { ...service, status: "unavailable" as const, latencyMs }
          }
        })
      )
      if (isActive) setPolyglotServices(updated)
    }

    void loadDashboard()
    void checkServices()
    const interval = setInterval(() => void checkServices(), 20_000)
    return () => {
      isActive = false
      clearInterval(interval)
    }
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
  const moon = data.moonObservatory ?? {}

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 font-sans">
      <DashboardHeader status={dashboardStatus} generatedAt={generatedAt} />
      <DashboardMetrics
        data={data}
        missions={missions}
        projects={projects}
        prayers={prayers}
        services={polyglotServices}
      />

      {/* Main Content Grid */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <DashboardMainPanels missions={missions} prayers={prayers} feed={feed} />

        {/* Sidebar Column */}
        <DashboardSidebar moon={moon} services={polyglotServices} />
      </div>
    </div>
  )
}
