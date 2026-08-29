"use client"

import React from "react"
import { Moon, BookOpen, FileText, Share2, Star } from "lucide-react"

export function AchievementsList() {
  const achievements = [
    {
      title: "Moon Observer",
      description: "Submitted 10 moon observations",
      date: "24 May 2025",
      icon: Moon,
      color: "text-blue-400 border-blue-400/30",
    },
    {
      title: "Qur'an Explorer",
      description: "Completed 50 verses with notes",
      date: "18 May 2025",
      icon: BookOpen,
      color: "text-emerald-400 border-emerald-400/30",
    },
    {
      title: "Research Contributor",
      description: "Published 5 research papers",
      date: "10 May 2025",
      icon: FileText,
      color: "text-primary border-border",
    },
    {
      title: "Knowledge Sharer",
      description: "Helped 10 community members",
      date: "5 May 2025",
      icon: Share2,
      color: "text-amber-400 border-amber-400/30",
    },
    {
      title: "Early Mission Supporter",
      description: "Joined in the early days",
      date: "26 Apr 2025",
      icon: Star,
      color: "text-fuchsia-400 border-fuchsia-400/30",
    },
  ]

  return (
    <div className="rounded-xl border border-border bg-black/40 p-6 backdrop-blur-md">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-sans text-[10px] font-bold tracking-widest text-primary/70 uppercase">
          Achievements
        </h3>
        <button className="font-sans text-[9px] text-primary transition-colors hover:text-primary">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {achievements.map((ach, i) => (
          <div key={i} className="group flex cursor-default items-start gap-4">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-black/50 ${ach.color} shadow-sm transition-transform group-hover:scale-110`}
            >
              <ach.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-sans text-sm font-semibold text-slate-200 transition-colors group-hover:text-white">
                {ach.title}
              </h4>
              <p className="font-sans text-[10px] text-slate-400">
                {ach.description}
              </p>
            </div>
            <div className="pt-1 font-mono text-[9px] text-slate-500">
              {ach.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
