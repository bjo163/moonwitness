---
name: stock-inventory-fifo-valuation
description: >-
  Use this skill when auditing First-In First-Out (FIFO) inventory cost valuation layers,
  warehouse stock moves, internal transfers, and physical inventory reconciliations in @moon/stock.
---

# Stock Inventory FIFO Valuation (Subatomic Skill)

Governs inventory valuation, costing layers, and physical stock moves in `@moon/stock`.

## FIFO Cost Layer Queue

Stock movements consume inventory layers in strict chronological order of receipt:
$$\text{Cost of Goods Sold (COGS)} = \sum_{k=1}^P q_k \cdot u_k$$
Where:
- $q_k$: Quantity consumed from incoming batch $k$.
- $u_k$: Unit purchase cost of batch $k$.
- $\sum q_k = \text{Total Quantity Shipped}$.

### Stock Move State Transition
Every internal or external inventory movement transitions through:
$$\text{DRAFT} \longrightarrow \text{CONFIRMED} \longrightarrow \text{ASSIGNED / RESERVED} \longrightarrow \text{DONE} \quad (\text{or CANCELLED})$$

- In `ASSIGNED`: Physical stock is reserved at warehouse location; available quantity drops, on-hand quantity remains constant.
- In `DONE`: On-hand quantity decrements; accounting valuation entry is triggered in `@moon/account`.

## Canonical Source Files
- `packages/moon-stock/src/`
- `packages/moon-stock/src/views.ts`

## Verification Command
```bash
pnpm --filter=@moon/stock test
```
