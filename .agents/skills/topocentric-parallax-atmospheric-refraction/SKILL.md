---
name: topocentric-parallax-atmospheric-refraction
description: >-
  Use this skill when computing topocentric parallax corrections for lunar and solar vectors,
  and Bennett/Saemundsson atmospheric refraction models adjusted for temperature and barometric pressure.
---

# Topocentric Parallax & Atmospheric Refraction (Subatomic Skill)

Governs conversion from geocentric celestial coordinates to topocentric horizon coordinates as perceived by a terrestrial observer, incorporating atmospheric bending and geodetic parallax.

## Topocentric Parallax Reduction

Let:
- $\phi$: Observer geodetic latitude.
- $h$: Observer elevation above WGS84 ellipsoid in meters.
- $\rho \sin\phi'$ and $\rho \cos\phi'$: Geocentric observer radius components:
  $$u = \arctan\left(\frac{b}{a} \tan\phi\right) = \arctan(0.99664719 \tan\phi)$$
  $$\rho \sin\phi' = 0.99664719 \sin u + \frac{h}{6378137} \sin\phi$$
  $$\rho \cos\phi' = \cos u + \frac{h}{6378137} \cos\phi$$

### Lunar Parallax Correction
For geocentric equatorial coordinates $(\alpha, \delta)$ and distance $\Delta$ (in Earth equatorial radii):
Equatorial horizontal parallax $\pi = \arcsin(1 / \Delta)$.
Topocentric coordinates $(\alpha', \delta')$:
$$\tan(\alpha' - \alpha) = \frac{-\rho \cos\phi' \sin\pi \sin H}{\cos\delta - \rho \cos\phi' \sin\pi \cos H}$$
$$\tan\delta' = \frac{(\sin\delta - \rho \sin\phi' \sin\pi) \cos(\alpha' - \alpha)}{\cos\delta \cos H - \rho \cos\phi' \sin\pi}$$
Where $H = \text{LAST} - \alpha$ is the geocentric hour angle.

## Atmospheric Refraction (Bennett Formula)

For true geometric altitude $h_{\text{true}}$ in degrees:
$$R_0 = \frac{1}{\tan\left(h_{\text{true}} + \frac{7.31}{h_{\text{true}} + 4.4}\right)} + 0.001351 \quad (\text{arcminutes})$$

### Temperature and Pressure Scaling
For ambient temperature $T$ ($^\circ\text{C}$) and barometric pressure $P$ ($\text{mbar}$ or $\text{hPa}$):
$$f(P, T) = \frac{P}{1010} \times \frac{283}{273 + T}$$
$$R = R_0 \times f(P, T)$$

Apparent Altitude:
$$h_{\text{apparent}} = h_{\text{true}} + \frac{R}{60^\circ}$$

## Canonical Source Files
- `services/celestial-engine/src/astronomy.py`
- `packages/moon-compute/src/hilal.ts`
- `packages/moon-compute/src/sun-position.ts`

## Verification Command
```bash
pnpm --filter=@moon/compute exec tsx -e 'import { calculateHilalVisibility } from "./src/hilal"; console.log(calculateHilalVisibility({ lat: -6.2, lon: 106.8, date: new Date() }))'
```
