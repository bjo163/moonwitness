# @moon/server

> **Transport & Runtime Boundary Layer for MoonWitness OS**

`@moon/server` provides HTTP, RPC, SSE, authentication, and routing infrastructure for MoonWitness applications.

---

## Core Responsibilities

- **HTTP & Fastify / Native Server Transport**: Lightweight, high-throughput request dispatching.
- **Authentication & Sessions**: Secure JWT verification, user context resolution, and session management.
- **Generic Model REST & RPC**: Standardized endpoints for model CRUD (`/api/:model`, `/rpc`).
- **Realtime / SSE**: Server-Sent Events lifecycle and telemetry broadcasts.
- **Middleware & Security**: Body parsing limits, CORS, rate limiting, and HTTP error normalization.
- **OpenAPI & Metadata**: Dynamic reflection endpoints (`/meta/models`).

---

## Architecture Principle

`@moon/server` is strictly a **transport boundary**. All domain rules, validation logic, and access permissions reside within models and addons (`@moon/base`, `@moon/witness`, `@moon/orm`), never in server request handlers.

---

## Usage

```typescript
import { NativeServer } from '@moon/server'
import baseAddons from '@moon/base'
import witnessAddons from '@moon/witness'

const server = new NativeServer({
  port: Number(process.env.API_PORT || 4000),
  database: process.env.DATABASE_URL || 'postgres://localhost/moonwitness',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  addons: [...baseAddons.models, ...witnessAddons.models]
})

server.listen(() => {
  console.log('MoonWitness server running on port', server.port)
})
```

---

## License

MIT
