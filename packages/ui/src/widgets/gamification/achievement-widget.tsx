"use client"
import { useMounted } from "@workspace/hooks"

import React, { useEffect, useState } from "react"
import { Award, Star, Terminal, Shield, Music, Zap } from "lucide-react"
import {
  useAchievementStore,
  ACHIEVEMENTS,
} from "@workspace/state"

const ICON_MAP: Record<string, React.ElementType> = {
  Terminal: Terminal,
  Shield: Shield,
  Music: Music,
  Award: Award,
}

export function AchievementWidget() {
  const mounted = useMounted()
  const points = useAchievementStore((s) => s.points)
  const unlockedIds = useAchievementStore((s) => s.unlockedIds)

  if (!mounted) return null

  // Calculate Level based on points (e.g. 100 points = 1 level)
  const level = Math.floor(points / 100) + 1
  const progressToNextLevel = points % 100

  const recentAchievements = unlockedIds
    .slice(-3) // Last 3
    .reverse()
    .map((id) => ACHIEVEMENTS[id])
    .filter(Boolean)

  return (
    <div className="w-full rounded-md border border-border bg-card p-4">
      <div className="mb-4 flex items-center gap-2">
        <Award className="h-4 w-4 text-fuchsia-400" />
        <h3 className="text-sm font-semibold text-foreground">
          Player status
        </h3>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-fuchsia-500/50 bg-fuchsia-500/10 shadow-sm">
          <span className="text-lg font-black text-fuchsia-400">{level}</span>
        </div>
        <div className="flex-1">
          <div className="mb-1 flex justify-between text-xs text-muted-foreground">
            <span>Level {level}</span>
            <span className="text-fuchsia-400">{points} XP</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/30">
            <div
              className="h-full bg-primary"
              style={{ width: `${progressToNextLevel}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="mb-2 border-b border-border pb-1 text-xs font-medium text-muted-foreground">
          Recent Unlocks
        </div>

        {recentAchievements.length === 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">
            <Zap className="mx-auto mb-1 h-4 w-4 opacity-50" />
            No achievements yet
          </div>
        ) : (
          recentAchievements.map((ach) => {
            if (!ach) return null
            const Icon = ICON_MAP[ach.icon] || Award
            return (
              <div
                key={ach.id}
                className="flex items-center gap-3 rounded bg-muted/30 p-2 transition-colors hover:bg-muted/30"
              >
                <div className="rounded bg-fuchsia-500/10 p-1.5 text-fuchsia-400">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {ach.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {ach.description}
                  </p>
                </div>
                <div className="text-xs font-semibold text-primary">
                  +{ach.points}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
