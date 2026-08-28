import { describe, expect, it, vi, beforeEach } from 'vitest'
import {
  isOtelEnabled,
  sanitizeSql,
  trackAttribute,
  shouldSampleQuery,
  resetQuerySampler,
  startDbSpan,
  withDbSpan,
} from '../src/telemetry.js'

describe('Moon ORM Telemetry', () => {
  beforeEach(() => {
    delete process.env.ENABLE_TELEMETRY
    resetQuerySampler()
  })

  describe('isOtelEnabled', () => {
    it('returns false when ENABLE_TELEMETRY is not set', () => {
      expect(isOtelEnabled()).toBe(false)
    })

    it('returns false when ENABLE_TELEMETRY is empty string', () => {
      process.env.ENABLE_TELEMETRY = ''
      expect(isOtelEnabled()).toBe(false)
    })

    it('returns true when ENABLE_TELEMETRY is true', () => {
      process.env.ENABLE_TELEMETRY = 'true'
      expect(isOtelEnabled()).toBe(true)
    })

    it('returns false when ENABLE_TELEMETRY is any other value', () => {
      process.env.ENABLE_TELEMETRY = 'false'
      expect(isOtelEnabled()).toBe(false)
    })
  })

  describe('sanitizeSql', () => {
    it('replaces single-quoted string literals with ?', () => {
      expect(sanitizeSql("SELECT * FROM users WHERE name = 'admin'")).toBe("SELECT * FROM users WHERE name = '?'")
    })

    it('replaces double-quoted identifiers with ?', () => {
      expect(sanitizeSql('SELECT * FROM "users" WHERE id = 1')).toBe('SELECT * FROM "?" WHERE id = ?')
    })

    it('replaces numeric literals with ?', () => {
      expect(sanitizeSql('SELECT * FROM users WHERE id = 42 AND age = 3.14')).toBe('SELECT * FROM users WHERE id = ? AND age = ?')
    })

    it('replaces dollar parameters with ?', () => {
      expect(sanitizeSql('SELECT * FROM users WHERE id = $1 AND name = $2')).toBe('SELECT * FROM users WHERE id = ? AND name = ?')
    })

    it('returns empty string as-is', () => {
      expect(sanitizeSql('')).toBe('')
    })

    it('returns nullish input as-is', () => {
      expect(sanitizeSql(null as any)).toBe(null as any)
    })
  })

  describe('trackAttribute', () => {
    it('does not throw when disabled', () => {
      expect(() => trackAttribute('db.table', 'users')).not.toThrow()
    })

    it('does not throw when enabled', () => {
      process.env.ENABLE_TELEMETRY = 'true'
      expect(() => trackAttribute('db.table', 'users')).not.toThrow()
    })
  })

  describe('shouldSampleQuery', () => {
    it('returns false when disabled', () => {
      expect(shouldSampleQuery(1)).toBe(false)
      expect(shouldSampleQuery(10)).toBe(false)
    })

    it('returns true on the Nth call when enabled', () => {
      process.env.ENABLE_TELEMETRY = 'true'
      expect(shouldSampleQuery(3)).toBe(false)
      expect(shouldSampleQuery(3)).toBe(false)
      expect(shouldSampleQuery(3)).toBe(true)
      expect(shouldSampleQuery(3)).toBe(false)
      expect(shouldSampleQuery(3)).toBe(false)
      expect(shouldSampleQuery(3)).toBe(true)
    })

    it('uses default interval of 10', () => {
      process.env.ENABLE_TELEMETRY = 'true'
      for (let i = 1; i < 10; i++) {
        expect(shouldSampleQuery()).toBe(false)
      }
      expect(shouldSampleQuery()).toBe(true)
    })
  })

  describe('resetQuerySampler', () => {
    it('resets the sample counter', () => {
      process.env.ENABLE_TELEMETRY = 'true'
      shouldSampleQuery(2)
      resetQuerySampler()
      expect(shouldSampleQuery(2)).toBe(false)
      expect(shouldSampleQuery(2)).toBe(true)
    })
  })

  describe('startDbSpan', () => {
    it('returns null when disabled', () => {
      expect(startDbSpan('test')).toBeNull()
    })

    it('returns a span when enabled', () => {
      process.env.ENABLE_TELEMETRY = 'true'
      const span = startDbSpan('test')
      expect(span).not.toBeNull()
      expect(span?.spanContext().traceId).toBeDefined()
      span?.end()
    })
  })

  describe('withDbSpan', () => {
    it('executes fn without span when disabled', async () => {
      const result = await withDbSpan('test', async () => 'ok')
      expect(result).toBe('ok')
    })

    it('executes fn with span when enabled', async () => {
      process.env.ENABLE_TELEMETRY = 'true'
      const result = await withDbSpan('test', async (span) => {
        expect(span).not.toBeNull()
        return 'ok'
      })
      expect(result).toBe('ok')
    })

    it('propagates errors and sets span status', async () => {
      process.env.ENABLE_TELEMETRY = 'true'
      await expect(
        withDbSpan('test', async () => {
          throw new Error('boom')
        })
      ).rejects.toThrow('boom')
    })
  })
})
