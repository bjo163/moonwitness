# OpenTelemetry Operations

Status: **Operational reference for observability configuration**.

## 1. Overview

MoonWitness uses structured logging as the primary observability mechanism. OpenTelemetry (OTel) is the recommended instrumentation layer when you need distributed traces, metrics aggregation, or export to a centralized backend.

The transport layer (`NativeServer` and `FastifyAdapter`) is the only boundary where OTel should be initialized. Domain addons and models must remain framework-agnostic.

## 2. Enabling OTel in Production

### 2.1 Install SDK packages

Add the required packages to `@moon/server`:

```bash
pnpm --filter @moon/server add @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-trace-otlp-http @opentelemetry/resources @opentelemetry/semantic-conventions
```

### 2.2 Initialize in server bootstrap

Wrap server startup with OTel SDK initialization. Do this in the application entry point (`apps/api/src/server.ts` or equivalent), not inside addon packages.

```ts
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
  resource: process.env.OTEL_RESOURCE_ATTRIBUTES,
})

try {
  sdk.start()
  await server.start()
} finally {
  await sdk.shutdown()
}
```

## 3. Configuration Options

All OTel behavior is controlled via environment variables. Do not hardcode endpoints or sampling rates.

| Variable | Purpose | Default |
|---|---|---|
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP collector URL (gRPC or HTTP) | unset (no export) |
| `OTEL_EXPORTER_OTLP_HEADERS` | Auth headers, comma-separated `key=value` pairs | unset |
| `OTEL_SERVICE_NAME` | Logical service name in traces | `moonwitness-api` |
| `OTEL_RESOURCE_ATTRIBUTES` | Key-value resource tags (e.g., `service.namespace=prod,deployment.environment=production`) | unset |
| `OTEL_TRACES_SAMPLER` | Sampling algorithm | `parentbased_traceidratio` |
| `OTEL_TRACES_SAMPLER_ARG` | Sample ratio for ratio-based samplers (0.0 – 1.0) | `0.1` |
| `OTEL_LOG_LEVEL` | SDK log verbosity | `info` |

Set these in your deployment environment or `.env.production.example`. Never commit secrets or production endpoints to the repository.

## 4. Sampling and Privacy Guardrails

### 4.1 Default Sampling

Use `parentbased_traceidratio` with a conservative argument in production:

```text
OTEL_TRACES_SAMPLER=parentbased_traceidratio
OTEL_TRACES_SAMPLER_ARG=0.1
```

This samples 10% of root spans and respects parent span decisions for downstream calls.

### 4.2 Always-Sample and Never-Sample Rules

Apply span attributes at the transport boundary to enforce sampling policies:

- **Health probes** (`/health/live`, `/health/ready`, `/health`) — mark with `span.setAttribute('health.probe', true)` and configure a `NeverSample` rule or filter them at the collector.
- **Internal cron metrics** — do not create spans for the 60-second metric interval flush. It generates noise without diagnostic value.
- **SSE connections** — create a single span per connection and do not emit a span per message. Messages are high-volume and low-decision-value.

### 4.3 PII Scrubbing

The server must never export raw request bodies or JWTs in span attributes. Apply these rules:

- Strip `Authorization`, `Cookie`, `Set-Cookie`, and `X-API-Key` from `http.request.header` attributes.
- Truncate `http.target` to path-only (remove query string) to avoid leaking search parameters that may contain user identifiers.
- Do not attach `env`, `body`, or raw `req` objects to spans. Use only the sanitized `RouteContext` fields that are safe for telemetry.

### 4.4 Rate and Error Budgets

If a downstream collector is unreachable, the SDK buffers a finite number of spans. Set explicit limits:

```text
OTEL_BSP_MAX_EXPORT_BATCH_SIZE=512
OTEL_BSP_SCHEDULE_DELAY=5000
```

Monitor `moon.telemetry.dropped_spans` (exported as a model metric via `MxMetric`) to detect backpressure before memory pressure forces a restart.

## 5. Graceful Shutdown Behavior

### 5.1 Server Stop Sequence

When the process receives `SIGTERM` or `SIGINT`:

1. Stop accepting new connections.
2. Flush in-flight spans (SDK `shutdown()` with a 5-second timeout).
3. Close SSE connections via `closeAllSSEConnections()`.
4. Clear the metric interval timer.
5. Tear down ORM via `teardownOrm()`.
6. Exit.

NativeServer and FastifyAdapter already implement steps 3–5 in their `stop()` methods. Step 2 must be added at the application bootstrap layer around the SDK instance.

### 5.2 Shutdown Timeout

Hard-kill after 10 seconds if graceful shutdown stalls:

```ts
const FORCE_SHUTDOWN_MS = 10_000

process.on('SIGTERM', async () => {
  setTimeout(() => process.exit(1), FORCE_SHUTDOWN_MS)
  await sdk.shutdown()
  await server.stop()
  process.exit(0)
})
```

### 5.3 Draining In-Flight Requests

- NativeServer does not implement connection draining. Active requests complete on their existing `http.ServerResponse`.
- FastifyAdapter calls `app.close()` which stops accepting new connections and waits for in-flight requests up to Fastify's own internal timeout. No custom drain logic is required.

## 6. Addon Telemetry Rules

Addons must not import OTel SDK packages. Telemetry concerns belong to the transport layer.

If an addon needs to record a domain event:
1. Call `publish(topic, payload)` from `@moon/server` to emit a platform event.
2. The server bootstrap layer listens for `moon_event` and creates spans from those events if telemetry is enabled.

This keeps addons free of observability framework dependencies and preserves the server-as-transport boundary.
