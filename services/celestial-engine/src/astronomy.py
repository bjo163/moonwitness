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


class PrayerTimesResult(TypedDict):
    date: str
    latitude: float
    longitude: float
    timezone_offset: float
    convention: str
    fajr: str
    sunrise: str
    dhuhr: str
    asr: str
    maghrib: str
    isha: str
    qibla_bearing: float


def _hours_to_time_str(hours: float) -> str:
    """Format floating-point hour (0..24) into HH:MM string."""
    normalized = hours % 24.0
    h = int(normalized)
    m = int(round((normalized - h) * 60.0))
    if m >= 60:
        h = (h + 1) % 24
        m = 0
    return f"{h:02d}:{m:02d}"


def calculate_prayer_times(
    latitude: float,
    longitude: float,
    date_str: str = "2026-09-06",
    timezone_offset: float = 7.0,
    convention: Literal["KEMENAG", "MWL", "ISNA", "UMM_AL_QURA"] = "KEMENAG",
) -> PrayerTimesResult:
    """
    Calculate high-precision Islamic prayer times using solar declination and equation of time.
    Supported conventions:
    - KEMENAG: Fajr 20.0°, Isha 18.0° (Ministry of Religious Affairs Indonesia)
    - MWL: Fajr 18.0°, Isha 17.0° (Muslim World League)
    - ISNA: Fajr 15.0°, Isha 15.0° (Islamic Society of North America)
    - UMM_AL_QURA: Fajr 18.5°, Isha = Maghrib + 90 minutes (Makkah, Saudi Arabia)
    """
    from datetime import datetime
    try:
        dt = datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        dt = datetime(2026, 9, 6)

    day_of_year = dt.timetuple().tm_yday

    # Fractional year in radians
    gamma = 2.0 * math.pi / 365.25 * (day_of_year - 1)

    # Equation of Time (minutes) - Spencer formula
    eqt = 229.18 * (
        0.000075
        + 0.001868 * math.cos(gamma)
        - 0.032077 * math.sin(gamma)
        - 0.014615 * math.cos(2.0 * gamma)
        - 0.040849 * math.sin(2.0 * gamma)
    )

    # Solar Declination in radians - Spencer formula
    decl = (
        0.006918
        - 0.399912 * math.cos(gamma)
        + 0.070257 * math.sin(gamma)
        - 0.006758 * math.cos(2.0 * gamma)
        + 0.000907 * math.sin(2.0 * gamma)
        - 0.002697 * math.cos(3.0 * gamma)
        + 0.00148 * math.sin(3.0 * gamma)
    )

    phi = math.radians(latitude)

    # Solar Transit (Solar Noon) in local standard time hours
    solar_transit = 12.0 + (timezone_offset * 15.0 - longitude) / 15.0 - (eqt / 60.0)

    # Helper function for Hour Angle omega given solar altitude alpha_deg
    def hour_angle(alpha_deg: float) -> float:
        alpha = math.radians(alpha_deg)
        cos_omega = (math.sin(alpha) - math.sin(phi) * math.sin(decl)) / (
            math.cos(phi) * math.cos(decl)
        )
        # Clamp to [-1, 1] for extreme polar latitudes
        cos_omega = max(-1.0, min(1.0, cos_omega))
        return math.degrees(math.acos(cos_omega))

    # Angles by convention
    if convention == "MWL":
        fajr_angle = 18.0
        isha_angle = 17.0
    elif convention == "ISNA":
        fajr_angle = 15.0
        isha_angle = 15.0
    elif convention == "UMM_AL_QURA":
        fajr_angle = 18.5
        isha_angle = 18.5
    else:  # Default KEMENAG
        fajr_angle = 20.0
        isha_angle = 18.0

    # 1. Sunrise & Sunset (geometric center of sun at -0.833° accounting for refraction & radius)
    omega_sun = hour_angle(-0.833)
    t_sunrise = solar_transit - omega_sun / 15.0
    t_sunset = solar_transit + omega_sun / 15.0

    # 2. Fajr (Dawn)
    omega_fajr = hour_angle(-fajr_angle)
    t_fajr = solar_transit - omega_fajr / 15.0

    # 3. Dhuhr (Transit + 2 minutes safety/ihtiyat)
    t_dhuhr = solar_transit + (2.0 / 60.0)

    # 4. Asr (Standard Shafi'i/Hanbali/Maliki: shadow = object length + shadow at noon)
    asr_altitude_rad = math.atan(1.0 / (1.0 + math.tan(abs(phi - decl))))
    omega_asr = hour_angle(math.degrees(asr_altitude_rad))
    t_asr = solar_transit + omega_asr / 15.0

    # 5. Maghrib (Sunset + 2 minutes ihtiyat)
    t_maghrib = t_sunset + (2.0 / 60.0)

    # 6. Isha (Nightfall)
    if convention == "UMM_AL_QURA":
        t_isha = t_maghrib + 1.5  # Fixed 90 minutes after Maghrib
    else:
        omega_isha = hour_angle(-isha_angle)
        t_isha = solar_transit + omega_isha / 15.0

    # Qibla bearing
    qibla = calculate_qibla_bearing(latitude, longitude)

    return PrayerTimesResult(
        date=dt.strftime("%Y-%m-%d"),
        latitude=round(latitude, 4),
        longitude=round(longitude, 4),
        timezone_offset=round(timezone_offset, 2),
        convention=convention,
        fajr=_hours_to_time_str(t_fajr),
        sunrise=_hours_to_time_str(t_sunrise),
        dhuhr=_hours_to_time_str(t_dhuhr),
        asr=_hours_to_time_str(t_asr),
        maghrib=_hours_to_time_str(t_maghrib),
        isha=_hours_to_time_str(t_isha),
        qibla_bearing=qibla["bearing_degrees"],
    )

