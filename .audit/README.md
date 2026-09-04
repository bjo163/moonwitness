# UMBRELLA Engineering Audit

This directory owns the versioned machine contract for MoonWitness engineering-health auditing.

## Source of truth

- `config/scoring.v1.json` owns canonical score bands, evidence coefficients, RawHealth/DeploymentReadiness weights, unknown policy, gate policy, model version, and required outputs.
- `config/evidence.v1.json` owns collector-to-dimension mappings, source-contract checks, exact-SHA execution mappings, required branch observations, and tracked engineering issues.
- `config/hygiene.v1.json` owns repository-hygiene dimensions, weights, thresholds, allow patterns, and penalties.
- `config/complexity.v1.json` owns complexity dimensions, thresholds, hotspot history policy, and component criticality multipliers.
- `config/quality.v1.json` owns ProgrammaticQuality, Reproducibility, FutureReadiness dimensions and hardcode penalties.
- `config/future-baseline.v1.json` is a dated technology-support baseline with source provenance. It is not treated as timeless truth.
- `config/certification.v1.json` owns Phase E certification checks, deterministic replay timestamp, and high-confidence secret-safety patterns.
- `schema/umbrella-report.schema.json` is the public machine-readable report schema.
- `schema/umbrella-certification.schema.json` is the machine-readable Phase E certification artifact schema.
- `umbrella-report.json` is generated output and MUST NOT be edited or committed manually.
- `.audit/runtime/UMBRELLA_STATUS.md` is the generated human view and MUST NOT become an independent scoring source.
- `.audit/runtime/umbrella-certification.json` is ephemeral certification evidence and MUST NOT be committed.

The runtime scoring config hash is computed over the canonical scoring config plus evidence, hygiene, complexity, quality, and future-baseline configs. A change to any active audit/scoring input therefore changes report provenance.

The generated report is derived from source/config/evidence. Human-readable reports are rendered from this machine state and never calculate scores, gates, progress, or issue truth independently.

## Commands

```text
pnpm audit:umbrella
pnpm audit:umbrella:json
pnpm audit:umbrella:validate
pnpm audit:umbrella:check
pnpm audit:umbrella:render
pnpm audit:umbrella:render:check
pnpm audit:umbrella:dry-run
pnpm audit:umbrella:fix-safe
pnpm audit:umbrella:certify
pnpm audit:umbrella:ci
```

`audit:umbrella` writes `.audit/umbrella-report.json` using repository-visible source evidence.

`audit:umbrella:ci` additionally consumes `.audit/runtime/ci-evidence.json`, which Foundation CI generates from exact-candidate job results, branch state, tracker state, and exact-SHA PostgreSQL certification state. The runtime evidence file is ephemeral and is never committed.

`audit:umbrella:validate` validates configuration, generated report structure, invariants, config fingerprint, report fingerprint, and required canonical outputs without forcing deployment readiness to pass.

`audit:umbrella:check` additionally enforces the configured deployment gate and exits non-zero for `UNKNOWN`, `FAIL`, or `BLOCKED_EXTERNAL`.

`audit:umbrella:render` reads the already generated machine report, validates it against active configuration, and renders `.audit/runtime/UMBRELLA_STATUS.md`.

`audit:umbrella:render:check` proves the human Markdown is byte-for-byte the deterministic renderer output for the machine report and verifies its embedded parity manifest.

`audit:umbrella:dry-run` runs the same audit plus safe-output planning while writing zero files.

`audit:umbrella:fix-safe` is deliberately narrow: it may regenerate only `.audit/umbrella-report.json` and a human status under `.audit/runtime/`. It cannot modify source code, scoring config, workflow policy, migrations, dependencies, or deployment configuration.

`audit:umbrella:certify` performs Phase E replay certification. In CI it receives the frozen `.audit/runtime/ci-evidence.json` and expected candidate SHA, runs the audit twice in an operating-system temporary directory using the configured fixed timestamp, validates JSON/Markdown parity, verifies the observed repository HEAD against the expected SHA, scans generated outputs for configured high-confidence secret patterns, and emits `.audit/runtime/umbrella-certification.json` only after all required checks pass.

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

Source collectors compute scores only from explicit measured checks/formulas. They do not contain handwritten readiness percentages.

Execution-sensitive dimensions such as runtime, database/migration, and rollback stay `UNKNOWN_REQUIRED` until exact-SHA PostgreSQL certification is complete. A workflow file existing in the repository is not treated as proof that the workflow executed successfully.

