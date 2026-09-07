---
name: hilal-crescent-visibility-algorithm
description: >-
  Use this skill when auditing, implementing, or testing lunar crescent visibility (Hilal) algorithms,
  including Odeh and Yallop criteria, Danjon limit, crescent width, and arc calculations.
---

# Hilal Crescent Visibility Algorithm (Subatomic Skill)

Governs the astronomical computation of the young lunar crescent visibility (Hilal) according to modern astrophysics and classical Islamic observational criteria.

## Mathematical Formulation & Parameters

The algorithm in `packages/moon-compute/src/hilal.ts` accepts:
- Observer latitude $\phi$, longitude $\lambda$, altitude $h$ (meters).
- Conjunction timestamp $t_{\text{conjunction}}$ (geocentric new moon).
- Topocentric Sun and Moon coordinates at sunset ($h_{\odot} = -0.833^\circ$).

### Key Variables
- **ARCV (Arc of Vision)**: Topocentric altitude difference between the center of the Sun and the center of the Moon at sunset:
  $$\text{ARCV} = h_{\text{moon}} - h_{\text{sun}}$$
- **ARCL (Arc of Light)**: Topocentric angular distance (elongation) between the Sun and Moon:
  $$\cos(\text{ARCL}) = \sin(h_{\text{moon}})\sin(h_{\text{sun}}) + \cos(h_{\text{moon}})\cos(h_{\text{sun}})\cos(\Delta A)$$
- **DAZ (Azimuth Difference)**:
  $$\Delta A = |A_{\text{moon}} - A_{\text{sun}}|$$
- **$W$ (Crescent Width)**:
  $$W = s_{\text{moon}} \cdot (1 - \cos(\text{ARCL}))$$
  where $s_{\text{moon}}$ is the topocentric lunar semi-diameter in arcminutes.

### Criteria Thresholds
1. **Danjon Limit**: If $\text{ARCL} < 7.0^\circ$, crescent cannot be observed due to lunar surface roughness and atmospheric scattering ($W \to 0$).
2. **Yallop Criterion ($q$-value)**:
   $$q = \frac{\text{ARCV} - (11.8371 - 6.3226 W + 0.7319 W^2 - 0.1018 W^3)}{10}$$
   - $q \ge +0.216$: Easily visible to the naked eye (Category A).
   - $+0.216 > q \ge -0.060$: Visible under perfect atmospheric conditions (Category B).
   - $-0.060 > q \ge -0.255$: May need optical aid (telescope/binoculars) to find (Category C).
   - $-0.255 > q \ge -0.400$: Visible only with optical aid (Category D).
   - $q < -0.400$: Not visible, even with telescope (Category E/F).
3. **MABIMS Criteria (Southeast Asia Standard)**:
   - Elongation $\ge 6.4^\circ$ and Moon altitude $\ge 3.0^\circ$ at local sunset.

## Canonical Verification & Testing

```bash
# Run unit tests for Hilal calculations
pnpm test packages/moon-compute/tests/hilal.test.ts

# Test specific visibility parameters
pnpm --filter=@moon/compute exec tsx -e 'import { calculateHilalVisibility } from "./src/hilal"; console.log(calculateHilalVisibility({ lat: -6.1754, lon: 106.8272, date: new Date() }))'
```
