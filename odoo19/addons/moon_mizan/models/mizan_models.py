from odoo import api, fields, models
from odoo.exceptions import ValidationError, UserError

METHODS = [("general", "General"), ("general_limited", "General limited"), ("prophetic", "Prophetic")]
STATES = [("draft", "Draft"), ("in_review", "In review"), ("reviewed", "Reviewed"), ("superseded", "Superseded")]

class MizanCategory(models.Model):
    _name = "moon.mizan.category"; _description = "Mizan category"
    name = fields.Char(required=True, index=True); code = fields.Char(required=True, index=True); parent_id = fields.Many2one("moon.mizan.category", ondelete="restrict"); active = fields.Boolean(default=True)
    _sql_constraints = [("code_unique", "unique(code)", "Category code must be unique.")]

class MizanJurisdiction(models.Model):
    _name = "moon.mizan.jurisdiction"; _description = "Mizan jurisdiction"
    name = fields.Char(required=True); code = fields.Char(required=True, index=True); kind = fields.Selection([(x, x.replace("_", " ").title()) for x in ("international", "national", "regional", "local", "organizational")], required=True); parent_id = fields.Many2one("moon.mizan.jurisdiction", ondelete="restrict"); country_id = fields.Many2one("res.country", ondelete="restrict"); authority_id = fields.Many2one("res.partner", ondelete="restrict"); active = fields.Boolean(default=True)
    _sql_constraints = [("code_unique", "unique(code)", "Jurisdiction code must be unique.")]

class MizanMethodProfile(models.Model):
    _name = "moon.mizan.method.profile"; _description = "Versioned Mizan method profile"
    name = fields.Char(required=True); code = fields.Char(required=True, index=True); version = fields.Char(required=True); state = fields.Selection([(x, x.title()) for x in ("draft", "published", "retired")], default="draft", required=True); principle_text = fields.Text(required=True); engine_version = fields.Char(required=True); contract_version = fields.Char(required=True); criterion_ids = fields.One2many("moon.mizan.criterion", "profile_id"); published_at = fields.Datetime(readonly=True); published_by = fields.Many2one("res.users", readonly=True)
    _sql_constraints = [("profile_version_unique", "unique(code, version)", "Method profile version must be unique.")]
    def action_publish(self):
        for rec in self:
            if not rec.criterion_ids: raise UserError("A method profile requires criteria before publication.")
            rec.write({"state": "published", "published_at": fields.Datetime.now(), "published_by": self.env.user.id})

class MizanCriterion(models.Model):
    _name = "moon.mizan.criterion"; _description = "Mizan criterion"; _order = "profile_id, sequence"
    profile_id = fields.Many2one("moon.mizan.method.profile", required=True, ondelete="restrict"); code = fields.Char(required=True); name = fields.Char(required=True); stage = fields.Selection([(x, x.title()) for x in ("primary", "right", "left", "secondary")], required=True); sequence = fields.Integer(default=10); definition = fields.Text(required=True); max_score = fields.Float(default=0); blocking = fields.Boolean(default=False); allow_na = fields.Boolean(default=False)
    _sql_constraints = [("criterion_code_unique", "unique(profile_id, code)", "Criterion code must be unique in a profile.")]

class MizanRegulation(models.Model):
    _name = "moon.mizan.regulation"; _description = "Mizan regulation"; _inherit = ["mail.thread"]
    name = fields.Char(required=True, tracking=True); document_key = fields.Char(required=True, index=True); revision = fields.Integer(default=1, required=True); previous_revision_id = fields.Many2one("moon.mizan.regulation", ondelete="restrict"); company_id = fields.Many2one("res.company", required=True, default=lambda s: s.env.company, ondelete="restrict"); category_id = fields.Many2one("moon.mizan.category", required=True, ondelete="restrict"); jurisdiction_ids = fields.Many2many("moon.mizan.jurisdiction"); state = fields.Selection(STATES, default="draft", required=True, tracking=True); legal_status = fields.Selection([(x, x.replace("_", " ").title()) for x in ("unverified", "draft", "enacted", "repealed", "superseded")], default="unverified", required=True); authority_id = fields.Many2one("res.partner", ondelete="restrict"); effective_from = fields.Date(); effective_until = fields.Date(); purpose = fields.Text(required=True); considerations = fields.Text(); article_ids = fields.One2many("moon.mizan.article", "regulation_id"); assessment_ids = fields.One2many("moon.mizan.assessment", "regulation_id")
    _sql_constraints = [("revision_unique", "unique(company_id, document_key, revision)", "Regulation revision must be unique.")]
    def write(self, vals):
        if any(r.state in ("reviewed", "superseded") for r in self) and set(vals) - {"state"}: raise UserError("Reviewed regulations are immutable; create a new revision.")
        return super().write(vals)

