from odoo import fields, models


class MoonDisaster(models.Model):
    _name = "moon.disaster"
    _description = "Independent Disaster & Environmental Event"
    _order = "date_start desc, id desc"

    name = fields.Char(string="Event Name / Location", required=True, index=True)
    dis_code = fields.Char(string="Disaster ID", required=True, index=True)  # e.g. DIS-2026-08-BABEL-001

    # Dynamic Many2one reference to Master Hazard Type
    disaster_type_id = fields.Many2one(
        "moon.disaster.type",
        string="Hazard Classification",
        required=True,
        index=True,
        ondelete="restrict",
        help="Pilih atau buat jenis bencana baru secara dinamis",
    )

    date_start = fields.Datetime(string="Start Date & Time", required=True)
    date_end = fields.Datetime(string="End Date & Time")

    location = fields.Char(string="Location / Regency", required=True, index=True)
    admin_area = fields.Char(string="Administrative Sub-Area (Village/District)")
    
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
    island = fields.Char(string="Island")

    latitude = fields.Float(string="Latitude", digits=(10, 6))
    longitude = fields.Float(string="Longitude", digits=(10, 6))
    precision = fields.Char(string="Geo Precision", default="district-centroid")

    company_id = fields.Many2one(
        "res.company",
        string="Company",
        default=lambda self: self.env.company,
        index=True,
    )

    severity = fields.Char(
        string="Severity / Scale",
        default="Local",
        help="Tingkat keparahan (e.g. Lokal, Regional, Nasional, Siaga III, Level IV, dll.)",
    )
    magnitude_display = fields.Char(string="Magnitude / Impact Measurement (e.g. 5.4 SR, Luas 150 Ha)")
    evidence_score = fields.Integer(string="Official Evidence Score (%)", default=95)

    natural_or_human_cause = fields.Text(
        string="Scientific & Factual Cause",
        help="Penjelasan resmi dari BMKG/BNPB mengenai faktor penyebab fisik.",
    )
    source_publisher = fields.Char(string="Source Authority", default="BNPB / BMKG")
    source_url = fields.Char(string="Official Report URL")
