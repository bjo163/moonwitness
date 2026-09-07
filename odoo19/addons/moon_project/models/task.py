from odoo import fields, models


class ProjectTask(models.Model):
    _inherit = "project.task"

    moon_external_id = fields.Char(index=True, copy=False)
    moon_due_date = fields.Datetime(related="date_deadline", store=True, readonly=True)
