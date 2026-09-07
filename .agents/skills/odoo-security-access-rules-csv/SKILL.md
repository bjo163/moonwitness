---
name: odoo-security-access-rules-csv
description: >-
  Use this skill when defining or auditing ir.model.access.csv permission bitmasks,
  group assignments, and ir.rule record-level domain filters in Odoo 19 addons.
---

# Odoo Security Access Rules & CSV (Subatomic Skill)

Governs Model Access Control Lists (ACLs) and Record Rules (`ir.rule`) in Odoo 19 addons (`odoo19/addons/*/security/`).

## `ir.model.access.csv` Structure

File: `security/ir.model.access.csv`
```csv
id,name,model_id:id,group_id:id,perm_read,perm_write,perm_create,perm_unlink
access_moon_myth_user,moon.myth.user,model_moon_myth,base.group_user,1,0,0,0
access_moon_myth_manager,moon.myth.manager,model_moon_myth,base.group_system,1,1,1,1
access_moon_disaster_user,moon.disaster.user,model_moon_disaster,base.group_user,1,0,0,0
access_moon_disaster_manager,moon.disaster.manager,model_moon_disaster,base.group_system,1,1,1,1
```

### Permission Bitmask Columns
- `perm_read`: `1` = allowed to read/search records; `0` = forbidden.
- `perm_write`: `1` = allowed to edit fields; `0` = forbidden.
- `perm_create`: `1` = allowed to create new records; `0` = forbidden.
- `perm_unlink`: `1` = allowed to delete records; `0` = forbidden.

## Record Rules (`ir.rule`) for Row-Level Security
In XML:
```xml
<record id="rule_moon_myth_published_public" model="ir.rule">
  <field name="name">Public Only Sees Published Myths</field>
  <field name="model_id" ref="model_moon_myth"/>
  <field name="domain_force">[('state', '=', 'published')]</field>
  <field name="groups" eval="[(4, ref('base.group_portal'))]"/>
  <field name="perm_read" eval="True"/>
  <field name="perm_write" eval="False"/>
  <field name="perm_create" eval="False"/>
  <field name="perm_unlink" eval="False"/>
</record>
```

## Canonical Source Files
- `odoo19/addons/moon_myth/security/`
- `odoo19/addons/moon_witness/security/`
- `odoo19/addons/moon_base/security/`

## Verification Command
```bash
docker exec odoo19-odoo19-1 odoo -d moonwitness_db -u moon_myth --stop-after-init
```
