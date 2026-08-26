# Witness Engine Runtime v1

Status: implementation slice for issue #57. The runtime is a reusable domain layer in `@moon/witness`; HTTP/RPC adapters are intentionally out of scope.

## Registration and execution

Every module registers one exact `code@semantic-version` pair through `WitnessEngineRegistry`. A registration must declare input/output schema versions, deterministic behavior, input validation, scope resolution, execution, and an evidence explanation method. The runtime refuses unregistered modules, duplicate versions, incomplete metadata, and non-deterministic modules that do not declare themselves AI-assisted.

`WitnessEngineRuntime` owns the domain API:

- `runModule()` validates input, normalizes scope, records a running `wx.engine.run`, executes the module, plans evidence, and persists one immutable `wx.engine.result`.
- `getRun()` reads a run through the supplied store and caller context.
- `replayRun()` requires the original module version and a revision resolver that confirms the original source revisions are still installed.
- `explainFinding()` delegates to the original module version and verifies that it explained the requested finding.
- `listModules()` and `validateScope()` are transport-neutral inspection helpers.

Production wiring uses `MoonOrmEngineRunStore` with the caller's normal Moon ORM `Ctx`. It deliberately never creates a superuser context, so model ACLs and record rules remain active. `InMemoryEngineRunStore` exists only for tests and local fixtures.

## Scope and reproducibility

`resolveEngineScope()` canonicalizes ordering and validates limits before module code sees a scope. The default Revelation scope is exactly QURAN, TAWRAT, ZABUR, and INJIL; Hadith and derived assertions are opt-in. Graph traversal is bounded to depth 4 and 500 nodes.

The run identity checksum includes module/runtime/schema versions, normalized input, normalized scope, pinned source revisions, ontology version, deterministic mode, and an AI configuration fingerprint when applicable. Execution timestamps and run IDs are excluded from result checksums. A deterministic replay that lacks the recorded module or source revisions fails with an explicit reproducibility error instead of using latest data.

## Evidence and authority invariants

Modules return finding candidates with evidence candidates. The runtime turns them into one stable result envelope with `findings`, `conflicts`, `unresolved`, source revisions, and provenance summary.

- Reproducible evidence requires a canonical target, evidence key, source revision, and provenance reference.
- No evidence becomes `INSUFFICIENT_EVIDENCE` plus an unresolved item.
- Contradicting evidence remains in `conflicts`; it is not averaged away.
- A translation requested as `PRIMARY_SOURCE` is emitted as `TRANSLATION`.
- A report requested as `PRIMARY_SOURCE` is emitted as `TRANSMISSION_REPORT`.
- AI-assisted module findings are always `AI_ASSISTED` and `PROVISIONAL`.
- Scores are explicit components with algorithm versions and evidence references. There is no opaque truth score.

The raw normalized input/scope/result JSON in `wx.engine.run` and `wx.engine.result` makes the envelope auditable. Strong run/result foreign keys plus a database-unique result run key preserve one immutable result per execution.
