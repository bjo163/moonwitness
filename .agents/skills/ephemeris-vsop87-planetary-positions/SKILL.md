---
name: ephemeris-vsop87-planetary-positions
description: >-
  Use this skill when implementing, auditing, or verifying VSOP87 analytical planetary ephemerides,
  heliocentric coordinates, series summation, and conversion to geocentric ecliptic positions.
---

# VSOP87 Analytical Planetary Ephemeris (Subatomic Skill)

Governs high-precision heliocentric and geocentric planetary position calculations using the French Bureau des Longitudes VSOP87 (Variations Séculaires des Orbites Planétaires) analytical solution.

## Mathematical Formulation & Series Expansion

For Julian Millennium $T$ from J2000.0 ($T = \frac{\text{JD} - 2451545.0}{365250}$):
Each heliocentric coordinate (longitude $L$, latitude $B$, radius vector $R$) is expanded as a Poisson series:

$$X = \sum_{\alpha=0}^5 T^\alpha \sum_{i=1}^{N_\alpha} A_i \cos(B_i + C_i T)$$

Where:
- $X \in \{L, B, R\}$
- $A_i$: Amplitude in radians (for $L, B$) or AU (for $R$).
- $B_i$: Phase constant in radians.
- $C_i$: Frequency in radians per Julian millennium.
- $\alpha$: Power of time in millennia ($T^0$ through $T^5$).

### Heliocentric to Geocentric Ecliptic Transformation
Given Earth heliocentric coordinates $(X_0, Y_0, Z_0)$ and Planet heliocentric coordinates $(X_p, Y_p, Z_p)$:
1. Rectangular coordinates:
   $$X = X_p - X_0 = R_p \cos B_p \cos L_p - R_0 \cos B_0 \cos L_0$$
   $$Y = Y_p - Y_0 = R_p \cos B_p \sin L_p - R_0 \cos B_0 \sin L_0$$
   $$Z = Z_p - Z_0 = R_p \sin B_p - R_0 \sin B_0$$
2. Geocentric Distance $\Delta$:
   $$\Delta = \sqrt{X^2 + Y^2 + Z^2}$$
3. Geocentric Ecliptic Longitude $\lambda$ and Latitude $\beta$:
   $$\lambda = \operatorname{atan2}(Y, X) \pmod{2\pi}$$
   $$\beta = \operatorname{atan2}\left(Z, \sqrt{X^2 + Y^2}\right)$$
4. Planetary Light-Time Correction $\tau$:
   $$\tau = 0.0057755183 \times \Delta \quad (\text{days})$$
   Re-evaluate $X_p(T - \tau)$ until $|\Delta_{k} - \Delta_{k-1}| < 10^{-8} \text{ AU}$.

## Canonical Implementation Files
- `services/celestial-engine/src/ephemeris.py`
- `packages/moon-compute/src/sun-position.ts`
- `packages/moon-compute/src/index.ts`

## Verification & Precision Proofs
```bash
# Verify celestial engine ephemeris tests
pytest services/celestial-engine/tests/test_ephemeris.py -v

# Isomorphic execution check
pnpm --filter=@moon/compute test
```
