import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { defaultResource } from '@opentelemetry/resources'
import { trace, type Span, SpanStatusCode } from '@opentelemetry/api'

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
  const serviceVersion = config.serviceVersion || process.env.OTEL_SERVICE_VERSION || '0.1.0'
  const traceEndpoint = config.otlpTraceEndpoint || process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT || 'http://localhost:4318/v1/traces'
  const metricEndpoint = config.otlpMetricEndpoint || process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT || 'http://localhost:4318/v1/metrics'

  sdk = new NodeSDK({
    serviceName,
    serviceVersion,
    traceExporter: new OTLPTraceExporter({ url: traceEndpoint }),
    metricReaders: [
      new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({ url: metricEndpoint }),
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

export function startDomainSpan(name: string, options?: { attributes?: Record<string, unknown> }): Span | null {
  if (!isTelemetryEnabled()) return null
  return tracer.startSpan(name, { attributes: options?.attributes })
}

export function withDomainSpan<R>(
  name: string,
  fn: (span: Span | null) => Promise<R>,
  options?: { attributes?: Record<string, unknown> }
): Promise<R> {
  if (!isTelemetryEnabled()) {
    return fn(null)
  }
  return tracer.startActiveSpan(name, options, async (span) => {
    try {
      return await fn(span)
    } catch (err: any) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: err?.message || String(err) })
      span.recordException(err instanceof Error ? err : new Error(String(err)))
      throw err
    }
  })
}