Foundation build/test/audit results can override weaker source evidence with E0 evidence. Branch enforcement is observed independently of issue state: an open issue does not by itself create a P0, and a closed issue cannot hide observed unprotected required branches.

## Phase B evidence scope

Programmatically collected:

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

## Phase C engineering-quality scope

Phase C activates five additional independent scores. They are not folded into one universal score.

### RepositoryHygieneScore

Measured programmatically where reliable:

```text
tracked generated artifacts
required .gitignore coverage
high-confidence secret hygiene
stale executable config/script targets
duplicate package-manager config ownership
repository-root clutter
```

`dead_code_ratio` and `unused_dependency_ratio` remain explicit optional/unknown dimensions until a reliable collector exists. Their missing measurement is exposed through hygiene measurement coverage; it is not silently reported as zero or clean.

### ComplexityScore

Uses TypeScript AST and dependency-graph analysis for:

```text
cyclomatic complexity
cognitive complexity
dependency cycles
fan-in / fan-out
duplication blocks
abstraction depth
package testability signal
change-frequency hotspots
```

Hotspot ranking follows:

```text
NormalizedComplexity × NormalizedChangeFrequency × CriticalityMultiplier
```

The UMBRELLA CI checkout uses full history for this collector. If sufficient history is unavailable, `hotspot_history` remains explicit unknown instead of receiving a fabricated value.

### ProgrammaticQualityScore

Measures configuration ownership, generated truth, deterministic test-data signals, automation coverage, and drift detection. Classified hardcode findings apply only through the versioned penalty policy in `quality.v1.json`.

### ReproducibilityScore

Measures lockfile ownership, package-manager pinning, frozen installs, Node runtime pinning, container reference pinning, GitHub Action reference pinning, and clean-checkout production certification coverage.

### FutureReadinessScore

Measures runtime support alignment, GitHub Actions runtime alignment, dependency-update automation, release/upgrade policy, security automation, and baseline provenance.

Technology recommendations are derived from `future-baseline.v1.json`, which records `as_of` and official source URLs. Refreshing technology assumptions requires changing that baseline/config, which changes report provenance and fingerprinting.

## Phase D renderer and mutation policy

Human status is a deterministic projection of the canonical JSON report. The renderer embeds a compact parity manifest containing source revision, report fingerprint, overall state, canonical outputs, and external blocker IDs. Parity validation compares both that manifest and the complete rendered Markdown against a fresh deterministic render.

The mutation law is intentionally restrictive:

```text
--dry-run => zero filesystem mutations
--fix-safe => generated audit outputs only
source/config/workflow/migration changes => never automatic
```

`--fix-safe` target validation prevents redirecting the report to source files and prevents the human status from escaping `.audit/runtime/`. Safe generation is reversible because both outputs are ignored generated artifacts.

## Phase E replay certification

Phase E does not create another health score. It certifies the trust properties of the existing machine report and human renderer.

Required checks are versioned in `config/certification.v1.json`:

```text
machine_report_byte_parity
report_fingerprint_parity
rendered_markdown_byte_parity
renderer_manifest_parity
source_revision_exact
secret_safety
```

The two audit replays use the same fixed `generated_at`, the same frozen CI evidence file, the same source checkout, and separate temporary output paths. Machine JSON and human Markdown must match byte-for-byte. The certifier never passes `--source-revision` to the audit process; the audit must observe repository `HEAD` itself, and that observed revision must equal the CI candidate SHA.

Secret-safety reports pattern IDs and counts only. Matched secret values are never copied into certification output or logs.

Certification is fail-closed: any missing required check, failed parity, SHA mismatch, or configured secret-pattern finding exits non-zero and prevents the UMBRELLA CI job from succeeding.

## Determinism

The report records model/config/generator/source provenance and a semantic `report_fingerprint`. `generated_at` is excluded from that fingerprint, and CI evidence deliberately omits volatile run IDs/timestamps. The same source revision + active configuration + normalized engineering evidence state yields the same semantic fingerprint.

Stable ordering is required for findings, cycles, hotspots, recommendations, blocker display, rendered score rows, certification checks, and secret-safety finding classifications.

## Gate law

A score never overrides a gate.

```text
high score + failed mandatory gate => blocked
high score + external blocker => blocked
unknown mandatory gate => not deployable
```

No numeric score—including RawHealth, DeploymentReadinessScore, Hygiene, Complexity, Programmatic Quality, Reproducibility, or Future Readiness—may promote `UNKNOWN`, `FAIL`, or `BLOCKED_EXTERNAL` to `READY`.
