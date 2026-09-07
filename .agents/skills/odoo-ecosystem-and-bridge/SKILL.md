---
name: odoo-ecosystem-and-bridge
description: >-
  Use this skill when developing, auditing, or maintaining MoonWitness Odoo 19 addons, model schemas,
  XML views, security access rules, enterprise icons, and the bidirectional TypeScript-to-Odoo bridge.
---

# Odoo 19 Ecosystem & Integration Bridge Skill

Governs custom Odoo 19 addons, PostgreSQL 18-pgvector persistence, and the bidirectional RPC synchronization bridge (`@moon/odoo-bridge`).

## Architecture & Directory Layout

```text
odoo19/
├── docker-compose.yml           # PostgreSQL 18 (pgvector) + Odoo 19 (Port 10019/20019)
├── addons/                      # Custom MoonWitness enterprise modules
│   ├── moon_base/               # Shared technical utilities & external identity mapping
│   ├── moon_witness/            # Canonical corpus, passages, sources, provenance
│   ├── moon_mizan/              # Revelation assessment & jurisprudence workflow
│   ├── moon_disaster/           # Geophysical hazard observatory (BMKG/BNPB)
│   ├── moon_myth/               # Counter-mythos observatory & correlation engine
│   └── moon_project/            # Project & task compatibility extension
├── enterprise-addons/
│   └── moonwitness_ai/          # Custom AI agent, themed chat, and prompt shortcuts
└── etc/                         # odoo.conf and persistent server configs
```

## Mandatory Addon Conventions

1. **Manifest Contract (`__manifest__.py`)**:
   - Must specify: `name`, `version` (`19.0.1.x.x`), `summary`, `category` (`Knowledge` / `Technical` / `Services/Project`), `author` (`ArsyBelovedLabs` or `MoonWitness`), `license` (`LGPL-3`), `depends`, `data`, `installable: True`.
2. **Enterprise Icon Specification**:
   - Location: `static/description/icon.png`.
   - Dimensions: 128x128 RGBA PNG.
   - Design: MoonWitness dark slate background `(15, 23, 42)` with rounded 28px border container and semantic domain accent.
   - Root Menu: Register `web_icon="<addon_name>,static/description/icon.png"` in the top-level menu XML.
3. **ORM Compatibility in Odoo 19**:
   - Inherited related fields must strictly match parent field types (e.g. `project.task.date_deadline` is `datetime`).
   - Use `models.Constraint` instead of legacy `_sql_constraints`.

## The `@moon/odoo-bridge` TypeScript Client

Connects Next.js web applications and API services directly to Odoo via authenticated JSON-RPC:
```typescript
import { OdooBridgeClient } from "@moon/odoo-bridge";

const odoo = new OdooBridgeClient({
  url: process.env.ODOO_URL || "http://localhost:10019",
  db: "moonwitness",
  username: "admin",
  apiKey: process.env.ODOO_API_KEY
});

const sources = await odoo.searchRead("moon.witness.source", [], ["name", "stable_key"]);
```

## Operational Runbook

```bash
# Update Odoo module registry in running container
docker exec odoo19-odoo19-1 python3 -c "import odoo; from odoo.tools import config; config.parse_config(['-c', '/etc/odoo/odoo.conf', '--db_host=db', '--db_port=5432', '--db_user=odoo', '--db_password=odoo19@2025', '-d', 'moonwitness', '-u', 'moon_witness,moon_mizan,moon_disaster,moon_myth,moon_project']); from odoo.modules.registry import Registry; Registry.new('moonwitness', update_module=True)"

# Restart Odoo server container cleanly
docker restart odoo19-odoo19-1

# View server runtime logs
docker logs --tail 50 odoo19-odoo19-1
```
