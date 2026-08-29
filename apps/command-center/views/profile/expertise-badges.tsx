"use client"

import React from "react"
import { Telescope, BookOpen, Brain, Network, Activity } from "lucide-react"

export function ExpertiseBadges() {
  const expertises = [
    {
      label: "Astronomy",
      icon: Telescope,
      color: "text-blue-400 border-blue-400/30 bg-blue-400/10",
    },
    {
      label: "Qur'an Studies",
      icon: BookOpen,
      color: "text-success border-success/30 bg-success/10",
    },
    {
      label: "AI & Machine Learning",
      icon: Brain,
      color: "text-fuchsia-400 border-fuchsia-400/30 bg-fuchsia-400/10",
    },
    {
      label: "Space Observation",
      icon: Activity,
      color: "text-primary border-border bg-primary/10",
    },
    {
      label: "History & Civilization",
      icon: Network,
      color: "text-warning border-warning/30 bg-warning/10",
    },
    {
      label: "Data Science",
      icon: Network,
      color: "text-indigo-400 border-indigo-400/30 bg-indigo-400/10",
    },
  ]

  return (
    <div className="rounded-xl border border-border bg-card p-6 backdrop-blur-md">
      <h3 className="mb-6 font-sans text-[10px] font-bold tracking-widest text-primary/70 uppercase">
        Expertise & Interests
      </h3>

      <div className="flex flex-wrap gap-3">
        {expertises.map((exp, i) => (
          <div
            key={i}
            className={`flex cursor-default items-center gap-2 rounded-lg border px-3 py-2 transition-all hover:scale-105 ${exp.color}`}
          >
            <exp.icon className="h-4 w-4" />
            <span className="font-sans text-xs font-medium">{exp.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
