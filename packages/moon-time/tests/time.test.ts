import { describe, expect, it } from 'vitest'
import { AEQ4_EPOCH_UTC_MS, getAEQ4Timestamp, getCountdownProgress, utcToHijri } from '../src/index.js'

describe('@moon/time', () => {
  it('converts the epoch into a valid Hijri date shape', () => {
    const hijri = utcToHijri(AEQ4_EPOCH_UTC_MS)

    expect(hijri.year).toBeGreaterThan(1400)
    expect(hijri.month).toBeGreaterThanOrEqual(1)
    expect(hijri.month).toBeLessThanOrEqual(12)
    expect(hijri.day).toBeGreaterThanOrEqual(1)
    expect(hijri.day).toBeLessThanOrEqual(30)
  })

  it('returns deterministic pre-era and active timestamp modes', () => {
    expect(getAEQ4Timestamp(AEQ4_EPOCH_UTC_MS - 1).mode).toBe('PRE_ERA')
    const active = getAEQ4Timestamp(AEQ4_EPOCH_UTC_MS)

    expect(active.mode).toBe('ACTIVE')
    expect(active.formatted).toContain('∞·AEQ4')
    expect(active.era).toBe(1)
  })

  it('clamps countdown progress to the documented range', () => {
    expect(getCountdownProgress(Date.UTC(2020, 0, 1))).toBe(0)
    expect(getCountdownProgress(Date.UTC(2030, 0, 1))).toBe(100)
  })
})
