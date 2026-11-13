import type { NativeServer } from "@moon/server"
import { registerExternalProxies } from "./external-proxies.js"
import { registerPolyglotBridge } from "./polyglot-bridge.js"
import { registerSystemRoutes } from "./system.js"

export function registerAllRoutes(server: NativeServer): void {
  registerExternalProxies(server)
  registerPolyglotBridge(server)
  registerSystemRoutes(server)
}
