{
    "name": "Moon Myth",
    "version": "19.0.1.0.0",
    "summary": "Counter-Mythos & Ritual Observatory Database",
    "description": """
        MoonMyth — Counter-Mythos & Ritual Observatory Module for MoonWitness.
        Grounds mythos/ritual entities, field observations, evidence audit,
        Tauhid-gap analysis, and causality review across Indonesia.
    """,
    "category": "Knowledge",
    "author": "ArsyBelovedLabs",
    "license": "LGPL-3",
    "depends": ["moon_base", "moon_witness", "moon_disaster"],
    "data": [
        "security/ir.model.access.csv",
        "views/moon_myth_views.xml",
        "views/moon_myth_observation_views.xml",
        "views/moon_myth_issue_views.xml",
        "views/moon_myth_evidence_views.xml",
        "views/moon_myth_candidate_views.xml",
        "views/moon_myth_disaster_views.xml",
        "views/menu_views.xml",
        "data/demo_myths.xml",
        "data/ir_cron_data.xml",
    ],
    "installable": True,
    "application": True,
}
