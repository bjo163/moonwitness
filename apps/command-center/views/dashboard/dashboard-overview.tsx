"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Moon,
  Users,
} from "lucide-react"
import { apiClient } from "@moon/client"
import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui"

type DashboardData = {
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
type Response = { success: boolean; data: DashboardData }

function Panel({
  title,
  action,
  children,
}: {
  title: string
  action?: string
  children: ReactNode
}) {
  return (
    <Card className="rounded-xl border border-border bg-card p-5 shadow-sm text-card-foreground">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {action && (
          <button className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            {action}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {children}
    </Card>
  )
}

function Metric({
  label,
  value,
  detail,
  icon: Icon,
  href,
}: {
  label: string
  value: string
  detail: string
  icon: typeof Activity
  href?: string
}) {
  const content = (
    <>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-foreground font-mono">
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </>
  )

  if (!href) {
    return (
      <Card className="rounded-xl border border-border bg-card p-5 shadow-sm text-card-foreground">
        {content}
      </Card>
    )
  }

  return (
    <Link href={href} className="block rounded-xl border border-border bg-card p-5 shadow-sm text-card-foreground transition-colors hover:border-primary/50 hover:bg-accent/50">
      {content}
    </Link>
  )
}

export function DashboardOverview() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [polyglotServices, setPolyglotServices] = useState<
    Array<{
      name: string
      url: string
      port: number
      status: "online" | "offline" | "checking"
      latencyMs?: number
    }>
  >([
    { name: "API Gateway (Fastify)", url: "/health/live", port: 4000, status: "checking" },
    { name: "Celestial Engine (Python)", url: "/api/services/celestial/health", port: 8001, status: "checking" },
    { name: "AI Agent (Python)", url: "/api/services/ai/health", port: 8002, status: "checking" },
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
            const res = await fetch(svc.url)
            const latencyMs = Math.round(performance.now() - t0)
            return {
              ...svc,
              status: res.ok ? ("online" as const) : ("offline" as const),
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
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground font-sans">
        <div className="flex items-center gap-3">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary" />
          Loading dashboard...
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-5 text-sm text-destructive">
        Dashboard data is temporarily unavailable.
      </div>
    )
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
      {/* Header Greeting */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-wider">
            Overview
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            Operations Overview
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A concise view of today&apos;s activity and system status across MoonWitness.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          Last synced just now
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Open tasks"
          value={String(data.tasksOverview?.open ?? missions.length)}
          detail={`${completed} completed today`}
          icon={CheckCircle2}
        />
        <Metric
          label="Active projects"
          value={String(projects.length)}
          detail="Across all workspaces"
          icon={BriefcaseBusiness}
        />
        <Metric
          label="Prayer schedule"
          value={String(prayers.length)}
          detail="Today's entries"
          icon={Clock3}
        />
        <Metric
          label="System health"
          value="Operational"
          detail="All services responding"
          icon={Activity}
          href="/terminal"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Panel title="Today's Tasks & Activity" action="View all">
            <div className="divide-y divide-border">
              {missions.slice(0, 5).map((mission, index) => (
                <div
                  key={mission.id ?? index}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      mission.status === "done"
                        ? "bg-success/10 text-success border border-success/30"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {mission.title ?? "Untitled task"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {mission.subtitle ?? "No additional details"}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {mission.progress ??
                      (mission.status === "done" ? "Done" : "In progress")}
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="Prayer Schedule">
              <div className="space-y-2">
                {prayers.slice(0, 5).map((prayer, index) => (
                  <div
                    key={prayer.name ?? index}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2.5"
                  >
                    <span className="text-sm text-foreground">{prayer.name}</span>
                    <span className="text-sm font-bold text-primary font-mono">
                      {prayer.time}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Knowledge Updates" action="Open feed">
              <div className="space-y-3">
                {feed.slice(0, 4).map((item, index) => (
                  <div key={item.id ?? index} className="flex gap-3">
                    <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.title ?? item.name ?? "Knowledge update"}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.subtitle ?? item.description ?? "New information available"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>

        {/* Sidebar Column */}
        <aside className="space-y-6">
          <Panel title="Celestial Observatory">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
                <Moon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {moon.phase ?? "Current phase"}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {moon.illumination ?? "—"} illumination
                </p>
              </div>
            </div>
            <dl className="mt-5 space-y-2 text-sm border-t border-border pt-4">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Visibility</dt>
                <dd className="font-mono font-medium text-foreground">
                  {moon.visibility ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Altitude</dt>
                <dd className="font-mono font-medium text-foreground">
                  {moon.altitude ?? "—"}
                </dd>
              </div>
            </dl>
          </Panel>

          <Panel title="Polyglot Services & Telemetry">
            <div className="space-y-3">
              {polyglotServices.map((svc) => (
                <div
                  key={svc.name}
                  className="flex items-center justify-between border-b border-border/40 pb-2 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        svc.status === "online"
                          ? "bg-success"
                          : svc.status === "checking"
                            ? "bg-warning"
                            : "bg-destructive"
                      }`}
                    />
                    <div>
                      <p className="text-xs font-medium text-foreground">{svc.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">Port :{svc.port}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase ${
                        svc.status === "online"
                          ? "text-success"
                          : svc.status === "checking"
                            ? "text-warning"
                            : "text-destructive"
                      }`}
                    >
                      {svc.status}
                    </span>
                    {svc.latencyMs !== undefined && (
                      <p className="text-[10px] text-muted-foreground font-mono">{svc.latencyMs}ms</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Quick Actions">
            <div className="grid grid-cols-2 gap-2">
              <a
                href="/users"
                className="rounded-lg border border-border bg-card p-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Users className="mb-2 h-4 w-4 text-primary" />
                Users
              </a>
              <a
                href="/terminal"
                className="rounded-lg border border-border bg-card p-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Activity className="mb-2 h-4 w-4 text-primary" />
                Developer Console
              </a>
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  )
}
