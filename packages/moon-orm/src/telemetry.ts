import { trace, type Span, type SpanOptions, SpanStatusCode } from '@opentelemetry/api'

export function isOtelEnabled(): boolean {
  return process.env.ENABLE_TELEMETRY === 'true'
}

const tracer = trace.getTracer('moon-orm')

export function startDbSpan(name: string, options?: SpanOptions): Span | null {
  if (!isOtelEnabled()) return null
  return tracer.startSpan(name, options)
}

export function withDbSpan<R>(
  name: string,
  fn: (span: Span | null) => Promise<R>,
  options?: SpanOptions
): Promise<R> {
  if (!isOtelEnabled()) {
    return fn(null)
  }
  const handler = async (span: Span): Promise<R> => {
    try {
      return await fn(span)
    } catch (err: any) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: err?.message || String(err) })
      span.recordException(err instanceof Error ? err : new Error(String(err)))
      throw err
    }
  }

  if (options) {
    return tracer.startActiveSpan(name, options, handler) as Promise<R>
  }
  return tracer.startActiveSpan(name, handler) as Promise<R>
}

export function sanitizeSql(sql: string): string {
  if (!sql) return sql
  return sql
    .replace(/'[^']*'/g, "'?'")
    .replace(/"[^"]*"/g, '"?"')
    .replace(/\$\d+/g, '?')
    .replace(/\b\d+(?:\.\d+)?\b/g, '?')
}

const MAX_CARDINALITY = 100
const cardinalityTracker = new Map<string, Set<string>>()

export function trackAttribute(key: string, value: string): void {
  if (!isOtelEnabled()) return
  const set = cardinalityTracker.get(key)
  if (!set) {
    cardinalityTracker.set(key, new Set([value]))
    return
  }
  if (set.size < MAX_CARDINALITY) {
    set.add(value)
  }
}

let sampleCounter = 0
const DEFAULT_SAMPLE_INTERVAL = 10

export function shouldSampleQuery(interval = DEFAULT_SAMPLE_INTERVAL): boolean {
  if (!isOtelEnabled()) return false
  sampleCounter++
  return sampleCounter % interval === 0
}

export function resetQuerySampler(): void {
  sampleCounter = 0
}
