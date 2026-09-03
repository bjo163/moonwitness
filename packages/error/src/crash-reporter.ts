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
  if (error === null || error === undefined) return

  // Ignore abort errors from fetch or Next.js navigation cancellation
  if (
    (typeof error === 'object' && error !== null && 'name' in error && (error as any).name === 'AbortError') ||
    (error instanceof Error && error.name === 'AbortError') ||
    (typeof error === 'object' && error !== null && 'digest' in error && String((error as any).digest).startsWith('NEXT_'))
  ) {
    return
  }

  // Ignore empty objects or empty strings
  if (typeof error === 'object' && error !== null && !(error instanceof Error) && Object.keys(error).length === 0) {
    return
  }

  let message = 'Unknown runtime error'
  let stack: string | undefined

  if (error instanceof Error) {
    message = error.message || error.name || 'Unknown Error'
    stack = error.stack
  } else if (typeof error === 'string') {
    if (!error.trim()) return
    message = error
  } else if (typeof error === 'object' && error !== null) {
    if ('message' in error && typeof (error as any).message === 'string' && (error as any).message.trim()) {
      message = (error as any).message
    } else {
      try {
        message = JSON.stringify(error)
      } catch {
        message = String(error)
      }
    }
    if ('stack' in error && typeof (error as any).stack === 'string') {
      stack = (error as any).stack
    }
  }

  const payload: CrashEventPayload = {
    message,
    stack,
    module: context?.module,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location?.href : undefined,
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
    // Ignore DOM resource loading errors (e.g. <img>, <link>, <script> loading failures)
    if (event.target && event.target !== window && event.target !== document) {
      return
    }

    if (!event.error && !event.message) {
      return
    }

    reportCrash(event.error || new Error(event.message || 'Window error event'), {
      module: 'window.onerror',
    })
  })

  window.addEventListener('unhandledrejection', (event) => {
    if (!event.reason) return
    if (
      typeof event.reason === 'object' &&
      event.reason !== null &&
      Object.keys(event.reason).length === 0 &&
      !(event.reason instanceof Error)
    ) {
      return
    }
    if (event.reason?.name === 'AbortError' || event.reason?.message?.includes('aborted')) {
      return
    }

    reportCrash(event.reason, {
      module: 'window.unhandledrejection',
    })
  })
}
