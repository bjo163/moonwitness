"use client"
import { useMounted } from "@workspace/hooks"

import React, { useEffect } from "react"
import { Button } from "../../components/button"
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
    <div className="rounded-md border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-sans text-sm font-semibold text-foreground">
          Daily Quests
        </h3>
        <Target className="h-4 w-4 text-warning/50" />
      </div>

      <div className="space-y-3">
        {quests.map((q) => (
          <Button
            type="button"
            variant="ghost"
            key={q.id}
            onClick={() => {
              if (!q.completed) completeQuest(q.id)
            }}
            className={`flex h-auto w-full items-center justify-between rounded-md border p-3 text-left transition-colors ${
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
          </Button>
        ))}
      </div>
    </div>
  )
}
