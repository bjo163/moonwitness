---
name: odoo-jsonrpc-bidirectional-synchronizer
description: >-
  Use this skill when auditing or implementing JSON-RPC 2.0 payload marshalling, authentication cookie handling,
  model method execution (execute_kw), and bidirectional sync between Next.js apps and Odoo 19.
---

# Odoo JSON-RPC Bidirectional Synchronizer (Subatomic Skill)

Governs the network transport protocol connecting the TypeScript Next.js applications (`apps/command-center`, `apps/web`) to the local Odoo 19 backend via JSON-RPC 2.0 in `@moon/odoo-bridge`.

## JSON-RPC 2.0 Protocol Envelope

Request wire payload to `/jsonrpc`:
```json
{
  "jsonrpc": "2.0",
  "method": "call",
  "params": {
    "service": "object",
    "method": "execute_kw",
    "args": [
      "moonwitness_db",
      2,
      "admin_api_token",
      "moon.myth.correlation",
      "search_read",
      [[["proximity_score", ">=", 70]]],
      {
        "fields": ["name", "rel_code", "proximity_score", "repository_causality_score", "status"],
        "limit": 50
      }
    ]
  },
  "id": 1788750001
}
```

Response wire payload:
```json
{
  "jsonrpc": "2.0",
  "id": 1788750001,
  "result": [
    {
      "id": 1,
      "name": "REL-2026-08-001 — Pelabuhan Ratu Ritual vs M6.2 Tectonic Quake",
      "rel_code": "REL-2026-08-001",
      "proximity_score": 85,
      "repository_causality_score": 0,
      "status": "published"
    }
  ]
}
```

## Error Handling & Exception Unwrapping
When Odoo throws a server exception, unwrap the Python traceback into structured TypeScript errors:
```typescript
if (response.data.error) {
  const odooError = response.data.error.data
  throw new OdooRPCError({
    code: response.data.error.code,
    message: odooError.message || response.data.error.message,
    pythonTraceback: odooError.debug,
  })
}
```

## Canonical Source Files
- `packages/moon-odoo-bridge/src/`
- `apps/command-center/src/lib/odoo-client.ts`

## Verification Command
```bash
pnpm --filter=@moon/odoo-bridge test
```
