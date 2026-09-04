# UMBRELLA Engineering Audit

This directory owns the versioned machine contract for MoonWitness engineering-health auditing.

## Source of truth

- `config/scoring.v1.json` owns scoring weights, evidence coefficients, score bands, unknown policy, gate policy, and required canonical outputs.
- `schema/umbrella-report.schema.json` is the public machine-readable report schema.
- `umbrella-report.json` is generated output and MUST NOT be edited or committed manually.

The generated report is derived from source/config/evidence. Human-readable reports must later be rendered from this machine state, never calculated independently.

## Commands

```text
pnpm audit:umbrella
pnpm audit:umbrella:json
pnpm audit:umbrella:validate
pnpm audit:umbrella:check
```

`audit:umbrella` writes `.audit/umbrella-report.json`.

`audit:umbrella:validate` validates the scoring config, generated report structure, invariants, config fingerprint, report fingerprint, and required canonical outputs without making deployment readiness pass.

`audit:umbrella:check` additionally enforces the configured deployment gate. During Phase A, required runtime/deployment evidence has not yet been collected, so the gate is expected to remain `UNKNOWN` and this command is expected to exit non-zero. That is intentional fail-closed behavior, not a score failure.

## Phase A semantics

Phase A establishes the contract only. It does not invent engineering-health values.

Required component inputs start as:

```text
UNKNOWN_REQUIRED
value = null
evidence = E5
```

Therefore `RawHealth` and `DeploymentReadinessScore` remain `INSUFFICIENT` until collectors provide evidence. They are never silently converted to zero or 100.

`AuditCoverage`, `VerifiedCoverage`, and `EvidenceConfidence` may legitimately be `0` when their formulas measure zero assessed/verified/evidenced domains out of known applicable domains. Those values describe knowledge coverage, not system health.

`RepositoryHygieneScore`, `ComplexityScore`, `ProgrammaticQualityScore`, `ReproducibilityScore`, and `FutureReadinessScore` remain explicitly deferred/insufficient until their Phase C collectors and calibrated profiles are implemented.

## Determinism

The report records:

```text
model_id
scoring_model_version
scoring_config_version
config_hash
generator version
source_revision
generated_at
report_fingerprint
```

`report_fingerprint` excludes `generated_at`, so the same source revision + same configuration + same normalized evidence state yields the same fingerprint. Timestamps do not create false semantic drift.

## Gate law

A score never overrides a gate.

```text
high score + failed mandatory gate => blocked
high score + external blocker => blocked
unknown mandatory gate => not deployable
```

No numeric score may promote `UNKNOWN`, `FAIL`, or `BLOCKED_EXTERNAL` to `READY`.
