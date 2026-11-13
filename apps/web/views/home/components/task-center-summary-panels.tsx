"use client"

import type { ReactNode } from "react"
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Clock,
  Moon,
  Target,
  User,
} from "lucide-react"
import { Button, resolveSemanticColor } from "@workspace/ui"
import {
  TASK_CENTER_DEADLINES,
  TASK_CENTER_SUGGESTIONS,
  TASK_CENTER_WORKLOAD,
  type TaskCenterSuggestion,
} from "./task-center-data"

const DEADLINE_ICONS = { moon: Moon, book: BookOpen } as const
const SUGGESTION_ICONS = {
  clock: Clock,
  alert: AlertTriangle,
  user: User,
  target: Target,
} as const

function TaskCenterSummaryPanel({
  title,
  children,
  className = "",
  footer,
}: {
  title: string
  children: ReactNode
  className?: string
  footer?: ReactNode
}) {
  return (
    <div className={`bg-background rounded-xl border border-border p-4 ${className}`}>
      <div className="mb-4 text-[9px] font-black tracking-widest text-primary uppercase">
        {title}
      </div>
      {children}
      {footer}
    </div>
  )
}

function TaskCenterStatusRing() {
  const statuses = [
    { label: "To Do", value: "12 (30%)", color: "bg-blue-500" },
    { label: "In Progress", value: "18 (45%)", color: "bg-amber-500" },
    { label: "Review", value: "6 (15%)", color: "bg-primary" },
    { label: "Done", value: "4 (10%)", color: "bg-emerald-500" },
  ]

  return (
    <TaskCenterSummaryPanel
      title="MY TASKS SUMMARY"
      footer={
        <Button type="button" variant="ghost" size="sm" className="mt-3 w-full border-t border-border text-[8px] font-bold tracking-widest uppercase">
          View My Tasks <ArrowRight className="h-2.5 w-2.5" />
        </Button>
      }
    >
      <div className="flex items-center gap-4">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-primary">
          <div className="absolute inset-0 rounded-full border-[4px] border-blue-500 border-r-transparent border-b-transparent" style={{ transform: "rotate(-45deg)" }} />
          <div className="absolute inset-0 rounded-full border-[4px] border-amber-500 border-b-transparent border-l-transparent" style={{ transform: "rotate(45deg)" }} />
          <div className="absolute inset-0 rounded-full border-[4px] border-border border-t-transparent border-l-transparent" style={{ transform: "rotate(135deg)" }} />
          <div className="text-center">
            <div className="font-mono text-lg leading-none font-black text-foreground">40</div>
            <div className="mt-0.5 text-[5px] font-bold text-primary uppercase">My Tasks</div>
          </div>
        </div>
        <div className="flex-1 space-y-1 text-[8px]">
          {statuses.map((status) => (
            <div key={status.label} className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-foreground">
                <span className={`h-1.5 w-1.5 rounded-full ${status.color}`} /> {status.label}
              </span>
              <span className="font-mono text-primary">{status.value}</span>
            </div>
          ))}
        </div>
      </div>
    </TaskCenterSummaryPanel>
  )
}

function TaskCenterDeadlines() {
  return (
    <TaskCenterSummaryPanel
      title="UPCOMING DEADLINES"
      footer={
        <Button type="button" variant="ghost" size="sm" className="mt-2 w-full text-[8px] font-bold tracking-widest uppercase">
          View Calendar <ArrowRight className="h-2.5 w-2.5" />
        </Button>
      }
    >
      <div className="space-y-3">
        {TASK_CENTER_DEADLINES.map((deadline) => {
          const Icon = DEADLINE_ICONS[deadline.icon]
          return (
            <div key={deadline.name} className="flex gap-3">
              <div className="bg-background flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border">
                <Icon className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="flex-1 border-b border-border pb-2">
                <div className="mb-0.5 truncate text-[9px] leading-tight font-bold text-foreground">{deadline.name}</div>
                <div className="mb-1 text-[7px] text-primary uppercase">{deadline.project}</div>
                <div className="flex items-center justify-between font-mono text-[8px]">
                  <span className="text-primary">{deadline.date}</span>
                  <span style={{ color: resolveSemanticColor(deadline.color) }}>{deadline.label}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </TaskCenterSummaryPanel>
  )
}

function TaskCenterWorkload() {
  return (
    <TaskCenterSummaryPanel
      title="TEAM WORKLOAD"
      footer={
        <Button type="button" variant="ghost" size="sm" className="mt-3 w-full border-t border-border text-[8px] font-bold tracking-widest uppercase">
          View Team Tasks <ArrowRight className="h-2.5 w-2.5" />
        </Button>
      }
    >
      <div className="flex-1 space-y-3 text-[9px]">
        {TASK_CENTER_WORKLOAD.map((member) => (
          <div key={member.name} className="flex items-center gap-2">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted">
              <User className="h-3 w-3 text-primary" />
            </div>
            <div className="w-24 truncate text-foreground">{member.name}</div>
            <div className="bg-background h-1 flex-1 overflow-hidden rounded-full">
              <div className="h-full rounded-full" style={{ width: member.width, backgroundColor: resolveSemanticColor(member.color) }} />
            </div>
            <div className="w-8 text-right font-mono text-primary">{member.value}</div>
            <div className="w-8 text-right font-bold" style={{ color: resolveSemanticColor(member.color) }}>{member.status}</div>
          </div>
        ))}
      </div>
    </TaskCenterSummaryPanel>
  )
}

function TaskCenterSuggestionRow({ suggestion }: { suggestion: TaskCenterSuggestion }) {
  const Icon = SUGGESTION_ICONS[suggestion.icon]
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: resolveSemanticColor(suggestion.color) }} />
      <div className="text-[9px] leading-tight text-foreground">{suggestion.message}</div>
    </div>
  )
}

function TaskCenterSuggestedActions() {
  return (
    <TaskCenterSummaryPanel title="AI SUGGESTED ACTIONS" className="relative flex flex-1 flex-col overflow-hidden border-primary/20">
      <div className="flex-1 space-y-2.5">
        {TASK_CENTER_SUGGESTIONS.map((suggestion) => (
          <TaskCenterSuggestionRow key={suggestion.message} suggestion={suggestion} />
        ))}
      </div>
      <Button type="button" variant="ghost" className="mt-2 flex items-center justify-center gap-1 text-[8px] font-bold text-primary transition-colors hover:text-foreground">
        View All Suggestions <ArrowRight className="h-2.5 w-2.5" />
      </Button>
    </TaskCenterSummaryPanel>
  )
}

export function TaskCenterSummaryContent() {
  return (
    <div className="flex flex-col gap-4 xl:col-span-3">
      <TaskCenterStatusRing />
      <TaskCenterDeadlines />
      <TaskCenterWorkload />
      <TaskCenterSuggestedActions />
    </div>
  )
}
