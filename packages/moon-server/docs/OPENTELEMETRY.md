# OpenTelemetry Operations

Status: **Canonical observability reference**.

## 1. Ownership

OpenTelemetry is initialized only inside `@moon/server`. Domain addons remain framework-agnostic and must not import Fastify or OpenTelemetry SDK packages for ordinary request tracing.

The canonical runtime is:

```text
NativeServer public API
  -> FastifyAdapter
  -> bootstrapTelemetry()
  -> OpenTelemetry NodeSDK + auto instrumentations
  -> Fastify / HTTP / supported database instrumentation
```

`@moon/performance` remains the product/application metrics layer. OpenTelemetry complements it with distributed trace/metric export.

## 2. Enable / disable

Telemetry is disabled unless explicitly enabled:

```text
ENABLE_TELEMETRY=true
```

When disabled, local development and tests require no collector and create no exporter lifecycle.

When enabled, `bootstrapTelemetry()` starts the NodeSDK before the Fastify listener. `server.stop()` closes SSE, closes Fastify, tears down ORM resources, and calls `shutdownTelemetry()`.

## 3. Export configuration

Supported runtime variables:

| Variable | Purpose |
|---|---|
| `ENABLE_TELEMETRY` | `true` enables the SDK |
| `OTEL_SERVICE_NAME` | service name; defaults to `moon-server` / API override |
| `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` | OTLP HTTP trace endpoint |
| `OTEL_EXPORTER_OTLP_METRICS_ENDPOINT` | OTLP HTTP metric endpoint |

Do not commit collector credentials or private production endpoints.

## 4. Automatic instrumentation

`telemetry.ts` uses:

```ts
getNodeAutoInstrumentations()
```

This is the supported Node OpenTelemetry auto-instrumentation bundle and is initialized at the canonical Fastify transport boundary. It captures supported HTTP/framework/database instrumentation without leaking Fastify types into domain packages.

Manual domain spans remain available through:

```ts
withDomainSpan(name, handler)
startDomainSpan(name, options)
```

Use manual spans only for bounded, meaningful domain operations.

## 5. Correlation

Fastify provides the canonical request ID. The adapter:

- accepts/generates a request ID
- returns it as `x-request-id`
- exposes it to Moon raw handlers as `req.requestId`
- includes it in transport logs

When telemetry is enabled, trace/span context follows supported async work through OpenTelemetry context propagation.

Recommended correlation fields are bounded identifiers only:

```text
requestId
traceId
spanId
safe user/session identifier when policy permits
domain operation identifier
```

## 6. Privacy and cardinality

Never export these as span attributes:

- JWTs
- passwords
- OTP values
- `Authorization`, `Cookie`, `Set-Cookie`, or API-key headers
- raw request or response bodies
- arbitrary unbounded user-generated text
- secrets or environment dumps

Prefer route templates and bounded IDs over raw URLs with sensitive query strings.

## 7. SSE

Create connection/lifecycle spans, not one span per SSE message. Long-lived streams must keep session authorization independent from telemetry: revocation/expiry checks remain enforced by the SSE handler even when telemetry is disabled.

## 8. Shutdown

Canonical shutdown order:

```text
stop application/background work
-> close active SSE streams
-> Fastify close/drain
-> ORM teardown
-> OpenTelemetry SDK shutdown/flush
```

A collector outage must not change authorization behavior or require local development to have external observability infrastructure.

## 9. Verification

Transport changes must test both modes:

```text
ENABLE_TELEMETRY unset/false -> server boots normally
ENABLE_TELEMETRY=true        -> SDK initializes and shuts down cleanly
```

The full repository gates remain:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```
