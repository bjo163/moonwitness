---
name: disaster-mythos-causality-debunking
description: >-
  Use this skill when analyzing claims connecting cultural rituals/superstitions to natural disasters,
  enforcing geophysical causality thresholds (focal depth, plate tectonics, magma chamber pressure),
  and generating scientific empirical proof reports.
---

# Disaster-Mythos Causality Debunking Engine (Subatomic Skill)

Governs the rigorous scientific refutation of animistic and mythical claims associating supernatural rituals (e.g. offerings to sea spirits, mountain appeasement rites) with seismic, volcanic, or meteorological disasters.

## Scientific Causal Evaluation Criteria

Each correlation assessment evaluates:
1. **Focal Depth & Mechanism**:
   - Tectonic earthquakes occur along subduction faults (e.g. Indo-Australian plate subducting under Sunda plate at $5-7\text{ cm/year}$) at depths $> 10\text{ km}$.
   - Magma ascent is driven by lithostatic buoyancy and volatile exsolution ($H_2O, CO_2, SO_2$).
   - Human physical presence or sacrificial rituals on the surface generate negligible force ($< 10^3 \text{ N}$ vs earthquake energy $E = 10^{4.8 + 1.5 M} \text{ Joules}$, which exceeds $10^{14} \text{ Joules}$ for $M \ge 6.0$).
2. **Temporal Delta $\Delta T$**:
   $$\Delta T = |t_{\text{disaster}} - t_{\text{ritual}}|$$
   - Folkloric claims retroactively expand $\Delta T$ from days to months to claim causation (*post hoc ergo propter hoc* fallacy).

## Automated Refutation Report Generation

When evaluating `moon.myth.correlation`, generate:
```typescript
interface ScientificDebunkingFinding {
  correlationId: string
  mythTitle: string
  disasterEvent: string
  geophysicalMechanism: "SUBDUCTION_ZONE_FAULT" | "MAGMA_CHAMBER_OVERPRESSURE" | "CORIOLIS_TROPICAL_CYCLONE"
  energyDiscrepancyRatio: number // Ratio of disaster Joules to ritual Joules (typically > 10^12)
  theologicalClassification: "TAUHID_VIOLATION_SHIRK" | "SUPERSTITIOUS_KHURAFAH"
  verdict: "ZERO_CAUSAL_CORRELATION_CONFIRMED"
}
```

## Canonical Source Files
- `odoo19/addons/moon_myth/models/moon_myth_correlation.py`
- `odoo19/addons/moon_myth/models/moon_myth_evidence.py`
- `odoo19/addons/moon_disaster/models/moon_disaster.py`

## Verification Command
```bash
python -c "energy_eq = 10**(4.8 + 1.5 * 6.5); print(f'M6.5 Earthquake Energy: {energy_eq:.2e} Joules | Surface ritual influence: 0.0000000000%')"
```
