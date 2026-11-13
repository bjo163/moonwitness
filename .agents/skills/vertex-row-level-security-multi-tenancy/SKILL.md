---
name: vertex-row-level-security-multi-tenancy
description: >-
  Use this skill when implementing, auditing, or testing Row-Level Security (RLS), multi-tenant context injection,
  permission evaluation, and security predicate wrapping in Vertex ORM.
---

# Vertex Row-Level Security & Multi-Tenancy (Subatomic Skill)

Governs tenant isolation and data access control at the ORM layer, preventing unauthorized horizontal privilege escalation across users or organizations.

## Security Context Pipeline

Every ORM operation executes inside an explicit context:
```typescript
import { createCtx, withSecurity, Vertex } from '@moon/orm'

const userCtx = createCtx({
  userId: 42,
  companyId: 1,
  roles: ['PROJECT_MEMBER'],
  isSuperuser: false,
})

// Guaranteed RLS predicate injection:
const records = await withSecurity(userCtx, async () => {
  return await TaskRecord.search([['projectId', '=', 5]])
})
```

## SQL Predicate Injection Mechanism
When evaluating `search()` or `searchRead()`, `rbac-evaluator.ts` checks access rules:
1. **Model Access Rights**: Check `(read, write, create, unlink)` bitmask for user's roles.
2. **Record Rules Domain Compilation**:
   Translates business rules into SQL `WHERE` clauses:
   $$\text{WHERE } (\text{company\_id} = 1 \text{ OR } \text{company\_id IS NULL}) \text{ AND } (\text{is\_private} = \text{false} \text{ OR } \text{owner\_id} = 42)$$

### Invariance Rules
- **No Direct Raw SQL in Controllers**: Always pass through `withSecurity(ctx)` or use parameterized `QueryBuilder`.
- **Superuser Flag Isolation**: `isSuperuser: true` can only be set by verified system background jobs, never from HTTP request body.

## Canonical Source Files
- `packages/moon-orm/src/security.ts`
- `packages/moon-orm/src/rbac-evaluator.ts`
- `packages/moon-orm/src/env.ts`

## Verification Command
```bash
pnpm --filter=@moon/orm exec tsx -e 'import { checkAccessRights } from "./src/security"; console.log("RLS Evaluator Loaded")'
```
