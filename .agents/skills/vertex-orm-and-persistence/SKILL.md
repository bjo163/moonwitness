---
name: vertex-orm-and-persistence
description: >-
  Use this skill when defining database entities, running schema migrations, implementing Row-Level Security (RLS),
  managing transactions, and working with the Vertex ORM kernel.
---

# Vertex ORM & Relational Persistence Skill

Governs the operational database persistence layer, entity life cycles, schema migrations, and tenant security across `@moon/orm`, `@moon/base`, and `@moon/cache`.

## Core Invariants & Constitutional Rules

1. **Relational Model Hierarchy**:
   - Every persistent entity must extend `BaseKernel` or `BaseRecord` from `@moon/orm`.
   - Built-in audit timestamps (`createdAt`, `updatedAt`) and soft-delete capabilities are handled automatically.
2. **Row-Level Security (RLS) & Multi-Tenancy**:
   - Queries executing on behalf of an operator or tenant must wrap execution with `withSecurity(ctx)`:
     ```typescript
     const results = await vertex.withSecurity(userSecurityContext).query(MyModel).find({ ... });
     ```
3. **Transactional Atomicity**:
   - Multi-step write operations must execute within a managed transaction context to guarantee automatic rollback on failure:
     ```typescript
     await vertex.runInTransaction(async (tx) => {
       await tx.insert(RecordA);
       await tx.update(RecordB);
     });
     ```
4. **Zero Raw SQL String Concatenation**:
   - String concatenation of unescaped user inputs into SQL strings is strictly banned. Always utilize parameterized query builders or Vertex model helpers.

## Schema Migrations & Management

All schema changes must flow through versioned migration definitions:

```bash
# Check database migration status
pnpm --filter=api db:sync-status

# Apply forward migrations to target database
pnpm --filter=api db:sync-up

# Roll back most recent migration
pnpm --filter=api db:sync-down

# Seed baseline database data
pnpm --filter=api db:seed
pnpm --filter=api db:demo
```

## ORM Verification Checklist

- [ ] New models declare primary keys and foreign key constraints explicitly.
- [ ] Decimal/currency fields use fixed-point types (`Decimal` from `@moon/orm/decimal`) rather than IEEE-754 floating point.
- [ ] Cache invalidation tags are declared for high-throughput query entities.
- [ ] No database operations are performed directly inside React UI components or client packages.
