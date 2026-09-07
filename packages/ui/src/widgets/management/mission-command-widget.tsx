import React from "react"
import {
  Moon,
  Scroll,
  Telescope,
  Languages,
  BarChart2,
  ChevronRight,
  ArrowRight,
} from "lucide-react"
import { Button } from "../../components/button"

export function MissionCommandWidget() {
  return (
    <div className="flex flex-col gap-4 lg:col-span-4 font-sans">
      <div className="flex flex-1 flex-col rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              OPERATIONS CENTER
            </div>
            <div className="mt-0.5 text-xs font-medium text-foreground">
              Today&apos;s Priority Actions
            </div>
          </div>
          <Button type="button" variant="ghost" className="flex cursor-pointer items-center gap-1 text-xs font-medium text-primary hover:underline">
            View All <ChevronRight className="h-3 w-3" />
          </Button>
        </div>

        <div className="grid flex-1 grid-cols-2 sm:grid-cols-5 items-center gap-2.5">
          {[
            {
              n: "Observe Moon",
              icon: Moon,
              sev: "High Priority",
              badge: "text-primary bg-primary/10",
            },
            {
              n: "Verify Hadith",
              icon: Scroll,
              sev: "Medium Priority",
              badge: "text-warning bg-warning/10",
            },
            {
              n: "Research Astronomy",
              icon: Telescope,
              sev: "High Priority",
              badge: "text-primary bg-primary/10",
            },
            {
              n: "Translate Verse",
              icon: Languages,
              sev: "Normal",
              badge: "text-success bg-success/10",
            },
            {
              n: "Analyze Data",
              icon: BarChart2,
              sev: "Low Priority",
              badge: "text-muted-foreground bg-muted",
            },
          ].map((m, i) => (
            <div
              key={i}
              className="flex h-full cursor-pointer flex-col items-center justify-center rounded-lg border border-border bg-muted/20 p-3 text-center transition-colors hover:bg-accent/50"
            >
              <m.icon className="mb-2 h-5 w-5 text-primary" />
              <div className="mb-1 text-xs font-medium text-foreground">
                {m.n}
              </div>
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${m.badge}`}>
                {m.sev}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm">
        <div className="w-28 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          EXECUTIVE OVERVIEW
        </div>

        <div className="flex flex-1 justify-between px-4 font-sans">
          <div className="text-center">
            <div className="mb-0.5 text-[11px] text-muted-foreground uppercase">
              Open Issues
            </div>
            <div className="text-destructive text-sm font-bold">14</div>
            <div className="text-destructive text-[10px]">
              1 Critical
            </div>
          </div>
          <div className="text-center">
            <div className="mb-0.5 text-[11px] text-muted-foreground uppercase">
              Projects
            </div>
            <div className="text-sm font-bold text-foreground">42</div>
            <div className="text-[10px] text-muted-foreground">
              Active
            </div>
          </div>
          <div className="text-center">
            <div className="mb-0.5 text-[11px] text-muted-foreground uppercase">
              Tasks
            </div>
            <div className="text-sm font-bold text-foreground">238</div>
            <div className="text-[10px] text-muted-foreground">
              Total
            </div>
          </div>
          <div className="text-center">
            <div className="mb-0.5 text-[11px] text-muted-foreground uppercase">
              Insights
            </div>
            <div className="text-sm font-bold text-foreground">18</div>
            <div className="text-[10px] text-muted-foreground">New</div>
          </div>
          <div className="text-center">
            <div className="mb-0.5 text-[11px] text-muted-foreground uppercase">
              Confidence
            </div>
            <div className="text-success text-sm font-bold">97%</div>
            <div className="text-success text-[10px]">
              Verified
            </div>
          </div>
        </div>

        <Button type="button" variant="ghost" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
          View Report <ArrowRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
