from odoo import fields, models


class MoonExternalIdentity(models.Model):
    _name = "moon.external.identity"
    _description = "Moon external identity"
    _rec_name = "external_key"
    _order = "create_date desc"

    external_key = fields.Char(required=True, index=True)
    provider = fields.Char(required=True, index=True)
    model_name = fields.Char(required=True, index=True)
    res_id = fields.Integer(required=True, index=True)
    company_id = fields.Many2one("res.company", index=True, ondelete="restrict")
    active = fields.Boolean(default=True, index=True)
    note = fields.Text()

    _sql_constraints = [
        ("provider_key_unique", "unique(provider, external_key)", "External identity must be unique per provider."),
    ]
