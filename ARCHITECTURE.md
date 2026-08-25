# MoonWitness Architecture

Status: **Canonical** for backend/platform architecture.

MoonWitness follows a deliberately small mental model:

```text
APP
 |
 v
SERVER
 |
 v
ORM
 |
 v
POSTGRESQL

ADDONS
 |- base
 |- witness
 |- cab
 |- mizan
 |- khidra
 `- ...
```

## Core rule: Model First

New business capabilities start from a model. Do not begin by creating a repository, service layer, command bus, or database access path unless a concrete need proves it is necessary.

Canonical write path:

```text
HTTP / RPC / Worker
        |
        v
     Model
        |
        v
    Moon ORM
        |
        v
  PostgreSQL transaction
```

There must be one canonical persistence path. Application code must not create alternate database write paths around Moon ORM.

## Layer responsibilities

### `apps/*`

Applications compose the system. They may configure servers, load addons, and provide user interfaces. They must not become the home of domain business logic.

### `packages/moon-server`

Transport/runtime boundary only:

- HTTP routing
- authentication/session handling
- request context creation
- REST and RPC transport
- SSE/realtime transport
- middleware
- OpenAPI and metadata endpoints
- HTTP error mapping

Business rules belong to models/addons, not server handlers.

### `packages/moon-orm`

The canonical data and model runtime:

- `Vertex` model base
- fields and relations
- `Recordset`
- `QueryBuilder`
- context (`Ctx`)
- model registry
- transactions
- validation
- access rights and record rules
- schema synchronization/migrations
- lifecycle hooks

Security and transaction behavior must be safe by default.

### Domain addons

Each domain is a self-contained addon, for example `moon-cab`, `moon-mizan`, and `moon-witness`.

An addon owns its domain models and may expose special routes only when generic model REST/RPC is insufficient.

### PostgreSQL

PostgreSQL is infrastructure, not the application programming model. Direct SQL/Knex access from domain addons is discouraged and requires a documented reason. Ordinary domain reads/writes must use Moon ORM.

## Dependency direction

Preferred direction:

```text
apps
  -> moon-server
  -> domain addons
       -> moon-orm
       -> explicitly declared addon dependencies

moon-server -> moon-orm
moon-orm    -> database driver
```

Avoid cyclic addon dependencies.

## Hard architecture rules

1. **MODEL FIRST** — business state is modeled before transport/UI code.
2. **ONE ORM** — Moon ORM is the canonical persistence path.
3. **SERVER IS TRANSPORT** — no domain policy in generic server handlers.
4. **ADDON OWNERSHIP** — each domain owns its models and behavior.
5. **TRANSACTION BY DEFAULT** — a business write must be atomic.
6. **SECURITY FAILS CLOSED** — missing or invalid permission configuration must not silently grant access.
7. **AUDITABLE MUTATIONS** — important mutations must be traceable as the platform hardening work lands.
8. **NO ARBITRARY RULE EXECUTION** — persisted security rules must be parsed/evaluated as controlled data, never arbitrary JavaScript.
9. **SIMPLE BEFORE ABSTRACT** — add abstractions only after real repeated use cases justify them.
10. **ONE CONCEPT, ONE IMPLEMENTATION** — remove duplicate mechanisms instead of keeping multiple equivalent paths.

## Generic model API

The server may expose generic model operations such as:

```text
GET    /api/:model
POST   /api/:model
GET    /api/:model/:id
PUT    /api/:model/:id
DELETE /api/:model/:id
POST   /rpc
GET    /meta/models
```

Domain-specific endpoints are allowed for operations that are genuinely not ordinary model CRUD/query behavior.

## Schema policy

Model definitions are the source of schema intent. Development schema synchronization may be automatic, but production schema changes must be reviewable and deterministic. Production must not perform unsafe auto-DDL at application startup.

## UI relationship

UI consumes model/API contracts. UI may control presentation and interaction state, but it does not define authoritative domain rules, permissions, or workflow constraints.

## Historical documents

`FOUNDATION-ROADMAP.md` and other existing design documents remain useful historical/detail references. When they conflict with this file on the platform shape, this file is the canonical architecture direction.