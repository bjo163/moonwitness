# Witness Architecture Freeze v1.4

Status: frozen contract for the provenance-first Witness graph and engine.

## Non-negotiable semantic separation

Every record keeps four independent dimensions: node kind, source class,
epistemic lane, and output authority. Scores are analytic metadata only; they
never change source class, lane, authority, or operational status.

The canonical Revelation families are `QURAN`, `TAWRAT`, `ZABUR`, and `INJIL`.
Their source-policy records, editions, revisions, and provenance remain
separate. A translation is a content witness, never an additional independent
Revelation source.

## Persistence and graph boundary

Moon ORM is the only canonical persistence boundary; PostgreSQL is the
production database. Relations, assertions, evidence, provenance, engine
runs, research runs, and score results are first-class versioned records.
Canonical identity is shared across domains; ambiguous reconciliation remains
`UNRESOLVED` rather than creating an implicit equivalence.

The graph is canonical data. Engine modules are ACL-aware runtime consumers of
that graph. They do not bypass ORM, issue ad-hoc SQL, or create a second graph
database. Derived indexes are rebuildable accelerators and cannot create a
canonical relation.

## Evidence and engine law

Every substantive relation, assertion, or finding retains reproducible
evidence, source revision, provenance, and conflict/unresolved state. Primary
content remains source content; engine interpretation is separately classified.
AI output is always `AI_ASSISTED` or candidate/derived material and cannot
promote a canonical fact.

Deterministic runs pin input, scope, source revisions, ontology and scoring
profile fingerprints. Missing historical revisions make replay fail explicitly.

## Status-first scoring law

The only allowed order is:

`identity/source classification -> evidence resolution -> epistemic status -> score eligibility -> vector -> optional composite`.

Score dimensions use `AVAILABLE`, `INSUFFICIENT`, or `NOT_APPLICABLE`; absent
data is never zero or a midpoint. Every composite preserves vector components,
profile/version, coverage, formula fingerprint, and evidence lineage.
Translations or derived editions of one canonical witness count once for
independence.

## Domain boundaries

Passages own content witnesses, not scalar meanings. Concepts and lexical
claims live in assertions/evidence. Tradition is universal; Hadith-specific
isnad/grading fields are optional specialization, never assumptions for
rabbinic or patristic material. Corpus-mined divine expressions require exact
allowed-corpus occurrences and have no fixed 99-item authority.

## Verification references

- `GRAPH_CORE.md` — identity, ontology, and provenance model.
- `ENGINE_RUNTIME.md` — deterministic run/result/replay contract.
- `REVELATION_ENGINES.md` — source-preserving module outputs.
- `../src/services/scoring.ts` — versioned vector/profile implementation.

Changes to this contract require a superseding freeze document and migration
plan; implementation code may not silently redefine these rules.
