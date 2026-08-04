"use client"
import { useMounted } from "@core/hooks"

import React, { useEffect, useState } from "react"
import { Award, Star, Terminal, Shield, Music, Zap } from "lucide-react"
import { useAchievementStore, ACHIEVEMENTS } from "@core/store/achievement-store"

const ICON_MAP: Record<string, React.ElementType> = {
  Terminal: Terminal,
  Shield: Shield,
  Music: Music,
  Award: Award
}

export function AchievementWidget() {
  const mounted = useMounted()
  const points = useAchievementStore((s) => s.points)
  const unlockedIds = useAchievementStore((s) => s.unlockedIds)

  
  if (!mounted) return null

  // Calculate Level based on points (e.g. 100 points = 1 level)
  const level = Math.floor(points / 100) + 1
  const progressToNextLevel = (points % 100)
  
  const recentAchievements = unlockedIds
    .slice(-3) // Last 3
    .reverse()
    .map(id => ACHIEVEMENTS[id])
    .filter(Boolean)

  return (
    <div className="panel-clip w-full border border-fuchsia-500/20 bg-black/40 p-4 font-mono">
      <div className="mb-4 flex items-center gap-2">
        <Award className="h-4 w-4 text-fuchsia-400" />
        <h3 className="text-xs font-bold tracking-widest text-white uppercase">
          Player Status
        </h3>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-fuchsia-500/50 bg-fuchsia-500/10 shadow-[0_0_15px_rgba(217,70,239,0.2)]">
          <span className="text-lg font-black text-fuchsia-400">{level}</span>
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-[9px] uppercase tracking-widest text-primary mb-1">
            <span>LEVEL {level}</span>
            <span className="text-fuchsia-400">{points} XP</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div 
              className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-400"
              style={{ width: `${progressToNextLevel}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-[9px] uppercase tracking-widest text-primary/70 mb-2 border-b border-white/10 pb-1">
          Recent Unlocks
        </div>
        
        {recentAchievements.length === 0 ? (
          <div className="text-center py-4 text-[10px] text-primary/50">
            <Zap className="h-4 w-4 mx-auto mb-1 opacity-50" />
            No achievements yet
          </div>
        ) : (
          recentAchievements.map(ach => {
            if (!ach) return null
            const Icon = ICON_MAP[ach.icon] || Award
            return (
              <div key={ach.id} className="flex items-center gap-3 rounded bg-white/5 p-2 transition-colors hover:bg-white/10">
                <div className="text-fuchsia-400 bg-fuchsia-500/10 p-1.5 rounded">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-bold text-white">{ach.title}</p>
                  <p className="truncate text-[8px] text-primary">{ach.description}</p>
                </div>
                <div className="text-[9px] font-bold text-fuchsia-400">
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
