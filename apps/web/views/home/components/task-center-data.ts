import type { SemanticColorToken } from "@workspace/ui"

export type TaskCenterDeadline = {
  name: string
  project: string
  date: string
  label: string
  color: SemanticColorToken
  icon: "moon" | "book"
}

export type TaskCenterWorkload = {
  name: string
  value: string
  status: string
  color: SemanticColorToken
  width: string
}

export type TaskCenterSuggestion = {
  message: string
  color: SemanticColorToken
  icon: "clock" | "alert" | "user" | "target"
}

export const TASK_CENTER_DEADLINES: TaskCenterDeadline[] = [
  {
    name: "Observe Hilal - West Indonesia",
    project: "Moon Observation",
    date: "May 27, 2025",
    label: "Tomorrow",
    color: "destructive",
    icon: "moon",
  },
  {
    name: "Analyze Moon Phase Data",
    project: "Astronomy Atlas",
    date: "May 28, 2025",
    label: "2 days left",
    color: "destructive",
    icon: "moon",
  },
  {
    name: "Translate Qur'an 2:184",
    project: "Qur'an Translation",
    date: "May 30, 2025",
    label: "4 days left",
    color: "warning",
    icon: "book",
  },
]

export const TASK_CENTER_WORKLOAD: TaskCenterWorkload[] = [
  { name: "Ahmad Farisi", value: "8 / 12", status: "High", color: "destructive", width: "66%" },
  { name: "Fatimah Zahra", value: "6 / 10", status: "Medium", color: "warning", width: "60%" },
  { name: "Muhammad Ridwan", value: "7 / 10", status: "High", color: "destructive", width: "70%" },
  { name: "Aisha Nurul", value: "5 / 8", status: "Medium", color: "warning", width: "62%" },
  { name: "Omar Hassan", value: "9 / 12", status: "High", color: "destructive", width: "75%" },
]

export const TASK_CENTER_SUGGESTIONS: TaskCenterSuggestion[] = [
  { message: "14 tasks are overdue. Consider rescheduling.", color: "destructive", icon: "clock" },
  { message: "You have 6 high priority tasks due this week.", color: "warning", icon: "alert" },
  { message: "Fatimah Zahra has high workload next 3 days.", color: "destructive", icon: "user" },
  { message: "Observation coverage is low in West Indonesia.", color: "success", icon: "target" },
]
