---
name: qibla-geodesic-spherical-trigonometry
description: >-
  Use this skill when developing, testing, or auditing Qibla azimuth geodesic calculations,
  spherical trigonometry formulas, and Great-Circle navigation routines.
---

# Qibla Geodesic Spherical Trigonometry (Subatomic Skill)

Governs forward azimuth and Great-Circle distance calculations from any planetary coordinate to the Kaaba ($21.422477^\circ\text{ N}, 39.826216^\circ\text{ E}$).

## Spherical Trigonometry Formula

In `packages/moon-compute/src/qibla.ts`:
Given observer coordinates $(\phi, \lambda)$ and Kaaba coordinates $(\phi_K, \lambda_K)$:
$$\Delta\lambda = \lambda_K - \lambda$$

The forward azimuth angle $\theta_{\text{qibla}}$ clockwise from true North is:
$$\tan(\theta_{\text{qibla}}) = \frac{\sin(\Delta\lambda)}{\cos(\phi)\tan(\phi_K) - \sin(\phi)\cos(\Delta\lambda)}$$

Using `atan2` for four-quadrant normalization:
$$\theta_{\text{qibla}} = \text{atan2}\left(\sin(\Delta\lambda), \cos(\phi)\tan(\phi_K) - \sin(\phi)\cos(\Delta\lambda)\right)$$
Normalize result into $[0^\circ, 360^\circ)$:
$$\theta_{\text{normalized}} = (\theta_{\text{qibla}} + 360^\circ) \pmod{360^\circ}$$

## Great-Circle Distance (Haversine Formula)

$$d = 2R \arcsin\left(\sqrt{\sin^2\left(\frac{\phi_K - \phi}{2}\right) + \cos(\phi)\cos(\phi_K)\sin^2\left(\frac{\Delta\lambda}{2}\right)}\right)$$
where $R \approx 6371.0088\text{ km}$ (WGS-84 mean earth radius).

## Invariants & Edge Cases

- **Kaaba Proximity**: If observer is within $100\text{ meters}$ of Kaaba ($d < 0.1\text{ km}$), azimuth is indeterminate (all directions face Kaaba).
- **Antipodal Point**: If observer is at the antipodal point of Kaaba ($-21.4225^\circ\text{ S}, -140.1738^\circ\text{ W}$), all directions are equidistant; return deterministic $0^\circ$ with antipodal warning.
- **Pure Math**: Zero external network or database calls.

## Verification Runbook

```bash
# Verify Jakarta Qibla azimuth (expected ~295.2 degrees)
pnpm --filter=@moon/compute exec tsx -e 'import { calculateQibla } from "./src/qibla"; console.log(calculateQibla(-6.1754, 106.8272))'

# Run unit tests
pnpm test packages/moon-compute/tests/qibla.test.ts
```
