import { describe, expect, it } from 'vitest'
import { calculateQiblaBearing, degreesToCompass } from '../src/qibla.js'
import { calculateLunarPhaseCycle } from '../src/moon-phase.js'

describe('@moon/compute', () => {
  it('calculates a stable Qibla result for Jakarta', () => {
    const result = calculateQiblaBearing(-6.2088, 106.8456)

    expect(result.qibla_bearing_deg).toBeGreaterThan(290)
    expect(result.qibla_bearing_deg).toBeLessThan(300)
    expect(result.distance_to_kabah_km).toBeGreaterThan(7_000)
    expect(result.cardinal_direction).toBe(degreesToCompass(result.qibla_bearing_deg))
  })

  it('normalizes compass angles across the zero-degree boundary', () => {
    expect(degreesToCompass(-1)).toBe('N')
    expect(degreesToCompass(360)).toBe('N')
    expect(degreesToCompass(180)).toBe('S')
  })

  it('keeps lunar phase output bounded and deterministic', () => {
    const result = calculateLunarPhaseCycle(0)

    expect(result.phase_name).toBe('New Moon')
    expect(result.illumination_fraction).toBeGreaterThanOrEqual(0)
    expect(result.illumination_fraction).toBeLessThanOrEqual(1)
    expect(result.age_days).toBe(0)
  })
})
