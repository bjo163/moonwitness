import {
  Activity,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
} from "lucide-react"
import { ErrorNotice, MetricCard } from "@workspace/ui"

export { DashboardPanel } from "./dashboard-panel"
export { DashboardMainPanels } from "./dashboard-main-panels"
export { DashboardSidebar } from "./dashboard-sidebar"
export type { DashboardData, PolyglotService, ServiceStatus } from "./dashboard.types"
import type { DashboardData, PolyglotService } from "./dashboard.types"

export function DashboardLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground font-sans">
      <div className="flex items-center gap-3">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary" />
        Loading dashboard...
      </div>
    </div>
  )
}

export function DashboardUnavailable() {
  return <ErrorNotice message="Dashboard data is temporarily unavailable." />
}

export function DashboardHeader({
  status,
  generatedAt,
}: {
  status: "success" | "partial" | "unavailable"
  generatedAt: string | null
}) {
  const statusLabel =
    status === "success"
      ? "All dashboard sources available"
      : status === "partial"
        ? "Some dashboard sources unavailable"
        : "Dashboard unavailable"
  const statusColor =
    status === "success"
      ? "bg-success"
      : status === "partial"
        ? "bg-warning"
        : "bg-destructive"
  const generatedTime = generatedAt
    ? new Date(generatedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null

  return (
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Overview</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Operations Overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          A concise view of operational records and source availability.
        </p>
      </div>
      <div
        aria-live="polite"
        className="flex items-center gap-2 text-xs text-muted-foreground"
      >
        <span aria-hidden="true" className={`h-2 w-2 rounded-full ${statusColor}`} />
        <span>{statusLabel}</span>
        {generatedTime && <span>· Generated {generatedTime}</span>}
      </div>
    </div>
  )
}

export function DashboardMetrics({
  data,
  missions,
  projects,
  prayers,
  services,
}: {
  data: DashboardData
  missions: Array<Record<string, any>>
  projects: Array<Record<string, any>>
  prayers: Array<Record<string, any>>
  services: PolyglotService[]
}) {
  const completed = missions.filter(
    (mission) => mission.status === "done" || mission.status === "completed"
  ).length
  const checkedServices = services.filter(
    (service) => service.status !== "checking"
  ).length
  const availableServices = services.filter(
    (service) => service.status === "online"
  ).length
  const unavailableServices = checkedServices - availableServices
  const healthValue =
    checkedServices === 0
      ? "Checking"
      : unavailableServices === 0
        ? "Available"
        : availableServices === 0
          ? "Unavailable"
          : "Partial"
  const healthDetail =
    checkedServices === 0
      ? "Health checks pending"
      : `${availableServices} of ${services.length} services responding`

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="Open tasks"
        value={
          data.tasksOverview?.open === undefined
            ? "—"
            : String(data.tasksOverview.open)
        }
        detail={`${completed} completed in returned tasks`}
        icon={CheckCircle2}
      />
      <MetricCard
        label="Active projects"
        value={data.activeProjects === null ? "—" : String(projects.length)}
        detail="Returned project records"
        icon={BriefcaseBusiness}
      />
      <MetricCard
        label="Prayer schedule"
        value={data.todayPrayer === null ? "—" : String(prayers.length)}
        detail={data.todayPrayer === null ? "Schedule unavailable" : "Computed entries"}
        icon={Clock3}
      />
      <MetricCard
        label="Service health"
        value={healthValue}
        detail={healthDetail}
        icon={Activity}
        href="/terminal"
      />
    </div>
  )
}
