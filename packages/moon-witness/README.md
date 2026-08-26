# @moon/witness

> **Sacred Divine Knowledge, Canonical Knowledge Graph & Deterministic Engine Runtime**

`@moon/witness` is the canonical knowledge and telemetry engine of the MoonWitness Operating System. It provides structured ontological graph models for Revelation, Historical Figures, Universal Traditions, Epistemic Assertions, and reproducible computational engines.

---

## Key Features

### 1. Canonical Domain Knowledge Graph
- **Scripture & Revelation Graph**: `wx.passage`, `wx.text.edition`, `wx.content`, `wx.root`, `wx.lexeme`, `wx.lexical.occurrence`, `wx.revelation.event`.
- **Figure & Person Graph**: `wx.figure`, `wx.figure.name`, `wx.figure.role`.
- **Universal Tradition & Transmission Graph**: `wx.tradition.corpus`, `wx.tradition.unit`, `wx.tradition.reference`, `wx.tradition.attribution`, `wx.transmission.chain`, `wx.transmission.link`, `wx.tradition.assessment`.
- **Concepts & Mined Expressions**: `wx.concept`, `wx.assertion`, `wx.evidence`, `wx.divine.expression`, `wx.divine.expression.occurrence`.

### 2. Provenance & Epistemic Authority Invariants
Every graph node and edge is traceable to its source:
- `wx.source` & `wx.source.policy`
- `wx.provenance`
- Authority classifications: `PRIMARY_SOURCE`, `TRANSLATION`, `TRANSMISSION_REPORT`, `SOURCE_SUMMARY`, `DERIVED`, `NOT_APPLICABLE`.
- Epistemic lanes: `CORE`, `HISTORICAL_CONTEXT`, `COMPARATIVE`, `UNRESOLVED`.

### 3. Versioned Engine Runtime (`WitnessEngineRuntime`)
- Deterministic module execution (`revelation.query`, `analyzeWitness`).
- Canonical scope resolution (`resolveEngineScope`) and cryptographic identity checksums.
- Immutable run and result records (`wx.engine.run`, `wx.engine.result`).
- Reproducible finding explanations (`explainFinding`).

### 4. Corpus Ingestion Data Plane
- Pluggable source adapters (`WitnessSourceAdapter`, `FixtureAdapter`).
- Checksum verification, fingerprinting, and normalization pipelines.

### 5. Pure Compute Astronomy
- Precision astronomical calculations (Moon phase data, daily prayer times, Duha time, and Qibla vectors) without DB dependencies.

---

## Installation

```bash
pnpm --filter @moon/witness build
```

---

## Usage Example

### Bounded Domain Queries
```typescript
import { createCtx, getModel, SUPERUSER_ID } from '@moon/orm'
import {
  passageByReference,
  entityProfile,
  findEntities
} from '@moon/witness'

const env = createCtx(SUPERUSER_ID, {}, getModel)

// Lookup canonical passage
const passage = await passageByReference(env, 'Q:2:255')

// Lookup entity profile with aliases and active relations
const profile = await entityProfile(env, passage.entityId)
```

### Revelation Query Engine Execution
```typescript
import {
  WitnessEngineRuntime,
  WitnessEngineRegistry,
  MoonOrmEngineRunStore,
  createRevelationQueryModule
} from '@moon/witness'

// Initialize registry and runtime
const registry = new WitnessEngineRegistry()
registry.register(createRevelationQueryModule())

const store = new MoonOrmEngineRunStore()
const runtime = new WitnessEngineRuntime(registry, store)

// Execute deterministic revelation query
const run = await runtime.runModule(
  env,
  'revelation.query',
  '1.0.0',
  { reference: 'Q:1:1' }
)

console.log('Result Summary:', run.result?.summary)
```

---

## Documentation Links

- [Graph Core Specification](docs/GRAPH_CORE.md)
- [Graph Domain Queries](docs/GRAPH_QUERIES.md)
- [Engine Runtime v1](docs/ENGINE_RUNTIME.md)
- [Legacy Migration Guide](docs/LEGACY_MIGRATION.md)

---

## License

MIT
