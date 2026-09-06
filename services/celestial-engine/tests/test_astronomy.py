"""
Unit tests for astronomical algorithms and falakiah criteria.
"""
from src.astronomy import calculate_qibla_bearing, evaluate_hilal_visibility


def test_qibla_from_jakarta():
    # Jakarta Istiqlal coordinates: -6.1702, 106.8315
    # Canonical Qibla bearing from Jakarta is ~295.14 degrees (West-Northwest)
    res = calculate_qibla_bearing(-6.1702, 106.8315)
    assert 294.0 <= res["bearing_degrees"] <= 296.0
    assert res["compass_direction"] == "WNW"
    assert res["distance_km"] > 7800.0


def test_qibla_from_london():
    # London coordinates: 51.5074, -0.1278
    # Canonical Qibla from London is ~118.99 degrees (East-Southeast)
    res = calculate_qibla_bearing(51.5074, -0.1278)
    assert 118.0 <= res["bearing_degrees"] <= 120.0
    assert res["compass_direction"] == "ESE"


def test_hilal_mabims_criteria_pass():
    # Altitude 4.5° (> 3°), Elongation 7.2° (> 6.4°)
    res = evaluate_hilal_visibility(4.5, 7.2, crescent_width_arcmin=0.8)
    assert res["mabims_visible"] is True
    assert "CRITERIA_MET" in res["mabims_status"]


def test_hilal_mabims_criteria_fail_low_altitude():
    # Altitude 2.1° (< 3°), Elongation 8.0° (> 6.4°)
    res = evaluate_hilal_visibility(2.1, 8.0, crescent_width_arcmin=0.5)
    assert res["mabims_visible"] is False
    assert "Altitude" in res["mabims_status"]


def test_hilal_odeh_classification():
    # High altitude and wide crescent should fall into Category A (easily naked eye)
    res_easy = evaluate_hilal_visibility(12.0, 14.0, crescent_width_arcmin=1.2)
    assert res_easy["odeh_classification"] == "A"

    # Very low altitude should fall into Category D (not visible)
    res_impossible = evaluate_hilal_visibility(0.5, 3.0, crescent_width_arcmin=0.05)
    assert res_impossible["odeh_classification"] == "D"
