#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const critical = new Set([
  "@moon/protocol",
  "@moon/server",
  "@moon/orm",
  "@moon/witness",
  "@moon/client",
  "@workspace/ui",
  "@moon/testing",
])
const roots = ["apps", "packages"]
const records = []

function hasTest(dir) {
  let found = false
  function visit(current) {
    if (found || !fs.existsSync(current)) return
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
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
      else if (/\.(test|spec)\.[cm]?[jt]sx?$/.test(entry.name)) {
        found = true
        return
      }
    }
  }
  visit(dir)
  return found
}

for (const rootName of roots) {
  const base = path.join(root, rootName)
  for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const dir = path.join(base, entry.name)
    const manifestPath = path.join(dir, "package.json")
    if (!fs.existsSync(manifestPath)) continue
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"))
    records.push({
      path: path.relative(root, dir).split(path.sep).join("/"),
      name: manifest.name ?? entry.name,
      critical: critical.has(manifest.name),
      has_test: hasTest(dir),
    })
  }
}

records.sort((a, b) => a.name.localeCompare(b.name))
const criticalMissing = records.filter(
  (record) => record.critical && !record.has_test
)
const result = {
  schema_version: 1,
  generated_by: "scripts/testability-check.mjs",
  total_packages: records.length,
  tested_packages: records.filter((record) => record.has_test).length,
  coverage_percent: records.length
    ? Number(
        (
          (records.filter((record) => record.has_test).length /
            records.length) *
          100
        ).toFixed(2)
      )
    : 0,
  critical_missing_tests: criticalMissing,
  packages: records,
}
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
if (criticalMissing.length > 0) process.exitCode = 2
