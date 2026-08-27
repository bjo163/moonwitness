import { describe, it, expect, vi } from 'vitest'
import { reportCrash, onCrash } from '@workspace/error'

describe('@workspace/error — Fault Telemetry & Crash Reporter', () => {
  it('dispatches crash reports to registered listeners', () => {
    const mockListener = vi.fn()
    const unsubscribe = onCrash(mockListener)

    const testError = new Error('Subsystem calibration failed')
    reportCrash(testError, { module: 'TEST_MODULE' })

    expect(mockListener).toHaveBeenCalledOnce()
    const payload = mockListener.mock.calls[0][0]
    expect(payload.message).toBe('Subsystem calibration failed')
    expect(payload.module).toBe('TEST_MODULE')
    expect(payload.timestamp).toBeDefined()

    unsubscribe()

    reportCrash(new Error('Second error'))
    expect(mockListener).toHaveBeenCalledOnce()
  })
})
