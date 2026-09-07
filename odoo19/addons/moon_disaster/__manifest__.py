{
    "name": "Moon Disaster",
    "version": "19.0.1.0.0",
    "summary": "Independent Disaster, Hazard & Geophysical Observatory",
    "description": """
        MoonDisaster — Geophysical & Environmental Hazard Observatory.
        Houses Master Hazard Types, Real-world Disaster Events (BMKG/BNPB),
        and provides independent scientific grounding decoupled from superstitious claims.
    """,
    "category": "Knowledge",
    "author": "ArsyBelovedLabs",
    "license": "LGPL-3",
    "depends": ["moon_base"],
    "data": [
        "security/ir.model.access.csv",
        "views/moon_disaster_type_views.xml",
        "views/moon_disaster_views.xml",
        "views/menu_views.xml",
        "data/disaster_master_data.xml",
    ],
    "installable": True,
    "application": True,
}
