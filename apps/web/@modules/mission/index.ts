import { defineModule } from "@modules/define-module"
import { MissionControlView } from "./views/mission-control-view"
import { DiplomasiProfetikView } from "./views/diplomasi-profetik-view"
import { PersatuanUmatView } from "./views/persatuan-umat-view"
import { PiagamPeradabanView } from "./views/piagam-peradaban-view"
import { SertifikatPiagamView } from "./views/sertifikat-piagam-view"
import { ToolkitRasulullahView } from "./views/toolkit-rasulullah-view"
import { LawJusticeView } from "./views/law-justice-view"
import { GardenBrainstormView } from "./views/garden-brainstorm-view"

/**
 * Mission Module — MoonWitness OS
 *
 * Strategi, pemantauan misi, dan pergerakan peradaban.
 */
export default defineModule({
  id: "mission",
  label: "MISSION",
  icon: "Target",
  type: "APP",
  navPlacement: "OS_DOCK",
  basePath: "/mission",
  defaultRoute: "control",
  routes: [
    {
      slug: "control",
      label: "Mission Control",
      icon: "Target",
      component: MissionControlView,
    },
    {
      slug: "diplomasi-profetik",
      label: "Diplomasi Profetik",
      icon: "Globe",
      component: DiplomasiProfetikView,
    },
    {
      slug: "persatuan-umat",
      label: "Persatuan Umat",
      icon: "Users",
      component: PersatuanUmatView,
    },
    {
      slug: "piagam-peradaban",
      label: "Piagam Peradaban",
      icon: "ScrollText",
      component: PiagamPeradabanView,
    },
    {
      slug: "sertifikat-piagam",
      label: "Sertifikat Piagam",
      icon: "Award",
      component: SertifikatPiagamView,
    },
    {
      slug: "toolkit-rasulullah",
      label: "Toolkit Rasulullah",
      icon: "Wrench",
      component: ToolkitRasulullahView,
    },
    {
      slug: "law-justice",
      label: "Law & Justice",
      icon: "Scale",
      component: LawJusticeView,
    },
    {
      slug: "garden-brainstorm",
      label: "Garden Brainstorm",
      icon: "Sprout",
      component: GardenBrainstormView,
    },
  ],
})
