#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const roots = ["apps", "packages", "services", "cli"]
const files = []
function listTests(dir) {
  const result = []
  function visit(current) {
    if (!fs.existsSync(current)) return
    for (const entry of fs
      .readdirSync(current, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name))) {
      if (
        [
          "node_modules",
          ".next",
          "dist",
          "build",
          ".turbo",
          "coverage",
        ].includes(entry.name)
      )
        continue
      const full = path.join(current, entry.name)
      if (entry.isDirectory()) visit(full)
      else if (
        /\.(test|spec)\.[cm]?[jt]sx?$/.test(entry.name) ||
        entry.name.startsWith("test_")
      )
        result.push(path.relative(root, full).split(path.sep).join("/"))
    }
  }
  visit(dir)
  return result
}
function walk(dir) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs
    .readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))) {
    if (
      ["node_modules", ".next", "dist", "build", ".turbo", "coverage"].includes(
        entry.name
      )
    )
      continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (entry.name === "package.json") files.push(full)
  }
}
for (const name of roots) walk(path.join(root, name))

const packages = files
  .map((file) => {
    const manifest = JSON.parse(fs.readFileSync(file, "utf8"))
    return {
      path: path.relative(root, path.dirname(file)).split(path.sep).join("/"),
      name: manifest.name ?? null,
      version: manifest.version ?? null,
      scripts: Object.keys(manifest.scripts ?? {}).sort(),
      dependencies: Object.keys({
        ...(manifest.dependencies ?? {}),
        ...(manifest.devDependencies ?? {}),
      }).sort(),
      tests: listTests(path.dirname(file)),
    }
  })
  .sort((a, b) => a.path.localeCompare(b.path))
const serviceDirs = fs.existsSync(path.join(root, "services"))
  ? fs
      .readdirSync(path.join(root, "services"), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => {
        const dir = path.join(root, "services", entry.name)
        const manifestPath = path.join(dir, "pyproject.toml")
        return {
          path: `services/${entry.name}`,
          name: entry.name,
          manifest: fs.existsSync(manifestPath) ? "pyproject.toml" : null,
          scripts: [],
          dependencies: [],
        }
      })
      .sort((a, b) => a.path.localeCompare(b.path))
  : []

const result = {
  schema_version: 1,
  generated_by: "scripts/repository-map.mjs",
  source: [
    "package.json",
    "pnpm-workspace.yaml",
    "ARCHITECTURE.md",
    ".github/workflows",
  ],
  roots,
  applications: packages.filter((item) => item.path.startsWith("apps/")),
  packages: packages.filter((item) => item.path.startsWith("packages/")),
  services: [
    ...packages.filter((item) => item.path.startsWith("services/")),
    ...serviceDirs,
  ],
  tooling: packages.filter((item) => item.path.startsWith("cli/")),
}
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
