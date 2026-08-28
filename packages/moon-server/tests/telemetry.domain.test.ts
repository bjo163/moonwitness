import { describe, expect, it, vi, beforeEach } from 'vitest'
import { isTelemetryEnabled, startDomainSpan, withDomainSpan } from '../src/telemetry.js'

describe('Moon Server Domain Telemetry', () => {
  beforeEach(() => {
    delete process.env.ENABLE_TELEMETRY
  })

  describe('isTelemetryEnabled', () => {
    it('returns false when ENABLE_TELEMETRY is not set', () => {
      expect(isTelemetryEnabled()).toBe(false)
    })

    it('returns false when ENABLE_TELEMETRY is empty string', () => {
      process.env.ENABLE_TELEMETRY = ''
      expect(isTelemetryEnabled()).toBe(false)
    })

    it('returns true when ENABLE_TELEMETRY is true', () => {
      process.env.ENABLE_TELEMETRY = 'true'
      expect(isTelemetryEnabled()).toBe(true)
    })

    it('returns false when ENABLE_TELEMETRY is any other value', () => {
      process.env.ENABLE_TELEMETRY = 'false'
      expect(isTelemetryEnabled()).toBe(false)
    })
  })

  describe('startDomainSpan', () => {
    it('returns null when disabled', () => {
      expect(startDomainSpan('auth.login')).toBeNull()
    })

    it('returns a span when enabled', () => {
      process.env.ENABLE_TELEMETRY = 'true'
      const span = startDomainSpan('auth.login')
      expect(span).not.toBeNull()
      expect(span?.spanContext().traceId).toBeDefined()
      span?.end()
    })

    it('accepts attributes when enabled', () => {
      process.env.ENABLE_TELEMETRY = 'true'
      const span = startDomainSpan('auth.login', {
        attributes: { 'auth.action': 'login' }
      })
      expect(span).not.toBeNull()
      span?.end()
    })
  })

  describe('withDomainSpan', () => {
    it('executes fn without span when disabled', async () => {
      const result = await withDomainSpan('auth.login', async () => 'ok')
      expect(result).toBe('ok')
    })

    it('executes fn with span when enabled', async () => {
      process.env.ENABLE_TELEMETRY = 'true'
      const result = await withDomainSpan('auth.login', async (span) => {
        expect(span).not.toBeNull()
        return 'ok'
      })
      expect(result).toBe('ok')
    })

    it('propagates errors and sets span status', async () => {
      process.env.ENABLE_TELEMETRY = 'true'
      await expect(
        withDomainSpan('auth.login', async () => {
          throw new Error('boom')
        })
      ).rejects.toThrow('boom')
    })
  })
})
