import { defineModule } from "@modules/define-module"
import { ErpCabView } from "./views/erp-cab-view"

/**
 * CAB Module — MoonWitness OS (C-01)
 *
 * Change Advisory Board Governance Engine.
 * Mengelola RFC (Request for Change), keputusan CAB, agenda rapat,
 * proyek implementasi, dan audit trail tugas secara menyeluruh.
 *
 * Family: CONSOLE / ERP (Purple accent)
 * Code: C-01
 */
export default defineModule({
  id: "cab",
  label: "CAB",
  icon: "ShieldCheck",
  type: "APP",
  navPlacement: "ERP_SIDEBAR",
  basePath: "/cab",
  defaultRoute: "board",
  routes: [
    {
      slug: "board",
      label: "CAB Board",
      icon: "ShieldCheck",
      component: ErpCabView,
    },
  ],
})
