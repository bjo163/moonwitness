# ◈ @moon/server

Version: package version from `package.json`  
Status: **Canonical MoonWitness transport boundary**

`@moon/server` provides the public Moon server abstraction, authentication/session transport, bounded REST, explicit RPC procedures, SSE, proxy routing, OpenAPI/meta endpoints, and optional OpenTelemetry instrumentation.

## Architecture

```text
apps/api
  -> NativeServer (stable public Moon API)
  -> FastifyAdapter (internal transport implementation)
  -> Fastify 5
  -> Node.js HTTP
```

Fastify is the **only canonical production routing engine**. Domain addons do not import Fastify for ordinary route registration; they depend on Moon-owned contracts such as `defineRoute()` and models/services.

## Core responsibilities

- **Fastify 5 transport lifecycle** behind `NativeServer`.
- **Authentication & sessions** with canonical JWT/session validation.
- **Generic bounded REST** for model CRUD/query behavior.
- **Explicit RPC registry**: only `defineProcedure()` entries are remotely callable; input/output are runtime validated.
- **Realtime / SSE** with session revalidation, cleanup, and shutdown draining.
- **Moon middleware compatibility** including `@moon/performance`.
- **OpenAPI & metadata** from canonical protocol/model registries.
- **OpenTelemetry** initialization/shutdown at the transport boundary when enabled.

## Usage

```ts
import { NativeServer } from '@moon/server'
import baseAddons from '@moon/base'
import witnessAddons from '@moon/witness'

const server = new NativeServer({
  port: Number(process.env.API_PORT || 4000),
  database: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  addons: [...baseAddons.models, ...witnessAddons.models],
})

await server.start()
```

Register ordinary addon routes before startup:

```ts
import { defineRoute } from '@moon/server'

defineRoute({
  method: 'GET',
  path: '/api/example/status',
  auth: 'user',
  handler: async () => ({ ok: true }),
})
```

Define RPC only through an explicit procedure contract:

```ts
import { defineProcedure } from '@moon/server'
import { z } from 'zod'

defineProcedure({
  name: 'example.echo',
  description: 'Echo one bounded value',
  input: z.object({
    model: z.string(),
    args: z.array(z.string()).length(1),
    kwargs: z.record(z.unknown()),
  }),
  output: z.object({ echo: z.string() }),
  handler: async (_ctx, input) => ({ echo: input.args[0]! }),
})
```

## Transport rules

- Addons must not depend directly on Fastify types for normal routes.
- Register Moon routes/middleware before `server.start()`.
- Do not add a second HTTP/router implementation.
- Raw Node request/response access is a compatibility escape hatch owned by `@moon/server`.
- Production schema changes use migration/install/verify commands, not application startup.
- Never expose arbitrary model/static methods through RPC.

## Verification

```bash
pnpm --filter @moon/server build
pnpm --filter @moon/server test
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

See `docs/FASTIFY-MIGRATION.md` and `docs/OPENTELEMETRY.md` for the canonical transport and observability details.
