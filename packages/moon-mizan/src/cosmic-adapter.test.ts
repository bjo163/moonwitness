import { describe, expect, it } from 'vitest'
import { adaptCosmicResult } from './cosmic-adapter.js'

const valid = { modelOnly: true, divineVerdict: false, rgbl: { r: 1, g: 2, b: 3, l: 4 }, magnitude: 0.8, actionGates: Array(9).fill(0), impactVector: Array(13).fill(0), scaleInputs: Array(15).fill(0), quranicStatus: 'PROVISIONAL', sourceRevision: 'rev-1', modelVersion: 'cosmic-1' }

describe('Cosmic analytical boundary', () => {
  it('accepts a correctly shaped analytical result', () => expect(adaptCosmicResult(valid).modelOnly).toBe(true))
  it('rejects normative verdict flags', () => expect(() => adaptCosmicResult({ ...valid, divineVerdict: true })).toThrow())
  it('rejects mixed dimension vectors', () => expect(() => adaptCosmicResult({ ...valid, impactVector: Array(15).fill(0) })).toThrow())
})
