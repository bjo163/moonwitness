---
name: matrix-pivot-grid-aggregation-reporter
description: >-
  Use this skill when implementing or auditing multidimensional Pivot Grid aggregation, cross-tabulation
  of measures and dimensions (SUM, AVG, COUNT, MIN, MAX), and dynamic column/row grouping.
---

# Matrix Pivot Grid Aggregation Reporter (Subatomic Skill)

Governs client-side and server-assisted multi-dimensional data pivot slicing and aggregation in `@workspace/ui/src/components/matrix/model-pivot-grid.tsx`.

## Aggregation Algebra

Let a dataset $D$ contain records with dimensions $\{d_1, d_2, \dots, d_k\}$ and numerical measure $m$:
For row dimension $R$ and column dimension $C$:
Cells are partitioned into buckets:
$$B(r, c) = \{x \in D \mid x.R = r \land x.C = c\}$$

### Aggregation Operators
1. **SUM**: $A_{\text{sum}}(B) = \sum_{x \in B} x.m$
2. **COUNT**: $A_{\text{count}}(B) = |B|$
3. **AVG**: $A_{\text{avg}}(B) = \frac{A_{\text{sum}}(B)}{|B|}$ (handled with Decimal arithmetic for monetary values).

## Data Structure
```typescript
interface PivotConfig {
  rowDimensions: string[]      // e.g. ['stageId', 'priority']
  colDimensions: string[]      // e.g. ['projectId']
  measureField: string         // e.g. 'estimatedHours'
  aggregationFn: 'sum' | 'count' | 'avg' | 'min' | 'max'
}

interface PivotResultTable {
  rowHeaders: string[][]
  colHeaders: string[][]
  dataMatrix: number[][]
  rowTotals: number[]
  colTotals: number[]
  grandTotal: number
}
```

## Performance & Virtualization
- For matrices exceeding 100 rows $\times$ 20 columns, window virtualization is enabled to prevent DOM thrashing.
- Cells format numerical values using `Intl.NumberFormat` with strict locale awareness.

## Canonical Source Files
- `packages/ui/src/components/matrix/model-pivot-grid.tsx`
- `packages/types/src/matrix.types.ts`

## Verification Command
```bash
pnpm --filter=@workspace/ui test
```
