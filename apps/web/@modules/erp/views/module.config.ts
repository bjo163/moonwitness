import type { NavLinkConfig } from "@core/navigation"

export const erpNavigation: NavLinkConfig[] = [
  { label: "Dashboard", href: "/erp/dashboard", icon: "LayoutDashboard" },
  { label: "Mission Control", href: "/erp/mission-control", icon: "Target" },
  { label: "Observatory", href: "/erp/observatory", icon: "Telescope" },
  { label: "Scripture Hub", href: "/erp/scriptures", icon: "BookOpen" },
  { label: "History Explorer", href: "/erp/history", icon: "Clock" },
  { label: "Knowledge Graph", href: "/erp/knowledge-graph", icon: "Network" },
  { label: "KHIDRA AI", href: "/erp/khidra", icon: "Brain" },
  { label: "Projects", href: "/erp/projects", icon: "FolderKanban" },
  { label: "Tasks", href: "/erp/tasks", icon: "CheckSquare" },
  { label: "Reports", href: "/erp/reports", icon: "BarChart3" },
  { label: "Community", href: "/erp/community", icon: "Users" },
  {
    label: "Global Intelligence",
    href: "/erp/global-intelligence",
    icon: "Globe",
  },
]

export const erpQuickLaunch: NavLinkConfig[] = [
  { label: "Read Qur'an", href: "/erp/scriptures/quran", icon: "BookOpen" },
  { label: "Open KHIDRA", href: "/erp/khidra", icon: "Brain" },
  { label: "Moon Observatory", href: "/erp/observatory", icon: "Telescope" },
  { label: "Mission Control", href: "/erp/mission-control", icon: "Target" },
  { label: "Research Lab", href: "/erp/research", icon: "FlaskConical" },
]
