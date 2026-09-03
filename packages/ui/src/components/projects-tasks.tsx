"use client"

import React from "react"
import { ArrowRight, FolderKanban, CheckCircle2, Clock } from "lucide-react"

type Project = {
  id: string
  icon: string
  title: string
  subtitle: string
  progress: number
}
type TaskItem = { id: string; title: string; due: string; status: string }
type TaskStats = {
  total: number
  today: number
  tomorrow: number
  overdue: number
  completed: number
}

type ProjectsTasksProps = {
  projects?: Project[]
  tasks?: {
    stats?: Partial<TaskStats>
    list?: TaskItem[]
  } | any
}

function ActiveProjects({ projects = [] }: { projects?: Project[] }) {
  const projectList = Array.isArray(projects) ? projects : []
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Active Projects
        </h3>
        <span className="font-mono text-[10px] text-muted-foreground">
          {projectList.length} Projects
        </span>
      </div>

      <div className="flex-1 space-y-3">
        {projectList.map((p) => (
          <div
            key={p.id}
            className="group rounded-lg border border-border bg-muted/20 p-3.5 transition-colors hover:bg-accent/40"
          >
            <div className="mb-2.5 flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-primary shadow-sm">
                <FolderKanban className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-sans text-xs font-semibold text-foreground">
                  {p.title}
                </p>
                <p className="truncate font-sans text-[11px] text-muted-foreground">
                  {p.subtitle}
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-primary">
                {p.progress}%
              </span>
            </div>
            {/* Progress Bar */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${p.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-1.5 font-sans text-xs font-medium text-primary hover:underline">
        View All Projects <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  )
}

function TasksOverview({
  tasks,
}: {
  tasks?: { stats?: Partial<TaskStats>; list?: TaskItem[] } | any
}) {
  const stats: TaskStats = {
    total: tasks?.stats?.total ?? tasks?.total ?? 24,
    today: tasks?.stats?.today ?? tasks?.today ?? 8,
    tomorrow: tasks?.stats?.tomorrow ?? tasks?.tomorrow ?? 4,
    overdue: tasks?.stats?.overdue ?? tasks?.overdue ?? 2,
    completed: tasks?.stats?.completed ?? tasks?.completed ?? 19,
  }
  const list: TaskItem[] = Array.isArray(tasks?.list)
    ? tasks.list
    : [
        { id: "t1", title: "Review Lunar Observation Logs", due: "Today", status: "done" },
        { id: "t2", title: "Verify Qur'an Root Concordance", due: "Today", status: "pending" },
        { id: "t3", title: "Run Seismic Waveform Diagnostics", due: "Tomorrow", status: "pending" },
        { id: "t4", title: "Analyze Planetary Telemetry Feed", due: "Overdue", status: "pending" },
      ]

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Tasks Overview
        </h3>
        <span className="font-mono text-[10px] text-muted-foreground">
          {stats.total} Total
        </span>
      </div>

      <div className="mb-6 flex items-center gap-6">
        {/* Doughnut Chart Mock */}
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-muted border-t-primary border-r-primary">
          <div className="text-center">
            <span className="block font-mono text-xl font-bold text-foreground">
              {stats.total}
            </span>
            <span className="block font-sans text-[9px] uppercase tracking-wider text-muted-foreground">
              Tasks
            </span>
          </div>
        </div>

        {/* Legends */}
        <div className="flex-1 space-y-1.5 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Today
            </span>
            <span className="font-semibold text-foreground">{stats.today}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-warning" />
              Tomorrow
            </span>
            <span className="font-semibold text-foreground">{stats.tomorrow}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-destructive" />
              Overdue
            </span>
            <span className="font-semibold text-destructive">{stats.overdue}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-success" />
              Completed
            </span>
            <span className="font-semibold text-success">{stats.completed}</span>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 space-y-1.5 border-t border-border pt-3">
        {list.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted/40"
          >
            <div className="flex items-center gap-2.5">
              {t.status === "done" ? (
                <CheckCircle2 className="h-4 w-4 text-success" />
              ) : (
                <Clock className="h-4 w-4 text-muted-foreground" />
              )}
              <span
                className={`font-sans text-xs ${
                  t.status === "done"
                    ? "text-muted-foreground line-through"
                    : "text-foreground font-medium"
                }`}
              >
                {t.title}
              </span>
            </div>
            <span
              className={`font-mono text-[10px] ${
                t.due === "Today"
                  ? "text-success font-semibold"
                  : t.due === "Tomorrow"
                    ? "text-warning"
                    : "text-muted-foreground"
              }`}
            >
              {t.due}
            </span>
          </div>
        ))}
      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-1.5 border-t border-border pt-3 font-sans text-xs font-medium text-primary hover:underline">
        View All Tasks <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  )
}

export function ProjectsTasks({ projects, tasks }: ProjectsTasksProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 font-sans">
      <ActiveProjects projects={projects} />
      <TasksOverview tasks={tasks} />
    </div>
  )
}

export { ProjectsTasks as ErpProjectsTasks }
