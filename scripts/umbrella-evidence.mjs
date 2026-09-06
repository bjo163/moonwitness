import fs from "node:fs"
import path from "node:path"

const EVIDENCE_RANK = { E5: 0, E4: 1, E3: 2, E2: 3, E1: 4, E0: 5 }

function readText(rootDir, relativePath) {
  const fullPath = path.join(rootDir, relativePath)
  return fs.existsSync(fullPath) ? fs.readFileSync(fullPath, "utf8") : null
}

function contextValue(context, dottedPath) {
  return String(dottedPath || "").split(".").filter(Boolean).reduce((value, key) => value?.[key], context)
}

export function evaluateSourceCheck(rootDir, check, context = {}) {
  if (check.type === "context_equals") return contextValue(context, check.context_path) === check.value
  const fullPath = path.join(rootDir, check.path)
  if (check.type === "file_exists") return fs.existsSync(fullPath)
  const text = readText(rootDir, check.path)
  if (text === null) return false
  if (check.type === "contains_all") return check.values.every((value) => text.includes(value))
  if (check.type === "json_script") {
    try {
      const parsed = JSON.parse(text)
      return typeof parsed?.scripts?.[check.script] === "string" && parsed.scripts[check.script].trim().length > 0
    } catch {
      return false
    }
  }
  throw new Error(`Unknown source check type ${check.type}`)
}

function knownInput(value, evidenceLevel, reasonCodes = []) {
  return {
    state: "KNOWN_VALUE",
    value,
    condition: value === 100 ? "PASS" : "FAIL",
    evidence_level: evidenceLevel,
    reason_codes: reasonCodes,
  }
}

function unknownInput(reasonCode) {
  return {
    state: "UNKNOWN_REQUIRED",
    value: null,
    condition: "UNKNOWN",
    evidence_level: "E5",
    reason_codes: [reasonCode],
  }
}

function applyObservation(observations, profile, dimension, input) {
  observations[profile] ||= {}
  const current = observations[profile][dimension]
  if (!current || EVIDENCE_RANK[input.evidence_level] > EVIDENCE_RANK[current.evidence_level]) {
    observations[profile][dimension] = input
  }
}

export function collectSourceEvidence(rootDir, evidenceConfig, sourceContext = {}) {
  const observations = { RawHealth: {}, DeploymentReadinessScore: {} }
  const evidence = []
  for (const [collectorId, collector] of Object.entries(evidenceConfig.source_collectors || {})) {
    const checks = collector.checks.map((check) => ({ id: check.id, passed: evaluateSourceCheck(rootDir, check, sourceContext) }))
    const passed = checks.filter((check) => check.passed).length
    const value = checks.length === 0 ? null : (passed / checks.length) * 100
    const input = value === null ? unknownInput("SOURCE_COLLECTOR_EMPTY") : knownInput(value, "E1", value === 100 ? [] : ["SOURCE_CONTRACT_CHECK_FAILED"])
    for (const mapping of collector.maps || []) applyObservation(observations, mapping.profile, mapping.dimension, input)
    evidence.push({
      id: collectorId,
      kind: "source_contract",
      evidence_level: "E1",
      assessed: checks.length,
      passed,
      checks,
      value,
      condition: input.condition,
    })
  }
  return { observations, evidence }
}

function executionInput(status, conclusion, reasonPrefix) {
  if (status === "completed" && conclusion === "success") return knownInput(100, "E0")
  if (status === "completed" && ["failure", "timed_out", "action_required", "startup_failure"].includes(conclusion)) {
    return knownInput(0, "E0", [`${reasonPrefix}_FAILED`])
  }
  return unknownInput(`${reasonPrefix}_NOT_COMPLETED`)
}

function foundationAggregate(foundation = {}) {
  const keys = ["audit", "lint", "typecheck", "test", "build"]
  const values = keys.map((key) => foundation[key]).filter(Boolean)
  if (values.length !== keys.length) return unknownInput("FOUNDATION_EVIDENCE_INCOMPLETE")
  if (values.every((value) => value === "success")) return knownInput(100, "E0")
  if (values.some((value) => ["failure", "cancelled", "timed_out"].includes(value))) return knownInput(0, "E0", ["FOUNDATION_JOB_FAILED"])
  return unknownInput("FOUNDATION_EVIDENCE_NOT_FINAL")
}

