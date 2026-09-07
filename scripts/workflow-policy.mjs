#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const workflowDir = path.join(root, ".github", "workflows")
const failures = []
for (const entry of fs
  .readdirSync(workflowDir)
  .filter((name) => /\.ya?ml$/.test(name))
  .sort()) {
  const file = path.join(workflowDir, entry)
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/)
  lines.forEach((line, index) => {
    const match = line.match(/uses:\s*([^\s#]+)@([^\s#]+)/)
    if (match && !/^[0-9a-f]{40}$/.test(match[2]))
      failures.push(
        `${entry}:${index + 1}: action ${match[1]} must use a 40-character commit SHA`
      )
    if (/node-version:\s*['"]?20(?:['"]|\s|$)/.test(line))
      failures.push(
        `${entry}:${index + 1}: Node 20 is outside the supported runtime policy`
      )
  })
}
const result = {
  schema_version: 1,
  policy: { action_ref: "immutable-commit-sha", minimum_node_major: 22 },
  workflows: fs
    .readdirSync(workflowDir)
    .filter((name) => /\.ya?ml$/.test(name))
    .sort(),
  failures,
}
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
if (failures.length) process.exitCode = 2
