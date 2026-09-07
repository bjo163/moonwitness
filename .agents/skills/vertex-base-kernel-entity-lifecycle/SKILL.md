---
name: vertex-base-kernel-entity-lifecycle
description: >-
  Use this skill when defining Vertex ORM models, lifecycle hooks (beforeCreate, afterUpdate, beforeDelete),
  soft-delete tombstones (deleted_at), and automatic timestamp auditing.
---

# Vertex Base Kernel & Entity Lifecycle (Subatomic Skill)

Governs the lifecycle, schema instantiation, and execution hooks of models extending the `Vertex` base class in `@moon/orm`.

## Entity Definition & Lifecycle Hooks

```typescript
import { Vertex, fields } from '@moon/orm'

export class TaskRecord extends Vertex {
  static override _name = 'pj.task'
  static override _description = 'Project Task Entity'

  // Field definitions
  title = fields.char({ string: 'Title', required: true })
  stageId = fields.many2one('pj.stage', { string: 'Stage', required: true })
  dueDate = fields.datetime({ string: 'Due Date' })
  isArchived = fields.boolean({ string: 'Archived', default: false })
  
  // Auditing fields managed automatically by Vertex kernel
  createdAt = fields.datetime({ readonly: true })
  updatedAt = fields.datetime({ readonly: true })
  deletedAt = fields.datetime({ readonly: true })

  // Lifecycle Interceptor Hooks
  override async beforeCreate(vals: Record<string, any>) {
    if (!vals.title || vals.title.trim() === '') {
      throw new Error('Task title cannot be whitespace only.')
    }
    vals.title = vals.title.trim()
  }

  override async afterCreate(recordId: number) {
    // Post-creation event trigger or cache invalidation
  }

  override async beforeUpdate(vals: Record<string, any>) {
    vals.updatedAt = new Date().toISOString()
  }

  override async beforeDelete() {
    // Enforce soft-delete tombstone instead of physical row purging
    throw new Error('Hard delete forbidden on pj.task; set isArchived or deletedAt.')
  }
}
```

## Soft Delete Filter Interception
All standard queries via `QueryBuilder` automatically inject the soft-delete predicate unless explicitly requested with `.withArchived()`:
$$\text{WHERE } \text{deleted\_at IS NULL}$$

## Canonical Source Files
- `packages/moon-orm/src/base.ts`
- `packages/moon-orm/src/fields.ts`
- `packages/moon-orm/src/hooks.ts`

## Verification Command
```bash
pnpm --filter=@moon/orm test
```