class MizanArticle(models.Model):
    _name = "moon.mizan.article"; _description = "Mizan regulation article"; _order = "regulation_id, sequence"
    regulation_id = fields.Many2one("moon.mizan.regulation", required=True, ondelete="restrict"); number = fields.Char(required=True); sequence = fields.Integer(default=10); title = fields.Char(); norm_text = fields.Text(required=True); operator = fields.Selection([(x, x.title()) for x in ("obligatory", "recommended", "permitted", "discouraged", "prohibited")], required=True); subject = fields.Text(required=True); conditions = fields.Text(); exceptions = fields.Text(); sanction_text = fields.Text(); remedy_text = fields.Text(); provenance_ids = fields.Many2many("moon.witness.provenance")
    _sql_constraints = [("number_unique", "unique(regulation_id, number)", "Article number must be unique in a regulation revision.")]

class MizanCase(models.Model):
    _name = "moon.mizan.case"; _description = "Mizan case"; _inherit = ["mail.thread"]
    name = fields.Char(required=True, index=True); external_key = fields.Char(index=True); company_id = fields.Many2one("res.company", required=True, default=lambda s: s.env.company, ondelete="restrict"); owner_id = fields.Many2one("res.users", required=True, default=lambda s: s.env.user, ondelete="restrict"); question = fields.Text(required=True); context = fields.Text(required=True); jurisdiction_ids = fields.Many2many("moon.mizan.jurisdiction"); article_ids = fields.Many2many("moon.mizan.article"); state = fields.Selection([(x, x.title()) for x in ("draft", "in_review", "assessed", "archived")], default="draft", required=True); assessment_ids = fields.One2many("moon.mizan.assessment", "case_id")

