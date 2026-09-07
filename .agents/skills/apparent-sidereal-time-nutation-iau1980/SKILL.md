---
name: apparent-sidereal-time-nutation-iau1980
description: >-
  Use this skill when implementing or auditing Greenwich Mean Sidereal Time (GMST), IAU 1980
  nutation in longitude and obliquity, true obliquity of the ecliptic, and the equation of the equinoxes.
---

# Apparent Sidereal Time & IAU 1980 Nutation (Subatomic Skill)

Governs high-precision transformation between Earth-fixed terrestrial frames and celestial coordinate systems using the IAU 1980 Nutation Theory and sidereal time calculations.

## Greenwich Mean Sidereal Time (GMST)

For Julian Day $\text{JD}$ and century $T = \frac{\text{JD} - 2451545.0}{36525}$:
At $0^\text{h}$ UT1:
$$\theta_0 = 100.46061837^\circ + 36000.770053608^\circ T + 0.000387933^\circ T^2 - \frac{T^3}{38710000}$$
For fractional UT1 hour $H$:
$$\text{GMST} = \theta_0 + 360.98564736629^\circ \times \frac{H}{24} \pmod{360^\circ}$$

## IAU 1980 Nutation Expansion

Mean Obliquity of the Ecliptic ($\epsilon_0$):
$$\epsilon_0 = 23^\circ 26' 21.448'' - 46.8150'' T - 0.00059'' T^2 + 0.001813'' T^3$$

Longitude of Ascending Node of Moon's Orbit ($\Omega$):
$$\Omega = 125.04452^\circ - 1934.136261^\circ T + 0.0020708^\circ T^2 + \frac{T^3}{450000}$$

### Primary Nutation Terms
1. **Nutation in Longitude ($\Delta\psi$)**:
   $$\Delta\psi = -17.20'' \sin(\Omega) - 1.32'' \sin(2L_\odot) - 0.23'' \sin(2L_\text{moon}) + 0.21'' \sin(2\Omega)$$
2. **Nutation in Obliquity ($\Delta\epsilon$)**:
   $$\Delta\epsilon = +9.20'' \cos(\Omega) + 0.57'' \cos(2L_\odot) + 0.10'' \cos(2L_\text{moon}) - 0.09'' \cos(2\Omega)$$

True Obliquity:
$$\epsilon = \epsilon_0 + \Delta\epsilon$$

## Equation of the Equinoxes & GAST

$$\text{Equation of Equinoxes} = \Delta\psi \cos(\epsilon)$$
$$\text{GAST (Greenwich Apparent Sidereal Time)} = \text{GMST} + \Delta\psi \cos(\epsilon)$$

Local Apparent Sidereal Time (LAST) for observer longitude $\lambda$:
$$\text{LAST} = \text{GAST} + \lambda$$

## Canonical Source Files
- `services/celestial-engine/src/astronomy.py`
- `packages/moon-compute/src/sun-position.ts`

## Verification Command
```bash
pytest services/celestial-engine/tests/test_astronomy.py -v
```
