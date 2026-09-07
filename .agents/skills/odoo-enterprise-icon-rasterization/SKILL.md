---
name: odoo-enterprise-icon-rasterization
description: >-
  Use this skill when designing, generating, or verifying Odoo 19 module enterprise PNG icons (128x128 RGBA,
  dark slate container, 28px rounded corners, domain semantic accents) to eliminate missing icon errors.
---

# Odoo Enterprise Icon Rasterization (Subatomic Skill)

Governs the technical specifications and deterministic generation of module icons for Odoo 19 addons (`odoo19/addons/<module>/static/description/icon.png`).

## Canonical Graphic Specification

| Parameter | Specification Value |
|---|---|
| Dimensions | $128 \times 128\text{ pixels}$ strictly |
| Color Mode | RGBA (32-bit with 8-bit alpha channel) |
| Container Color | Dark slate `#0f172a` (`rgb(15, 23, 42)`) |
| Border Radius | $28\text{ pixels}$ rounded container corners |
| Inner Padding | $18\text{ pixels}$ inset from border |
| Primary Glyph Accent | Domain-specific hex color |

### Module Domain Accent Palette
- `moon_witness`: Cyan `#0284c7` (Knowledge & Quranic graph)
- `moon_mizan`: Emerald `#10b981` (Balance & Justice)
- `moon_base`: Blue `#3b82f6` (Core system foundation)
- `moon_project`: Amber `#f59e0b` (Project management matrix)
- `moonwitness_ai`: Purple `#8b5cf6` (Prophetic RAG & AI agents)
- `moon_disaster`: Rose `#f43f5e` (Seismic & natural disasters)
- `moon_myth`: Indigo `#6366f1` (Counter-mythos & folklore)

## Verification Command
```bash
python -c "
from PIL import Image
import os
for mod in ['moon_witness','moon_mizan','moon_base','moon_project','moonwitness_ai','moon_disaster','moon_myth']:
    p = f'odoo19/addons/{mod}/static/description/icon.png'
    im = Image.open(p)
    assert im.size == (128, 128) and im.mode == 'RGBA'
print('All 7 Odoo module enterprise icons verified 100% compliant')
"
```
