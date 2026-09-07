from odoo import api, fields, models


class MoonDisasterType(models.Model):
    _name = "moon.disaster.type"
    _description = "Master Hazard / Disaster Classification"
    _order = "name asc"

    name = fields.Char(string="Hazard / Disaster Name", required=True, index=True)
    code = fields.Char(string="Hazard Code / Slug", index=True)  # e.g. EQ-TECTONIC, WILDFIRE, LANDSLIDE
    
    # Fully dynamic domain/category (not hardcoded selection)
    scientific_domain = fields.Char(
        string="Scientific Domain / Field",
        help="e.g. Tektonik, Vulkanologi, Hidro-Meteorologi, Oseanografi, dll. (Bebas diisi)",
    )
    official_authority = fields.Char(
        string="Responsible Authority",
        default="BMKG / BNPB / PVMBG",
        help="Lembaga ilmiah/otoritas resmi (BMKG, PVMBG, BNPB, USGS, dsb.)",
    )
    scientific_mechanism = fields.Text(
        string="Objective Scientific Mechanism",
        help="Penjelasan ilmiah objektif mengenai sebab fisik bencana alam ini.",
    )
    common_myths = fields.Text(
        string="Common Local Superstitions / Folkloric Beliefs",
        help="Mitos / kepercayaan mistis lokal yang sering salah dikaitkan masyarakat dengan bencana ini.",
    )
    
    event_ids = fields.One2many(
        "moon.disaster",
        "disaster_type_id",
        string="Historical Recorded Events",
    )
    event_count = fields.Integer(
        string="Recorded Events Count",
        compute="_compute_event_count",
        store=True,
    )
    color = fields.Integer(string="Color Index", default=0)
    active = fields.Boolean(default=True)

    _sql_constraints = [
        ("name_uniq", "unique(name)", "Nama jenis bencana harus unik!"),
    ]

    @api.depends("event_ids")
    def _compute_event_count(self):
        for record in self:
            record.event_count = len(record.event_ids)
