"""
◈ MoonWitness Celestial Compute Service API
FastAPI service exposing high-precision astronomical calculations to the API Gateway.
"""
from typing import Optional
from fastapi import FastAPI
from pydantic import BaseModel, Field
from src.ephemeris import calculate_lunar_phase, LunarPhase
from src.astronomy import (
    calculate_qibla_bearing,
    evaluate_hilal_visibility,
    QiblaResult,
    HilalVisibilityResult,
)

app = FastAPI(
    title="MoonWitness Celestial Engine",
    description="High-precision astronomical and ephemeris calculation service",
    version="0.1.0",
)


class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "celestial-engine"
    version: str = "0.1.0"


class LunarPhaseRequest(BaseModel):
    days_since_new_moon: float = Field(..., ge=0.0, description="Elapsed days in current lunar cycle")


class QiblaRequest(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Observer latitude in decimal degrees")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Observer longitude in decimal degrees")


class HilalVisibilityRequest(BaseModel):
    altitude_degrees: float = Field(..., ge=-10.0, le=90.0, description="Lunar altitude above true horizon in degrees")
    elongation_degrees: float = Field(..., ge=0.0, le=180.0, description="Angular separation between Sun and Moon in degrees")
    crescent_width_arcmin: float = Field(0.5, ge=0.01, le=5.0, description="Crescent width (W) in arcminutes")


@app.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse()


@app.post("/ephemeris/lunar-phase", response_model=LunarPhase)
def get_lunar_phase(req: LunarPhaseRequest):
    return calculate_lunar_phase(req.days_since_new_moon)


@app.get("/ephemeris/qibla", response_model=QiblaResult)
@app.post("/ephemeris/qibla", response_model=QiblaResult)
def get_qibla_direction(
    lat: Optional[float] = None,
    lon: Optional[float] = None,
    req: Optional[QiblaRequest] = None,
):
    latitude = req.latitude if req else (lat if lat is not None else 0.0)
    longitude = req.longitude if req else (lon if lon is not None else 0.0)
    return calculate_qibla_bearing(latitude, longitude)


@app.get("/ephemeris/hilal-visibility", response_model=HilalVisibilityResult)
@app.post("/ephemeris/hilal-visibility", response_model=HilalVisibilityResult)
def get_hilal_visibility(
    alt: Optional[float] = None,
    elong: Optional[float] = None,
    width: Optional[float] = None,
    req: Optional[HilalVisibilityRequest] = None,
):
    altitude = req.altitude_degrees if req else (alt if alt is not None else 0.0)
    elongation = req.elongation_degrees if req else (elong if elong is not None else 0.0)
    crescent_width = req.crescent_width_arcmin if req else (width if width is not None else 0.5)
    return evaluate_hilal_visibility(
        altitude_degrees=altitude,
        elongation_degrees=elongation,
        crescent_width_arcmin=crescent_width,
    )

