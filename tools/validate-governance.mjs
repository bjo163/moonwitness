#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const registryDir = path.join(root, ".agents", "registry")
const expected = ["agents", "skills", "rules", "schedules"]
const failures = []
const registries = new Map()
const idPattern = /^(agent|skill|rule|schedule)\.[a-z0-9-]+(?:\.[a-z0-9-]+)*$/

for (const type of expected) {
  const file = path.join(registryDir, `${type}.json`)
  if (!fs.existsSync(file)) { failures.push(`${type}: missing registry`); continue }
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"))
    if (data.schema_version !== 1 || data.registry_type !== type || !Array.isArray(data.entries)) failures.push(`${type}: invalid registry envelope`)
    registries.set(type, data.entries ?? [])
  } catch (error) { failures.push(`${type}: invalid JSON (${error.message})`) }
}

const all = new Map()
for (const [type, entries] of registries) for (const entry of entries) {
  if (!entry.id || !idPattern.test(entry.id) || !entry.id.startsWith(`${type.slice(0, -1)}.`)) failures.push(`${type}: invalid id ${entry.id ?? "<missing>"}`)
  if (!/^\d+\.\d+\.\d+$/.test(entry.version ?? "")) failures.push(`${entry.id ?? type}: invalid version`)
  if (!entry.status || !entry.owner || !entry.scope) failures.push(`${entry.id ?? type}: missing identity metadata`)
  if (all.has(entry.id)) failures.push(`duplicate id ${entry.id}`)
  all.set(entry.id, entry)
}
for (const [type, entries] of registries) for (const entry of entries) {
  for (const dependency of entry.dependencies ?? []) if (!all.has(dependency)) failures.push(`${entry.id}: missing dependency ${dependency}`)
  for (const skill of entry.skills ?? []) if (!all.has(skill)) failures.push(`${entry.id}: missing skill ${skill}`)
  for (const rule of entry.rules ?? []) if (!all.has(rule)) failures.push(`${entry.id}: missing rule ${rule}`)
}

const graph = new Map([...all.keys()].map((id) => [id, all.get(id).dependencies ?? []]))
const visiting = new Set(), visited = new Set()
function visit(id, chain = []) {
  if (visiting.has(id)) { failures.push(`dependency cycle: ${[...chain, id].join(" -> ")}`); return }
  if (visited.has(id)) return
  visiting.add(id); for (const dependency of graph.get(id) ?? []) visit(dependency, [...chain, id]); visiting.delete(id); visited.add(id)
}
for (const id of graph.keys()) visit(id)

const result = { schema_version: 1, registries: Object.fromEntries([...registries].map(([type, entries]) => [type, entries.length])), failures }
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
if (failures.length) process.exitCode = 2
