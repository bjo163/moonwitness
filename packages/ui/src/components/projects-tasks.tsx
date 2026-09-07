"use client"

import React, { useMemo } from "react"
import { ArrowRight, CheckCircle2, Clock, FolderKanban } from "lucide-react"

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

type TasksInput = {
  stats?: Partial<TaskStats>
  list?: TaskItem[]
}

type ProjectsTasksProps = {
  projects?: Project[]
  tasks?: TasksInput | any
}

type ProjectsTasksController = {
  projects: Project[]
  stats: TaskStats
  taskList: TaskItem[]
}

const DEFAULT_TASK_LIST: TaskItem[] = [
  {
    id: "t1",
    title: "Review Lunar Observation Logs",
    due: "Today",
    status: "done",
  },
  {
    id: "t2",
    title: "Verify Qur'an Root Concordance",
    due: "Today",
    status: "pending",
  },
  {
    id: "t3",
    title: "Run Seismic Waveform Diagnostics",
    due: "Tomorrow",
    status: "pending",
  },
  {
    id: "t4",
    title: "Analyze Planetary Telemetry Feed",
    due: "Overdue",
    status: "pending",
  },
]

function useProjectsTasksController({
  projects,
  tasks,
}: ProjectsTasksProps): ProjectsTasksController {
  return useMemo(() => {
    const taskStats: TaskStats = {
      total: tasks?.stats?.total ?? tasks?.total ?? 24,
      today: tasks?.stats?.today ?? tasks?.today ?? 8,
      tomorrow: tasks?.stats?.tomorrow ?? tasks?.tomorrow ?? 4,
      overdue: tasks?.stats?.overdue ?? tasks?.overdue ?? 2,
      completed: tasks?.stats?.completed ?? tasks?.completed ?? 19,
    }

    return {
      projects: Array.isArray(projects) ? projects : [],
      stats: taskStats,
      taskList: Array.isArray(tasks?.list) ? tasks.list : DEFAULT_TASK_LIST,
    }
  }, [projects, tasks])
}

type ProjectCardProps = {
  project: Project
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group rounded-lg border border-border bg-muted/20 p-3.5 transition-colors hover:bg-accent/40">
      <div className="mb-2.5 flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-primary shadow-sm">
          <FolderKanban className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-sans text-xs font-semibold text-foreground">
            {project.title}
          </p>
          <p className="truncate font-sans text-[11px] text-muted-foreground">
            {project.subtitle}
          </p>
        </div>
        <span className="font-mono text-xs font-bold text-primary">
          {project.progress}%
        </span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${project.progress}%` }}
        />
      </div>
    </div>
  )
}

type ActiveProjectsProps = {
  projects: Project[]
}

function ActiveProjects({ projects }: ActiveProjectsProps) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-sans text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Active Projects
        </h3>
        <span className="font-mono text-[10px] text-muted-foreground">
          {projects.length} Projects
        </span>
      </div>

      <div className="flex-1 space-y-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <ViewAllButton label="View All Projects" />
    </div>
  )
}

type TaskStatsLegendProps = {
  stats: TaskStats
}

function TaskStatsLegend({ stats }: TaskStatsLegendProps) {
  const legendItems = [
    {
      label: "Today",
      value: stats.today,
      color: "bg-primary",
      valueColor: "text-foreground",
    },
    {
      label: "Tomorrow",
      value: stats.tomorrow,
      color: "bg-warning",
      valueColor: "text-foreground",
    },
    {
      label: "Overdue",
      value: stats.overdue,
      color: "bg-destructive",
      valueColor: "text-destructive",
    },
    {
      label: "Completed",
      value: stats.completed,
      color: "bg-success",
      valueColor: "text-success",
    },
  ]

  return (
    <div className="flex-1 space-y-1.5 font-mono text-xs">
      {legendItems.map((item) => (
        <div key={item.label} className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-muted-foreground">
            <span className={`h-2 w-2 rounded-full ${item.color}`} />
            {item.label}
          </span>
          <span className={`font-semibold ${item.valueColor}`}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  )
}

type TaskItemRowProps = {
  task: TaskItem
}

function TaskItemRow({ task }: TaskItemRowProps) {
  const isDone = task.status === "done"
  const dueClassName =
    task.due === "Today"
      ? "text-success font-semibold"
      : task.due === "Tomorrow"
        ? "text-warning"
        : "text-muted-foreground"

  return (
    <div className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted/40">
      <div className="flex items-center gap-2.5">
        {isDone ? (
          <CheckCircle2 className="h-4 w-4 text-success" />
        ) : (
          <Clock className="h-4 w-4 text-muted-foreground" />
        )}
        <span
          className={`font-sans text-xs ${
            isDone
              ? "text-muted-foreground line-through"
              : "font-medium text-foreground"
          }`}
        >
          {task.title}
        </span>
      </div>
      <span className={`font-mono text-[10px] ${dueClassName}`}>
        {task.due}
      </span>
    </div>
  )
}

type TaskListProps = {
  tasks: TaskItem[]
}

function TaskList({ tasks }: TaskListProps) {
  return (
    <div className="flex-1 space-y-1.5 border-t border-border pt-3">
      {tasks.map((task) => (
        <TaskItemRow key={task.id} task={task} />
      ))}
    </div>
  )
}

type ViewAllButtonProps = {
  label: string
  bordered?: boolean
}

function ViewAllButton({ label, bordered = false }: ViewAllButtonProps) {
  return (
    <button
      className={`mt-4 flex w-full items-center justify-center gap-1.5 font-sans text-xs font-medium text-primary hover:underline ${
        bordered ? "border-t border-border pt-3" : ""
      }`}
    >
      {label} <ArrowRight className="h-3 w-3" />
    </button>
  )
}

type TasksOverviewProps = {
  stats: TaskStats
  taskList: TaskItem[]
}

function TasksOverview({ stats, taskList }: TasksOverviewProps) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-sans text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Tasks Overview
        </h3>
        <span className="font-mono text-[10px] text-muted-foreground">
          {stats.total} Total
        </span>
      </div>

      <div className="mb-6 flex items-center gap-6">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-muted border-t-primary border-r-primary">
          <div className="text-center">
            <span className="block font-mono text-xl font-bold text-foreground">
              {stats.total}
            </span>
            <span className="block font-sans text-[9px] tracking-wider text-muted-foreground uppercase">
              Tasks
            </span>
          </div>
        </div>

        <TaskStatsLegend stats={stats} />
      </div>

      <TaskList tasks={taskList} />
      <ViewAllButton label="View All Tasks" bordered />
    </div>
  )
}

type ProjectsTasksPresentationProps = ProjectsTasksController

function ProjectsTasksPresentation({
  projects,
  stats,
  taskList,
}: ProjectsTasksPresentationProps) {
  return (
    <div className="grid grid-cols-1 gap-4 font-sans lg:grid-cols-2">
      <ActiveProjects projects={projects} />
      <TasksOverview stats={stats} taskList={taskList} />
    </div>
  )
}

export function ProjectsTasks({ projects, tasks }: ProjectsTasksProps) {
  const controller = useProjectsTasksController({ projects, tasks })

  return <ProjectsTasksPresentation {...controller} />
}

export { ProjectsTasks as ErpProjectsTasks }
