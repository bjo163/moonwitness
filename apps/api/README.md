# MoonWitness API Service (`apps/api`)

The primary backend service for MoonWitness OS, powered by `@moon/server`, `@moon/orm`, and core domain addons (`@moon/witness`, `@moon/base`, `@moon/mizan`, `@moon/khidra`, `@moon/cab`).

---

## Commands

```bash
# Start development server with live watch
pnpm dev

# Build TypeScript output
pnpm build

# Start production server
pnpm start

# Run PostgreSQL graph certification suite
pnpm run certify:witness-graph-pg
```

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgres://postgres:password@localhost:5432/moonwitness` |
| `JWT_SECRET` | Secret key for signing and verifying tokens | `your-secret-key` |
| `API_PORT` | Port for the HTTP API | `4000` |
| `BOOTSTRAP_ADMIN_EMAIL` | Superuser bootstrap email | `admin@moonwitness.org` |
| `BOOTSTRAP_ADMIN_PASSWORD` | Superuser bootstrap password (required in production) | Set a unique secret |
