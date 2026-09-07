---
name: crm-lead-scoring-pipeline-funnel
description: >-
  Use this skill when auditing or implementing predictive lead scoring, opportunity pipeline stages,
  weighted revenue forecasting, and conversion funnel analytics in @moon/crm.
---

# CRM Lead Scoring & Pipeline Funnel (Subatomic Skill)

Governs CRM sales stages, probability-weighted revenue forecasting, and dynamic lead qualification scoring in `@moon/crm`.

## Weighted Revenue & Lead Scoring

For pipeline opportunities $i \in [1, M]$ with expected revenue $R_i$ and stage win probability $P(s_i) \in [0, 1]$:
$$\text{Forecasted Weighted Pipeline} = \sum_{i=1}^M R_i \cdot P(s_i)$$

### Stage Probability Matrix
- `NEW_INQUIRY`: $P = 0.10$
- `QUALIFIED`: $P = 0.30$
- `PROPOSAL_SENT`: $P = 0.60$
- `NEGOTIATION`: $P = 0.85$
- `WON`: $P = 1.00$
- `LOST`: $P = 0.00$

### Multi-Attribute Lead Score
$$\text{Score} = \sum_{k=1}^K w_k \cdot f_k(\text{lead})$$
Factors $f_k$:
- Budget confirmed ($+30\text{ pts}$)
- Decision maker identified ($+25\text{ pts}$)
- Valid corporate email domain ($+15\text{ pts}$)
- Activity within 7 days ($+20\text{ pts}$)

## Canonical Source Files
- `packages/moon-crm/src/`
- `packages/moon-crm/src/views.ts`

## Verification Command
```bash
pnpm --filter=@moon/crm test
```
