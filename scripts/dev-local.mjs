#!/usr/bin/env node
/**
 * ◈ MoonWitness — Zero-Config Local-First Development Launcher
 *
 * Boots the complete application stack (apps/web, apps/command-center, apps/api)
 * backed by local SQLite without requiring PostgreSQL or Docker.
 */

import { spawn } from "node:child_process"
import { existsSync, mkdirSync } from "node:fs"
import { resolve, join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, "..")
const dataDir = join(repoRoot, "data")

if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true })
}

const sqliteUrl = `sqlite://${join(dataDir, "moonwitness.dev.db").replace(/\\/g, "/")}`

console.log("=================================================================")
console.log("◈ MOONWITNESS — ZERO-CONFIG LOCAL-FIRST DEVELOPMENT")
console.log("=================================================================")
console.log(`Database:     ${sqliteUrl}`)
console.log("Mode:         Offline / Standalone (Zero PostgreSQL Dependency)")
console.log("=================================================================\n")

const env = {
  ...process.env,
  DATABASE_URL: sqliteUrl,
  NODE_ENV: "development",
  MOON_AUTO_SYNC: "true",
}

const isWindows = process.platform === "win32"
const pnpmCmd = isWindows ? "pnpm.cmd" : "pnpm"

const child = spawn(pnpmCmd, ["dev"], {
  cwd: repoRoot,
  env,
  stdio: "inherit",
})

child.on("exit", (code) => {
  process.exit(code ?? 0)
})

process.on("SIGINT", () => child.kill("SIGINT"))
process.on("SIGTERM", () => child.kill("SIGTERM"))
