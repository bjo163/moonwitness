"use client"
import { useMounted } from "@workspace/hooks"

import React, { useEffect, useState } from "react"
import { useQuestStore } from "@workspace/state"
import { Target, CheckCircle2, Circle } from "lucide-react"

export function QuestWidget() {
  const mounted = useMounted()
  const { quests, refreshQuests, completeQuest } = useQuestStore()

  useEffect(() => {
    refreshQuests()
  }, [refreshQuests])

  if (!mounted) return null

  return (
    <div className="bg-background/60 rounded-2xl border border-warning/20 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-sans text-xs font-bold tracking-wider text-warning uppercase">
          Daily Quests
        </h3>
        <Target className="h-4 w-4 text-warning/50" />
      </div>

      <div className="space-y-3">
        {quests.map((q) => (
          <div
            key={q.id}
            onClick={() => {
              if (!q.completed) completeQuest(q.id)
            }}
            className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all ${
              q.completed
                ? "border-success/20 bg-emerald-500/5 opacity-70"
                : "border-amber-500/10 bg-card hover:border-warning/30 hover:bg-warning/10"
            }`}
          >
            <div className="flex items-center gap-3">
              {q.completed ? (
                <CheckCircle2 className="h-4 w-4 text-success" />
              ) : (
                <Circle className="h-4 w-4 text-warning/50" />
              )}
              <div>
                <div
                  className={`font-sans text-xs font-bold ${q.completed ? "text-success line-through" : "text-foreground"}`}
                >
                  {q.title}
                </div>
              </div>
            </div>
            <div
              className={`font-mono text-[10px] font-bold ${q.completed ? "text-success" : "text-warning"}`}
            >
              +{q.rewardXP} XP
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
