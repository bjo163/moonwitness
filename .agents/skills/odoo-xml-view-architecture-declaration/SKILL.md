---
name: odoo-xml-view-architecture-declaration
description: >-
  Use this skill when authoring, auditing, or refactoring Odoo 19 XML view definitions
  (form, list/tree, kanban, search, pivot, graph), xpath extensions, and action window declarations.
---

# Odoo 19 XML View Architecture (Subatomic Skill)

Governs the authoring and extension of user interfaces inside Odoo 19 addons (`odoo19/addons/*`) using declarative XML syntax.

## Canonical View Definition Structure

```xml
<?xml version="1.0" encoding="utf-8"?>
<odoo>
  <!-- Form View Declaration -->
  <record id="view_moon_myth_form" model="ir.ui.view">
    <field name="name">moon.myth.form</field>
    <field name="model">moon.myth</field>
    <field name="arch" type="xml">
      <form string="Mythological Narrative Observation">
        <header>
          <button name="action_ai_review" string="Analyze with AI" type="object" class="oe_highlight" invisible="state != 'draft'"/>
          <button name="action_publish" string="Certify Finding" type="object" invisible="state == 'published'"/>
          <field name="state" widget="statusbar" statusbar_visible="draft,reviewed,published"/>
        </header>
        <sheet>
          <div class="oe_title">
            <h1><field name="name" placeholder="e.g. Nyai Roro Kidul Green Attire Myth"/></h1>
          </div>
          <group>
            <group string="Geographic Origin">
              <field name="region_id"/>
              <field name="latitude"/>
              <field name="longitude"/>
            </group>
            <group string="Theological Assessment">
              <field name="tauhid_classification"/>
              <field name="superstition_risk_score" widget="progressbar"/>
            </group>
          </group>
          <notebook>
            <page string="Field Observations" name="observations">
              <field name="observation_ids"/>
            </page>
            <page string="Scientific Causality Reviews" name="correlations">
              <field name="correlation_ids"/>
            </page>
          </notebook>
        </sheet>
        <chatter/>
      </form>
    </field>
  </record>
</odoo>
```

## View Invariants in Odoo 19
1. **Odoo 19 `<list>` vs `<tree>`**: In Odoo 19, standard tabular views use `<list string="...">` (though `<tree>` is maintained for backwards compatibility).
2. **Dynamic Invisibility Syntax**: Always use `invisible="field == 'value'"` instead of deprecated `attrs="{'invisible': ...}"`.
3. **Enterprise Chatter**: Always append `<chatter/>` (not `<div class="oe_chatter">`) at the bottom of the form view.

## Canonical Source Files
- `odoo19/addons/moon_myth/views/`
- `odoo19/addons/moon_witness/views/`
- `odoo19/addons/moon_project/views/`

## Verification Command
```bash
docker exec odoo19-odoo19-1 odoo -d moonwitness_db -u moon_myth --stop-after-init
```
