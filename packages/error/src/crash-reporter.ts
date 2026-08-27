/**
 * ◈ MOONWITNESS — CRASH REPORTER & FAULT TELEMETRY
 *
 * Captures unhandled client errors and rejection events.
 * Batches telemetry payload and safely reports to system console / API.
 */

export interface CrashEventPayload {
  message: string
  stack?: string
  source?: string
  lineno?: number
  colno?: number
  module?: string
  timestamp: string
  url?: string
}

export type CrashReport = CrashEventPayload
export type CrashListener = (event: CrashEventPayload) => void
export type CrashReportListener = CrashListener

const listeners: Set<CrashListener> = new Set()

export function onCrash(listener: CrashListener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function reportCrash(error: Error | unknown, context?: { module?: string; extra?: Record<string, unknown> }): void {
  const err = error instanceof Error ? error : new Error(String(error))
  const payload: CrashEventPayload = {
    message: err.message || 'Unknown runtime error',
    stack: err.stack,
    module: context?.module,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : undefined,
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error('[CrashReporter] Fault captured:', payload)
  }

  for (const listener of listeners) {
    try {
      listener(payload)
    } catch (listenerErr) {
      console.warn('[CrashReporter] Listener failed:', listenerErr)
    }
  }
}

let initialized = false

export function initGlobalCrashHandler(): void {
  if (typeof window === 'undefined' || initialized) return
  initialized = true

  window.addEventListener('error', (event) => {
    reportCrash(event.error || new Error(event.message), {
      module: 'window.onerror',
    })
  })

  window.addEventListener('unhandledrejection', (event) => {
    reportCrash(event.reason || new Error('Unhandled Promise Rejection'), {
      module: 'window.unhandledrejection',
    })
  })
}
