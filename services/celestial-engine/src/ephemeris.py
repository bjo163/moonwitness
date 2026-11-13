"""
◈ MoonWitness Celestial Compute Module
Deterministic calculations for lunar coordinates, illumination fraction, and phase angles.
"""
from typing import TypedDict
import math


class LunarPhase(TypedDict):
    phase_name: str
    illumination_fraction: float
    age_days: float
    elongation_degrees: float


def compute_lunar_illumination(phase_angle_rad: float) -> float:
    """Compute fraction of the Moon's illuminated disk from phase angle in radians."""
    return (1.0 + math.cos(phase_angle_rad)) / 2.0


def calculate_lunar_phase(days_since_new_moon: float) -> LunarPhase:
    """
    Calculate approximate lunar phase data given days elapsed in synodic month (29.530588 days).
    """
    synodic_month = 29.53058867
    cycle_fraction = (days_since_new_moon % synodic_month) / synodic_month
    phase_angle = cycle_fraction * 2 * math.pi
    elongation = cycle_fraction * 360.0

    illumination = compute_lunar_illumination(phase_angle + math.pi)

    if elongation < 1.0 or elongation >= 359.0:
        name = "New Moon"
    elif elongation < 89.0:
        name = "Waxing Crescent"
    elif elongation <= 91.0:
        name = "First Quarter"
    elif elongation < 179.0:
        name = "Waxing Gibbous"
    elif elongation <= 181.0:
        name = "Full Moon"
    elif elongation < 269.0:
        name = "Waning Gibbous"
    elif elongation <= 271.0:
        name = "Last Quarter"
    else:
        name = "Waning Crescent"

    return LunarPhase(
        phase_name=name,
        illumination_fraction=round(illumination, 4),
        age_days=round(days_since_new_moon % synodic_month, 2),
        elongation_degrees=round(elongation, 2),
    )
