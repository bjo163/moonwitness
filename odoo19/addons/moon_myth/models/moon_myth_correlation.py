import math
from odoo import api, fields, models


class MoonMythCorrelation(models.Model):
    _name = "moon.myth.correlation"
    _description = "Correlation & Causality Review Engine"
    _order = "proximity_score desc, id desc"

    name = fields.Char(string="Relation Title", compute="_compute_name", store=True)
    rel_code = fields.Char(string="Relation ID", required=True, index=True)  # e.g. REL-2026-08-001

    observation_id = fields.Many2one(
        "moon.myth.observation",
        string="Ritual Observation",
        required=True,
        ondelete="cascade",
    )
    disaster_id = fields.Many2one(
        "moon.disaster",
        string="Disaster Event",
        required=True,
        ondelete="cascade",
    )

    temporal_relation = fields.Selection(
        [
            ("overlapping-window", "Overlapping Window"),
            ("same-day", "Same Day"),
            ("prior-within-3-days", "Prior Within 3 Days"),
            ("post-within-3-days", "Post Within 3 Days"),
            ("distant-time", "Distant in Time"),
        ],
        string="Temporal Relation",
        default="overlapping-window",
    )
    delta_hours = fields.Integer(string="Delta Gap (Hours)", default=0)

    geographic_relation = fields.Selection(
        [
            ("same-locality", "Same Locality (< 25km)"),
            ("same-regency-context", "Same Regency Context (< 75km)"),
            ("same-province", "Same Province Context"),
            ("distinct-regions", "Distinct / Far Regions"),
        ],
        string="Geographic Relation",
        default="same-regency-context",
    )
    distance_km = fields.Float(string="Distance (KM)", digits=(10, 2))

    proximity_score = fields.Integer(
        string="Proximity Score (%)",
        help="Deterministic closeness in space & time. DOES NOT PROVE CAUSATION.",
    )
    repository_causality_score = fields.Integer(
        string="Causality Score (%)",
        default=0,
        help="Reviewed scientific causality score (0-10%). Proves ritual has no physical causal power.",
    )
    status = fields.Selection(
        [
            ("REVIEWED_NO_CAUSAL_LINK", "Reviewed: No Causal Link"),
            ("AUTO_PROXIMITY_ONLY", "Auto Proximity Only (Unreviewed)"),
            ("INDEPENDENT_PARALLEL", "Independent Parallel Phenomenon"),
        ],
        string="Review Status",
        default="REVIEWED_NO_CAUSAL_LINK",
        required=True,
    )
    competing_explanations = fields.Text(
        string="Competing Scientific Explanations",
        help="Documented physical/meteorological facts explaining the disaster.",
    )
    finding = fields.Text(
        string="Scientific & Theological Finding",
        help="Academic conclusion debunking any superstitious or mystical causal claims.",
    )

    @api.depends("observation_id.name", "disaster_id.name")
    def _compute_name(self):
        for record in self:
            obs = record.observation_id.name or "Observation"
            dis = record.disaster_id.name or "Disaster"
            record.name = f"{obs} ↔ {dis}"

    @api.onchange("observation_id", "disaster_id")
    def _onchange_compute_metrics(self):
        """Calculates distance using Haversine formula and estimates proximity score."""
        for record in self:
            if record.observation_id and record.disaster_id:
                o_lat = record.observation_id.latitude
                o_lon = record.observation_id.longitude
                d_lat = record.disaster_id.latitude
                d_lon = record.disaster_id.longitude

                if o_lat and o_lon and d_lat and d_lon:
                    # Haversine formula
                    r = 6371.0  # Earth radius in KM
                    dlat = math.radians(d_lat - o_lat)
                    dlon = math.radians(d_lon - o_lon)
                    a = (
                        math.sin(dlat / 2.0) ** 2
                        + math.cos(math.radians(o_lat))
                        * math.cos(math.radians(d_lat))
                        * math.sin(dlon / 2.0) ** 2
                    )
                    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
                    dist = r * c
                    record.distance_km = round(dist, 1)

                    if dist <= 25:
                        record.geographic_relation = "same-locality"
                        geo_score = 35
                    elif dist <= 75:
                        record.geographic_relation = "same-regency-context"
                        geo_score = 30
                    else:
                        record.geographic_relation = "same-province"
                        geo_score = 15

                    temp_score = 45 if record.delta_hours == 0 else 30
                    record.proximity_score = temp_score + geo_score
