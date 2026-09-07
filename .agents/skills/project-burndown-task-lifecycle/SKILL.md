---
name: project-burndown-task-lifecycle
description: >-
  Use this skill when auditing sprint velocity calculation, sprint burndown curve tracking,
  task estimation vs actual hours, and milestone completion forecasting in @moon/project.
---

# Project Burndown & Task Lifecycle (Subatomic Skill)

Governs agile sprint tracking, velocity calculation, and burndown chart modeling in `@moon/project`.

## Burndown Curve Mathematical Model

For sprint of duration $D$ days with total estimated story points or hours $H_{\text{total}}$:
1. **Ideal Burndown Line**:
   $$H_{\text{ideal}}(t) = H_{\text{total}} \cdot \left(1 - \frac{t}{D}\right) \quad \text{for } t \in [0, D]$$
2. **Actual Remaining Work**:
   $$H_{\text{actual}}(t) = H_{\text{total}} - \sum_{\tau \le t} \text{CompletedHours}(\tau)$$
3. **Sprint Velocity ($V$)**:
   $$V = \frac{1}{K} \sum_{k=1}^K \text{PointsDelivered}_k$$

### Burndown Delta Indicator
$$\Delta_{\text{pace}}(t) = H_{\text{actual}}(t) - H_{\text{ideal}}(t)$$
- $\Delta_{\text{pace}} > 0$: Behind schedule (scope creep or velocity blocker).
- $\Delta_{\text{pace}} < 0$: Ahead of schedule.

## Canonical Source Files
- `packages/moon-project/src/models/pj-sprint.ts`
- `packages/moon-project/src/models/pj-task.ts`
- `packages/moon-project/src/views.ts`

## Verification Command
```bash
pnpm --filter=@moon/project test
```
