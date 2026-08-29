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
      color: "text-emerald-400",
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
      color: "text-indigo-400",
    },
    {
      label: "Verses Studied",
      value: "1,248",
      icon: BookOpen,
      color: "text-amber-400",
    },
    {
      label: "Hours Spent Learning",
      value: "342h",
      icon: Clock,
      color: "text-slate-300",
    },
    {
      label: "Helped Others",
      value: "56",
      icon: Users,
      color: "text-fuchsia-400",
    },
  ]

  return (
    <div className="rounded-xl border border-border bg-black/40 p-6 backdrop-blur-md">
      <h3 className="mb-6 font-sans text-[10px] font-bold tracking-widest text-primary/70 uppercase">
        Mission Summary
      </h3>

      <div className="space-y-4">
        {stats.map((stat, i) => (
          <div key={i} className="group flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 ${stat.color} transition-transform group-hover:scale-110`}
              >
                <stat.icon className="h-4 w-4" />
              </div>
              <span className="font-sans text-xs text-slate-300">
                {stat.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-white">
                {stat.value}
              </span>
              <svg
                className="h-3 w-3 text-emerald-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-primary/10 py-2.5 font-sans text-[10px] font-bold text-primary transition-colors hover:bg-primary/10">
        View Full Statistics <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  )
}
