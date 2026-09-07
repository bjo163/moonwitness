---
name: revelation-mizan-assessment
description: >-
  Use this skill when developing, testing, or auditing Revelation–Mizan assessment algorithms,
  theological criteria weighting, balance evaluations, and jurisprudence review workflows.
---

# Revelation–Mizan Assessment Skill

Governs deterministic evaluation algorithms, multi-criteria weighting, and human review workflows for Islamic jurisprudence and ethical balancing across `@moon/mizan`.

## Architecture & Data Flow

```text
Source Reference / Case
        ↓
Versioned Method Profile (Profiles, Weights, Thresholds)
        ↓
Evaluation Engine (Deterministic multi-criteria scoring)
        ↓
Assessment Record (Rating, Score, Balance State: Balanced / Deficit / Excess)
        ↓
Human-in-the-loop Review Workflow (Draft → In Review → Evaluated → Certified)
```

## Core Entities (`@moon/mizan`)

- **`moon.mizan.method.profile`**: Versioned profile defining criteria weights, general weight vs reference weight, and scoring algorithms.
- **`moon.mizan.criterion`**: Individual evaluation metric with objective validation rules.
- **`moon.mizan.assessment`**: Core assessment instance recording scores, weights, and balance classification (`balance_state`).
- **`moon.mizan.assessment.line`**: Line-item evaluation linking individual criterion to answer, score, and explicit rationale (`reason`).
- **`moon.mizan.case` & `moon.mizan.regulation`**: Concrete legal or ethical case mapped against relevant Shariah regulations.
- **`moon.mizan.engine.run`**: Deterministic engine run audit recording inputs, parameter hash, and computed output.

## Operational Procedures

1. **Deterministic Calculation**:
   - Scores and balance states are derived mathematically from weights and criteria answers:
     $$\text{Total Score} = \sum (\text{Line Score} \times \text{Weight})$$
   - An assessment is strictly deterministic: identical criteria responses against the same profile must yield identical ratings.

2. **Cosmic Adapter Integration**:
   - Connects Mizan assessments to external API protocols and Odoo backend via typed contracts.

## Testing & Verification

```bash
# Run Mizan engine unit tests
pnpm test packages/moon-mizan

# Test cosmic adapter integration
vitest run packages/moon-mizan/src/cosmic-adapter.test.ts
```

## Quality Checklist

- [ ] All method profiles are versioned; never mutate an active profile in-place.
- [ ] Every score computation has traceable criteria lines with explicit justification.
- [ ] State transitions follow canonical workflow (`draft` → `in_review` → `evaluated`).