class MizanAssessment(models.Model):
    _name = "moon.mizan.assessment"; _description = "Mizan assessment"; _inherit = ["mail.thread"]
    name = fields.Char(required=True); company_id = fields.Many2one("res.company", required=True, default=lambda s: s.env.company, ondelete="restrict"); source_revision = fields.Char(required=True, default="unresolved", index=True); case_id = fields.Many2one("moon.mizan.case", ondelete="restrict"); regulation_id = fields.Many2one("moon.mizan.regulation", ondelete="restrict"); article_id = fields.Many2one("moon.mizan.article", ondelete="restrict"); profile_id = fields.Many2one("moon.mizan.method.profile", required=True, ondelete="restrict"); assessor_id = fields.Many2one("res.users", required=True, default=lambda s: s.env.user, ondelete="restrict"); state = fields.Selection(STATES, default="draft", required=True, tracking=True); method = fields.Selection(METHODS); general_sufficient = fields.Selection([(x, x.title()) for x in ("unknown", "sufficient", "insufficient")], default="unknown", required=True); balance_state = fields.Selection([(x, x.title()) for x in ("unknown", "absent", "present")], default="unknown", required=True); general_weight = fields.Float(); reference_weight = fields.Float(); total_weight = fields.Float(); score_max = fields.Float(); score_available = fields.Boolean(default=False); rating = fields.Float(); rating_available = fields.Boolean(default=False); limitation = fields.Text(); conclusion = fields.Text(); recommended_action = fields.Text(); claim_ids = fields.One2many("moon.mizan.claim", "assessment_id"); line_ids = fields.One2many("moon.mizan.assessment.line", "assessment_id"); review_ids = fields.One2many("moon.mizan.review", "assessment_id")
    @api.constrains("case_id", "regulation_id", "article_id", "profile_id", "rating", "reference_weight", "general_weight", "total_weight")
    def _check_assessment(self):
        for r in self:
            if bool(r.case_id) == bool(r.regulation_id): raise ValidationError("Assessment must target exactly one case or regulation.")
            if r.article_id and r.article_id.regulation_id != r.regulation_id: raise ValidationError("Article must belong to the selected regulation.")
            if not 0 <= r.rating <= 4.5: raise ValidationError("Rating must be between 0 and 4.5.")
            if min(r.general_weight, r.reference_weight, r.total_weight) < 0: raise ValidationError("Weights cannot be negative.")
            if r.method == "general" and r.reference_weight: raise ValidationError("General method cannot have Prophetic weight.")
            if r.method == "prophetic" and (r.general_sufficient != "insufficient" or r.balance_state != "present" or not 0 < r.reference_weight <= 4): raise ValidationError("Prophetic method prerequisites are incomplete.")
            if r.total_weight > 21: raise ValidationError("Total weight cannot exceed 21.")
    def action_evaluate(self):
        """Run the bounded, local Mizan decision. No external engine is required."""
        for rec in self:
            if rec.profile_id.state != "published":
                raise UserError("Publish the method profile before evaluation.")
            lines = rec.line_ids.filtered(lambda line: line.criterion_id.profile_id == rec.profile_id)
            criteria = rec.profile_id.criterion_ids
            answers = {line.criterion_id.code: line for line in lines}
            required = criteria.filtered(lambda c: c.blocking and not c.allow_na)
            missing = required.filtered(lambda c: c.code not in answers or answers[c.code].answer == "unknown")
            failed = required.filtered(lambda c: answers.get(c.code) and answers[c.code].answer == "fail")
            if failed:
                rec.write({"state": "in_review", "score_available": False, "method": "general_limited", "limitation": "Blocking criterion failed: %s" % ", ".join(failed.mapped("code"))})
                continue
            if missing:
                rec.write({"state": "in_review", "score_available": False, "method": "general_limited", "limitation": "Required criterion is unknown: %s" % ", ".join(missing.mapped("code"))})
                continue
            score_criteria = criteria.filtered(lambda c: c.stage in ("right", "left"))
            missing_scores = score_criteria.filtered(lambda c: c.code not in answers or not answers[c.code].score_available)
            if missing_scores:
                rec.write({"state": "in_review", "score_available": False, "method": "general_limited", "limitation": "Scoring criterion is unavailable: %s" % ", ".join(missing_scores.mapped("code"))})
                continue
            right = sum(answers[c.code].score for c in criteria if c.stage == "right" and c.code in answers and answers[c.code].score_available)
            left = sum(answers[c.code].score for c in criteria if c.stage == "left" and c.code in answers and answers[c.code].score_available)
            general = right + left
            method = "general"
            reference = rec.reference_weight if rec.general_sufficient == "insufficient" and rec.balance_state == "present" else 0.0
            if reference > 0: method = "prophetic"
            rec.write({"state": "in_review", "method": method, "general_weight": general, "total_weight": general + reference, "score_max": 21.0 if method == "prophetic" else 17.0, "score_available": True, "rating_available": rec.rating > 0, "reference_weight": reference, "limitation": False})
        return True
    def action_submit_review(self): self.write({"state": "in_review"})
    def action_new_revision(self):
        self.ensure_one(); return {"type": "ir.actions.act_window", "res_model": self._name, "view_mode": "form", "target": "current", "context": {"default_name": self.name + " (revision)", "default_profile_id": self.profile_id.id}}

class MizanClaim(models.Model):
    _name = "moon.mizan.claim"; _description = "Mizan claim assessment"
    assessment_id = fields.Many2one("moon.mizan.assessment", required=True, ondelete="restrict"); assertion_id = fields.Many2one("moon.witness.assertion", required=True, ondelete="restrict"); statement_snapshot = fields.Text(required=True); kind = fields.Selection([(x, x.title()) for x in ("factual", "interpretive", "normative")], required=True); epistemic_status = fields.Selection([(x, x.title()) for x in ("unassessed", "established", "provisional", "insufficient_evidence", "reserved")], default="unassessed", required=True); grounding = fields.Selection([(x, x.title()) for x in ("unknown", "direct", "inferential", "mixed")], default="unknown", required=True); critical = fields.Boolean(); reason = fields.Text(); counterargument = fields.Text(); revision_trigger = fields.Text()

