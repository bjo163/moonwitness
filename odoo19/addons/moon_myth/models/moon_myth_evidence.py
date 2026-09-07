from odoo import fields, models


class MoonMythEvidence(models.Model):
    _name = "moon.myth.evidence"
    _description = "Observatory Audit Evidence"
    _order = "id desc"

    name = fields.Char(string="Evidence Title", required=True)
    evidence_type = fields.Selection(
        [
            ("Official", "Official Source (BMKG/Govt)"),
            ("Academic", "Academic / Journal"),
            ("News", "Verified News Media"),
            ("Field", "Field Report / Community Documentation"),
            ("Other", "Other"),
        ],
        string="Evidence Type",
        default="Official",
        required=True,
    )
    description = fields.Text(string="Description / Findings")
    url = fields.Char(string="Reference URL")
    observation_id = fields.Many2one(
        "moon.myth.observation",
        string="Linked Observation",
        ondelete="set null",
    )
