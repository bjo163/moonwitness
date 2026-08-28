import { describe, expect, it } from 'vitest'
import { PRIMARY_FILTERS, SECONDARY_FILTERS, chooseMethod, validateAssessment } from './engine.ts'

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

  it('rejects a rating above the 4.5 ceiling', () => {
    expect(() => validateAssessment({ ...validAssessment, rating: 4.6 }))
      .toThrow('Rating must be between 0 and 4.5')
  })

  it('rejects Prophetic weight when General is sufficient', () => {
    expect(() => validateAssessment({ ...validAssessment, generalSufficient: true }))
      .toThrow('Prophetic weight cannot be added')
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
})
