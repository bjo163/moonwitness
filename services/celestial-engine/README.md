# ◈ Celestial Engine Service

High-precision astronomical and celestial compute engine for MoonWitness, providing lunar phase calculations, hilal visibility prediction, solar elevation, and prayer time ephemeris data.

---

## Capabilities
- Lunar phase angle and illumination calculation
- Crescent moon (Hilal) visibility criteria (MABIMS, Odeh, Yallop)
- Solar declination and equation of time
- Astronomical coordinate transformation (Equatorial to Horizontal)

---

## Running Locally

```bash
# Run service with hot-reload
uv run uvicorn src.main:app --reload --port 8001

# Run unit tests
uv run pytest
```
