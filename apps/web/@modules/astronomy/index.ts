import { defineModule } from "@modules/define-module"
import { CelestialEventsView } from "./views/celestial-events-view"
import { DivineAstronomyView } from "./views/divine-astronomy-view"

/**
 * Astronomy Module — MoonWitness OS
 *
 * Pemantauan astronomi divine, perhitungan fase bulan, dan tanda-tanda kosmis.
 */
export default defineModule({
  id: "astronomy",
  label: "ASTRONOMY",
  icon: "Telescope",
  type: "APP",
  navPlacement: "OS_DOCK",
  basePath: "/astronomy",
  defaultRoute: "events",
  routes: [
    {
      slug: "events",
      label: "Celestial Events",
      icon: "Telescope",
      component: CelestialEventsView,
    },
    {
      slug: "divine",
      label: "Divine Astronomy",
      icon: "Orbit",
      component: DivineAstronomyView,
    },
  ],
})
