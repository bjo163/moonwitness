import { collectRepositoryHygiene } from "./umbrella-hygiene.mjs"
import { collectComplexity } from "./umbrella-complexity.mjs"
import { collectQualityReproFuture } from "./umbrella-quality.mjs"

export function collectPhaseCMetrics({ rootDir, scoringConfig, hygieneConfig, complexityConfig, qualityConfig, futureBaseline }) {
  return {
    hygiene: collectRepositoryHygiene(rootDir, scoringConfig, hygieneConfig),
    complexity: collectComplexity(rootDir, scoringConfig, complexityConfig),
    quality: collectQualityReproFuture(rootDir, scoringConfig, qualityConfig, futureBaseline),
  }
}

function withDetails(metric, details) {
  return { ...metric, details: { ...(metric.details || {}), ...details } }
}

export function applyPhaseCMetrics(report, collected) {
  const { hygiene, complexity, quality } = collected

  report.scores.RepositoryHygieneScore = withDetails(hygiene.metric, hygiene.coverage)
  report.scores.ComplexityScore = withDetails(complexity.metric, complexity.details)
  report.scores.ProgrammaticQualityScore = withDetails(quality.programmatic_quality.metric, {
    hardcode_penalty: quality.programmatic_quality.hardcode_penalty,
    nondeterministic_test_files: quality.programmatic_quality.nondeterministic_test_files,
  })
  report.scores.ReproducibilityScore = withDetails(quality.reproducibility.metric, quality.reproducibility.details)
  report.scores.FutureReadinessScore = withDetails(quality.future_readiness.metric, {
    baseline: quality.future_readiness.baseline,
  })

  report.hygiene = [
    { kind: "summary", ...hygiene.details, measurement_coverage: hygiene.coverage.measurement_coverage, unknown_dimensions: hygiene.coverage.unknown_dimensions },
    ...hygiene.findings.map((finding) => ({ kind: "finding", ...finding })),
  ]

  report.complexity = [
    { kind: "summary", ...complexity.details },
    ...complexity.cycles.map((files) => ({ kind: "dependency_cycle", files })),
    ...complexity.hotspots.map((hotspot) => ({ kind: "hotspot", ...hotspot })),
  ]

  report.future_tech = [
    { kind: "baseline", ...quality.future_readiness.baseline },
    ...quality.future_readiness.recommendations.map((recommendation) => ({ kind: "recommendation", ...recommendation })),
  ]

  return report
}
