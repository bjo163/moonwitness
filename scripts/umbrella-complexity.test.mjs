import { test } from "vitest"
import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { execFileSync } from "node:child_process"
import { collectComplexity } from "./umbrella-complexity.mjs"

const scoringConfig = {
  states: { known: "KNOWN_VALUE", unknown_required: "UNKNOWN_REQUIRED", not_applicable: "NOT_APPLICABLE" },
  unknown_policies: { strict_required_v1: { allow_numeric_when_unknown_required: false } },
  rounding: { decimals: 2 },
  score_bands: [{ label: "EXCELLENT", min: 95 }, { label: "CRITICAL", min: 0 }],
}
const config = {
  profile: { version: "1", formula_id: "weighted_mean_v1", unknown_policy: "strict_required_v1", dimensions: [
    { id: "cyclomatic", weight: .24, required: true }, { id: "cognitive", weight: .20, required: true }, { id: "dependency_cycles", weight: .18, required: true }, { id: "duplication", weight: .12, required: true }, { id: "fanout", weight: .08, required: true }, { id: "abstraction_depth", weight: .08, required: true }, { id: "testability", weight: .05, required: false }, { id: "hotspot_history", weight: .05, required: false }
  ]},
  thresholds: { cyclomatic_warn: 2, cyclomatic_critical: 8, cognitive_warn: 3, cognitive_critical: 12, fanout_warn: 2, fanout_critical: 5, abstraction_depth_warn: 2, abstraction_depth_critical: 5, duplication_block_lines: 3, min_history_commits: 3, history_lookback_commits: 20 },
  criticality: { default_multiplier: 1, rules: [{ pattern: "^src/core", multiplier: 2 }] },
  source_extensions: [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"],
  exclude_patterns: ["(?:\\.test|\\.spec)\\.[cm]?[jt]sx?$"],
}

function repo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "umbrella-complexity-"))
  fs.mkdirSync(path.join(dir, "src"), { recursive: true })
  execFileSync("git", ["init", "-q"], { cwd: dir })
  execFileSync("git", ["config", "user.email", "test@example.com"], { cwd: dir })
  execFileSync("git", ["config", "user.name", "test"], { cwd: dir })
  return dir
}
function commit(dir, message) { execFileSync("git", ["add", "."], { cwd: dir }); execFileSync("git", ["commit", "-qm", message], { cwd: dir }) }

test("AST complexity and dependency cycles are deterministic", () => {
  const dir = repo()
  fs.writeFileSync(path.join(dir, "src/a.ts"), "import { b } from './b'\nexport function a(x:number){ if(x>0){ if(x>1) return b(x) } return 0 }")
  fs.writeFileSync(path.join(dir, "src/b.ts"), "import { a } from './a'\nexport function b(x:number){ return x > 2 ? a(x-1) : x }")
  commit(dir, "one")
  const result = collectComplexity(dir, scoringConfig, config)
  assert.equal(result.details.dependency_cycle_components, 1)
  assert.equal(result.cycles[0].length, 2)
  assert.ok(result.files.find((f) => f.file === "src/a.ts").max_cyclomatic >= 3)
})

test("hotspot remains unknown with shallow history and becomes measured after enough commits", () => {
  const dir = repo()
  fs.writeFileSync(path.join(dir, "src/core.ts"), "export function core(x:number){ if(x) return 1; return 0 }")
  commit(dir, "one")
  let result = collectComplexity(dir, scoringConfig, config)
  assert.equal(result.details.history_available, false)
  fs.appendFileSync(path.join(dir, "src/core.ts"), "\n// two")
  commit(dir, "two")
  fs.appendFileSync(path.join(dir, "src/core.ts"), "\n// three")
  commit(dir, "three")
  result = collectComplexity(dir, scoringConfig, config)
  assert.equal(result.details.history_available, true)
  assert.ok(result.hotspots[0].hotspot_score !== null)
})
