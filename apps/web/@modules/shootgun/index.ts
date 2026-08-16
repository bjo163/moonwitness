import { defineModule } from "@modules/define-module"
import { ShootgunPublicView } from "./views/shootgun-public-view"

export default defineModule({
  id: "shootgun",
  label: "SHOOTGUN",
  icon: "Crosshair",
  type: "APP",
  navPlacement: "OS_DOCK",
  basePath: "/shootgun",
  defaultRoute: "operations",
  routes: [
    {
      slug: "operations",
      label: "Operation Archive",
      icon: "Crosshair",
      component: ShootgunPublicView,
    },
  ],
})