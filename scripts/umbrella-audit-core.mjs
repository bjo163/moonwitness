import crypto from "node:crypto"

export const GENERATOR_ID = "moonwitness-umbrella-audit"
export const GENERATOR_VERSION = "0.1.0"

export function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue)
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort((a, b) => a.localeCompare(b))
        .map((key) => [key, stableValue(value[key])])
    )
  }
  return value
}

export function stableJson(value) {
  return JSON.stringify(stableValue(value))
}

export function sha256(value) {
  return crypto.createHash("sha256").update(typeof value === "string" ? value : stableJson(value)).digest("hex")
}

function assertFiniteNumber(value, name) {
  if (!Number.isFinite(value)) throw new Error(`${name} must be a finite number`)
}

function assertPercent(value, name) {
  assertFiniteNumber(value, name)
  if (value < 0 || value > 100) throw new Error(`${name} must be within 0..100`)
}

export function validateConfig(config) {
  const errors = []
  if (!Number.isInteger(config?.schema_version) || config.schema_version < 1) errors.push("schema_version must be a positive integer")
  if (!config?.model?.id || !config?.model?.version) errors.push("model.id and model.version are required")
  if (!config?.scoring_config_version) errors.push("scoring_config_version is required")

  const tolerance = config?.validation?.weight_sum_tolerance
  const target = config?.validation?.weight_sum_target
  if (!Number.isFinite(tolerance) || tolerance < 0) errors.push("validation.weight_sum_tolerance must be a non-negative number")
  if (!Number.isFinite(target) || target <= 0) errors.push("validation.weight_sum_target must be a positive number")

  const decimals = config?.rounding?.decimals
  if (!Number.isInteger(decimals) || decimals < 0) errors.push("rounding.decimals must be a non-negative integer")

  const bands = config?.score_bands
  if (!Array.isArray(bands) || bands.length === 0) errors.push("score_bands must be non-empty")
  else {
    let previous = Infinity
    for (const band of bands) {
      if (!band?.label || !Number.isFinite(band?.min)) errors.push("every score band requires label and numeric min")
      else if (band.min > previous) errors.push("score_bands must be ordered from highest min to lowest")
      previous = band?.min ?? previous
    }
  }

  for (const [level, coefficient] of Object.entries(config?.evidence_coefficients || {})) {
    if (!/^E[0-5]$/.test(level)) errors.push(`invalid evidence level ${level}`)
    if (!Number.isFinite(coefficient) || coefficient < 0 || coefficient > 1) errors.push(`invalid evidence coefficient ${level}`)
  }
  for (const level of ["E0", "E1", "E2", "E3", "E4", "E5"]) {
    if (!(level in (config?.evidence_coefficients || {}))) errors.push(`missing evidence coefficient ${level}`)
  }

  for (const [profileName, profile] of Object.entries(config?.profiles || {})) {
    if (!profile?.formula_id || !profile?.version) errors.push(`${profileName} requires formula_id and version`)
    if (!config?.unknown_policies?.[profile?.unknown_policy]) errors.push(`${profileName} references unknown policy ${profile?.unknown_policy}`)
    if (!Array.isArray(profile?.dimensions) || profile.dimensions.length === 0) {
      errors.push(`${profileName} must define dimensions`)
      continue
    }
    let weightSum = 0
    const ids = new Set()
    for (const dimension of profile.dimensions) {
      if (!dimension?.id || ids.has(dimension.id)) errors.push(`${profileName} has missing/duplicate dimension id`)
      ids.add(dimension?.id)
      if (!Number.isFinite(dimension?.weight) || dimension.weight < 0) errors.push(`${profileName}.${dimension?.id} has invalid weight`)
      else weightSum += dimension.weight
    }
    if (Number.isFinite(target) && Number.isFinite(tolerance) && Math.abs(weightSum - target) > tolerance) {
      errors.push(`${profileName} weights sum to ${weightSum}, expected ${target}`)
    }
  }

  const requiredOutputs = config?.required_outputs
  if (!Array.isArray(requiredOutputs) || new Set(requiredOutputs).size !== requiredOutputs?.length) {
    errors.push("required_outputs must be a unique array")
  }

  if (errors.length > 0) throw new Error(`Invalid UMBRELLA scoring config:\n- ${errors.join("\n- ")}`)
  return true
}

