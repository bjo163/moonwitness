import { describe, expect, it } from 'vitest'
import { PRIMARY_FILTERS, chooseMethod } from './engine.js'

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
  })
})
