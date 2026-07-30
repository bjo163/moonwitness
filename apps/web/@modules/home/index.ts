import { defineModule } from "@modules/define-module"
import { HomeView } from "./views/home-view"

/**
 * Home Module — MoonWitness OS
 *
 * Landing page dan landing OS portal.
 */
export default defineModule({
  id: "home",
  label: "HOME",
  icon: "Home",
  type: "CORE_OS",
  navPlacement: "HIDDEN",
  basePath: "",
  defaultRoute: "home",
  routes: [
    { slug: "home", label: "HOME", icon: "Home", component: HomeView },
  ],
})

