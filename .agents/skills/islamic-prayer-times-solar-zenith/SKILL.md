---
name: islamic-prayer-times-solar-zenith
description: >-
  Use this skill when calculating Islamic prayer times, solar zenith angles, Asr shadow ratios,
  equation of time, and polar high-latitude adjustments.
---

# Islamic Prayer Times & Solar Zenith (Subatomic Skill)

Governs high-precision calculation of Islamic prayer times based on astronomical solar coordinates in `packages/moon-compute/src/prayer-times.ts` and `src/sun-position.ts`.

## Core Mathematical Equations

### 1. Solar Zenith Angle ($\alpha$) for Prayer Boundaries
Given solar declination $\delta$ and observer latitude $\phi$, the local hour angle $H$ when Sun reaches zenith angle $\alpha$ is:
$$\cos(H) = \frac{\cos(\alpha) - \sin(\phi)\sin(\delta)}{\cos(\phi)\cos(\delta)}$$
- **Fajr**: Dawn twilight ($\alpha \approx 108^\circ$ for $18^\circ$ convention, $\alpha \approx 110^\circ$ for Egyptian/Kemenag $20^\circ$).
- **Sunrise / Shuruk**: Apparent sunrise ($h = -0.833^\circ$, $\alpha = 90.833^\circ$ taking refraction and semi-diameter into account).
- **Dhuhr**: Solar transit / culmination ($H = 0$). Calculated via Equation of Time ($EoT$):
  $$T_{\text{Dhuhr}} = 12 + \text{Timezone} - \frac{\lambda}{15} - \frac{EoT}{60} + \Delta t_{\text{ihtiyat}}$$
- **Asr**: Shadow length ratio $n$:
  - Shafi'i, Maliki, Hanbali: $n = 1$ (shadow equals object length plus noontime shadow).
  - Hanafi: $n = 2$ (shadow equals twice object length plus noontime shadow).
  $$\tan(\alpha_{\text{Asr}}) = \frac{1}{n + \tan(|\phi - \delta|)}$$
- **Maghrib**: Apparent sunset ($h = -0.833^\circ$, $\alpha = 90.833^\circ$).
- **Isha**: Dusk twilight ($\alpha \approx 108^\circ$ for $18^\circ$ convention, or fixed $90\text{ minutes}$ after Maghrib for Umm al-Qura).

### 2. Extreme Latitude (Polar) Mitigation Methods
When $|\phi| > 48.5^\circ$, the sun may not descend to $18^\circ$ or $20^\circ$ below the horizon in summer ($\cos(H) < -1$).
Mitigation modes:
1. **Angle-Based Rule**: $T_{\text{twilight}} = \frac{\alpha}{60} \times \text{Night Duration}$.
2. **One-Seventh of the Night**: Fajr is at the last 1/7th of night; Isha is at the end of first 1/7th.
3. **Middle of the Night**: Night is split symmetrically from sunset to sunrise.

## Verification Runbook

```bash
# Test prayer calculation for Jakarta (-6.1754, 106.8272, UTC+7)
pnpm --filter=@moon/compute exec tsx -e 'import { calculatePrayerTimes } from "./src/prayer-times"; console.log(calculatePrayerTimes({ lat: -6.1754, lon: 106.8272, timezone: 7, date: new Date() }))'

# Run prayer time unit tests
pnpm test packages/moon-compute/tests/prayer-times.test.ts
```
