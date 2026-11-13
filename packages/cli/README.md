# ◈ @workspace/cli — MoonWitness CLI Toolkit

Version: 0.0.1

## Overview

Command-line interface for MoonWitness operations: database migrations, bootstrap, production checks, and development utilities.

## Installation

\`\`\`bash
pnpm add @workspace/cli
\`\`\`

## Usage

\`\`\`bash
# Production health check
pnpm cli:mw prod-check

# Database operations
pnpm cli:mw db:install
pnpm cli:mw db:verify
pnpm cli:mw db:migrate

# Development
pnpm cli:mw dev:up
pnpm cli:mw dev:down
\`\`\`

## Commands

| Command | Description |
|---------|-------------|
| \`prod-check\` | Full production readiness verification |
| \`db:install\` | Install schema and seed data |
| \`db:verify\` | Verify schema integrity |
| \`db:migrate\` | Run pending migrations |
| \`dev:up\` | Start development services |
| \`dev:down\` | Stop development services |

## Verification

\`\`\`bash
# Run tests
pnpm --filter=@workspace/cli test

# Type check
pnpm --filter=@workspace/cli typecheck
\`\`\`

## Architecture

- Entry point: \`src/mw.mjs\`
- Tests: \`tests/\`
- Uses @moon/orm, @moon/base, @moon/protocol, @moon/client

