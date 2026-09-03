"use client"

import React from "react"
import { Moon, BookOpen, FileText, Share2, Star } from "lucide-react"

export function AchievementsList() {
  const achievements = [
    {
      title: "Moon Observer",
      description: "Submitted 10 observations",
      date: "24 May 2025",
      icon: Moon,
      color: "text-primary border-primary/30 bg-primary/10",
    },
    {
      title: "Qur'an Explorer",
      description: "Completed 50 verses with notes",
      date: "18 May 2025",
      icon: BookOpen,
      color: "text-success border-success/30 bg-success/10",
    },
    {
      title: "Research Contributor",
      description: "Published 5 research summaries",
      date: "10 May 2025",
      icon: FileText,
      color: "text-primary border-primary/30 bg-primary/10",
    },
    {
      title: "Knowledge Sharer",
      description: "Assisted 10 community inquiries",
      date: "5 May 2025",
      icon: Share2,
      color: "text-warning border-warning/30 bg-warning/10",
    },
    {
      title: "Early Supporter",
      description: "Joined during foundational release",
      date: "26 Apr 2025",
      icon: Star,
      color: "text-warning border-warning/30 bg-warning/10",
    },
  ]

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm text-card-foreground">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Milestones & Achievements
        </h3>
        <button className="font-sans text-xs font-medium text-primary hover:underline">
          View All
        </button>
      </div>

      <div className="space-y-3.5">
        {achievements.map((ach, i) => (
          <div key={i} className="group flex items-start gap-3.5">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${ach.color} shadow-sm`}
            >
              <ach.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-sans text-xs font-semibold text-foreground">
                {ach.title}
              </h4>
              <p className="font-sans text-[11px] text-muted-foreground">
                {ach.description}
              </p>
            </div>
            <div className="pt-0.5 font-mono text-[10px] text-muted-foreground">
              {ach.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