export function collectExecutionEvidence(ciEvidence, evidenceConfig) {
  const observations = { RawHealth: {}, DeploymentReadinessScore: {} }
  const evidence = []
  if (!ciEvidence) return { observations, evidence, externalBlockers: [], issues: [], repositories: [], p0Remaining: 0 }

  const foundation = ciEvidence.foundation || {}
  const execution = {
    "foundation.build": executionInput("completed", foundation.build, "FOUNDATION_BUILD"),
    "foundation.test": executionInput("completed", foundation.test, "FOUNDATION_TEST"),
    "foundation.audit": executionInput("completed", foundation.audit, "FOUNDATION_AUDIT"),
    "foundation.aggregate": foundationAggregate(foundation),
    "certification.runtime": executionInput(ciEvidence.certification?.status, ciEvidence.certification?.conclusion, "CERTIFICATION_RUNTIME"),
    "certification.database": executionInput(ciEvidence.certification?.status, ciEvidence.certification?.conclusion, "CERTIFICATION_DATABASE"),
    "certification.rollback": executionInput(ciEvidence.certification?.status, ciEvidence.certification?.conclusion, "CERTIFICATION_ROLLBACK"),
  }

  for (const [evidenceId, input] of Object.entries(execution)) {
    for (const mapping of evidenceConfig.execution_mappings?.[evidenceId] || []) applyObservation(observations, mapping.profile, mapping.dimension, input)
    evidence.push({ id: evidenceId, kind: "execution", ...input })
  }

  const branches = evidenceConfig.github?.required_branches || []
  const branchStates = branches.map((name) => ({ name, protected: ciEvidence.branches?.[name]?.protected ?? null }))
  const unprotected = branchStates.filter((branch) => branch.protected === false)
  const branchUnknown = branchStates.filter((branch) => branch.protected === null)
  const externalBlockers = []
  let p0Remaining = 0
  if (unprotected.length > 0) {
    externalBlockers.push({
      id: "branch-enforcement",
      status: "BLOCKED_EXTERNAL",
      issue: 18,
      evidence_level: "E0",
      branches: unprotected.map((branch) => branch.name).sort(),
      reason_codes: ["REQUIRED_BRANCH_UNPROTECTED"],
    })
    p0Remaining += 1
  }

  const issueConfig = new Map((evidenceConfig.github?.tracked_issues || []).map((item) => [String(item.number), item]))
  const issues = Object.entries(ciEvidence.issues || {}).map(([number, issue]) => {
    const configured = issueConfig.get(String(number)) || {}
    let verified_state = "TRACKED"
    if (configured.kind === "branch_enforcement") {
      if (unprotected.length > 0) verified_state = "BLOCKED_EXTERNAL"
      else if (branchUnknown.length === 0) verified_state = "VALIDATED"
      else verified_state = "CONFIRMED"
    }
    return {
      number: Number(number),
      priority: configured.priority || null,
      kind: configured.kind || null,
      administrative_state: issue.state || "unknown",
      verified_state,
      evidence_level: configured.kind === "branch_enforcement" && branchUnknown.length === 0 ? "E0" : "E3",
    }
  }).sort((a, b) => a.number - b.number)

  const repositories = [{
    repository: ciEvidence.repository || null,
    source_revision: ciEvidence.source_revision || null,
    branches: branchStates,
  }]

  return { observations, evidence, externalBlockers, issues, repositories, p0Remaining }
}

export function mergeObservations(base, override) {
  const result = { RawHealth: {}, DeploymentReadinessScore: {} }
  for (const profile of Object.keys(result)) {
    for (const [dimension, input] of Object.entries(base?.[profile] || {})) applyObservation(result, profile, dimension, input)
    for (const [dimension, input] of Object.entries(override?.[profile] || {})) applyObservation(result, profile, dimension, input)
  }
  return result
}

export function collectUmbrellaEvidence({ rootDir, evidenceConfig, ciEvidence = null, sourceContext = {} }) {
  const source = collectSourceEvidence(rootDir, evidenceConfig, sourceContext)
  const execution = collectExecutionEvidence(ciEvidence, evidenceConfig)
  return {
    observations: mergeObservations(source.observations, execution.observations),
    evidence: [...source.evidence, ...execution.evidence].sort((a, b) => a.id.localeCompare(b.id)),
    externalBlockers: execution.externalBlockers,
    issues: execution.issues,
    repositories: execution.repositories,
    p0Remaining: execution.p0Remaining,
  }
}
