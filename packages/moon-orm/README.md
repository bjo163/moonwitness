# ◈ @moon/orm

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @moon/orm                                               ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  PKG VERSION:    9.0.0                                                   ║
║  CLASSIFICATION: TIER 2 — VERTEX ORM, RELATIONAL GRAPH & PGVECTOR        ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

> **Advanced Vertex-Based ORM with Row-Level Security, Magic Tuples & pgvector Integration for Node.js & TypeScript**

`@moon/orm` is the canonical data layer and model runtime for MoonWitness OS, powered by Knex.js and PostgreSQL.

---

## Features

- **Vertex-Based API**: Declarative models with expressive `fetch`, `spawn`, `morph`, `purge`, and `pick` methods.
- **Relational Magic Tuples**: Atomic Odoo-style relational mutations (e.g. `[0, 0, vals]`, `[4, id]`, `[6, 0, ids]`).
- **PostgreSQL `pgvector` Integration**: Native `vector(n)` field definitions and similarity distance queries (`<->`, `<=>`, `<#>`).
- **Row-Level Security & Record Rules**: Safe-by-default access rights and dynamic record rules (`mx.rule`).
- **Computed Fields (with Store)**: Declare computed fields that automatically evaluate on morph and persist to the database (`store: true`).
- **Delegation Inheritance**: Multi-table inheritance with transparent field delegation (`_inherits`).
- **Hierarchical Trees**: Native Materialized Path (`parent_path`) support for fast `child_of` and `parent_of` queries.
- **I18N Translatable Fields**: Automatic JSONB column mapping and transparent translation switching based on `env.context.lang`.
- **Recordset Caching**: Zero-cost N+1 mitigation. Records fetched in the same request lifecycle are automatically cached.
- **Auto-Schema Synchronization (Forge)**: Compare your TypeScript definitions with the database and automatically generate/execute DDL statements without manual migration files.

---

## Installation

```bash
pnpm add @moon/orm knex pg
```

---

## Initialization

```typescript
import knex from 'knex'
import { setupOrm, forge, registerModel } from '@moon/orm'

const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/moonwitness'
})

// Inject the db instance into the ORM engine
setupOrm(db)
```

---

## Defining Models

```typescript
import { Vertex, fields } from '@moon/orm'

export default class DocumentEmbedding extends Vertex {
  static _name = 'document.embedding'

  title = fields.Char({ required: true, translate: true })
  content = fields.Text({ required: true })
  
  // Vector embedding definition (e.g. OpenAI ada-002 or text-embedding-3)
  embedding = fields.Vector({ dim: 1536 })

  categoryId = fields.Many2one({
    relation: 'category_id',
    comodel: 'document.category'
  })

  // Computed field stored in DB
  charCount = fields.Integer({
    compute: (record) => (record.content ? record.content.length : 0),
    store: true
  })
}
```

---

## Usage

```typescript
import { createCtx, getModel, SUPERUSER_ID } from '@moon/orm'

// 1. Create Environment Context
const env = createCtx(SUPERUSER_ID, { lang: 'en_US' }, getModel)

// 2. Access Model
const Document = getModel('document.embedding')

// 3. Create (Spawn)
const doc = await Document.spawn(Document, env, {
  title: 'Cosmic Wisdom',
  content: 'Observation of celestial bodies and scripture harmony.',
  embedding: [0.012, -0.045, 0.089 /* ... 1536 dims */]
})

// 4. Query
const results = await Document.fetch(Document, env, [['charCount', '>', 10]])
```

---

## 🛡️ Architectural Boundaries
- Belongs to **Tier 2 (Core Infrastructure & ORM)**.
- Consumes `@workspace/types` and `@workspace/error`.

---

## 🧪 Verification
```bash
pnpm --filter @moon/orm test
```
