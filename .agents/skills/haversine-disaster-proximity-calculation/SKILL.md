---
name: haversine-disaster-proximity-calculation
description: >-
  Use this skill when calculating spherical great-circle geodesic distances between ritual/myth observation
  sites and natural disaster epicenters using the high-precision Haversine formula and BMKG data ingestion.
---

# Haversine Disaster Proximity Calculation (Subatomic Skill)

Governs the geospatial calculation of distance ($D$) between recorded mythological ritual sites and seismic/volcanic event epicenters using the WGS84 spherical Haversine formula.

## Mathematical Formulation

Let:
- $\phi_1, \lambda_1$: Latitude and longitude of ritual observation site in radians.
- $\phi_2, \lambda_2$: Latitude and longitude of disaster epicenter in radians.
- $R = 6371.0088\text{ km}$: Earth mean volumetric radius (IUGG recommendation).

$$\Delta\phi = \phi_2 - \phi_1$$
$$\Delta\lambda = \lambda_2 - \lambda_1$$
$$a = \sin^2\left(\frac{\Delta\phi}{2}\right) + \cos\phi_1 \cdot \cos\phi_2 \cdot \sin^2\left(\frac{\Delta\lambda}{2}\right)$$
$$c = 2 \cdot \operatorname{atan2}\left(\sqrt{a}, \sqrt{1 - a}\right)$$
$$D = R \cdot c \quad (\text{kilometers})$$

### Bounding Box Pre-Filter (Spatial Index Optimization)
To avoid evaluating all global earthquake records, compute bounding box for radius $r$ ($km$):
$$\Delta\phi_{\text{deg}} = \frac{r}{111.32}$$
$$\Delta\lambda_{\text{deg}} = \frac{r}{111.32 \cdot \cos\phi_1}$$
Filter candidates in database:
```sql
WHERE lat BETWEEN (lat0 - :dlat) AND (lat0 + :dlat)
  AND lng BETWEEN (lng0 - :dlng) AND (lng0 + :dlng)
```

## Proximity Score vs Causality Separation
$$\text{Proximity Score} = \max\left(0, 100 - \frac{D}{10} - \frac{|\Delta T_{\text{hours}}|}{2}\right)$$
- Proximity indicates spatiotemporal coincidence only.
- **Scientific Causality is strictly $0\%$** — physical tectonic movements are determined by lithospheric plate stress, never ritual folklore.

## Canonical Source Files
- `odoo19/addons/moon_myth/models/moon_myth_correlation.py`
- `odoo19/addons/moon_disaster/models/moon_disaster.py`
- `packages/moon-geo/src/`

## Verification Command
```bash
python -c "import math; r=6371.0; lat1,lon1=math.radians(-7.5),math.radians(110.4); lat2,lon2=math.radians(-7.8),math.radians(110.3); dlat=lat2-lat1; dlon=lon2-lon1; a=math.sin(dlat/2)**2+math.cos(lat1)*math.cos(lat2)*math.sin(dlon/2)**2; c=2*math.atan2(math.sqrt(a),math.sqrt(1-a)); print(f'Distance: {r*c:.2f} km')"
```
