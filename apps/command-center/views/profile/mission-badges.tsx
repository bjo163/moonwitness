"use client"

import React from "react"
import { Moon, BookOpen, Star, Shield, HelpCircle, Trophy } from "lucide-react"

export function MissionBadges() {
  const badges = [
    {
      name: "Moon Observer",
      level: "Level 3",
      icon: Moon,
      color: "text-blue-400 border-blue-400",
    },
    {
      name: "Qur'an Explorer",
      level: "Level 4",
      icon: BookOpen,
      color: "text-emerald-400 border-emerald-400",
    },
    {
      name: "Researcher",
      level: "Level 2",
      icon: Shield,
      color: "text-fuchsia-400 border-fuchsia-400",
    },
    {
      name: "Knowledge Sharer",
      level: "Level 2",
      icon: Trophy,
      color: "text-amber-400 border-amber-400",
    },
    {
      name: "Early Adopter",
      level: "Special",
      icon: Star,
      color:
        "text-yellow-400 border-yellow-400 shadow-sm",
    },
    {
      name: "Community Helper",
      level: "Level 1",
      icon: HelpCircle,
      color: "text-primary border-border",
    },
    {
      name: "Consistent Learner",
      level: "Level 3",
      icon: BookOpen,
      color: "text-indigo-400 border-indigo-400",
    },
    {
      name: "Coming Soon",
      level: "?",
      icon: HelpCircle,
      color: "text-slate-500 border-slate-600 border-dashed opacity-50",
    },
  ]

  return (
    <div className="h-full rounded-xl border border-border bg-black/40 p-6 backdrop-blur-md">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-sans text-[10px] font-bold tracking-widest text-primary/70 uppercase">
          Mission Badges
        </h3>
        <button className="font-sans text-[9px] text-primary transition-colors hover:text-primary">
          View All
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {badges.map((badge, i) => (
          <div
            key={i}
            className="group flex cursor-pointer flex-col items-center"
          >
            {/* Hexagon shape roughly approximated using rotated squares or just a ambienting container */}
            <div
              className={`relative flex h-12 w-12 items-center justify-center rounded-lg border-2 bg-black/50 transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110 ${badge.color}`}
            >
              <badge.icon className="h-5 w-5" />
            </div>
            <div className="mt-2 text-center">
              <p className="font-sans text-[8px] leading-tight font-semibold text-slate-200">
                {badge.name}
              </p>
              <p className="font-mono text-[7px] text-slate-500">
                {badge.level}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
