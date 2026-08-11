import { defineModule } from "@modules/define-module"
import { ERPDashboardView } from "./views/dashboard-view"
import { ErpAnalyticsView } from "./views/erp-analytics-view"
import { ErpHadithsView } from "./views/erp-hadiths-view"
import { ErpScripturesView } from "./views/erp-scriptures-view"
import { ErpUsersView } from "./views/erp-users-view"
import { ErpProfileView } from "./views/erp-profile-view" // Hot reload trigger
import { ErpMizanView } from "./views/erp-mizan-view"

/**
 * ERP Module — MoonWitness OS
 *
 * Dashboard dan backend system operasi MoonWitness.
 */
export default defineModule({
  id: "erp",
  label: "ERP",
  icon: "Database",
  type: "CORE_OS",
  navPlacement: "ERP_SIDEBAR",
  basePath: "/erp",
  defaultRoute: "dashboard",
  routes: [
    {
      slug: "dashboard",
      label: "Dashboard",
      icon: "LayoutDashboard",
      component: ERPDashboardView,
    },
    {
      slug: "hadiths",
      label: "Hadith Management",
      icon: "BookOpen",
      component: ErpHadithsView,
    },
    {
      slug: "scriptures",
      label: "Scripture Hub",
      icon: "ScrollText",
      component: ErpScripturesView,
    },
    {
      slug: "users",
      label: "User Access",
      icon: "Users",
      component: ErpUsersView,
    },
    {
      slug: "analytics",
      label: "System Analytics",
      icon: "Activity",
      component: ErpAnalyticsView,
    },
    {
      slug: "mizan",
      label: "Mizan Manager",
      icon: "Scale",
      component: ErpMizanView,
    },
    {
      slug: "profile",
      label: "My Profile",
      icon: "User",
      component: ErpProfileView,
    },
  ],
})

export const ERP_NAVIGATION = [
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
  { label: "User Access", href: "/erp/users", icon: "Users" },
  {
    label: "Global Intelligence",
    href: "/erp/global-intelligence",
    icon: "Globe",
  },
]

export const ERP_QUICK_LAUNCH = [
  { label: "Read Qur'an", href: "/erp/scriptures", icon: "BookOpen" },
  { label: "Open KHIDRA", href: "/erp/khidra", icon: "Brain" },
  { label: "Moon Observatory", href: "/erp/observatory", icon: "Telescope" },
  { label: "Mission Control", href: "/erp/mission-control", icon: "Target" },
  { label: "Research Lab", href: "/erp/research", icon: "FlaskConical" },
]
