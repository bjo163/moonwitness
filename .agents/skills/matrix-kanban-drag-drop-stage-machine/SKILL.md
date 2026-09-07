---
name: matrix-kanban-drag-drop-stage-machine
description: >-
  Use this skill when auditing or implementing polymorphic Matrix Kanban boards, HTML5 drag-and-drop
  card movement, optimistic stage transitions, and rollback on server error.
---

# Matrix Kanban Drag-and-Drop Stage Machine (Subatomic Skill)

Governs the reactive Kanban board interface used across Project tasks (`pj.task`), CRM opportunities (`crm.lead`), and Helpdesk tickets (`hd.ticket`) in `@workspace/ui`.

## Component Architecture & Optimistic State Machine

```typescript
import { useState } from 'react'
import type { KanbanConfig, RecordItem } from '@workspace/types'

export function ModelKanbanBoard({
  records,
  stages,
  config,
  onStageChange,
}: {
  records: RecordItem[]
  stages: { id: number; name: string }[]
  config: KanbanConfig
  onStageChange: (recordId: number, newStageId: number) => Promise<void>
}) {
  const [optimisticRecords, setOptimisticRecords] = useState(records)

  const handleDrop = async (recordId: number, targetStageId: number) => {
    // 1. Snapshot previous state for rollback
    const previousRecords = [...optimisticRecords]

    // 2. Optimistically update local state immediately (zero UI latency)
    setOptimisticRecords((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, [config.groupBy]: targetStageId } : r))
    )

    try {
      // 3. Dispatch RPC / REST mutation to backend
      await onStageChange(recordId, targetStageId)
    } catch (error) {
      // 4. Rollback on failure and trigger toast notification
      setOptimisticRecords(previousRecords)
      console.error('Stage transition failed; state rolled back', error)
    }
  }

  // Render columns by stages with drag-over visual feedback
}
```

## Accessibility & Keyboard Navigation
- Supports Arrow Key navigation between cards and stages.
- Space / Enter key activates card drag mode; Left/Right arrows move card between stage columns.

## Canonical Source Files
- `packages/ui/src/components/matrix/model-kanban-board.tsx`
- `packages/types/src/matrix.types.ts`
- `packages/hooks/src/use-matrix.ts`

## Verification Command
```bash
pnpm --filter=@workspace/ui test
```
