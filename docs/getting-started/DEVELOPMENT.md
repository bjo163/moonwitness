 # Development Setup
 
 ## Prerequisites
 
 - Node.js 22 (enforced via CI and .nvmrc)
 - pnpm 9+
 - Docker and Docker Compose
 - PostgreSQL 18 + pgvector 0.8.7 (via Docker)
 - Redis 7
 
 ## Quick Start
 
 ```
 # Clone repository
 git clone https://github.com/bjo163/moonwitness.git
 cd moonwitness
 
 # Install dependencies
 pnpm install --frozen-lockfile
 
 # Start development services
 docker compose -f docker-compose.dev.yml up -d
 
 # Run database migrations
 pnpm --filter=api db:install
 
 # Start all apps in development mode
 pnpm dev
 ```
 
 ## Available Scripts
 
 | Command | Description |
 |---------|-------------|
 | `pnpm dev` | Start all apps (web, command-center, api) |
 | `pnpm build` | Build all packages and apps |
 | `pnpm test` | Run all tests |
 | `pnpm lint` | Run ESLint |
 | `pnpm typecheck` | Run TypeScript type checking |
 | `pnpm audit:rules` | Run constitutional audit |
 | `pnpm certify:postgres` | Run PostgreSQL certification locally |
 
 ## Environment Variables
 
 Copy `.env.example` to `.env.local` and configure:
 
 ```
 cp .env.example .env.local
 ```
 
 Required variables:
 - `DATABASE_URL` — PostgreSQL connection string
 - `REDIS_URL` — Redis connection string
 - `JWT_SECRET` — JWT signing secret
 - `MOON_API_URL` — Internal API URL for server-to-server communication
 
 ## Project Structure
 
 ```
 moonwitness/
 ├── apps/
 │   ├── web/              # Public portal (Next.js, port 3000)
 │   ├── command-center/   # Admin portal (Next.js, port 3001)
 │   └── api/              # Backend API (Fastify, port 4000)
 ├── packages/
 │   ├── moon-*            # Domain packages (@moon/*)
 │   └── workspace/        # Shared primitives (@workspace/*)
 ├── contracts/            # API contracts and OpenAPI spec
 ├── scripts/              # Build, deploy, and utility scripts
 └── docs/                 # Documentation (this site)
 ```
 
 ## Running Tests
 
 ```
 # All tests
 pnpm test
 
 # Specific package
 pnpm --filter=moon-witness test
 
 # Watch mode
 pnpm test:watch
 ```
 
 ## Database Operations
 
 ```
 # Install schema and seed
 pnpm --filter=api db:install
 
 # Verify schema
 pnpm --filter=api db:verify
 
 # Generate migration
 pnpm --filter=api db:migrate:make <name>
 
 # Run migrations
 pnpm --filter=api db:migrate
 ```
