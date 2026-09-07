from odoo import fields, models


class ProjectProject(models.Model):
    _inherit = "project.project"

    moon_external_id = fields.Char(index=True, copy=False)
    moon_status = fields.Selection(
        [("active", "Active"), ("archived", "Archived")],
        compute="_compute_moon_status",
        store=True,
    )

    def _compute_moon_status(self):
        for record in self:
            record.moon_status = "active" if record.active else "archived"
