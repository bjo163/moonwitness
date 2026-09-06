import { BookOpen, CheckCircle2 } from "lucide-react"
import { DashboardPanel } from "./dashboard-panel"

type DashboardItems = Array<Record<string, any>>

export function DashboardMainPanels({ missions, prayers, feed }: { missions: DashboardItems; prayers: DashboardItems; feed: DashboardItems }) {
  return (
    <div className="space-y-6">
      <DashboardPanel title="Today's Tasks & Activity" action="View all">
        <div className="divide-y divide-border">
          {missions.length === 0 && <p className="py-3 text-sm text-muted-foreground">No task data is available.</p>}
          {missions.slice(0, 5).map((mission, index) => (
            <div key={mission.id ?? index} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full ${mission.status === "done" ? "border border-success/30 bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{mission.title ?? "Untitled task"}</p>
                <p className="truncate text-xs text-muted-foreground">{mission.subtitle ?? "No additional details"}</p>
              </div>
              <span className="font-mono text-xs text-muted-foreground">{mission.progress ?? (mission.status === "done" ? "Done" : "In progress")}</span>
            </div>
          ))}
        </div>
      </DashboardPanel>
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardPanel title="Prayer Schedule">
          <div className="space-y-2">
            {prayers.length === 0 && <p className="text-sm text-muted-foreground">Prayer schedule unavailable.</p>}
            {prayers.slice(0, 5).map((prayer, index) => (
              <div key={prayer.name ?? index} className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2.5">
                <span className="text-sm text-foreground">{prayer.name}</span>
                <span className="font-mono text-sm font-bold text-primary">{prayer.time}</span>
              </div>
            ))}
          </div>
        </DashboardPanel>
        <DashboardPanel title="Knowledge Updates" action="Open feed">
          <div className="space-y-3">
            {feed.length === 0 && <p className="text-sm text-muted-foreground">No knowledge updates are available.</p>}
            {feed.slice(0, 4).map((item, index) => (
              <div key={item.id ?? index} className="flex gap-3">
                <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{item.title ?? item.name ?? "Knowledge update"}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.subtitle ?? item.description ?? "New information available"}</p>
                </div>
              </div>
            ))}
          </div>
        </DashboardPanel>
      </div>
    </div>
  )
}
