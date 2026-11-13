---
name: isomorphic-celestial-computation
description: >-
  Use this skill when developing, testing, or auditing astronomical algorithms, lunar crescent visibility (Hilal),
  ephemeris models, solar coordinates, Qibla geodesics, and Islamic prayer times.
---

# Isomorphic Celestial Computation Skill

Governs pure mathematical astronomical calculations across `@moon/compute` (TypeScript) and `services/celestial-engine` (Python FastAPI).

## Core Architecture & Invariants

### 1. Pure Isomorphism (`@moon/compute`)
- **LAW BE-05 — Zero DB, Zero Network, Zero File I/O**:
  - All algorithms in `packages/moon-compute/src/` must remain pure mathematical functions.
  - Inputs: Latitude, Longitude, Altitude, UTC Timestamp, Calculation Parameters.
  - Outputs: Deterministic coordinate vectors, phase angles, azimuth, elevation, prayer timestamps.
  - Never import database models, network clients (`fetch`, `axios`), or file system modules (`fs`).

### 2. Algorithmic Modules in `@moon/compute`
- `hilal.ts`: Crescent visibility criterion (Odeh criterion, Yallop criterion, Danjon limit).
- `moon-phase.ts`: Moon illumination fraction, elongation angle, synodic phase determination.
- `prayer-times.ts`: Solar zenith calculation, Fajr/Isha angle adjustments, polar latitude mitigation methods.
- `qibla.ts`: Great-circle spherical trigonometry (geodesic distance and forward azimuth to Kaaba: $21.4225^\circ\text{ N}, 39.8262^\circ\text{ E}$).
- `sun-position.ts`: Solar right ascension, declination, hour angle, equation of time.

### 3. Polyglot Microservice (`services/celestial-engine`)
- Python FastAPI microservice providing high-precision ephemeris computation.
- Generates Pydantic models from canonical OpenAPI contracts:
  ```bash
  uv run datamodel-codegen --input contracts/openapi/openapi.json --output src/models/contracts.py
  ```

## Verification & Testing Runbook

```bash
# Run unit tests for TypeScript celestial computation
pnpm --filter=@moon/compute test

# Run astronomical precision tests
pnpm test packages/moon-compute

# Run Python celestial engine tests via uv
cd services/celestial-engine
uv run pytest
uv run ruff check
```

## Quality Checklist

- [ ] All celestial functions are pure: same inputs always yield exact same outputs.
- [ ] Polar latitude edge cases (extreme summer/winter latitudes where sun doesn't set/rise) return estimated fallbacks without `NaN` or infinite loops.
- [ ] Spherical geodesic formulas properly normalize longitude differences to $(-180^\circ, 180^\circ]$.
- [ ] No external I/O or environment state dependencies inside `@moon/compute`.
