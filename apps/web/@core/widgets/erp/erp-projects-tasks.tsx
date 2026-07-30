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
  projects: Project[]
  tasks: {
    stats: TaskStats
    list: TaskItem[]
  }
}

function ActiveProjects({ projects }: { projects: Project[] }) {
  return (
    <div className="bg-space/60 flex h-full flex-col rounded-2xl border border-cyan-500/20 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-sans text-xs font-bold tracking-wider text-cyan-400 uppercase">
          Active Projects
        </h3>
        <span className="font-mono text-[10px] text-primary/60">
          {projects.length} Active Projects
        </span>
      </div>

      <div className="flex-1 space-y-4">
        {projects.map((p) => (
          <div
            key={p.id}
            className="group cursor-pointer rounded-xl border border-cyan-500/10 bg-black/20 p-4 transition-all hover:border-cyan-500/30 hover:bg-black/40"
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20">
                <FolderKanban className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-sans text-sm font-medium text-white">
                  {p.title}
                </p>
                <p className="truncate font-sans text-xs text-primary/60">
                  {p.subtitle}
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-cyan-400">
                {p.progress}%
              </span>
            </div>
            {/* Progress Bar */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/60">
              <div
                className="h-full bg-cyan-400 transition-all duration-1000 ease-out"
                style={{ width: `${p.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-2 font-mono text-[10px] font-medium text-cyan-400 uppercase hover:text-cyan-300">
        View All Projects <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  )
}

function TasksOverview({
  tasks,
}: {
  tasks: { stats: TaskStats; list: TaskItem[] }
}) {
  const { stats, list } = tasks
  return (
    <div className="bg-space/60 flex h-full flex-col rounded-2xl border border-cyan-500/20 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-sans text-xs font-bold tracking-wider text-cyan-400 uppercase">
          Tasks Overview
        </h3>
        <span className="font-mono text-[10px] text-primary/60">
          {stats.total} Tasks
        </span>
      </div>

      <div className="mb-6 flex items-center gap-6">
        {/* Doughnut Chart Mock */}
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-cyan-400/20 border-t-cyan-400 border-r-cyan-400">
          <div className="text-center">
            <span className="block font-sans text-2xl font-bold text-white">
              {stats.total}
            </span>
            <span className="block font-mono text-[9px] text-primary/60 uppercase">
              Total Tasks
            </span>
          </div>
        </div>

        {/* Legends */}
        <div className="flex-1 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-primary/80">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              Today
            </span>
            <span className="text-white">{stats.today}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-primary/80">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Tomorrow
            </span>
            <span className="text-white">{stats.tomorrow}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-primary/80">
              <span className="h-2 w-2 rounded-full bg-red-400" />
              Overdue
            </span>
            <span className="text-white">{stats.overdue}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-primary/80">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Completed
            </span>
            <span className="text-white">{stats.completed}</span>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 space-y-2 border-t border-cyan-500/10 pt-4">
        {list.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-black/20"
          >
            <div className="flex items-center gap-3">
              {t.status === "done" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <Clock className="h-4 w-4 text-primary/40" />
              )}
              <span
                className={`font-sans text-sm ${t.status === "done" ? "text-primary/60 line-through" : "text-white"}`}
              >
                {t.title}
              </span>
            </div>
            <span
              className={`font-mono text-[10px] ${t.due === "Today" ? "text-emerald-400" : t.due === "Tomorrow" ? "text-amber-400" : "text-primary/60"}`}
            >
              {t.due}
            </span>
          </div>
        ))}
      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-2 border-t border-cyan-500/10 pt-4 font-mono text-[10px] font-medium text-cyan-400 uppercase hover:text-cyan-300">
        View All Tasks <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  )
}

export function ErpProjectsTasks({ projects, tasks }: ProjectsTasksProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ActiveProjects projects={projects} />
      <TasksOverview tasks={tasks} />
    </div>
  )
}
