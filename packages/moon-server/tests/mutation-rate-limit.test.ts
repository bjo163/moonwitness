import { describe, expect, it, beforeEach } from 'vitest'
import { isMutationRateLimited, resetMutationRateLimitForTests } from '../src/handlers/mutation-rate-limit.js'

describe('mutation rate limiter', () => {
  beforeEach(() => resetMutationRateLimitForTests())

  it('does not count safe GET requests', () => {
    expect(isMutationRateLimited('127.0.0.1', 'GET', 1)).toBe(false)
    expect(isMutationRateLimited('127.0.0.1', 'GET', 1)).toBe(false)
  })

  it('limits the 121st mutation in a one-minute window', () => {
    for (let attempt = 1; attempt <= 120; attempt += 1) {
      expect(isMutationRateLimited('127.0.0.1', 'POST', 1)).toBe(false)
    }
    expect(isMutationRateLimited('127.0.0.1', 'POST', 1)).toBe(true)
  })

  it('starts a fresh window after one minute', () => {
    for (let attempt = 1; attempt <= 120; attempt += 1) {
      isMutationRateLimited('127.0.0.1', 'POST', 1)
    }
    expect(isMutationRateLimited('127.0.0.1', 'POST', 60_001)).toBe(false)
  })
})
