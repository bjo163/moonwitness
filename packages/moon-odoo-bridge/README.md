# ◈ @moon/odoo-bridge

Version: package version from `package.json`  
Status: **Canonical Odoo integration boundary**

Integration boundary for Odoo-related transport and domain adapters.

This package owns typed bridge interfaces and adapter helpers only. Application
views, UI primitives, persistence, authorization, and business workflows remain
owned by their canonical application or domain packages.

## Usage / Quickstart

Import the typed bridge entrypoint from `@moon/odoo-bridge` and keep transport
and domain orchestration in the owning application or service package.

## Verification

Run the package typecheck from the repository root:

```bash
pnpm --filter @moon/odoo-bridge typecheck
```
