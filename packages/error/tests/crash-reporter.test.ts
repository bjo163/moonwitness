import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { reportCrash, onCrash, type CrashEventPayload } from '../src/crash-reporter.js'

describe('CrashReporter & Fault Telemetry', () => {
  let captured: CrashEventPayload[] = []
  let unsubscribe: () => void

  beforeEach(() => {
    captured = []
    unsubscribe = onCrash((payload) => {
      captured.push(payload)
    })
  })

  afterEach(() => {
    unsubscribe()
  })

  it('captures standard Error instances', () => {
    reportCrash(new Error('Test error message'), { module: 'test-module' })
    expect(captured.length).toBe(1)
    expect(captured[0]?.message).toBe('Test error message')
    expect(captured[0]?.module).toBe('test-module')
    expect(captured[0]?.timestamp).toBeDefined()
  })

  it('ignores null, undefined, empty objects, and AbortErrors', () => {
    reportCrash(null)
    reportCrash(undefined)
    reportCrash({})
    const abortErr = new Error('The user aborted a request.')
    abortErr.name = 'AbortError'
    reportCrash(abortErr)

    const nextDigestErr = { digest: 'NEXT_REDIRECT;replace;/login' }
    reportCrash(nextDigestErr)

    expect(captured.length).toBe(0)
  })

  it('properly extracts message from object-like errors', () => {
    reportCrash({ message: 'Custom object error', code: 500 })
    expect(captured.length).toBe(1)
    expect(captured[0]?.message).toBe('Custom object error')
  })

  it('allows unsubscribing from crash telemetry', () => {
    unsubscribe()
    reportCrash(new Error('Ignored after unsubscribe'))
    expect(captured.length).toBe(0)
  })
})