class MizanAssessmentLine(models.Model):
    _name = "moon.mizan.assessment.line"; _description = "Mizan criterion answer"
    assessment_id = fields.Many2one("moon.mizan.assessment", required=True, ondelete="restrict"); criterion_id = fields.Many2one("moon.mizan.criterion", required=True, ondelete="restrict"); answer = fields.Selection([(x, x.replace("_", " ").title()) for x in ("unknown", "pass", "fail", "not_applicable")], default="unknown", required=True); score = fields.Float(); score_available = fields.Boolean(default=False); reason = fields.Text(required=True)
    _sql_constraints = [("criterion_once", "unique(assessment_id, criterion_id)", "A criterion can be answered once per assessment.")]
    @api.constrains("criterion_id", "assessment_id", "answer", "score_available", "score")
    def _check_line(self):
        for r in self:
            if r.criterion_id.profile_id != r.assessment_id.profile_id: raise ValidationError("Criterion profile must match assessment profile.")
            if r.answer == "not_applicable" and not r.criterion_id.allow_na: raise ValidationError("This criterion does not allow N/A.")
            if not r.score_available and r.score: raise ValidationError("Unavailable score must be empty.")
            if r.score_available and not 0 <= r.score <= r.criterion_id.max_score: raise ValidationError("Criterion score exceeds its published maximum.")

class MizanReview(models.Model):
    _name = "moon.mizan.review"; _description = "Mizan human review"; _inherit = ["mail.thread"]
    assessment_id = fields.Many2one("moon.mizan.assessment", required=True, ondelete="restrict"); reviewer_id = fields.Many2one("res.users", required=True, default=lambda s: s.env.user, ondelete="restrict"); decision = fields.Selection([(x, x.replace("_", " ").title()) for x in ("accepted", "changes_requested", "rejected")], required=True); reason = fields.Text(required=True); conflict_of_interest = fields.Text(required=True); reviewed_at = fields.Datetime(default=fields.Datetime.now, required=True); input_hash = fields.Char(required=True); result_hash = fields.Char(required=True)
    @api.constrains("assessment_id", "reviewer_id")
    def _check_reviewer(self):
        for r in self:
            if r.assessment_id.assessor_id == r.reviewer_id: raise ValidationError("Assessor cannot review their own assessment.")

class MizanReference(models.Model):
    _name = "moon.mizan.reference"; _description = "Mizan source reference"
    assessment_id = fields.Many2one("moon.mizan.assessment", required=True, ondelete="restrict")
    assertion_id = fields.Many2one("moon.witness.assertion", ondelete="restrict")
    source_policy_key = fields.Char(required=True); source_policy_version = fields.Char(required=True)
    source_revision = fields.Char(required=True); locator = fields.Char(required=True)
    quote_snapshot = fields.Text(required=True); relevance_reason = fields.Text(required=True)
    verified = fields.Boolean(default=False); epistemic_status = fields.Selection([(x, x.title()) for x in ("unassessed", "provisional", "verified", "rejected")], default="unassessed", required=True)

class MizanEngineRun(models.Model):
    _name = "moon.mizan.engine.run"; _description = "Mizan deterministic engine run"; _inherit = ["mail.thread"]
    request_key = fields.Char(required=True, index=True); input_hash = fields.Char(required=True); profile_hash = fields.Char(required=True)
    contract_version = fields.Char(required=True); engine_version = fields.Char(required=True); source_revision = fields.Char(required=True)
    assessment_id = fields.Many2one("moon.mizan.assessment", required=True, ondelete="restrict")
    state = fields.Selection([(x, x.title()) for x in ("queued", "running", "succeeded", "failed", "stale")], default="queued", required=True)
    result_ids = fields.One2many("moon.mizan.engine.result", "run_id"); error_message = fields.Text()
    _sql_constraints = [("request_key_unique", "unique(request_key)", "Request key must be idempotent.")]

class MizanEngineResult(models.Model):
    _name = "moon.mizan.engine.result"; _description = "Mizan engine result"
    run_id = fields.Many2one("moon.mizan.engine.run", required=True, ondelete="restrict")
    output_hash = fields.Char(required=True); result_json = fields.Json(required=True)
    score_available = fields.Boolean(default=False); method = fields.Selection(METHODS); created_at = fields.Datetime(default=fields.Datetime.now, required=True)
