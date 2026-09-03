# Fastify Transport Architecture

Status: **Canonical production transport**.

## 1. Final architecture

MoonWitness exposes one public server abstraction:

```text
apps/api
  -> NativeServer (public Moon contract)
  -> FastifyAdapter (internal implementation)
  -> Fastify 5
  -> Node.js HTTP
```

`NativeServer` is intentionally a compatibility/public API name. It extends the internal `FastifyAdapter`; it no longer owns a handwritten `node:http` server, route matcher, or production middleware dispatcher.

There is **one canonical production routing engine: Fastify 5**.

## 2. Stable Moon contracts

Applications and addons continue to use Moon-owned APIs:

- `new NativeServer(config)`
- `server.use(middleware)`
- `server.get/post/put/delete(...)`
- `server.proxy(...)`
- `defineRoute(...)`
- `globalRoutes` as the registration registry
- raw `IncomingMessage` / `ServerResponse` inside existing Moon handlers where compatibility requires it

Fastify types must remain inside `@moon/server` transport code and transport-focused tests. Domain addons must not import Fastify merely to register normal routes.

## 3. Route lifecycle

All routes are registered into Fastify before `server.start()` completes.

```text
request
  -> Fastify request id / body parser / router
  -> Moon raw-request bridge
  -> Moon middleware chain
  -> auth / route handler / ORM-domain work
  -> Moon error/response envelope
  -> Fastify lifecycle completion
```

`defineRoute()` and routes registered through `server.get/post/put/delete/proxy` before startup are mapped into the same Fastify instance. No second runtime matcher competes with Fastify.

Route or middleware registration after `server.start()` is rejected so the runtime route table remains deterministic.

## 4. Raw request/response ownership

Existing Moon handlers still consume Node `IncomingMessage` / `ServerResponse`. The Fastify adapter deliberately bridges:

- parsed JSON body -> `req.__moonBody`
- Fastify path params -> `req.params`
- Fastify request id -> `req.requestId`

The adapter then calls `reply.hijack()` before handing control to Moon raw handlers. This keeps legacy handlers compatible without making them Fastify-aware.

`parseBody()` and declarative-route body parsing consume the bridged value when present, preventing reads from an already-consumed Fastify request stream.

## 5. Middleware ordering

Moon middleware registered with `server.use()` is preserved and runs in registration order around every Moon raw handler:

```text
middleware 1
  -> middleware 2
    -> route handler
```

`@moon/performance` therefore remains transport-independent.

## 6. Built-in surfaces

The canonical Fastify transport owns:

- `/auth/*`
- `/rpc`
- `/health`, `/health/live`, `/health/ready` aliases
- `/db/status`
- `/meta/models`
- `/api/meta/model/:model`
- `/live` SSE
- generic `/api/:model` REST
- OpenAPI and dashboard routes
- addon/custom Moon routes
- proxy routes

## 7. SSE

SSE remains a raw-response escape hatch under Fastify. `/live` performs admin authentication before opening the stream, passes the canonical JWT secret into the SSE lifecycle, periodically revalidates the session, and closes revoked/inactive/expired sessions.

Fastify owns connection acceptance and shutdown; `closeAllSSEConnections()` drains active streams before the adapter closes the Fastify instance.

## 8. OpenTelemetry

`bootstrapTelemetry()` runs before the Fastify listener starts. The Node OpenTelemetry SDK uses `getNodeAutoInstrumentations()`, which instruments supported HTTP/framework/database libraries without coupling domain packages to Fastify.

Telemetry is optional:

```text
ENABLE_TELEMETRY=true   -> initialize NodeSDK + OTLP exporters
anything else           -> no external collector required
```

Manual domain spans continue through `withDomainSpan()` / `startDomainSpan()`.

Never add JWTs, passwords, OTPs, authorization headers, raw request bodies, or unbounded user text to span attributes.

## 9. Request correlation

Fastify request IDs are canonical at the transport boundary. The adapter:

- accepts `x-request-id` when supplied by trusted infrastructure
- generates one otherwise
- emits `x-request-id` in responses
- exposes it to raw Moon handlers as `req.requestId`
- includes it in Moon HTTP logs

Trace correlation is provided by the OpenTelemetry active context when telemetry is enabled.

## 10. Compatibility `handleRequest()`

`NativeServer.handleRequest()` remains only as a compatibility/test shim. It uses `Fastify.inject()` and therefore executes through the canonical Fastify router. It is **not** a second production router.

## 11. Extension rule

New code should extend Moon contracts, not Fastify directly:

```ts
import { defineRoute } from '@moon/server'

defineRoute({
  method: 'GET',
  path: '/api/example/status',
  auth: 'user',
  handler: async ({ env }) => ({ ok: true }),
})
```

Only transport infrastructure inside `@moon/server` may depend directly on Fastify.

## 12. Verification

Canonical verification:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Production candidates additionally run PostgreSQL certification, backup/restore smoke, readiness checks, SSE/security regressions, and the normal `dev -> main` promotion flow.
