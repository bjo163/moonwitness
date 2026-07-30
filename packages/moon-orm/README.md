# @moon/orm

An enterprise-grade, advanced Vertex-based ORM for Node.js and TypeScript, powered by Knex.js.

## Features

- **Vertex-Based API**: Intuitive `fetch`, `spawn`, `morph`, `purge`, `pick` methods.
- **Relational Tuples**: "Magic tuples" for One2Many and Many2Many morphs (e.g. `[0, 0, vals]`, `[4, id]`, `[6, 0, ids]`).
- **Record Rules & Row-Level Security**: Fully integrated access rights and dynamic record rules (`mx.rule`).
- **Computed Fields (with Store)**: Declare computed fields that automatically evaluate on morph and persist to the database (`store: true`).
- **Delegation Inheritance**: `_inherits` support. Seamlessly read and morph to parent and child tables as if they are one model.
- **Hierarchical Trees**: Native Materialized Path (`parent_path`) support for lightning-fast `child_of` and `parent_of` queries.
- **I18N Translatable Fields**: Automatic JSONB column mapping and transparent translation switching based on `env.context.lang`.
- **Recordset Caching**: Zero-cost N+1 mitigation. Records fetched in the same request lifecycle are automatically cached.
- **Context Propagation**: Inherit contexts (`env.context`) everywhere, including smart defaults (`default_X`).
- **Auto-Schema Synchronization (Forge)**: Compare your TypeScript definitions with the database and automatically generate/execute DDL statements without manual migration files.

## Installation

```bash
npm install @moon/orm knex
```
*(Note: You also need to install your database driver, e.g., `pg` for PostgreSQL).*

## Initialization (Dependency Injection)

`@moon/orm` needs to be initialized with a Knex instance.

```typescript
import knex from 'knex';
import { setupOrm, forge } from '@moon/orm';

const db = knex({
  client: 'pg',
  connection: 'postgres://user:pass@localhost:5432/mydb'
});

// Inject the db instance into the ORM engine
setupOrm(db);
```

## Defining Models

```typescript
import { Vertex, fields } from '@moon/orm';

export default class Product extends Vertex {
  static _name = 'product.template';
  
  name = fields.Char({ required: true, translate: true });
  price = fields.Float({ default: 0.0 });
  categoryId = fields.Many2one({ relation: 'category_id', comodel: 'product.category' });
  
  // Computed field stored in DB
  totalValue = fields.Float({
    compute: (record) => record.price * 10,
    store: true
  });
}
```

## Usage

```typescript
import { spawnCtx, getModel } from '@moon/orm';

// 1. Create Environment Context
const env = spawnCtx(1, { lang: 'en_US' }, getModel);

// 2. Access Model
const Product = getModel('product.template');

// 3. Create
const product = await Product.spawn(Product, env, {
  name: 'Super Gadget',
  price: 99.99
});

// 4. Search and Read
const results = await Product.fetch(Product, env, [['price', '>', 50]]);
console.log(results);
```

## License
MIT
