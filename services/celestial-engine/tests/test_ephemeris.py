"""Unit tests for ephemeris lunar calculation."""
import math
from src.ephemeris import calculate_lunar_phase, compute_lunar_illumination


def test_illumination_at_full_and_new():
    # At new moon (phase angle 0), illumination is 1.0 when facing Sun, 0 from Earth
    new_moon = compute_lunar_illumination(math.pi)
    assert math.isclose(new_moon, 0.0, abs_tol=1e-5)

    full_moon = compute_lunar_illumination(0.0)
    assert math.isclose(full_moon, 1.0, abs_tol=1e-5)


def test_calculate_lunar_phase_new():
    phase = calculate_lunar_phase(0.0)
    assert phase["phase_name"] == "New Moon"
    assert phase["illumination_fraction"] == 0.0


def test_calculate_lunar_phase_full():
    # Half of synodic month (~14.765 days) is Full Moon
    phase = calculate_lunar_phase(14.765)
    assert phase["phase_name"] == "Full Moon"
    assert phase["illumination_fraction"] > 0.99
