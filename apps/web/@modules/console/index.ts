import { defineModule } from "@modules/define-module"
import { ConsoleView } from "./views/console-view"

/**
 * Console Module — MoonWitness OS
 *
 * Terminal command center untuk interaksi langsung dengan sistem.
 */
export default defineModule({
  id: "console",
  label: "CONSOLE",
  icon: "Terminal",
  type: "CORE_OS",
  navPlacement: "HIDDEN",
  basePath: "/console",
  defaultRoute: "terminal",
  routes: [
    {
      slug: "terminal",
      label: "Terminal",
      icon: "TerminalSquare",
      component: ConsoleView,
    },
  ],
})
