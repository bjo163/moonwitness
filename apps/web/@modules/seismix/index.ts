import dynamic from "next/dynamic"
import { defineModule } from "@modules/define-module"

const SeismicForgeView = dynamic(() =>
  import("./views/seismic-forge-view").then((m) => m.SeismicForgeView)
)
const TectonicMapView = dynamic(() =>
  import("./views/tectonic-map-view").then((m) => m.TectonicMapView)
)
const WaveformLabView = dynamic(() =>
  import("./views/waveform-lab-view").then((m) => m.WaveformLabView)
)
const QuakeArchiveView = dynamic(() =>
  import("./views/quake-archive-view").then((m) => m.QuakeArchiveView)
)

/**
 * SEISMIX Module — MoonWitness OS (O-08)
 *
 * Seismic Simulation Forge — Pusat simulasi dan observasi aktivitas seismik bumi.
 * Modul ini menyediakan visualisasi gelombang seismik, peta tektonik,
 * laboratorium waveform, dan arsip gempa bumi historis.
 *
 * Family: OBSERVATORY (Yellow accent)
 * Code: O-08
 */
export default defineModule({
  id: "seismix",
  label: "SEISMIX",
  icon: "Activity",
  type: "APP",
  navPlacement: "OS_DOCK",
  basePath: "/seismix",
  defaultRoute: "forge",
  routes: [
    {
      slug: "forge",
      label: "Seismic Forge",
      icon: "Activity",
      component: SeismicForgeView,
    },
    {
      slug: "tectonic-map",
      label: "Tectonic Map",
      icon: "Map",
      component: TectonicMapView,
    },
    {
      slug: "waveform-lab",
      label: "Waveform Lab",
      icon: "AudioWaveform",
      component: WaveformLabView,
    },
    {
      slug: "quake-archive",
      label: "Quake Archive",
      icon: "Database",
      component: QuakeArchiveView,
    },
  ],
})
