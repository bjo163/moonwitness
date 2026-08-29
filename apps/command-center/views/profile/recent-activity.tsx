"use client"

import React from "react"
import { Moon, BookOpen, FileText, Brain } from "lucide-react"

export function RecentActivity() {
  const activities = [
    {
      title: "Submitted Moon Observation",
      description: "Moon Phase - Waning Crescent 12.4%",
      date: "Today",
      time: "06:45 WIB",
      icon: Moon,
      tag: "Observatory",
      color: "text-primary border-primary/30",
    },
    {
      title: "Studied Qur'an Verse",
      description: "Surah Al-Mulk (67:3-5)",
      date: "Today",
      time: "05:12 WIB",
      icon: BookOpen,
      tag: "Scripture",
      color: "text-success border-success/30",
    },
    {
      title: "Completed Research Paper",
      description: "The Miracle of the Moon in Qur'an",
      date: "Yesterday",
      time: "22:30 WIB",
      icon: FileText,
      tag: "Research",
      color: "text-primary border-primary/30",
    },
    {
      title: "AI Discussion with KHIDRA",
      description: "Astronomical alignment in ancient times",
      date: "Yesterday",
      time: "15:48 WIB",
      icon: Brain,
      tag: "KHIDRA AI",
      color: "text-accent-foreground border-border",
    },
  ]

  return (
    <div className="h-full rounded-xl border border-border bg-card p-6 shadow-sm text-card-foreground">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Recent Activity
        </h3>
        <button className="font-sans text-xs font-medium text-primary hover:underline">
          View All
        </button>
      </div>

      <div className="relative space-y-4">
        {activities.map((act, i) => (
          <div
            key={i}
            className="group relative flex items-center justify-between"
          >
            <div className="flex w-full items-center gap-3.5">
              {/* Date/Time Left */}
              <div className="w-16 shrink-0 text-right">
                <div className="font-sans text-[11px] font-semibold text-foreground">
                  {act.date}
                </div>
                <div className="font-mono text-[10px] text-muted-foreground">
                  {act.time}
                </div>
              </div>

              {/* Timeline Node */}
              <div
                className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-muted/50 shadow-sm ${act.color}`}
              >
                <act.icon className="h-4 w-4" />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between gap-2 rounded-lg border border-border bg-muted/20 p-3 transition-colors hover:bg-accent/40 xl:flex-row xl:items-center">
                <div>
                  <h4 className="font-sans text-xs font-semibold text-foreground">
                    {act.title}
                  </h4>
                  <p className="mt-0.5 font-sans text-[11px] text-muted-foreground">
                    {act.description}
                  </p>
                </div>
                <div className="hidden items-center gap-1 self-start rounded-md border border-border bg-muted px-2 py-0.5 font-sans text-[10px] whitespace-nowrap text-muted-foreground sm:flex xl:self-auto">
                  {act.tag}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
