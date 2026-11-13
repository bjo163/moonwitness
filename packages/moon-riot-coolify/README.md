# ◈ @moon/riot-coolify

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @moon/riot-coolify                                      ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  PKG VERSION:    0.0.1                                                   ║
║  CLASSIFICATION: TIER 2 — COOLIFY DEPLOYMENT CONNECTOR                   ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🌌 Overview
`@moon/riot-coolify` is the Coolify (self-hosted, v4.5 API) provider built on `@moon/riot`. It covers read operations (projects, servers, resources, deployments, logs), deployment triggering and polling, power actions, and environment variable management. It encodes the verified quirks of the v4.5 API and deliberately exposes no delete endpoints, because deleting a Coolify resource destroys its containers and database volumes.

---

## 📦 Public API Surface

| Method | Description |
|---|---|
| `listProjects()` / `getProject(uuid)` | Project records |
| `listServers()` / `listServerResources(uuid)` | Servers and their resources (bare array payload) |
| `listResources(type)` / `getResource(type, uuid)` | Applications, services, databases; secrets stripped |
| `getApplication(uuid)` | Application detail, allowlisted fields only (`sentinel_token` never leaves the connector) |
| `deploy(uuid, { force? })` | `POST /api/v1/deploy?uuid=…` — returns `{ deploymentUuid }` |
| `getDeployment(uuid)` | Deployment record with the JSON-string `logs` field parsed into entries |
| `waitForDeployment(uuid, opts?)` | Polls until a terminal status; injectable sleep for tests |
| `power(type, uuid, action)` | start / stop / restart |
| `listEnvs(uuid)` / `updateEnv(uuid, env)` | Env vars; `isPreview` selects the preview row (every key has two rows) |
| `getApplicationLogs(uuid, lines?)` | Runtime container logs |

---

## 🚀 Usage

```typescript
import { createCoolifyProvider } from "@moon/riot-coolify"

// Config falls back to COOLIFY_BASE_URL and COOLIFY_TOKEN.
const coolify = createCoolifyProvider()

const { deploymentUuid } = await coolify.deploy(applicationUuid)
const deployment = await coolify.waitForDeployment(deploymentUuid)
if (deployment.status !== "finished") {
  console.error(deployment.logs.map((entry) => entry.output).join("\n"))
}
```

---

## 🛡️ Architectural Boundaries
- Belongs to **Tier 2 (Core Infrastructure)**; depends only on `@moon/riot`.
- Server-side only; intended for `apps/api` services and operational tooling.
- No delete endpoints. Deploy and power actions change production state — callers must confirm with the operator first.
- Credentials come from configuration or environment; never hardcoded or logged.

---

## 🧪 Verification
```bash
pnpm --filter @moon/riot-coolify typecheck
pnpm vitest run packages/moon-riot-coolify
```