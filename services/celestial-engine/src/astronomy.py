"""
◈ MoonWitness Celestial Compute — Advanced Astronomical & Falakiah Engine
High-precision spherical trigonometry for Qibla calculation, MABIMS/Odeh Hilal
visibility criteria, and solar trajectory mechanics.
"""
from typing import TypedDict, Literal
import math

# Ka'bah Sanctuary Coordinates (WGS84)
KAABA_LAT_DEG = 21.422487
KAABA_LNG_DEG = 39.826206
EARTH_RADIUS_KM = 6371.0


class QiblaResult(TypedDict):
    latitude: float
    longitude: float
    bearing_degrees: float
    compass_direction: str
    distance_km: float


class HilalVisibilityResult(TypedDict):
    altitude_degrees: float
    elongation_degrees: float
    crescent_width_arcmin: float
    mabims_visible: bool
    mabims_status: str
    odeh_v_value: float
    odeh_classification: Literal["A", "B", "C", "D"]
    odeh_description: str


def degrees_to_compass(degrees: float) -> str:
    """Convert bearing degrees (0..360) into 16-point cardinal direction string."""
    dirs = [
        "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
        "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
    ]
    idx = int((degrees + 11.25) / 22.5) % 16
    return dirs[idx]


def calculate_qibla_bearing(latitude: float, longitude: float) -> QiblaResult:
    """
    Calculate the exact Qibla bearing (azimuth from True North clockwise) and
    great-circle geodesic distance to the Holy Ka'bah in Makkah.
    """
    phi1 = math.radians(latitude)
    phi2 = math.radians(KAABA_LAT_DEG)
    lambda1 = math.radians(longitude)
    lambda2 = math.radians(KAABA_LNG_DEG)
    delta_lambda = lambda2 - lambda1

    # Great-circle forward azimuth formula
    y = math.sin(delta_lambda) * math.cos(phi2)
    x = math.cos(phi1) * math.sin(phi2) - math.sin(phi1) * math.cos(phi2) * math.cos(delta_lambda)
    bearing_rad = math.atan2(y, x)
    bearing_deg = (math.degrees(bearing_rad) + 360.0) % 360.0

    # Haversine distance
    delta_phi = phi2 - phi1
    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(max(0.0, 1.0 - a)))
    distance = EARTH_RADIUS_KM * c

    return QiblaResult(
        latitude=round(latitude, 6),
        longitude=round(longitude, 6),
        bearing_degrees=round(bearing_deg, 2),
        compass_direction=degrees_to_compass(bearing_deg),
        distance_km=round(distance, 1),
    )


def evaluate_hilal_visibility(
    altitude_degrees: float,
    elongation_degrees: float,
    crescent_width_arcmin: float = 0.5,
) -> HilalVisibilityResult:
    """
    Evaluate crescent moon (Hilal) visibility criteria according to:
    1. MABIMS New Criteria (2021/2022): Altitude >= 3.0 deg, Elongation >= 6.4 deg
    2. Mohammad Odeh Criteria (2006): Empirical topocentric polynomial model
    """
    mabims_altitude_pass = altitude_degrees >= 3.0
    mabims_elongation_pass = elongation_degrees >= 6.4
    mabims_visible = mabims_altitude_pass and mabims_elongation_pass

    if mabims_visible:
        mabims_status = "CRITERIA_MET (Hilal Likely Visible)"
    else:
        reasons = []
        if not mabims_altitude_pass:
            reasons.append(f"Altitude {altitude_degrees:.1f}° < 3.0°")
        if not mabims_elongation_pass:
            reasons.append(f"Elongation {elongation_degrees:.1f}° < 6.4°")
        mabims_status = f"CRITERIA_UNMET ({', '.join(reasons)})"

    # Odeh Model Polynomial: V = ArcV - (-0.1018 W^3 + 0.7319 W^2 - 6.3226 W + 7.1651)
    w = max(0.01, min(2.0, crescent_width_arcmin))
    f_w = -0.1018 * (w ** 3) + 0.7319 * (w ** 2) - 6.3226 * w + 7.1651
    odeh_v = altitude_degrees - f_w

    if odeh_v >= 5.65:
        odeh_class: Literal["A", "B", "C", "D"] = "A"
        odeh_desc = "Easily visible to the naked eye under normal atmospheric conditions."
    elif odeh_v >= 2.0:
        odeh_class = "B"
        odeh_desc = "Visible with optical aid; may be seen with naked eye in pristine skies."
    elif odeh_v >= -0.96:
        odeh_class = "C"
        odeh_desc = "Visible only with optical aid (telescope/binoculars)."
    else:
        odeh_class = "D"
        odeh_desc = "Not visible even with conventional optical telescope."

    return HilalVisibilityResult(
        altitude_degrees=round(altitude_degrees, 2),
        elongation_degrees=round(elongation_degrees, 2),
        crescent_width_arcmin=round(crescent_width_arcmin, 3),
        mabims_visible=mabims_visible,
        mabims_status=mabims_status,
        odeh_v_value=round(odeh_v, 3),
        odeh_classification=odeh_class,
        odeh_description=odeh_desc,
    )
