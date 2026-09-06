import { bandFor, roundScore } from "./umbrella-audit-core.mjs"
import { evaluateSourceCheck } from "./umbrella-evidence.mjs"

export function validateProgressConfig(config) {
  const errors = []
  if (!Number.isInteger(config?.schema_version) || config.schema_version < 1) errors.push("schema_version must be positive")
  if (!config?.version) errors.push("version is required")
  if (!Array.isArray(config?.lifecycle_states) || config.lifecycle_states.length === 0) errors.push("lifecycle_states must be non-empty")
  if (!config?.completion_by_state || typeof config.completion_by_state !== "object") errors.push("completion_by_state is required")
  for (const state of config?.lifecycle_states || []) {
    const value = config?.completion_by_state?.[state]
    if (!Number.isFinite(value) || value < 0 || value > 1) errors.push(`completion_by_state.${state} must be within 0..1`)
  }
  for (const key of ["validated", "partial", "empty"]) {
    const state = config?.resolution_states?.[key]
    if (!state || !(config?.lifecycle_states || []).includes(state)) errors.push(`resolution_states.${key} must reference lifecycle_states`)
  }
  if (!Array.isArray(config?.work_items) || config.work_items.length === 0) errors.push("work_items must be non-empty")
  const ids = new Set()
  for (const item of config?.work_items || []) {
    if (!item?.id || ids.has(item.id)) errors.push("work_items require unique ids")
    ids.add(item?.id)
    if (!Number.isFinite(item?.weight) || item.weight <= 0) errors.push(`${item?.id || "work_item"}.weight must be positive`)
    if (!Array.isArray(item?.checks) || item.checks.length === 0) errors.push(`${item?.id || "work_item"}.checks must be non-empty`)
  }
  if (errors.length) throw new Error(`Invalid progress config:\n- ${errors.join("\n- ")}`)
  return true
}

export function collectVerifiedProgress({ rootDir, progressConfig, scoringConfig, issues = [], sourceContext = {} }) {
  validateProgressConfig(progressConfig)
  const issueMap = new Map((issues || []).map((issue) => [Number(issue.number), issue]))
  const workItems = []
  let weightedCompletion = 0
  let totalWeight = 0

  for (const item of [...progressConfig.work_items].sort((a, b) => a.id.localeCompare(b.id))) {
    const checks = item.checks.map((check) => ({
      id: check.id,
      passed: evaluateSourceCheck(rootDir, check, sourceContext),
    })).sort((a, b) => a.id.localeCompare(b.id))
    const passed = checks.filter((check) => check.passed).length
    const allPassed = passed === checks.length
    const state = allPassed
      ? progressConfig.resolution_states.validated
      : passed > 0
        ? progressConfig.resolution_states.partial
        : progressConfig.resolution_states.empty
    const completion = progressConfig.completion_by_state[state]
    totalWeight += item.weight
    weightedCompletion += item.weight * completion
    const administrative = item.linked_issue ? issueMap.get(Number(item.linked_issue)) : null
    workItems.push({
      id: item.id,
      weight: item.weight,
      linked_issue: item.linked_issue ?? null,
      administrative_state: administrative?.administrative_state ?? null,
      verified_state: state,
      completion,
      assessed_checks: checks.length,
      passed_checks: passed,
      checks,
    })
  }

  if (!(totalWeight > 0)) throw new Error("Progress denominator must be greater than zero")
  const value = roundScore((weightedCompletion / totalWeight) * 100, scoringConfig)
  return {
    metric: {
      status: "KNOWN_VALUE",
      value,
      band: bandFor(value, scoringConfig),
      formula_id: scoringConfig.progress_policy.formula_id,
      profile_version: progressConfig.version,
      details: {
        total_weight: totalWeight,
        verified_weight: roundScore(weightedCompletion, scoringConfig),
        validated_items: workItems.filter((item) => item.verified_state === progressConfig.resolution_states.validated).length,
        total_items: workItems.length,
        lifecycle_states: [...progressConfig.lifecycle_states],
        work_items: workItems,
      },
    },
    work_items: workItems,
  }
}

export function applyVerifiedProgress(report, progressResult, progressConfig) {
  report.scores.Progress = progressResult.metric
  const itemsByIssue = new Map()
  for (const item of progressResult.work_items) {
    if (!item.linked_issue) continue
    const key = Number(item.linked_issue)
    const items = itemsByIssue.get(key) || []
    items.push(item)
    itemsByIssue.set(key, items)
  }

  for (const issue of report.issues || []) {
    const items = itemsByIssue.get(Number(issue.number))
    if (!items?.length) continue
    const allValidated = items.every((item) => item.verified_state === progressConfig.resolution_states.validated)
    const anyVerified = items.some((item) => item.passed_checks > 0)
    issue.verified_state = allValidated
      ? progressConfig.resolution_states.validated
      : anyVerified
        ? progressConfig.resolution_states.partial
        : progressConfig.resolution_states.empty
    issue.evidence_level = "E1"
    issue.dod = {
      validated_items: items.filter((item) => item.verified_state === progressConfig.resolution_states.validated).length,
      total_items: items.length,
    }
  }
  return report
}
