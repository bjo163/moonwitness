import { defineModule } from "@modules/define-module"
import { HistoryTimelineView } from "./views/history-timeline-view"
import { SejarahSirahView } from "./views/sejarah-sirah-view"
import { NubuatPeradabanView } from "./views/nubuat-peradaban-view"
import { MukjizatSainsView } from "./views/mukjizat-sains-view"

/**
 * History Module — MoonWitness OS
 *
 * Catatan sejarah, sirah nabi, nubuat, dan keajaiban peradaban.
 */
export default defineModule({
  id: "history",
  label: "HISTORY",
  icon: "History",
  type: "APP",
  navPlacement: "OS_DOCK",
  basePath: "/history",
  defaultRoute: "timeline",
  routes: [
    {
      slug: "timeline",
      label: "Timeline",
      icon: "History",
      component: HistoryTimelineView,
    },
    {
      slug: "sejarah-sirah",
      label: "Sejarah & Sirah",
      icon: "Map",
      component: SejarahSirahView,
    },
    {
      slug: "nubuat-peradaban",
      label: "Nubuat Peradaban",
      icon: "Eye",
      component: NubuatPeradabanView,
    },
    {
      slug: "mukjizat-sains",
      label: "Mukjizat Sains",
      icon: "Sparkles",
      component: MukjizatSainsView,
    },
  ],
})
