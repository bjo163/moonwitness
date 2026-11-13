---
name: mizan-multi-criteria-weighting-engine
description: >-
  Use this skill when auditing or implementing Mizan multi-criteria scoring, normalized weight vectors,
  method profile versioning, and deterministic balance classification (deficit, balanced, excess).
---

# Mizan Multi-Criteria Weighting Engine (Subatomic Skill)

Governs the deterministic multi-criteria evaluation of actions, policies, and statements against Quranic balance principles (*al-Mizan*, Surah Ar-Rahman 55:7-9).

## Mathematical Formulation

Let an evaluation request $E$ contain $N$ criteria with weights $w_i \in (0, 1]$ and normalized scores $s_i \in [0, 1]$:
$$\sum_{i=1}^N w_i = 1.0 \quad (\text{Strict Weight Normalization Invariant})$$

The Composite Mizan Index ($CMI$) is calculated as:
$$\text{CMI} = \sum_{i=1}^N w_i \cdot s_i$$

### Three-Tier Balance Classification
Given threshold margins $\theta_{\text{lower}} = 0.40$ and $\theta_{\text{upper}} = 0.70$:
$$\text{Status} = \begin{cases}
\text{DEFICIT} & \text{if } \text{CMI} < \theta_{\text{lower}} \\
\text{BALANCED} & \text{if } \theta_{\text{lower}} \le \text{CMI} \le \theta_{\text{upper}} \\
\text{EXCESS / GHULUWW} & \text{if } \text{CMI} > \theta_{\text{upper}} \text{ (extremism / uncalibrated rigor)}
\end{cases}$$

## Method Profile Versioning
To ensure evaluation reproducibility over time:
```typescript
interface MizanMethodProfile {
  profileId: string          // e.g. "mizan-ahp-2026.1"
  version: string            // Semver "1.2.0"
  algorithm: "WEIGHTED_SUM" | "ANALYTIC_HIERARCHY_PROCESS" | "TOPSIS"
  criteria: Array<{
    code: string             // "ADL", "IHSAN", "HIFZ_DIN", "HIFZ_NAFS"
    weight: number           // sum to 1.0
    theologicalBasis: string // Quranic reference
  }>
  thresholds: {
    deficitMax: number       // 0.40
    balancedMax: number      // 0.70
  }
}
```

## Canonical Source Files
- `packages/moon-mizan/src/`
- `packages/moon-mizan/src/views.ts`
- `odoo19/addons/moon_mizan/models/`

## Verification Command
```bash
pnpm --filter=@moon/mizan test
```
