---
name: fastify-declarative-route-builder
description: >-
  Use this skill when defining Fastify HTTP route handlers, typed Zod request/response schema envelopes,
  automatic OpenAPI specification derivation, and structured error responses.
---

# Fastify Declarative Route Builder (Subatomic Skill)

Governs the construction of backend REST endpoints in `apps/api` and `@moon/server` using declarative Zod contract validation and type-safe routing.

## Declarative Route Pattern

```typescript
import { z } from 'zod'
import { defineRoute } from '@moon/server'

export const getHilalObservationRoute = defineRoute({
  method: 'GET',
  path: '/api/v1/celestial/hilal/:locationId',
  summary: 'Retrieve real-time Hilal crescent parameters',
  tags: ['Celestial'],
  
  // Parameter & Query Validation Schemas
  params: z.object({
    locationId: z.string().min(1),
  }),
  query: z.object({
    date: z.string().date().optional(),
    elevation: z.coerce.number().default(0),
  }),
  
  // Standardized Response Envelope Schema
  response: {
    200: z.object({
      success: z.literal(true),
      data: z.object({
        arcv: z.number(),
        arcl: z.number(),
        crescentWidth: z.number(),
        visibilityClassification: z.enum(['A', 'B', 'C', 'D', 'E']),
      }),
      meta: z.object({
        timestamp: z.string(),
      }),
    }),
    400: z.object({
      success: z.literal(false),
      error: z.object({
        code: z.string(),
        message: z.string(),
      }),
    }),
  },

  handler: async (req, reply) => {
    // req.params and req.query are strictly typed and runtime validated
    const { locationId } = req.params
    const { date, elevation } = req.query
    return {
      success: true,
      data: {
        arcv: 7.2,
        arcl: 10.4,
        crescentWidth: 0.85,
        visibilityClassification: 'A',
      },
      meta: { timestamp: new Date().toISOString() },
    }
  },
})
```

## Error Envelope Invariants
All error responses MUST conform to `@moon/protocol` format:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Invalid date format",
    "details": [...]
  }
}
```

## Canonical Source Files
- `packages/moon-server/src/route-builder.ts`
- `packages/moon-server/src/fastify-adapter.ts`
- `apps/api/src/`

## Verification Command
```bash
pnpm --filter=@moon/server test
```