export function roundScore(value, config) {
  if (value === null) return null
  return Number(value.toFixed(config.rounding.decimals))
}

export function bandFor(value, config) {
  if (value === null) return null
  return config.score_bands.find((band) => value >= band.min)?.label ?? null
}

export function defaultInputsForProfile(profile, config) {
  return Object.fromEntries(
    profile.dimensions.map((dimension) => [dimension.id, {
      state: config.states.unknown_required,
      value: null,
      condition: "UNKNOWN",
      evidence_level: "E5",
      reason_codes: ["COLLECTOR_NOT_AVAILABLE"],
    }])
  )
}

export function computeWeightedProfile(profileName, profile, inputs, config) {
  const policy = config.unknown_policies[profile.unknown_policy]
  const components = []
  let numerator = 0
  let knownWeight = 0
  let applicableWeight = 0
  const unknownRequired = []

  for (const dimension of profile.dimensions) {
    const input = inputs?.[dimension.id] || {
      state: config.states.unknown_required,
      value: null,
      condition: "UNKNOWN",
      evidence_level: "E5",
      reason_codes: ["MISSING_INPUT"],
    }

    if (![config.states.known, config.states.unknown_required, config.states.not_applicable].includes(input.state)) {
      throw new Error(`${profileName}.${dimension.id} has invalid state ${input.state}`)
    }

    if (input.state === config.states.not_applicable) {
      components.push({ id: dimension.id, weight: dimension.weight, ...input })
      continue
    }

    applicableWeight += dimension.weight
    if (input.state === config.states.unknown_required) {
      if (dimension.required !== false) unknownRequired.push(dimension.id)
      components.push({ id: dimension.id, weight: dimension.weight, ...input })
      continue
    }

    assertPercent(input.value, `${profileName}.${dimension.id}.value`)
    numerator += input.value * dimension.weight
    knownWeight += dimension.weight
    components.push({ id: dimension.id, weight: dimension.weight, ...input })
  }

  let value = null
  let status = "INSUFFICIENT"
  if (knownWeight > 0 && (unknownRequired.length === 0 || policy.allow_numeric_when_unknown_required)) {
    value = roundScore(numerator / knownWeight, config)
    status = "KNOWN_VALUE"
  }

  return {
    status,
    value,
    band: bandFor(value, config),
    formula_id: profile.formula_id,
    profile_version: profile.version,
    known_weight: roundScore(knownWeight, config),
    applicable_weight: roundScore(applicableWeight, config),
    unknown_required: unknownRequired.sort((a, b) => a.localeCompare(b)),
    components,
  }
}

export function computeCoverage(profile, inputs, config) {
  let applicable = 0
  let assessed = 0
  let verified = 0
  let evidenceTotal = 0

  for (const dimension of profile.dimensions) {
    const input = inputs[dimension.id]
    if (input.state === config.states.not_applicable) continue
    applicable += 1
    const coefficient = config.evidence_coefficients[input.evidence_level]
    if (!Number.isFinite(coefficient)) throw new Error(`Unknown evidence level ${input.evidence_level}`)
    evidenceTotal += coefficient
    if (input.state === config.states.known) assessed += 1
    if (input.state === config.states.known && (input.evidence_level === "E0" || input.evidence_level === "E1")) verified += 1
  }

  const ratio = (numerator) => applicable === 0 ? null : roundScore((numerator / applicable) * 100, config)
  const evidenceConfidence = applicable === 0 ? null : roundScore((evidenceTotal / applicable) * 100, config)

  return {
    applicable_domains: applicable,
    assessed_domains: assessed,
    verified_domains: verified,
    audit_coverage: ratio(assessed),
    verified_coverage: ratio(verified),
    evidence_confidence: evidenceConfidence,
  }
}

