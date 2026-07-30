import { defineModule } from "@modules/define-module"
import { CosmicIdleView } from "./views/cosmic-idle-view"

export default defineModule({
  id: "game",
  label: "Cosmic Idle",
  icon: "Gamepad2",
  type: "APP",
  navPlacement: "OS_DOCK",
  basePath: "/game",
  defaultRoute: "adam",
  routes: [
    { slug: "adam", label: "Level 1: Adam", icon: "Sparkles", component: CosmicIdleView },
  ],
})
