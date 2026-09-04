import test from "node:test"
import assert from "node:assert/strict"
import { applyPhaseCMetrics } from "./umbrella-phase-c.mjs"

function metric(value) {
  return { status: "KNOWN_VALUE", value, band: "GOOD", formula_id: "fixture", profile_version: "1" }
}

test("Phase C replaces deferred scores without changing deployment gate truth", () => {
  const report = {
    scores: {
      DeploymentGate: { status: "BLOCKED_EXTERNAL", can_deploy: false },
      RepositoryHygieneScore: metric(null),
      ComplexityScore: metric(null),
      ProgrammaticQualityScore: metric(null),
      ReproducibilityScore: metric(null),
      FutureReadinessScore: metric(null),
    },
    hygiene: [], complexity: [], future_tech: [],
  }
  const gateBefore = structuredClone(report.scores.DeploymentGate)
  const collected = {
    hygiene: {
      metric: metric(88),
      coverage: { measurement_coverage: 75, unknown_dimensions: ["dead_code_ratio"] },
      details: { tracked_files: 10 },
      findings: [{ category: "repo_root_clutter", file: "x.tmp" }],
    },
    complexity: {
      metric: metric(72),
      details: { source_files: 9 },
      cycles: [["a.ts", "b.ts"]],
      hotspots: [{ file: "a.ts", hotspot_score: 0.7 }],
    },
    quality: {
      programmatic_quality: { metric: metric(91), hardcode_penalty: 2, nondeterministic_test_files: [] },
      reproducibility: { metric: metric(79), details: { action_uses: 4 } },
      future_readiness: {
        metric: metric(65),
        baseline: { as_of: "2026-09-04", sources: ["official"] },
        recommendations: [{ id: "node-engine-floor", current: ">=20", recommendation: "raise floor" }],
      },
    },
  }

  applyPhaseCMetrics(report, collected)
  assert.deepEqual(report.scores.DeploymentGate, gateBefore)
  assert.equal(report.scores.RepositoryHygieneScore.value, 88)
  assert.equal(report.scores.ComplexityScore.value, 72)
  assert.equal(report.scores.ProgrammaticQualityScore.value, 91)
  assert.equal(report.scores.ReproducibilityScore.value, 79)
  assert.equal(report.scores.FutureReadinessScore.value, 65)
  assert.equal(report.hygiene[1].kind, "finding")
  assert.equal(report.complexity.some((item) => item.kind === "dependency_cycle"), true)
  assert.equal(report.future_tech.some((item) => item.kind === "recommendation"), true)
})
