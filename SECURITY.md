# Security Policy

Report suspected vulnerabilities privately to the repository owner. Do not open a public issue
with exploit details, access tokens, credentials, database dumps, or personally identifying data.

Include a concise reproduction, affected version, impact, and any suggested mitigation. Reports
are acknowledged as soon as practical and coordinated fixes are preferred before disclosure.

Operational requirements:

- Set a unique `JWT_SECRET` and production bootstrap credentials outside source control.
- For Docker Compose production deployments, copy `.env.production.example` to
  `.env.production`, replace every `REPLACE_WITH_*` value, and deploy only through
  `scripts/deploy-prod.sh` or `scripts/deploy-prod.ps1`. The stack deliberately
  refuses to start when required database, Redis, or JWT secrets are absent.
- PostgreSQL and Redis are intentionally not host-published. Reach them only from
  the API container or through a separately authenticated, temporary maintenance path.
- Apply migrations through `pnpm --filter api db:migrate` or `db:install`; do not rely on startup DDL.
- Back up PostgreSQL before production migrations. Validate restoration in a separate environment
  using `pg_restore`, then run `pnpm --filter api db:verify`.
- Keep `.env` files, backups, and runtime logs out of Git.
