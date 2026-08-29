"use client"

import React from "react"
import { Moon, BookOpen, Star, Shield, HelpCircle, Trophy } from "lucide-react"

export function MissionBadges() {
  const badges = [
    {
      name: "Moon Observer",
      level: "Level 3",
      icon: Moon,
      color: "text-primary border-primary/40 bg-primary/10",
    },
    {
      name: "Qur'an Explorer",
      level: "Level 4",
      icon: BookOpen,
      color: "text-success border-success/40 bg-success/10",
    },
    {
      name: "Researcher",
      level: "Level 2",
      icon: Shield,
      color: "text-primary border-primary/40 bg-primary/10",
    },
    {
      name: "Knowledge Sharer",
      level: "Level 2",
      icon: Trophy,
      color: "text-warning border-warning/40 bg-warning/10",
    },
    {
      name: "Early Adopter",
      level: "Special",
      icon: Star,
      color: "text-warning border-warning/40 bg-warning/10",
    },
    {
      name: "Community Helper",
      level: "Level 1",
      icon: HelpCircle,
      color: "text-primary border-border bg-muted",
    },
    {
      name: "Consistent Learner",
      level: "Level 3",
      icon: BookOpen,
      color: "text-primary border-primary/40 bg-primary/10",
    },
    {
      name: "Upcoming",
      level: "Locked",
      icon: HelpCircle,
      color: "text-muted-foreground border-border border-dashed bg-muted/40 opacity-60",
    },
  ]

  return (
    <div className="h-full rounded-xl border border-border bg-card p-6 shadow-sm text-card-foreground">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Achievements & Badges
        </h3>
        <button className="font-sans text-xs font-medium text-primary hover:underline">
          View All
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {badges.map((badge, i) => (
          <div
            key={i}
            className="group flex cursor-pointer flex-col items-center"
          >
            <div
              className={`relative flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-200 group-hover:scale-105 ${badge.color}`}
            >
              <badge.icon className="h-5 w-5" />
            </div>
            <div className="mt-2 text-center">
              <p className="font-sans text-[10px] leading-tight font-medium text-foreground">
                {badge.name}
              </p>
              <p className="font-mono text-[9px] text-muted-foreground">
                {badge.level}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
