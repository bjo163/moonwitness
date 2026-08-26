import { defineModule } from "@modules/define-module"
import { ERPDashboardView } from "./views/dashboard-view"
import { ErpHadithsView } from "./views/hadiths-view"
import { ErpScripturesView } from "./views/scriptures-view"
import { ErpUsersView } from "./views/users-view"
import { ErpProfileView } from "./views/profile-view"
import { ErpCabView } from "./views/cab-view"
import { ConsoleView } from "./views/console-view"

/**
 * Command Center Module — MoonWitness OS
 *
 * Pusat kendali admin: dashboard sistem, manajemen data,
 * CAB governance, dan developer terminal.
 */
export default defineModule({
  id: "command-center",
  label: "COMMAND CENTER",
  icon: "ShieldCheck",
  type: "CORE_OS",
  navPlacement: "ERP_SIDEBAR",
  basePath: "/command-center",
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
      slug: "cab",
      label: "CAB Governance",
      icon: "ShieldCheck",
      component: ErpCabView,
    },
    {
      slug: "profile",
      label: "My Profile",
      icon: "User",
      component: ErpProfileView,
    },
    {
      slug: "terminal",
      label: "Dev Terminal",
      icon: "Terminal",
      component: ConsoleView,
    },
  ],
})
