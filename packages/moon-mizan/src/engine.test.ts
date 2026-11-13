import { describe, expect, it } from 'vitest'
import { PRIMARY_FILTERS, SECONDARY_FILTERS, chooseMethod, validateAssessment } from './engine.js'

const validAssessment = {
  primaryFilterPassed: true,
  secondaryFilterPassed: true,
  powerRightScore: 8,
  powerLeftScore: 6,
  generalSufficient: false,
  balanceSatisfied: true,
  internalReferenceVerified: true,
  propheticReferenceRelevant: true,
  propheticReferenceWeight: 3,
  rating: 4
}

describe('chooseMethod', () => {
  it('keeps a sufficient assessment in the General method', () => {
    expect(chooseMethod({
      generalSufficient: true,
      balanceSatisfied: true,
      internalReferenceVerified: true
    })).toEqual({ method: 'general' })
  })

  it('activates Prophetic only with balance and a verified internal reference', () => {
    expect(chooseMethod({
      generalSufficient: false,
      balanceSatisfied: true,
      internalReferenceVerified: true
    })).toEqual({ method: 'prophetic' })
  })

  it('does not force Prophetic without a verified internal reference', () => {
    expect(chooseMethod({
      generalSufficient: false,
      balanceSatisfied: true,
      internalReferenceVerified: false
    })).toEqual({
      method: 'general_limited',
      limitation: 'Internal reference is not verified.'
    })
  })

  it('uses exactly four primary filters', () => {
    expect(PRIMARY_FILTERS).toHaveLength(4)
    expect(SECONDARY_FILTERS).toHaveLength(4)
  })
})

describe('validateAssessment', () => {
  it('calculates a Prophetic total only from a verified relevant reference', () => {
    expect(validateAssessment(validAssessment)).toEqual({
      method: 'prophetic',
      generalWeight: 14,
      propheticReferenceWeight: 3,
      totalWeight: 17
    })
  })

  it('rejects a failed primary filter before scoring', () => {
    expect(() => validateAssessment({ ...validAssessment, primaryFilterPassed: false }))
      .toThrow('Primary Filter must pass')
  })

  it('rejects a failed secondary filter before scoring', () => {
    expect(() => validateAssessment({ ...validAssessment, secondaryFilterPassed: false }))
      .toThrow('Secondary Filter must pass')
  })

  it('rejects a rating above the 4.5 ceiling', () => {
    expect(() => validateAssessment({ ...validAssessment, rating: 4.6 }))
      .toThrow('Rating must be between 0 and 4.5')
  })

  it('rejects Prophetic weight when General is sufficient', () => {
    expect(() => validateAssessment({ ...validAssessment, generalSufficient: true }))
      .toThrow('Prophetic weight cannot be added')
  })

  it('rejects Power Right score above maximum of 10', () => {
    expect(() => validateAssessment({ ...validAssessment, powerRightScore: 11 }))
      .toThrow('Power Right score must be between 0 and 10')
  })

  it('accepts Power Right score at maximum of 10', () => {
    const result = validateAssessment({ ...validAssessment, powerRightScore: 10, powerLeftScore: 7 })
    expect(result.generalWeight).toBe(17)
  })

  it('rejects Power Left score above maximum of 7', () => {
    expect(() => validateAssessment({ ...validAssessment, powerLeftScore: 8 }))
      .toThrow('Power Left score must be between 0 and 7')
  })

  it('accepts Power Left score at maximum of 7', () => {
    const result = validateAssessment({ ...validAssessment, powerLeftScore: 7 })
    expect(result.generalWeight).toBe(15)
  })

  it('rejects Prophetic reference weight above maximum of 4', () => {
    expect(() => validateAssessment({ ...validAssessment, propheticReferenceWeight: 5 }))
      .toThrow('Prophetic reference weight must be between 0 and 4')
  })

  it('falls back to General Limited when a reference has no assessment value', () => {
    expect(validateAssessment({
      ...validAssessment,
      propheticReferenceRelevant: false,
      propheticReferenceWeight: 0
    })).toEqual({
      method: 'general_limited',
      generalWeight: 14,
      propheticReferenceWeight: 0,
      totalWeight: 14,
      limitation: 'A verified reference does not provide sufficient assessment value.'
    })
  })

  it('rejects Prophetic weight without balance and verified reference', () => {
    expect(() => validateAssessment({
      ...validAssessment,
      balanceSatisfied: false,
      internalReferenceVerified: true,
      propheticReferenceWeight: 3
    })).toThrow('Prophetic weight requires a material balance condition')
  })

  it('General method maximum total weight is 17 (10 + 7)', () => {
    const result = validateAssessment({
      ...validAssessment,
      generalSufficient: true,
      powerRightScore: 10,
      powerLeftScore: 7,
      propheticReferenceWeight: 0
    })
    expect(result.generalWeight).toBe(17)
    expect(result.totalWeight).toBe(17)
    expect(result.method).toBe('general')
  })

  it('Prophetic method maximum total weight is 21 (10 + 7 + 4)', () => {
    const result = validateAssessment({
      ...validAssessment,
      powerRightScore: 10,
      powerLeftScore: 7,
      propheticReferenceWeight: 4
    })
    expect(result.generalWeight).toBe(17)
    expect(result.propheticReferenceWeight).toBe(4)
    expect(result.totalWeight).toBe(21)
    expect(result.method).toBe('prophetic')
  })
})
