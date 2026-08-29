"use client"

import React from "react"
import {
  Target,
  Beaker,
  Telescope,
  BookOpen,
  Clock,
  Users,
  ArrowRight,
} from "lucide-react"

export function MissionSummary() {
  const stats = [
    {
      label: "Knowledge Points",
      value: "12,480",
      icon: Target,
      color: "text-success",
    },
    {
      label: "Research Contributions",
      value: "128",
      icon: Beaker,
      color: "text-primary",
    },
    {
      label: "Observations Submitted",
      value: "87",
      icon: Telescope,
      color: "text-primary",
    },
    {
      label: "Verses Studied",
      value: "1,248",
      icon: BookOpen,
      color: "text-warning",
    },
    {
      label: "Hours Spent Learning",
      value: "342h",
      icon: Clock,
      color: "text-foreground",
    },
    {
      label: "Helped Others",
      value: "56",
      icon: Users,
      color: "text-primary",
    },
  ]

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm text-card-foreground">
      <h3 className="mb-4 font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Activity Summary
      </h3>

      <div className="space-y-3">
        {stats.map((stat, i) => (
          <div key={i} className="group flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/40 ${stat.color}`}
              >
                <stat.icon className="h-4 w-4" />
              </div>
              <span className="font-sans text-xs text-foreground">
                {stat.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-foreground">
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 py-2.5 font-sans text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
        View Full Statistics <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
