from odoo import fields, models


class MoonMythDisaster(models.Model):
    _name = "moon.myth.disaster"
    _description = "Independent Disaster & Environmental Event"
    _order = "date_start desc, id desc"

    name = fields.Char(string="Disaster Title / Event", required=True, index=True)
    dis_code = fields.Char(string="Disaster ID", required=True, index=True)  # e.g. DIS-2026-08-BABEL-001
    month = fields.Char(string="Month", default="2026-08", index=True)

    date_start = fields.Datetime(string="Start Time / Date", required=True)
    date_end = fields.Datetime(string="End Time / Date")

    location = fields.Char(string="Location / Regency", required=True)
    admin_area = fields.Char(string="Administrative Sub-Area (Village/District)")
    province = fields.Char(string="Province")
    island = fields.Char(string="Island")

    latitude = fields.Float(string="Latitude", digits=(10, 6))
    longitude = fields.Float(string="Longitude", digits=(10, 6))
    precision = fields.Char(string="Precision", default="district-centroid")

    disaster_type = fields.Selection(
        [
            ("wildfire", "Wildfire / Karhutla"),
            ("earthquake", "Earthquake / Gempa"),
            ("flood", "Flood / Banjir"),
            ("volcano", "Volcanic Eruption / Erupsi"),
            ("drought", "Drought / Kekeringan"),
            ("other", "Other Disaster"),
        ],
        string="Disaster Type",
        default="wildfire",
        required=True,
    )
    severity = fields.Selection(
        [
            ("local", "Local"),
            ("regional", "Regional"),
            ("national", "National Disaster"),
        ],
        string="Severity",
        default="local",
    )
    evidence_score = fields.Integer(string="Official Evidence Score (%)", default=95)

    natural_or_human_cause = fields.Text(
        string="Scientific / Objective Cause",
        help="Scientific explanation of the event from meteorological, tectonic, or human activity factors.",
    )
    source_publisher = fields.Char(string="Source Authority", default="BNPB / BMKG")
    source_url = fields.Char(string="Official Source URL")

    correlation_ids = fields.One2many(
        "moon.myth.correlation",
        "disaster_id",
        string="Correlated Observations",
    )
