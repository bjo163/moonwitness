import type { SemanticColorToken } from "@workspace/ui"

export type TaskCenterTableRowData = {
  t: string
  tag: string
  proj: string
  asg: string
  prio: string
  prioC: SemanticColorToken
  stat: string
  statC: SemanticColorToken
  date: string
  prog: number
}

export const TASK_CENTER_TABLE_ROWS: TaskCenterTableRowData[] = [
  {
    t: "Observe Hilal - West Indonesia",
    tag: "Observation",
    proj: "Moon Observation",
    asg: "Ahmad Farisi",
    prio: "HIGH",
    prioC: "destructive",
    stat: "In Progress",
    statC: "warning",
    date: "May 27, 2025",
    prog: 70,
  },
  {
    t: "Analyze Moon Phase Data",
    tag: "Research",
    proj: "Astronomy Atlas",
    asg: "Fatimah Zahra",
    prio: "HIGH",
    prioC: "destructive",
    stat: "In Progress",
    statC: "warning",
    date: "May 28, 2025",
    prog: 45,
  },
  {
    t: "Translate Qur'an 2:184",
    tag: "Translation",
    proj: "Qur'an Translation",
    asg: "Muhammad Ridwan",
    prio: "MEDIUM",
    prioC: "warning",
    stat: "Review",
    statC: "info",
    date: "May 30, 2025",
    prog: 80,
  },
  {
    t: "Verify Historical Event - Badr",
    tag: "History",
    proj: "Islamic History",
    asg: "Aisha Nurul",
    prio: "MEDIUM",
    prioC: "warning",
    stat: "To Do",
    statC: "primary",
    date: "Jun 01, 2025",
    prog: 0,
  },
  {
    t: "Develop AI Hilal Detection Model",
    tag: "AI & ML",
    proj: "AI Systems",
    asg: "Omar Hassan",
    prio: "HIGH",
    prioC: "destructive",
    stat: "In Progress",
    statC: "warning",
    date: "Jun 03, 2025",
    prog: 60,
  },
  {
    t: "Collect Data - Cloud Coverage",
    tag: "Environment",
    proj: "Climate Monitor",
    asg: "Yusuf Al-Kaff",
    prio: "LOW",
    prioC: "success",
    stat: "To Do",
    statC: "primary",
    date: "Jun 04, 2025",
    prog: 0,
  },
  {
    t: "Create Educational Content - Moon",
    tag: "Education",
    proj: "Content Creation",
    asg: "Zainab Azzahra",
    prio: "MEDIUM",
    prioC: "warning",
    stat: "Review",
    statC: "info",
    date: "Jun 05, 2025",
    prog: 75,
  },
  {
    t: "Prepare Monthly Report - May",
    tag: "Reporting",
    proj: "Monthly Reports",
    asg: "Ahmad Farisi",
    prio: "HIGH",
    prioC: "destructive",
    stat: "To Do",
    statC: "primary",
    date: "Jun 06, 2025",
    prog: 10,
  },
]
