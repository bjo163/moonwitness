from odoo import fields, models


class MoonMythObservation(models.Model):
    _name = "moon.myth.observation"
    _description = "Mythos Field Observation"
    _order = "date_start desc, id desc"

    name = fields.Char(string="Observation Title", required=True, index=True)
    obs_code = fields.Char(string="Observation ID", index=True)  # e.g. OBS-2026-08-001
    myth_id = fields.Many2one(
        "moon.myth",
        string="Mythos Entity",
        required=True,
        index=True,
        ondelete="restrict",
    )
    month = fields.Char(string="Reporting Month", default="2026-08", index=True)
    date_display = fields.Char(string="Date (Display)", help="e.g. 5–6 Aug")
    date_start = fields.Date(string="Start Date")
    date_end = fields.Date(string="End Date")
    location = fields.Char(string="Location", required=True, index=True)
    actor = fields.Char(string="Actor / Community", help="Community performing the ritual")
    summary = fields.Text(string="Observation Summary")
    
    # Observatory Scores
    evidence_score = fields.Integer(string="Evidence Score (%)", default=80)
    tauhid_gap = fields.Integer(string="Tauhid Gap (%)", default=50)
    causality = fields.Integer(
        string="Causality Score (%)",
        default=0,
        help="Scientific causal relation to any environmental/disaster events (0 = proximity only, not causation).",
    )
    
    # Geography & Administrative Map (Linked to Odoo Base res.country & res.country.state)
    country_id = fields.Many2one(
        "res.country",
        string="Country",
        default=lambda self: self.env.ref("base.id", raise_if_not_found=False) or self.env["res.country"].search([("code", "=", "ID")], limit=1),
        index=True,
    )
    state_id = fields.Many2one(
        "res.country.state",
        string="Province / State",
        domain="[('country_id', '=', country_id)]",
        index=True,
    )
    province = fields.Char(string="Province (Text)")
    island = fields.Char(string="Island", default="Java")
    latitude = fields.Float(string="Latitude", digits=(10, 6))
    longitude = fields.Float(string="Longitude", digits=(10, 6))
    precision = fields.Char(string="Geo Precision", default="locality-centroid")

    company_id = fields.Many2one(
        "res.company",
        string="Company",
        default=lambda self: self.env.company,
        index=True,
    )
    user_id = fields.Many2one(
        "res.users",
        string="Reviewer / Observer",
        default=lambda self: self.env.user,
        index=True,
    )

    source_url = fields.Char(string="Primary Source URL")
    note = fields.Text(string="Research Notes")

    correlation_ids = fields.One2many(
        "moon.myth.correlation",
        "observation_id",
        string="Disaster Correlations",
    )
