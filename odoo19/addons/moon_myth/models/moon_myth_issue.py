from odoo import fields, models


class MoonMythIssue(models.Model):
    _name = "moon.myth.issue"
    _description = "Tauhid Clarification Issue"
    _order = "code asc"

    code = fields.Char(string="Issue Code", required=True, index=True)  # e.g. TAU-01
    name = fields.Char(string="Core Issue / Question", required=True)
    myth_id = fields.Many2one(
        "moon.myth",
        string="Related Mythos",
        index=True,
        ondelete="set null",
    )
    target = fields.Char(string="Practice / Locality Target")
    priority = fields.Selection(
        [
            ("LOW", "Low"),
            ("MEDIUM", "Medium"),
            ("HIGH", "High"),
            ("CRITICAL", "Critical"),
        ],
        string="Priority",
        default="MEDIUM",
        required=True,
    )
    status = fields.Char(
        string="Current Status",
        default="Verified practice; theological clarification required",
    )
    resolution = fields.Text(
        string="Clarification / Theological Resolution",
        help="Guidance on separating cultural symbolism from theological polytheism.",
    )
