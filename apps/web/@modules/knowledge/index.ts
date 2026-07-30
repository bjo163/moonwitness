import { defineModule } from "@modules/define-module"
import { KnowledgeHubView } from "./views/knowledge-hub-view"
import { KnowledgeSignalsView } from "./views/knowledge-signals-view"
import { IntelligenceGraphView } from "./views/intelligence-graph-view"
import { AsmaulHusnaView } from "./views/asmaul-husna-view"
import { DoaHarianView } from "./views/doa-harian-view"
import { HaditsPortalView } from "./views/hadits-view"
import { KitabPortalView } from "./views/kitab-view"
import { MatriksKitabView } from "./views/matriks-kitab-view"
import { SanadKeilmuanView } from "./views/sanad-keilmuan-view"
import { TasbihView } from "./views/tasbih-view"
import { TauhidPortalView } from "./views/tauhid-view"
import { KamusAkarKataView } from "./views/kamus-akar-kata-view"
import { KalkulatorZakatView } from "./views/kalkulator-zakat-view"

/**
 * Knowledge Module — MoonWitness OS
 *
 * Pusat pengetahuan, kitab, ibadah, dan intelligence graph.
 */
export default defineModule({
  id: "knowledge",
  label: "KNOWLEDGE",
  icon: "Brain",
  type: "APP",
  navPlacement: "OS_DOCK",
  basePath: "/knowledge",
  defaultRoute: "hub",
  routes: [
    {
      slug: "hub",
      label: "Knowledge Hub",
      icon: "Brain",
      component: KnowledgeHubView,
    },
    {
      slug: "signals",
      label: "Global Signals",
      icon: "Activity",
      component: KnowledgeSignalsView,
    },
    {
      slug: "graph",
      label: "Intelligence Graph",
      icon: "Network",
      component: IntelligenceGraphView,
    },
    {
      slug: "asmaul-husna",
      label: "Asmaul Husna",
      icon: "Book",
      component: AsmaulHusnaView,
    },
    {
      slug: "doa-harian",
      label: "Doa Harian",
      icon: "Book",
      component: DoaHarianView,
    },
    {
      slug: "hadits",
      label: "Hadits Portal",
      icon: "Book",
      component: HaditsPortalView,
    },
    {
      slug: "kitab",
      label: "Kitab Portal",
      icon: "Book",
      component: KitabPortalView,
    },
    {
      slug: "matriks-kitab",
      label: "Matriks Kitab",
      icon: "Grid",
      component: MatriksKitabView,
    },
    {
      slug: "sanad-keilmuan",
      label: "Sanad Keilmuan",
      icon: "Network",
      component: SanadKeilmuanView,
    },
    { slug: "tasbih", label: "Tasbih", icon: "Circle", component: TasbihView },
    {
      slug: "tauhid",
      label: "Tauhid",
      icon: "Sun",
      component: TauhidPortalView,
    },
    {
      slug: "kamus-akar-kata",
      label: "Kamus Akar Kata",
      icon: "BookOpen",
      component: KamusAkarKataView,
    },
    {
      slug: "kalkulator-zakat",
      label: "Kalkulator Zakat",
      icon: "Calculator",
      component: KalkulatorZakatView,
    },
  ],
})
