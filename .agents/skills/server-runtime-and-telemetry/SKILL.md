---
name: server-runtime-and-telemetry
description: >-
  Use this skill when building or refactoring backend routes, Fastify adapters, Server-Sent Events (SSE) telemetry,
  RPC procedures, authentication lifecycles, and session revocation.
---

# Server Runtime & Realtime Telemetry Skill

Governs backend HTTP transport, Fastify adapters, declarative route builders, real-time Server-Sent Events (SSE), and cryptographic session management across `@moon/server` and `apps/api`.

## Core Laws & Patterns

### 1. Declarative Route Architecture (`defineRoute()`)
- Endpoints must declare schemas for query parameters, headers, request bodies, and responses:
  ```typescript
  import { defineRoute } from "@moon/server";
  import { z } from "zod";

  export const getUserRoute = defineRoute({
    method: "GET",
    path: "/api/v1/users/:id",
    params: z.object({ id: z.string().uuid() }),
    response: SuccessEnvelope(UserSchema),
    handler: async ({ params, ctx }) => {
      const user = await ctx.userService.findById(params.id);
      return user;
    },
  });
  ```
- Handlers must never call raw `res.writeHead()` or manual stringified responses. The Fastify adapter wraps returned payloads in standardized envelopes automatically.

### 2. Realtime SSE Telemetry (`broadcastTopic`)
- Real-time broadcasts flow through typed topics:
  ```typescript
  telemetryServer.broadcastTopic("celestial:ephemeris", {
    altitude: 12.4,
    azimuth: 285.1,
    phase: "waxing_crescent"
  });
  ```
- Client listeners automatically clean up listeners on disconnection.

### 3. Cryptographic Security & Immediate Revocation
- JWT payloads contain `tokenVersion` or `sessionId`.
- User password updates or logout events must increment the user's `tokenVersion` in database, instantly invalidating all active JWTs.
- Passwords and recovery secrets are hashed using Argon2/bcrypt; plaintext secrets are strictly prohibited.

## Development & Test Commands

```bash
# Start backend API service in development
pnpm dev:api

# Run server route and adapter tests
vitest run packages/moon-server

# Validate server boundary tests
pnpm test packages/moon-server/tests
```

## Review Checklist

- [ ] All input parameters and payloads are validated via Zod schemas before handler execution.
- [ ] Authentication middleware properly inspects Bearer token and verifies `tokenVersion`.
- [ ] SSE streams handle client disconnect without leaking memory or file descriptors.
- [ ] CORS headers and rate-limiting middleware are enabled on all public routes.
