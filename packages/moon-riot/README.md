# ◈ @moon/riot

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @moon/riot                                              ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  PKG VERSION:    0.0.1                                                   ║
║  CLASSIFICATION: TIER 2 — INFRASTRUCTURE CONNECTOR CORE                  ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🌌 Overview
`@moon/riot` is the generic connector core for external infrastructure providers. It provides a typed fetch-based HTTP client with bearer auth, timeouts, and typed errors, plus the shared provider contract that concrete connectors (such as `@moon/riot-coolify`) implement. It holds no provider-specific logic and no credentials.

---

## 📦 Public API Surface

| Class / Helper | Parameters | Description |
|---|---|---|
| `createHttpClient()` | `config: HttpClientConfig` | JSON HTTP client with bearer auth, query building, and timeout |
| `RiotError` | `message, options?` | Base connector error |
| `RiotHttpError` | `status, url, body` | Non-2xx response with parsed body |
| `RiotTimeoutError` | `url, timeoutMs` | Request exceeded its timeout |
| `ConnectorProvider` | type | Provider contract (`id`, `kind`) |
| `RiotConfig` | type | `baseUrl` + `token` configuration shape |

---

## 🚀 Usage

```typescript
import { createHttpClient } from "@moon/riot"

const http = createHttpClient({
  baseUrl: process.env.PROVIDER_BASE_URL!,
  token: process.env.PROVIDER_TOKEN!,
  timeoutMs: 30_000,
})

const projects = await http.get<Project[]>("/api/v1/projects")
```

---

## 🛡️ Architectural Boundaries
- Belongs to **Tier 2 (Core Infrastructure)**.
- Provider packages (e.g. `@moon/riot-coolify`) build on this core; applications consume providers, not raw HTTP.
- Tokens are supplied via configuration or environment; never hardcoded.

---

## 🧪 Verification
```bash
pnpm --filter @moon/riot typecheck
pnpm vitest run packages/moon-riot
```