export function deriveDeploymentGate(profile, inputs, externalBlockers, p0Remaining, config) {
  const policy = config.gate_policies.DeploymentGate
  const mandatory = profile.dimensions.filter((dimension) => dimension.mandatory_gate)
  const failed = []
  const unknown = []

  for (const dimension of mandatory) {
    const input = inputs[dimension.id]
    if (!input || input.state === config.states.unknown_required || input.condition === "UNKNOWN") {
      unknown.push(dimension.id)
      continue
    }
    if (input.state === config.states.not_applicable) continue
    if (policy.block_on_conditions.includes(input.condition)) failed.push(dimension.id)
  }

  const activeExternal = (externalBlockers || []).filter((blocker) => blocker.status === policy.external_blocker_status)
  if ((policy.p0_blocks && p0Remaining > 0) || activeExternal.length > 0) {
    return {
      status: policy.external_blocker_status,
      can_deploy: false,
      failed_dimensions: failed,
      unknown_dimensions: unknown,
      external_blockers: activeExternal.map((item) => item.id).sort((a, b) => String(a).localeCompare(String(b))),
      reason_codes: [
        ...(p0Remaining > 0 ? ["P0_REMAINING"] : []),
        ...(activeExternal.length > 0 ? ["EXTERNAL_BLOCKER"] : []),
      ],
    }
  }
  if (failed.length > 0) {
    return {
      status: "FAIL",
      can_deploy: false,
      failed_dimensions: failed.sort((a, b) => a.localeCompare(b)),
      unknown_dimensions: unknown.sort((a, b) => a.localeCompare(b)),
      external_blockers: [],
      reason_codes: ["MANDATORY_GATE_FAILED"],
    }
  }
  if (unknown.length > 0) {
    return {
      status: policy.unknown_status,
      can_deploy: false,
      failed_dimensions: [],
      unknown_dimensions: unknown.sort((a, b) => a.localeCompare(b)),
      external_blockers: [],
      reason_codes: ["MANDATORY_GATE_UNKNOWN"],
    }
  }
  return {
    status: policy.ready_status,
    can_deploy: true,
    failed_dimensions: [],
    unknown_dimensions: [],
    external_blockers: [],
    reason_codes: [],
  }
}

function deferredMetric(name, config) {
  return {
    status: "INSUFFICIENT",
    value: null,
    band: null,
    formula_id: null,
    profile_version: null,
    reason_codes: [`${config.deferred_profiles[name] || "FUTURE_PHASE"}_PROFILE_NOT_ACTIVE`],
  }
}

function coverageMetric(value, formulaId, details, config) {
  return {
    status: value === null ? "NOT_APPLICABLE" : "KNOWN_VALUE",
    value,
    band: null,
    formula_id: formulaId,
    profile_version: config.scoring_config_version,
    details,
  }
}

