---
name: matrix-timeline-gantt-dependency-graph
description: >-
  Use this skill when auditing or implementing project Gantt timelines, task dependency Directed Acyclic Graphs (DAG),
  predecessor/successor constraints, and Critical Path Method (CPM) calculation.
---

# Matrix Timeline & Gantt Dependency Graph (Subatomic Skill)

Governs the interactive Gantt chart and dependency scheduling engine for project milestones and tasks in `@moon/project` and `@workspace/ui`.

## Critical Path Method (CPM) Formulation

Given project activities $i \in V$ with duration $d_i$ and dependency edges $(i, j) \in E$ meaning task $j$ cannot start until task $i$ finishes:
1. **Forward Pass (Earliest Start / Earliest Finish)**:
   $$ES_j = \max_{(i, j) \in E} EF_i, \quad ES_{\text{root}} = t_0$$
   $$EF_j = ES_j + d_j$$
2. **Backward Pass (Latest Finish / Latest Start)**:
   $$LF_i = \min_{(i, j) \in E} LS_j, \quad LF_{\text{end}} = \max_k EF_k$$
   $$LS_i = LF_i - d_i$$
3. **Total Slack / Float ($S_i$)**:
   $$S_i = LS_i - ES_i = LF_i - EF_i$$
   - Tasks where $S_i = 0$ constitute the **Critical Path**; any delay directly delays project completion.

## Graph Cycle Detection
Before committing dependency links:
```typescript
function detectCycle(graph: Map<number, number[]>): boolean {
  const visited = new Set<number>()
  const recStack = new Set<number>()

  for (const node of graph.keys()) {
    if (hasCycleUtil(node, visited, recStack, graph)) return true
  }
  return false
}
```
Direct dependency cycles (e.g. A depends on B, B depends on A) are rejected with a descriptive validation error.

## Canonical Source Files
- `packages/moon-project/src/models/pj-task.ts`
- `packages/moon-project/src/views.ts`
- `packages/ui/src/`

## Verification Command
```bash
pnpm --filter=@moon/project test
```
