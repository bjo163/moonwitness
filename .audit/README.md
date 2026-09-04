# UMBRELLA Engineering Audit

This directory owns the versioned machine contract for MoonWitness engineering-health auditing.

## Source of truth

- `config/scoring.v1.json` owns scoring weights, evidence coefficients, score bands, unknown policy, gate policy, and required canonical outputs.
- `config/evidence.v1.json` owns collector-to-dimension mappings, source-contract checks, exact-SHA execution mappings, required branch observations, and tracked engineering issues.
- `schema/umbrella-report.schema.json` is the public machine-readable report schema.
- `umbrella-report.json` is generated output and MUST NOT be edited or committed manually.

The generated report is derived from source/config/evidence. Human-readable reports must later be rendered from this machine state, never calculated independently.

## Commands

```text
pnpm audit:umbrella
pnpm audit:umbrella:json
pnpm audit:umbrella:validate
pnpm audit:umbrella:check
pnpm audit:umbrella:ci
```

`audit:umbrella` writes `.audit/umbrella-report.json` using repository-visible source evidence.

`audit:umbrella:ci` additionally consumes `.audit/runtime/ci-evidence.json`, which Foundation CI generates from exact-candidate job results, branch state, tracker state, and exact-SHA PostgreSQL certification state. The runtime evidence file is ephemeral and is never committed.

`audit:umbrella:validate` validates the scoring config, generated report structure, invariants, config fingerprint, report fingerprint, and required canonical outputs without forcing deployment readiness to pass.

`audit:umbrella:check` additionally enforces the configured deployment gate and exits non-zero for `UNKNOWN`, `FAIL`, or `BLOCKED_EXTERNAL`.

## Evidence semantics

Evidence strength and engineering condition remain separate:

```text
E0 = directly executed / observed
E1 = directly verified in current source/config
E2 = corroborated current sources
E3 = single-source administrative indication
E4 = inference
E5 = unknown
```

Phase B source collectors compute scores only from explicit pass/fail check ratios. They do not contain handwritten readiness percentages.

Execution-sensitive dimensions such as runtime, database/migration, and rollback stay `UNKNOWN_REQUIRED` until exact-SHA PostgreSQL certification is complete. A workflow file existing in the repository is not treated as proof that the workflow executed successfully.

Foundation build/test/audit results can override weaker source evidence with E0 evidence. Branch enforcement is observed independently of issue state: an open issue does not by itself create a P0, and a closed issue cannot hide observed unprotected required branches.

## Current Phase B scope

Programmatically collected now:

```text
build contract + exact CI build result
runtime exact-SHA certification state
configuration contract
data/database exact-SHA certification state
integration via exact CI tests
test contract + exact CI test result
deployment contract
CI/CD aggregate result
security-critical constitutional audit result
observability contract
rollback exact-SHA certification state
branch-enforcement external blocker
#18 / #26 tracker reconciliation
classified hardcode findings from the constitutional collector layer
```

`RepositoryHygieneScore`, `ComplexityScore`, `ProgrammaticQualityScore`, `ReproducibilityScore`, and `FutureReadinessScore` remain explicitly deferred/insufficient until their Phase C collectors and calibrated profiles are implemented.

## Determinism

The report records model/config/generator/source provenance and a semantic `report_fingerprint`. `generated_at` is excluded from that fingerprint, and CI evidence deliberately omits volatile run IDs/timestamps. The same source revision + configuration + normalized engineering evidence state yields the same semantic fingerprint.

## Gate law

A score never overrides a gate.

```text
high score + failed mandatory gate => blocked
high score + external blocker => blocked
unknown mandatory gate => not deployable
```

No numeric score may promote `UNKNOWN`, `FAIL`, or `BLOCKED_EXTERNAL` to `READY`.