export function buildReport({ config, sourceRevision, generatedAt = new Date().toISOString(), externalBlockers = [], p0Remaining = 0, observations = {} }) {
  validateConfig(config)
  const rawProfile = config.profiles.RawHealth
  const deploymentProfile = config.profiles.DeploymentReadinessScore
  const rawInputs = { ...defaultInputsForProfile(rawProfile, config), ...(observations.RawHealth || {}) }
  const deploymentInputs = { ...defaultInputsForProfile(deploymentProfile, config), ...(observations.DeploymentReadinessScore || {}) }

  const rawHealth = computeWeightedProfile("RawHealth", rawProfile, rawInputs, config)
  const deploymentReadiness = computeWeightedProfile("DeploymentReadinessScore", deploymentProfile, deploymentInputs, config)
  const coverage = computeCoverage(rawProfile, rawInputs, config)
  const deploymentGate = deriveDeploymentGate(deploymentProfile, deploymentInputs, externalBlockers, p0Remaining, config)

  const progress = {
    status: "INSUFFICIENT",
    value: null,
    band: null,
    formula_id: config.progress_policy.formula_id,
    profile_version: config.scoring_config_version,
    reason_codes: ["ISSUE_DOD_EVIDENCE_NOT_COLLECTED"],
  }

  const scores = {
    RawHealth: rawHealth,
    Progress: progress,
    DeploymentReadinessScore: deploymentReadiness,
    DeploymentGate: deploymentGate,
    AuditCoverage: coverageMetric(coverage.audit_coverage, config.coverage_formulas.AuditCoverage, coverage, config),
    VerifiedCoverage: coverageMetric(coverage.verified_coverage, config.coverage_formulas.VerifiedCoverage, coverage, config),
    EvidenceConfidence: coverageMetric(coverage.evidence_confidence, config.coverage_formulas.EvidenceConfidence, coverage, config),
    RepositoryHygieneScore: deferredMetric("RepositoryHygieneScore", config),
    ComplexityScore: deferredMetric("ComplexityScore", config),
    ProgrammaticQualityScore: deferredMetric("ProgrammaticQualityScore", config),
    ReproducibilityScore: deferredMetric("ReproducibilityScore", config),
    FutureReadinessScore: deferredMetric("FutureReadinessScore", config),
  }

  const report = {
    schema_version: config.schema_version,
    generated_at: generatedAt,
    source_revision: sourceRevision,
    model_id: config.model.id,
    scoring_model_version: config.model.version,
    scoring_config_version: config.scoring_config_version,
    config_hash: sha256(config),
    generator: { id: GENERATOR_ID, version: GENERATOR_VERSION },
    overall: {
      status: deploymentGate.status === "READY" && rawHealth.status === "KNOWN_VALUE" ? "READY" : deploymentGate.status === "FAIL" || deploymentGate.status === "BLOCKED_EXTERNAL" ? "BLOCKED" : "PARTIAL",
      can_deploy: deploymentGate.can_deploy,
      reason_codes: [...new Set([
        ...deploymentGate.reason_codes,
        ...(rawHealth.status !== "KNOWN_VALUE" ? ["RAW_HEALTH_INSUFFICIENT"] : []),
      ])].sort((a, b) => a.localeCompare(b)),
    },
    scores,
    repositories: [],
    components: [
      ...rawHealth.components.map((component) => ({ profile: "RawHealth", ...component })),
      ...deploymentReadiness.components.map((component) => ({ profile: "DeploymentReadinessScore", ...component })),
    ],
    issues: [],
    deployment: { gate: deploymentGate },
    evidence: [],
    hardcodes: [],
    complexity: [],
    hygiene: [],
    coverage: [coverage],
    future_tech: [],
    external_blockers: externalBlockers,
    report_fingerprint: ""
  }

  const fingerprintInput = structuredClone(report)
  delete fingerprintInput.generated_at
  delete fingerprintInput.report_fingerprint
  report.report_fingerprint = sha256(fingerprintInput)
  return report
}

export function validateReport(report, config) {
  const errors = []
  const requiredTopLevel = [
    "schema_version", "generated_at", "source_revision", "model_id", "scoring_model_version",
    "scoring_config_version", "config_hash", "generator", "overall", "scores", "repositories",
    "components", "issues", "deployment", "evidence", "hardcodes", "complexity", "hygiene",
    "coverage", "future_tech", "external_blockers", "report_fingerprint",
  ]
  for (const key of requiredTopLevel) if (!(key in report)) errors.push(`missing report field ${key}`)
  for (const output of config.required_outputs) if (!(output in (report.scores || {}))) errors.push(`missing required output ${output}`)

  for (const [name, metric] of Object.entries(report.scores || {})) {
    if (name === "DeploymentGate") continue
    if (metric.value !== null && metric.value !== undefined) {
      try { assertPercent(metric.value, `scores.${name}.value`) } catch (error) { errors.push(error.message) }
    }
  }

  const coverage = report.coverage?.[0]
  if (coverage) {
    if (coverage.verified_domains > coverage.assessed_domains) errors.push("verified_domains must be <= assessed_domains")
    if (coverage.assessed_domains > coverage.applicable_domains) errors.push("assessed_domains must be <= applicable_domains")
  }

  if (report.overall?.can_deploy !== (report.scores?.DeploymentGate?.status === "READY")) {
    errors.push("overall.can_deploy must exactly follow DeploymentGate READY state")
  }

  const fingerprintInput = structuredClone(report)
  delete fingerprintInput.generated_at
  delete fingerprintInput.report_fingerprint
  if (report.report_fingerprint !== sha256(fingerprintInput)) errors.push("report_fingerprint mismatch")
  if (report.config_hash !== sha256(config)) errors.push("config_hash mismatch")

  if (errors.length > 0) throw new Error(`Invalid UMBRELLA report:\n- ${errors.join("\n- ")}`)
  return true
}
