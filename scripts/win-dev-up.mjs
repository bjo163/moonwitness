#!/usr/bin/env node
import { spawn } from "node:child_process"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const psScript = join(__dirname, "win-dev-up.ps1")
const extraArgs = process.argv.slice(2)

const ps = spawn(
  "powershell.exe",
  ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", psScript, ...extraArgs],
  {
    stdio: "inherit",
    shell: false,
  }
)

ps.on("exit", (code) => {
  process.exit(code ?? 0)
})
