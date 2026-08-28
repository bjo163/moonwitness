import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { defaultResource } from '@opentelemetry/resources'
import { trace, type Span, type SpanOptions, SpanStatusCode } from '@opentelemetry/api'

let sdk: NodeSDK | null = null

export interface TelemetryConfig {
  serviceName?: string
  serviceVersion?: string
  otlpTraceEndpoint?: string
  otlpMetricEndpoint?: string
}

export async function bootstrapTelemetry(config: TelemetryConfig = {}): Promise<void> {
  if (process.env.ENABLE_TELEMETRY !== 'true') {
    return
  }

  const serviceName = config.serviceName || process.env.OTEL_SERVICE_NAME || 'moon-server'
  const traceEndpoint = config.otlpTraceEndpoint || process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT
  const metricEndpoint = config.otlpMetricEndpoint || process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT

  sdk = new NodeSDK({
    serviceName,
    traceExporter: new OTLPTraceExporter(traceEndpoint ? { url: traceEndpoint } : undefined),
    metricReaders: [
      new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter(metricEndpoint ? { url: metricEndpoint } : undefined),
        exportIntervalMillis: 60000,
      }),
    ],
    resource: defaultResource(),
    instrumentations: [getNodeAutoInstrumentations()],
  })

  sdk.start()
}

export async function shutdownTelemetry(): Promise<void> {
  if (sdk) {
    await sdk.shutdown()
    sdk = null
  }
}

export function isTelemetryEnabled(): boolean {
  return process.env.ENABLE_TELEMETRY === 'true'
}

const tracer = trace.getTracer('moon-server')

export function startDomainSpan(name: string, options?: SpanOptions): Span | null {
  if (!isTelemetryEnabled()) return null
  return tracer.startSpan(name, options)
}

export function withDomainSpan<R>(
  name: string,
  fn: (span: Span | null) => Promise<R>,
  options?: SpanOptions
): Promise<R> {
  if (!isTelemetryEnabled()) {
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
