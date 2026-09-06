#!/usr/bin/env node
import { spawn, spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { existsSync } from "node:fs"

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(__dirname, "..")
const runnersDir = join(__dirname, "runners")

const args = process.argv.slice(2)
const keepExisting = args.includes("-KeepExisting") || args.includes("--keep-existing")

console.log("=================================================================")
console.log("MOONWITNESS OS - WINDOWS MULTI-SERVICE DEV RUNNER")
console.log("=================================================================")
console.log(`Workspace Root: ${repoRoot}`)
console.log("Execution Mode: Dedicated Windows CMD Windows (3 Node.js services)")

// Step 1: Clean occupied ports unless keepExisting is requested
if (!keepExisting) {
  console.log("\n>> Step 1/3: Checking local port availability...")
  const downScript = join(__dirname, "win-dev-down.mjs")
  spawnSync("node", [downScript], { stdio: "inherit", cwd: repoRoot })
}

// Step 2: Build shared workspace packages (@moon/*)
console.log("\n>> Step 2/3: Building shared workspace packages (@moon/*)...")
try {
  spawnSync("pnpm.cmd", ["--filter", "@moon/*", "build"], {
    stdio: "inherit",
    cwd: repoRoot,
    shell: true,
  })
} catch {
  console.log("[!] Package build finished with warnings, continuing...")
}

const services = [
  { id: "api", title: "MW-API [Port 4000]", file: "dev-api.cmd", desc: "API Backend (Node.js)", url: "http://localhost:4000" },
  { id: "command-center", title: "MW-COMMAND-CENTER [Port 3001]", file: "dev-command-center.cmd", desc: "Command Center", url: "http://localhost:3001" },
  { id: "web", title: "MW-WEB [Port 3000]", file: "dev-web.cmd", desc: "Public Web Portal", url: "http://localhost:3000" },
]

for (const svc of services) {
  const runnerPath = join(runnersDir, svc.file)
  const child = spawn("cmd.exe", ["/c", "start", svc.title, runnerPath], {
    detached: true,
    stdio: "ignore",
    cwd: repoRoot,
  })
  child.unref()
  console.log(`  [OK] Launched CMD window: ${svc.title}`)
}

console.log("\n=================================================================")
console.log("ALL MOONWITNESS SERVICES LAUNCHED IN DEDICATED WINDOWS:")
for (const svc of services) {
  console.log(`  * ${svc.desc.padEnd(18)} : ${svc.url}`)
}
console.log("\nNote: Each service is running in its own separate Windows CMD window.")
console.log("To stop all services and free ports, run: pnpm win:dev:down")
console.log("=================================================================")
