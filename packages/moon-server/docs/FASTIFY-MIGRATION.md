# Fastify Migration Guide

Status: **Canonical transport boundary reference**.

## 1. Transport Boundary

`@moon/server` exposes two transport implementations that share the same handler layer:

- **NativeServer** — Node.js native `http` module. Zero external HTTP framework dependencies. Used by the API app since initial launch.
- **FastifyAdapter** — Fastify engine. Plugin-capable, decorator-friendly, and schema-validated. Added as the forward-path transport.

Both transports:
- accept the same `MoonConfig` / `FastifyAdapterConfig` shape (database, jwtSecret, port, host, addons, cors, onBoot, email)
- call `setupOrm()` in the constructor and `teardownOrm()` in `stop()`
- register addons via `registerModel(addon)` in the constructor
- run `checkDbConnection()` + `forge()` in `start()`
- emit the same built-in endpoints (`/auth/*`, `/rpc`, `/health/*`, `/db/status`, `/meta/models`, `/api/:model/:id`)
- expose identical route-registration APIs: `defineRoute()` from `@moon/server` and the `get/post/put/delete/proxy` methods on the server instance

The only architectural difference is the request lifecycle:
- NativeServer routes every request through a single `handleRequest()` dispatcher.
- FastifyAdapter registers routes directly on a Fastify instance and wraps handlers with `buildHandler()` for timing.

## 2. When to Use Which Transport

Use **NativeServer** when:
- the deployment targets a minimal container image and you want to avoid Fastify as a dependency.
- you need raw `http.IncomingMessage` / `http.ServerResponse` access inside middleware or custom handlers.
- you are migrating incrementally and want the proven baseline.

Use **FastifyAdapter** when:
- you need Fastify plugins (e.g., `@fastify/cors`, `@fastify/helmet`, `@fastify/rate-limit`).
- you want decorator-based shared request state.
- you are building a new service or greenfield deployment and want the faster, plugin-rich engine.

Do not run both transports on the same port. They are mutually exclusive runtime choices for a single process.

## 3. Addon Extension Rules

Addons extend the server through three stable mechanisms. All three work identically regardless of transport.

### 3.1 Models

Addons export model classes. The server registers them via the `addons` array in config:

```ts
import baseAddons from '@moon/base'
import witnessAddons from '@moon/witness'

const server = new NativeServer({
  database: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  addons: [...baseAddons.models, ...witnessAddons.models],
})
```

Models are domain-owned. The server never contains business rules, validation logic, or access permissions for a model.

### 3.2 Declarative Routes

Addons call `defineRoute()` at module load time. The route is appended to `globalRoutes` and picked up by whichever transport is active:

```ts
import { defineRoute } from '@moon/server'
import { getModel } from '@moon/orm'

defineRoute({
  method: 'GET',
  path: '/api/cab/summary',
  handler: async ({ env }) => {
    const Change = getModel('cab.change')
    // ...
  },
})
```

Declarative routes handle auth, CORS, query parsing, body parsing, and error mapping automatically.

### 3.3 Controller Classes

Addons may use the decorator-based controller pattern for grouped endpoints:

```ts
import { Controller, Get, registerController } from '@moon/server'

@Controller('/api/cab')
class CabController {
  @Get('/summary')
  async summary(req, res) {
    // ...
  }
}

registerController(new CabController())
```

Controller methods receive raw `IncomingMessage` / `ServerResponse`. This path is transport-agnostic because both transports ultimately resolve handlers from `globalRoutes`.

### 3.4 View Manifests

Addons export `views` mapping model names to `ViewManifest` objects. The server merges them via `registerViewManifests()`:

```ts
registerViewManifests({
  ...baseViews,
  ...witnessViews,
  ...cabViews,
})
```

View manifests are consumed by the meta introspection handlers (`/meta/models`, `/api/meta/model/:model`) and are transport-agnostic.

### 3.5 What Addons Must Not Do

- import `NativeServer` or `FastifyAdapter` directly. Addons depend only on `@moon/server` public exports.
- register routes by mutating `globalRoutes` after `server.start()`. Route registration must happen before boot.
- contain transport-specific logic (e.g., Fastify decorators, Node.js `http` module escapes) inside model code or `defineRoute()` handlers. If a transport escape hatch is required, place it in a dedicated handler module that imports from `@moon/server` utilities, not from the transport class.

## 4. Migration Path: NativeServer → FastifyAdapter

### Step 1: Update the import

```diff
- import { NativeServer } from '@moon/server'
+ import { FastifyAdapter } from '@moon/server'
```

### Step 2: Rename the config interface (optional)

`FastifyAdapterConfig` is a distinct type name but accepts the same fields as `MoonConfig`. If you use TypeScript and rely on the config type, update the reference:

```diff
- const server = new NativeServer({ ... })
+ const adapter = new FastifyAdapter({ ... })
```

### Step 3: Replace `server.use()` middleware

NativeServer exposes `use(mw)` for middleware chains. FastifyAdapter does not. Migrate middleware to Fastify plugins or wrap them into handlers registered via `adapter.get()` / `adapter.post()`.

If you have no custom middleware, this step is a no-op.

### Step 4: Replace `server.proxy()` calls

The proxy method signatures are identical. Rename the receiver:

```diff
- server.proxy('GET', '/api/external/nasa', url, opts, 'user')
+ adapter.proxy('GET', '/api/external/nasa', url, opts, 'user')
```

### Step 5: Replace `server.start()` / `server.stop()`

Method names are identical. No code change required beyond the receiver name.

### Step 6: Verify

Run the existing test suite:

```bash
pnpm --filter @moon/server test
```

All existing tests cover handler logic and `globalRoutes` behavior, so they pass unchanged under either transport. Add Fastify-specific tests only if you introduce Fastify plugins or decorators.

### Compatibility Checklist

| Feature | NativeServer | FastifyAdapter |
|---|---|---|
| Generic model REST | yes | yes |
| RPC | yes | yes |
| SSE | yes | yes |
| Auth endpoints | yes | yes |
| Health probes | yes | yes |
| OpenAPI / docs | yes | yes |
| `defineRoute()` | yes | yes |
| `registerController()` | yes | yes |
| `registerViewManifests()` | yes | yes |
| `server.proxy()` | yes | yes |
| `server.use()` middleware | yes | no |
| Fastify plugins | no | yes |
| Decorators | no | yes |
