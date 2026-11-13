import Link from "next/link"
import { Activity, Moon, Users } from "lucide-react"
import type { PolyglotService } from "./dashboard.types"
import { DashboardPanel } from "./dashboard-panel"

export function DashboardSidebar({ moon, services }: { moon: Record<string, any>; services: PolyglotService[] }) {
  return (
    <aside className="space-y-6">
      <DashboardPanel title="Celestial Observatory">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10"><Moon className="h-6 w-6 text-primary" /></div>
          <div><p className="font-semibold text-foreground">{moon.phase ?? "Current phase"}</p><p className="mt-0.5 text-xs text-muted-foreground">{moon.illumination ?? "—"} illumination</p></div>
        </div>
        <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-muted-foreground">Visibility</dt><dd className="font-mono font-medium text-foreground">{moon.visibility ?? "—"}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">Altitude</dt><dd className="font-mono font-medium text-foreground">{moon.altitude ?? "—"}</dd></div>
        </dl>
      </DashboardPanel>
      <DashboardPanel title="Polyglot Services & Telemetry">
        <div className="space-y-3">
          {services.map((service) => (
              <div key={service.name} className="flex items-center justify-between border-b border-border/40 pb-2 last:border-0 last:pb-0">
              <div className="flex items-center gap-2"><span aria-hidden="true" className={`h-2 w-2 rounded-full ${service.status === "online" ? "bg-success" : service.status === "checking" ? "bg-warning" : "bg-destructive"}`} /><div><p className="text-xs font-medium text-foreground">{service.name}</p><p className="font-mono text-[10px] text-muted-foreground">Port :{service.port}</p></div></div>
              <div className="text-right"><span className={`font-mono text-[10px] font-bold uppercase ${service.status === "online" ? "text-success" : service.status === "checking" ? "text-warning" : "text-destructive"}`}>{service.status}</span>{service.latencyMs !== undefined && <p className="font-mono text-[10px] text-muted-foreground">{service.latencyMs}ms</p>}</div>
            </div>
          ))}
        </div>
      </DashboardPanel>
      <DashboardPanel title="Quick Actions">
        <div className="grid grid-cols-2 gap-2">
          <Link href="/users" className="rounded-lg border border-border bg-card p-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"><Users className="mb-2 h-4 w-4 text-primary" />Users</Link>
          <Link href="/terminal" className="rounded-lg border border-border bg-card p-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"><Activity className="mb-2 h-4 w-4 text-primary" />Developer Console</Link>
        </div>
      </DashboardPanel>
    </aside>
  )
}
