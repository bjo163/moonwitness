---
name: counter-mythos-disaster-correlation
description: >-
  Use this skill when auditing or expanding the Counter-Mythos & Natural Disaster Observatory,
  maintaining correlation engines, Haversine geospatial calculations, and Tauhid-gap assessments.
---

# Counter-Mythos & Natural Disaster Correlation Skill

Governs scientific and theological observatory modules in Odoo (`moon_myth`, `moon_disaster`) designed to objectively decouple natural geophysical phenomena from superstitious beliefs.

## Architectural Objectives

1. **Independent Geophysical Observatory (`moon_disaster`)**:
   - Master Hazard Types (`moon.disaster.type`): Dynamic master data covering volcanic eruptions, tectonic earthquakes, tsunamis, wildfires, landslides, liquefaction with official monitoring authorities (BMKG, PVMBG, BNPB, USGS).
   - Real-World Events (`moon.disaster`): Actual disaster occurrences with geospatial coordinates, magnitude, depth, and timestamp.

2. **Counter-Mythos Observatory (`moon_myth`)**:
   - Master Mythos Database (`moon.myth`): Folk beliefs, rituals, sacrificial offerings (sesaji laut, persembahan gunung).
   - Field Observations (`moon.myth.observation`): Documented ritual activities with geographic coordinates.
   - Tauhid Register (`moon.myth.issue`): Theological critique from the perspective of Islamic monotheism.
   - Evidence Ledger (`moon.myth.evidence`): Empirical facts disproving magical or superstitious claims.

3. **Correlation & Causality Review Engine (`moon.myth.correlation`)**:
   - Computes distance between ritual site and disaster epicenter using the **Haversine Formula**:
     $$d = 2r \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)}\right)$$
   - Calculates time delta ($\Delta T = |T_{\text{ritual}} - T_{\text{disaster}}|$) in hours.
   - Quantifies **Causality Score = 0%** when events are driven purely by tectonic/magmatic laws of nature, debunking claims that disasters occurred due to "lack of offerings".

4. **Autonomous Scout Pipeline (`moon.myth.candidate`)**:
   - Background cron (`ir_cron_autonomous_myth_scout`) runs every 6 hours to discover ritual news, extracts metadata via OpenCode Free AI service, and allows manual one-click promotion to active observation.

## Maintenance Runbook

```bash
# Verify Odoo addon manifest integrity
docker exec odoo19-odoo19-1 python3 -c "import odoo; from odoo.tools import config; config.parse_config(['-c', '/etc/odoo/odoo.conf', '--db_host=db', '--db_port=5432', '--db_user=odoo', '--db_password=odoo19@2025', '-d', 'moonwitness', '-u', 'moon_disaster,moon_myth'])"

# Test Haversine formula calculation
docker exec odoo19-odoo19-1 python3 -c "from math import radians, cos, sin, asin, sqrt; lat1, lon1, lat2, lon2 = map(radians, [-7.7956, 110.3695, -8.0, 110.5]); d = 2 * 6371 * asin(sqrt(sin((lat2-lat1)/2)**2 + cos(lat1)*cos(lat2)*sin((lon2-lon1)/2)**2)); print(f'Distance: {d:.2f} km')"
```

## Checklist

- [ ] New disaster types remain dynamic via `moon.disaster.type` records, never hardcoded in Python selection arrays.
- [ ] Correlation engine handles zero distance or missing timestamp gracefully without throwing unhandled exceptions.
- [ ] Tauhid gap ratings use structured qualitative metrics (Low, Medium, High, Critical Shirk Gap).
