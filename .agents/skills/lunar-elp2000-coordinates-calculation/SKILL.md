---
name: lunar-elp2000-coordinates-calculation
description: >-
  Use this skill when auditing, implementing, or testing high-precision lunar geocentric coordinates,
  lunar perturbation series, Delaunay fundamental arguments, and topocentric lunar distance.
---

# Lunar ELP2000-82B Coordinates Calculation (Subatomic Skill)

Governs high-precision calculation of the Moon's geocentric position using the Chapront-Touzé ELP2000-82B analytical lunar theory.

## Delaunay Fundamental Arguments

For Julian centuries $T$ from J2000.0 ($T = \frac{\text{JD} - 2451545.0}{36525}$):
- **Mean elongation of Moon from Sun ($D$)**:
  $$D = 297.8501921^\circ + 445267.1114034^\circ T - 0.0018819^\circ T^2 + \frac{T^3}{545868} - \frac{T^4}{113065000}$$
- **Mean anomaly of Sun ($M$)**:
  $$M = 357.5291092^\circ + 35999.0502909^\circ T - 0.0001536^\circ T^2 + \frac{T^3}{24490000}$$
- **Mean anomaly of Moon ($M'$)**:
  $$M' = 134.9633964^\circ + 477198.8675055^\circ T + 0.0087414^\circ T^2 + \frac{T^3}{69699} - \frac{T^4}{14712000}$$
- **Moon's argument of latitude ($F$)**:
  $$F = 93.2720950^\circ + 483202.0175233^\circ T - 0.0036539^\circ T^2 - \frac{T^3}{3526000} + \frac{T^4}{863310000}$$

## Perturbation Harmonic Summation

$$\Sigma_l = \sum A_l \sin(i D + j M + k M' + m F)$$
$$\Sigma_b = \sum A_b \sin(i D + j M + k M' + m F)$$
$$\Sigma_r = \sum A_r \cos(i D + j M + k M' + m F)$$

Where:
- Geocentric Ecliptic Longitude: $\lambda_{\text{moon}} = L' + \Sigma_l$
- Geocentric Ecliptic Latitude: $\beta_{\text{moon}} = \Sigma_b$
- Geocentric Distance ($km$): $\Delta_{\text{moon}} = 385000.56 + \Sigma_r$

### Major Lunar Perturbations
1. **Evection**: $1.2739^\circ \sin(2D - M')$
2. **Variation**: $0.5913^\circ \sin(2D)$
3. **Yearly Equation**: $-0.1858^\circ \sin(M)$
4. **Parallactic Inequality**: $-0.0354^\circ \sin(D)$

## Canonical Source Files
- `services/celestial-engine/src/ephemeris.py`
- `packages/moon-compute/src/moon-phase.ts`
- `packages/moon-compute/src/hilal.ts`

## Verification & Test Invocation
```bash
# Verify lunar phase and coordinates in Python service
pytest services/celestial-engine/tests/test_ephemeris.py -k "lunar" -v

# Verify isomorphic TypeScript lunar compute
pnpm --filter=@moon/compute test
```
