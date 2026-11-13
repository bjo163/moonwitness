#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const changed = execFileSync("git", ["diff", "--name-only", "HEAD"], {
  cwd: root,
  encoding: "utf8",
})
  .split(/\r?\n/)
  .filter(Boolean)
  .sort()
const workspaces = new Map()
for (const rootName of ["apps", "packages", "services", "cli"]) {
  const base = path.join(root, rootName)
  if (!fs.existsSync(base)) continue
  for (const file of fs.readdirSync(base, { withFileTypes: true })) {
    if (!file.isDirectory()) continue
    const dir = path.join(base, file.name)
    const manifestPath = path.join(dir, "package.json")
    const pythonManifest = path.join(dir, "pyproject.toml")
    if (fs.existsSync(manifestPath))
      workspaces.set(
        `${rootName}/${file.name}`,
        JSON.parse(fs.readFileSync(manifestPath, "utf8"))
      )
    else if (fs.existsSync(pythonManifest))
      workspaces.set(`${rootName}/${file.name}`, {
        name: file.name,
        scripts: { test: "python test suite" },
      })
  }
}
const affected = [...workspaces.entries()].filter(([dir]) =>
  changed.some((file) => file === dir || file.startsWith(`${dir}/`))
)
const critical = affected.some(([dir]) =>
  /moon-(protocol|server|orm|witness)|packages\/ui/.test(dir)
)
const result = {
  schema_version: 1,
  changed_files: changed,
  affected_workspaces: affected.map(([path, manifest]) => ({
    path,
    name: manifest.name,
    scripts: Object.keys(manifest.scripts ?? {}).sort(),
  })),
  required_checks: [
    "audit:rules",
    "lint",
    "typecheck",
    "test",
    "build",
    ...(critical ? ["contracts:verify", "test:e2e"] : []),
  ],
}
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
