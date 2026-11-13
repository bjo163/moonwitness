---
name: enterprise-operations-matrix
description: >-
  Use this skill when developing, extending, or auditing enterprise operations modules (Project, CRM,
  Helpdesk, Accounting, Stock, Product, Mail, Khidra) and their corresponding shared Matrix UI components.
---

# Enterprise Operations Matrix Skill

Governs the unified ERP domain modules (`@moon/*`) and their shared interactive presentation widgets (`@workspace/ui/matrix`).

## Domain Modules Inventory

1. **`@moon/project`**: Projects, tasks, milestones, stage lifecycles, burndown metrics.
2. **`@moon/crm`**: Leads, opportunities, automated lead scoring, pipeline stages.
3. **`@moon/helpdesk`**: Support tickets, SLA tracking, priority routing, automated assignment.
4. **`@moon/account`**: Double-entry journal entries, chart of accounts, invoicing, tax lines.
5. **`@moon/stock`**: Multi-warehouse inventory, stock valuation, movement ledgers.
6. **`@moon/product`**: Product catalog, SKU management, multi-currency price lists.
7. **`@moon/mail`**: Dynamic email templates, queued notification delivery.
8. **`@moon/khidra`**: Strategic intelligence briefings, trend detection, automated advisory recommendations.
9. **`@moon/shootgun`**: High-throughput outbound messaging and notification blast engine.

## The Shared Matrix UI Architecture (`@workspace/ui`)

Rather than coding custom tables or boards for every separate entity, the system utilizes canonical polymorphic matrix widgets:

- **`ModelWorkspace`**: Unified container providing instant switching between List, Kanban, Pivot, and Timeline views.
- **`ModelDataTable`**: High-density, sortable, filterable table with column visibility toggles and batch selection.
- **`ModelKanbanBoard`**: Drag-and-drop stage board with automatic status update callbacks.
- **`ModelPivotGrid`**: Multi-dimensional aggregation grid for reporting metrics.
- **`ModelTimelineView`**: Chronological Gantt-style planning view.
- **`ModelFormModal` & `ModelFieldWidget`**: Dynamic schema-driven modal editors.

```tsx
import { ModelWorkspace } from "@workspace/ui";

export function ProjectTaskWorkspace({ tasks, stages, onUpdateTask }: Props) {
  return (
    <ModelWorkspace
      title="Project Tasks"
      records={tasks}
      stages={stages}
      onRecordUpdate={onUpdateTask}
      supportedViews={["table", "kanban", "timeline"]}
    />
  );
}
```

## Quality Invariants

- Never duplicate pagination, filtering, or column sorting logic across domain views. Always leverage `ModelDataTableController`.
- All monetary values must format with explicit ISO currency codes (`Intl.NumberFormat`).
- Business entity models must live in their dedicated `@moon/<domain>` package, never inside React components.
