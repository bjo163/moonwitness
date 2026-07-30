import { defineModule } from "@modules/define-module"
import { AnalyticsTelemetryView } from "./views/analytics-telemetry-view"
import { AnalisisTrenView } from "./views/analisis-tren-view"
import { DiagnostikHikmahView } from "./views/diagnostik-hikmah-view"
import { PsikologiJiwaView } from "./views/psikologi-jiwa-view"

/**
 * Analytics Module — MoonWitness OS
 *
 * Pemantauan sistem global, analitik tren, dan riset kejiwaan.
 */
export default defineModule({
  id: "analytics",
  label: "ANALYTICS",
  icon: "BarChart3",
  type: "APP",
  navPlacement: "OS_DOCK",
  basePath: "/analytics",
  defaultRoute: "telemetry",
  routes: [
    {
      slug: "telemetry",
      label: "Global Telemetry",
      icon: "Activity",
      component: AnalyticsTelemetryView,
    },
    {
      slug: "analisis-tren",
      label: "Analisis Tren",
      icon: "TrendingUp",
      component: AnalisisTrenView,
    },
    {
      slug: "diagnostik-hikmah",
      label: "Diagnostik Hikmah",
      icon: "Stethoscope",
      component: DiagnostikHikmahView,
    },
    {
      slug: "psikologi-jiwa",
      label: "Psikologi Jiwa",
      icon: "Heart",
      component: PsikologiJiwaView,
    },
  ],
})
