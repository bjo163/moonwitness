---
name: solar-declination-equation-of-time
description: >-
  Use this skill when calculating solar declination, the Equation of Time (EoT), true solar noon,
  and solar hour angles for exact Islamic prayer windows and Duha times.
---

# Solar Declination & Equation of Time (Subatomic Skill)

Governs the calculation of the Sun's declination ($\delta_\odot$) and the Equation of Time ($\text{EoT}$) needed to find exact local solar transit (Zawal/Dhuhr), sunrise, sunset, and solar zenith transitions.

## Geometric Mean Elements

For day of year $d \in [1, 365]$ or fractional year $\gamma$ (radians):
$$\gamma = \frac{2\pi}{365} \left(d - 1 + \frac{\text{hour} - 12}{24}\right)$$

### Equation of Time ($\text{EoT}$ in minutes)
$$\begin{aligned}
\text{EoT} = 229.18 \times (&0.000075 + 0.001868 \cos\gamma - 0.032077 \sin\gamma \\
&- 0.014615 \cos(2\gamma) - 0.040849 \sin(2\gamma))
\end{aligned}$$

### Solar Declination ($\delta_\odot$ in radians)
$$\begin{aligned}
\delta_\odot = &0.006918 - 0.399912 \cos\gamma + 0.070257 \sin\gamma \\
&- 0.006758 \cos(2\gamma) + 0.000907 \sin(2\gamma) \\
&- 0.002697 \cos(3\gamma) + 0.00148 \sin(3\gamma)
\end{aligned}$$

## Solar Transit & Hour Angle Derivation

1. **Solar Transit (Local Solar Noon / Zawal)** in local clock time:
   $$\text{Transit} = 12:00:00 + \frac{4 \times (\lambda_{\text{standard}} - \lambda_{\text{observer}}) - \text{EoT}}{60} \quad (\text{hours})$$
   Where $\lambda_{\text{standard}} = 15^\circ \times \text{UTC offset}$.

2. **Solar Hour Angle ($H_0$) for Zenith Angle $\theta$**:
   $$\cos H_0 = \frac{\cos\theta - \sin\phi \sin\delta_\odot}{\cos\phi \cos\delta_\odot}$$
   - For Sunrise/Sunset: $\theta = 90.8333^\circ$ (accounting for $0.5333^\circ$ solar disk diameter and $0.5667^\circ$ standard refraction).
   - For Fajr: $\theta = 110.0^\circ$ (KEMENAG $20.0^\circ$ below horizon).
   - For Isha: $\theta = 108.0^\circ$ (KEMENAG $18.0^\circ$ below horizon).
   - For Asr (Shafi'i/Hanbali/Maliki): $\theta = 90^\circ - \operatorname{arccot}(1 + \tan|\phi - \delta_\odot|)$.

## Canonical Source Files
- `packages/moon-compute/src/sun-position.ts`
- `packages/moon-compute/src/prayer-times.ts`
- `services/celestial-engine/src/astronomy.py`

## Verification Command
```bash
pnpm --filter=@moon/compute exec tsx -e 'import { getSunPosition } from "./src/sun-position"; console.log(getSunPosition({ latitude: -6.2, longitude: 106.8 }))'
```
