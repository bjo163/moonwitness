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
import type { DashboardData } from "./dashboard.types"

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

export function DashboardHeader() {
  return (
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Overview</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Operations Overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          A concise view of today&apos;s activity and system status across MoonWitness.
        </p>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
        Last synced just now
      </div>
    </div>
  )
}

export function DashboardMetrics({ data, missions, projects, prayers, completed }: { data: DashboardData; missions: Array<Record<string, any>>; projects: Array<Record<string, any>>; prayers: Array<Record<string, any>>; completed: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="Open tasks" value={String(data.tasksOverview?.open ?? missions.length)} detail={`${completed} completed today`} icon={CheckCircle2} />
      <MetricCard label="Active projects" value={String(projects.length)} detail="Across all workspaces" icon={BriefcaseBusiness} />
      <MetricCard label="Prayer schedule" value={String(prayers.length)} detail="Today's entries" icon={Clock3} />
      <MetricCard label="System health" value="See telemetry" detail="Service status is checked separately" icon={Activity} href="/terminal" />
    </div>
  )
}
