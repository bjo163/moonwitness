from odoo import api, fields, models


class MoonMyth(models.Model):
    _name = "moon.myth"
    _description = "Counter-Mythos Entity"
    _order = "name asc"

    name = fields.Char(string="Mythos / Practice Name", required=True, index=True)
    code = fields.Char(string="Code / Identifier", index=True)
    category = fields.Selection(
        [
            ("AGRARIAN", "Agrarian / Harvest Ritual"),
            ("ANCESTOR", "Ancestor Veneration"),
            ("COSMIC", "Cosmic / Celestial Myth"),
            ("MARITIME", "Maritime / Sea Offering"),
            ("FOLKLORE", "Folklore & Legend"),
            ("SYNCRETIC", "Syncretic Belief"),
            ("OTHER", "Other"),
        ],
        string="Category",
        default="AGRARIAN",
        required=True,
    )
    theological_status = fields.Selection(
        [
            ("UNDER_REVIEW", "Under Review"),
            ("CULTURAL_SYMBOL", "Cultural Symbolism Only"),
            ("SYNCRETIC_PRACTICE", "Syncretic Practice"),
            ("TAUHID_VIOLATION", "Confirmed Tauhid Violation"),
            ("CLARIFIED", "Theologically Clarified"),
        ],
        string="Theological Status",
        default="UNDER_REVIEW",
        required=True,
    )
    description = fields.Text(string="Description / Background")
    theological_critique = fields.Text(
        string="Tauhid Critique & Revelation Perspective",
        help="Critique grounded in Islamic monotheism (Tauhid) and revelation lens.",
    )
    # Linkage to Canonical Scripture in moon_witness (e.g. Surah Al-Waqiah, Luqman, An-Najm)
    scripture_verse_id = fields.Many2one(
        "moon.witness.scripture.verse",
        string="Quranic Evidence Verse",
        help="Ayat Al-Qur'an rujukan untuk pembuktian Tauhid",
        ondelete="set null",
    )
    company_id = fields.Many2one(
        "res.company",
        string="Company",
        default=lambda self: self.env.company,
        index=True,
    )
    observation_ids = fields.One2many(
        "moon.myth.observation",
        "myth_id",
        string="Field Observations",
    )
    observation_count = fields.Integer(
        string="Observations Count",
        compute="_compute_counts",
        store=True,
    )
    issue_ids = fields.One2many(
        "moon.myth.issue",
        "myth_id",
        string="Clarification Issues",
    )
    average_tauhid_gap = fields.Float(
        string="Avg Tauhid Gap (%)",
        compute="_compute_counts",
        store=True,
    )
    active = fields.Boolean(default=True)

    @api.depends("observation_ids", "observation_ids.tauhid_gap")
    def _compute_counts(self):
        for record in self:
            obs = record.observation_ids
            record.observation_count = len(obs)
            if obs:
                record.average_tauhid_gap = sum(obs.mapped("tauhid_gap")) / len(obs)
            else:
                record.average_tauhid_gap = 0.0
