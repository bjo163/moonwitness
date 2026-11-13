 # Workspace Packages Reference
 
 ## @workspace/* — Shared Frontend Primitives
 
 | Package | Description |
 |---------|-------------|
 | `@workspace/ui` | Enterprise design system (shadcn/ui, Tailwind v4, semantic tokens) |
 | `@workspace/types` | Universal TypeScript types |
 | `@workspace/state` | Shared state management |
 | `@workspace/hooks` | Shared React hooks |
 | `@workspace/error` | Error envelopes and handling |
 | `@workspace/i18n` | Internationalization |
 | `@workspace/auto-avatar` | Avatar generation |
 
 ## @moon/* — Domain Packages
 
 | Package | Domain | Description |
 |---------|--------|-------------|
 | `@moon/base` | Platform | Core models (user, org, role, grant, rule, metric, session) |
 | `@moon/witness` | Knowledge | Quran, Hadith, lexical roots, knowledge graph |
 | `@moon/mizan` | Assessment | Revelation–Mizan ethical evaluation engine |
 | `@moon/project` | Operations | Project management, tasks, sprints |
 | `@moon/crm` | Business | Customer relationship, leads, pipeline |
 | `@moon/helpdesk` | Support | Tickets, SLA, escalation |
 | `@moon/account` | Finance | Double-entry ledger, journal entries |
 | `@moon/stock` | Inventory | FIFO valuation, warehouse moves |
 | `@moon/product` | Catalog | Product variants, pricing, BOM |
 | `@moon/mail` | Communication | Email templates, queues, tracking |
 | `@moon/geo` | Geophysical | Seismic events, coordinates, distance |
 | `@moon/khidra` | AI Assistant | Conversational wisdom assistant |
 | `@moon/shootgun` | Operations | Tactical operations, action logs |
 | `@moon/performance` | Telemetry | System metrics, query tracking |
 | `@moon/cron` | Scheduling | Job scheduling, cron expressions |
 | `@moon/cab` | Governance | Change Advisory Board |
 | `@moon/compute` | Math Engine | Astronomical, prayer times, Qibla, Hilal |
 | `@moon/protocol` | Contracts | API contracts, Zod schemas, OpenAPI |
 | `@moon/server` | Transport | Fastify server, REST/RPC, SSE, auth |
 | `@moon/orm` | Persistence | Vertex ORM, migrations, RLS |
 | `@moon/client` | Client SDK | Type-safe API client, hooks |
 | `@moon/cache` | Caching | Multi-backend cache manager |
 | `@moon/validation` | Validation | Schema validation, middleware |
 
 ## Apps
 
 | App | Port | Description |
 |-----|------|-------------|
 | `apps/web` | 3000 | Public portal |
 | `apps/command-center` | 3001 | Admin portal |
 | `apps/api` | 4000 | Backend API (Fastify) |
