import { ArrowUpRight } from "lucide-react"
import { Button, Panel } from "@workspace/ui"

export function DashboardPanel({ title, action, children }: { title: string; action?: string; children: React.ReactNode }) {
  return (
    <Panel padding="lg" className="rounded-xl shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {action && (
          <Button type="button" variant="ghost" size="sm" className="h-auto gap-1 px-0 text-xs font-medium text-primary hover:underline">
            {action}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      {children}
    </Panel>
  )
}
