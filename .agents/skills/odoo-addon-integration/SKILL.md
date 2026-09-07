---
name: odoo-addon-integration
description: >-
  Use this skill when developing, auditing, or maintaining MoonWitness Odoo 19 addons, models, manifests, icons, and database migrations.
---

# Odoo 19 Addon Integration Skill

Provides runbooks and conventions for managing MoonWitness addons within the local Odoo 19 Docker environment.

## Guidelines

1. **Manifest and Architecture Standard**:
   - Every custom addon resides in `odoo19/addons/<addon_name>`.
   - Manifest `__manifest__.py` must contain:
     - Canonical name, version (`19.0.x.x.x`), summary, description, author (`ArsyBelovedLabs` / `MoonWitness`), license (`LGPL-3`).
     - Declared dependencies (`moon_base`, `mail`, `project`, etc.).
   - Include enterprise icon at `static/description/icon.png` (128x128 RGBA PNG with MoonWitness dark slate container and semantic color accents).

2. **ORM Compatibility in Odoo 19**:
   - Field types must match related target fields exactly (e.g. `date_deadline` in `project.task` is `fields.Datetime`, not `fields.Date`).
   - Use standard `models.Constraint` rather than deprecated `_sql_constraints` for custom SQL constraints.

3. **Database & Registry Synchronization**:
   - Update module registry in running Odoo container:
     ```bash
     docker exec odoo19-odoo19-1 python3 -c "import odoo; from odoo.tools import config; config.parse_config(['-c', '/etc/odoo/odoo.conf', '--db_host=db', '--db_port=5432', '--db_user=odoo', '--db_password=odoo19@2025', '-d', 'moonwitness', '-u', '<addon_name>']); from odoo.modules.registry import Registry; Registry.new('moonwitness', update_module=True)"
     ```
   - Restart container cleanly when assets or Python files are modified:
     ```bash
     docker restart odoo19-odoo19-1
     ```
