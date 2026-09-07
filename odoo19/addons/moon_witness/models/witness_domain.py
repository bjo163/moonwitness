from odoo import fields, models


class MoonWitnessProvenance(models.Model):
    _name = "moon.witness.provenance"
    _description = "Witness provenance"
    _order = "create_date desc"
    name = fields.Char(required=True)
    stable_key = fields.Char(index=True)
    source_id = fields.Many2one("moon.witness.source", required=True, index=True, ondelete="restrict")
    artifact_id = fields.Many2one("moon.witness.artifact", index=True, ondelete="restrict")
    snapshot_id = fields.Many2one("moon.witness.snapshot", index=True, ondelete="restrict")
    source_reference = fields.Char(index=True)
    revision = fields.Char(index=True)
    checksum = fields.Char(index=True)
    method = fields.Char()
    note = fields.Text()
    active = fields.Boolean(default=True, index=True)


class MoonWitnessSource(models.Model):
    _name = "moon.witness.source"
    _description = "Witness source"
    _order = "name"
    name = fields.Char(required=True, index=True)
    stable_key = fields.Char(required=True, index=True)
    source_class = fields.Selection([("SCRIPTURE", "Scripture"), ("HADITH", "Hadith"), ("REFERENCE", "Reference"), ("OTHER", "Other")], default="OTHER", required=True)
    publisher = fields.Char()
    corpus = fields.Char(index=True)
    edition = fields.Char(index=True)
    revision = fields.Char(index=True)
    source_url = fields.Text()
    license = fields.Char()
    company_id = fields.Many2one("res.company", index=True, ondelete="restrict")
    active = fields.Boolean(default=True)
    _sql_constraints = [("stable_key_unique", "unique(stable_key)", "Source stable key must be unique.")]


class MoonWitnessArtifact(models.Model):
    _name = "moon.witness.artifact"
    _description = "Witness source artifact"
    name = fields.Char(required=True)
    source_id = fields.Many2one("moon.witness.source", required=True, index=True, ondelete="cascade")
    revision_label = fields.Char(required=True)
    sha256 = fields.Char(required=True, index=True)
    file_size = fields.Integer(required=True)
    mime_type = fields.Char(required=True)
    attachment_id = fields.Many2one("ir.attachment", index=True, ondelete="set null")
    status = fields.Selection([("pending", "Pending"), ("verified", "Verified"), ("rejected", "Rejected")], default="pending", required=True, index=True)
    verified_at = fields.Datetime()
    verified_by = fields.Many2one("res.users", ondelete="set null")
    _sql_constraints = [("sha256_unique", "unique(sha256)", "Artifact checksum must be unique.")]


class MoonWitnessSnapshot(models.Model):
    _name = "moon.witness.snapshot"
    _description = "Witness source snapshot"
    name = fields.Char(required=True)
    source_id = fields.Many2one("moon.witness.source", required=True, index=True, ondelete="cascade")
    artifact_id = fields.Many2one("moon.witness.artifact", required=True, index=True, ondelete="restrict")
    policy_version = fields.Char(required=True)
    parser_version = fields.Char(required=True)
    normalization_version = fields.Char(required=True)
    raw_checksum = fields.Char(required=True)
    normalized_checksum = fields.Char(required=True)
    status = fields.Selection([("started", "Started"), ("completed", "Completed"), ("failed", "Failed")], default="started", required=True)
    started_at = fields.Datetime(required=True, default=fields.Datetime.now)
    completed_at = fields.Datetime()
    records_processed = fields.Integer(default=0)
    records_created = fields.Integer(default=0)
    records_updated = fields.Integer(default=0)
    records_rejected = fields.Integer(default=0)
    diagnostics = fields.Text()
    fingerprint = fields.Char(required=True, index=True)


class MoonWitnessPassage(models.Model):
    _name = "moon.witness.passage"
    _description = "Witness passage"
    _order = "source_id, sequence, id"
    name = fields.Char(required=True)
    source_id = fields.Many2one("moon.witness.source", required=True, index=True, ondelete="restrict")
    parent_id = fields.Many2one("moon.witness.passage", index=True, ondelete="cascade")
    passage_type = fields.Selection([("book", "Book"), ("chapter", "Chapter"), ("verse", "Verse"), ("section", "Section"), ("item", "Item")], required=True, index=True)
    sequence = fields.Integer(default=0, index=True)
    canonical_reference = fields.Char(required=True, index=True)
    local_number = fields.Integer()
    content = fields.Text()
    source_revision = fields.Char(index=True)
    active = fields.Boolean(default=True)
    _sql_constraints = [("source_reference_unique", "unique(source_id, canonical_reference)", "Passage reference must be unique within a source.")]


class MoonWitnessEvidence(models.Model):
    _name = "moon.witness.evidence"
    _description = "Witness evidence"
    name = fields.Char(required=True)
    passage_id = fields.Many2one("moon.witness.passage", required=True, index=True, ondelete="restrict")
    relation = fields.Selection([("supports", "Supports"), ("contradicts", "Contradicts"), ("context", "Context")], required=True, index=True)
    polarity = fields.Selection([("affirmed", "Affirmed"), ("qualified", "Qualified"), ("rejected", "Rejected")], default="affirmed", required=True)
    weight_bp = fields.Integer(default=0)
    source_reference = fields.Char()
    provenance_note = fields.Text()
    active = fields.Boolean(default=True)


class MoonWitnessScripture(models.Model):
    _name = "moon.witness.scripture"
    _description = "Witness scripture"
    name = fields.Char(required=True, index=True)
    canonical_code = fields.Char(required=True, index=True)
    tradition = fields.Char(index=True)
    language = fields.Char(index=True)
    source_id = fields.Many2one("moon.witness.source", index=True, ondelete="restrict")
    active = fields.Boolean(default=True)
    _sql_constraints = [("canonical_code_unique", "unique(canonical_code)", "Scripture code must be unique.")]


class MoonWitnessScriptureBook(models.Model):
    _name = "moon.witness.scripture.book"
    _description = "Witness scripture book or surah"
    _order = "scripture_id, number, id"
    name = fields.Char(required=True, index=True)
    scripture_id = fields.Many2one("moon.witness.scripture", required=True, index=True, ondelete="cascade")
    number = fields.Integer(required=True, index=True)
    name_original = fields.Char()
    slug = fields.Char(index=True)
    verses_count = fields.Integer(default=0)
    revelation_type = fields.Char()
    description = fields.Text()
    audio_url = fields.Char()
    active = fields.Boolean(default=True)
    _sql_constraints = [("scripture_book_number_unique", "unique(scripture_id, number)", "Book number must be unique within a scripture.")]


class MoonWitnessScriptureVerse(models.Model):
    _name = "moon.witness.scripture.verse"
    _description = "Witness scripture verse"
    _order = "book_id, number, id"
    name = fields.Char(required=True)
    book_id = fields.Many2one("moon.witness.scripture.book", required=True, index=True, ondelete="cascade")
    number = fields.Integer(required=True, index=True)
    text_original = fields.Text()
    text_translation = fields.Text()
    translation_language = fields.Char()
    audio_url = fields.Char()
    canonical_reference = fields.Char(required=True, index=True)
    active = fields.Boolean(default=True)
    _sql_constraints = [("verse_reference_unique", "unique(book_id, number)", "Verse number must be unique within a book.")]


class MoonWitnessTradition(models.Model):
    _name = "moon.witness.tradition"
    _description = "Witness hadith tradition"
    _order = "name"
    name = fields.Char(required=True, index=True)
    slug = fields.Char(required=True, index=True)
    scripture_id = fields.Many2one("moon.witness.scripture", index=True, ondelete="set null")
    language = fields.Char(index=True)
    description = fields.Text()
    item_count = fields.Integer(compute="_compute_item_count")
    active = fields.Boolean(default=True)

    def _compute_item_count(self):
        for record in self:
            record.item_count = self.env["moon.witness.tradition.item"].search_count([("tradition_id", "=", record.id)])


class MoonWitnessTraditionItem(models.Model):
    _name = "moon.witness.tradition.item"
    _description = "Witness hadith item"
    _order = "tradition_id, number, id"
    name = fields.Char(required=True)
    tradition_id = fields.Many2one("moon.witness.tradition", required=True, index=True, ondelete="cascade")
    number = fields.Integer(required=True, index=True)
    text_original = fields.Text()
    text_translation = fields.Text()
    translation_language = fields.Char()
    narrator = fields.Char()
    canonical_reference = fields.Char(index=True)
    grade = fields.Char()
    active = fields.Boolean(default=True)


class MoonWitnessAsmaulHusna(models.Model):
    _name = "moon.witness.asmaul.husna"
    _description = "Witness divine name"
    _order = "number, id"
    name = fields.Char(required=True)
    number = fields.Integer(required=True, index=True)
    name_arabic = fields.Char()
    name_latin = fields.Char()
    translation_id = fields.Char()
    translation_en = fields.Char()
    meaning = fields.Text()
    quran_reference = fields.Char()
    active = fields.Boolean(default=True)


class MoonWitnessDevotion(models.Model):
    _name = "moon.witness.devotion"
    _description = "Witness devotion"
    _order = "category, name"
    name = fields.Char(required=True)
    devotion_type = fields.Char(index=True)
    category = fields.Char(index=True)
    text_original = fields.Text()
    translation = fields.Text()
    reference = fields.Char()
    active = fields.Boolean(default=True)


class MoonWitnessBookmark(models.Model):
    _name = "moon.witness.bookmark"
    _description = "Witness user bookmark"
    _order = "create_date desc"
    user_id = fields.Many2one("res.users", required=True, index=True, ondelete="cascade")
    book_id = fields.Many2one("moon.witness.scripture.book", index=True, ondelete="cascade")
    verse_id = fields.Many2one("moon.witness.scripture.verse", index=True, ondelete="cascade")
    note = fields.Text()


class MoonWitnessHistory(models.Model):
    _name = "moon.witness.history"
    _description = "Witness user reading history"
    _order = "write_date desc"
    user_id = fields.Many2one("res.users", required=True, index=True, ondelete="cascade")
    book_id = fields.Many2one("moon.witness.scripture.book", required=True, index=True, ondelete="cascade")
    last_verse_id = fields.Many2one("moon.witness.scripture.verse", index=True, ondelete="set null")
    duration = fields.Integer(default=0, help="Reading duration in seconds")


class MoonWitnessEntity(models.Model):
    _name = "moon.witness.entity"
    _description = "Witness graph entity"
    name = fields.Char(required=True, index=True)
    canonical_key = fields.Char(required=True, index=True)
    entity_type = fields.Char(required=True, index=True)
    description = fields.Text()
    active = fields.Boolean(default=True)
    _sql_constraints = [("canonical_key_unique", "unique(canonical_key)", "Entity canonical key must be unique.")]


class MoonWitnessContent(models.Model):
    _name = "moon.witness.content"
    _description = "Witness textual content"
    name = fields.Char(required=True)
    passage_id = fields.Many2one("moon.witness.passage", required=True, index=True, ondelete="cascade")
    content_type = fields.Selection([("original", "Original"), ("translation", "Translation"), ("annotation", "Annotation")], required=True, index=True)
    language = fields.Char(index=True)
    edition_id = fields.Many2one("moon.witness.text.edition", index=True, ondelete="set null")
    text = fields.Text(required=True)
    checksum = fields.Char(index=True)
    active = fields.Boolean(default=True)


class MoonWitnessAssertion(models.Model):
    _name = "moon.witness.assertion"
    _description = "Witness assertion"
    name = fields.Char(required=True)
    canonical_key = fields.Char(required=True, index=True)
    subject_id = fields.Many2one("moon.witness.entity", index=True, ondelete="restrict")
    predicate = fields.Char(required=True, index=True)
    object_id = fields.Many2one("moon.witness.entity", index=True, ondelete="restrict")
    statement = fields.Text()
    status = fields.Selection([("draft", "Draft"), ("review", "Review"), ("accepted", "Accepted"), ("rejected", "Rejected")], default="draft", required=True, index=True)
    active = fields.Boolean(default=True)
    _sql_constraints = [("assertion_key_unique", "unique(canonical_key)", "Assertion canonical key must be unique.")]


class MoonWitnessRelation(models.Model):
    _name = "moon.witness.relation"
    _description = "Witness graph relation"
    name = fields.Char(required=True)
    subject_id = fields.Many2one("moon.witness.entity", required=True, index=True, ondelete="cascade")
    relation_type = fields.Char(required=True, index=True)
    object_id = fields.Many2one("moon.witness.entity", required=True, index=True, ondelete="cascade")
    provenance_id = fields.Many2one("moon.witness.provenance", index=True, ondelete="restrict")
    active = fields.Boolean(default=True)


class MoonWitnessResearchRun(models.Model):
    _name = "moon.witness.research.run"
    _description = "Witness research run"
    name = fields.Char(required=True)
    query = fields.Text(required=True)
    status = fields.Selection([("queued", "Queued"), ("running", "Running"), ("completed", "Completed"), ("failed", "Failed")], default="queued", required=True, index=True)
    started_at = fields.Datetime()
    completed_at = fields.Datetime()
    diagnostics = fields.Text()
    requested_by = fields.Many2one("res.users", index=True, ondelete="set null")


class MoonWitnessResearchHypothesis(models.Model):
    _name = "moon.witness.research.hypothesis"
    _description = "Witness research hypothesis"
    name = fields.Char(required=True)
    run_id = fields.Many2one("moon.witness.research.run", index=True, ondelete="cascade")
    statement = fields.Text(required=True)
    status = fields.Selection([("proposed", "Proposed"), ("supported", "Supported"), ("uncertain", "Uncertain"), ("rejected", "Rejected")], default="proposed", required=True, index=True)
    confidence_bp = fields.Integer(default=0)
    evidence_ids = fields.Many2many("moon.witness.evidence", string="Evidence")


class MoonWitnessEngineRun(models.Model):
    _name = "moon.witness.engine.run"
    _description = "Witness engine run"
    name = fields.Char(required=True)
    engine_key = fields.Char(required=True, index=True)
    version = fields.Char(required=True)
    status = fields.Selection([("queued", "Queued"), ("running", "Running"), ("completed", "Completed"), ("failed", "Failed")], default="queued", required=True, index=True)
    input_fingerprint = fields.Char(index=True)
    output_fingerprint = fields.Char(index=True)
    diagnostics = fields.Text()
    started_at = fields.Datetime()
    completed_at = fields.Datetime()


class MoonWitnessEngineResult(models.Model):
    _name = "moon.witness.engine.result"
    _description = "Witness engine result"
    name = fields.Char(required=True)
    run_id = fields.Many2one("moon.witness.engine.run", required=True, index=True, ondelete="cascade")
    result_type = fields.Char(required=True, index=True)
    payload = fields.Json(required=True)
    confidence_bp = fields.Integer(default=0)
    provenance_id = fields.Many2one("moon.witness.provenance", index=True, ondelete="restrict")


class MoonWitnessTextEdition(models.Model):
    _name = "moon.witness.text.edition"
    _description = "Witness text edition"
    name = fields.Char(required=True, index=True)
    source_id = fields.Many2one("moon.witness.source", index=True, ondelete="restrict")
    language = fields.Char(index=True)
    revision = fields.Char(index=True)
    checksum = fields.Char(index=True)
    active = fields.Boolean(default=True, index=True)


class MoonWitnessTraditionCorpus(models.Model):
    _name = "moon.witness.tradition.corpus"
    _description = "Witness tradition corpus"
    name = fields.Char(required=True, index=True)
    slug = fields.Char(required=True, index=True)
    source_id = fields.Many2one("moon.witness.source", index=True, ondelete="restrict")
    edition_id = fields.Many2one("moon.witness.text.edition", index=True, ondelete="set null")
    language = fields.Char(index=True)
    active = fields.Boolean(default=True, index=True)


class MoonWitnessTraditionUnit(models.Model):
    _name = "moon.witness.tradition.unit"
    _description = "Witness tradition unit"
    name = fields.Char(required=True)
    corpus_id = fields.Many2one("moon.witness.tradition.corpus", required=True, index=True, ondelete="cascade")
    stable_key = fields.Char(required=True, index=True)
    sequence = fields.Integer(default=0, index=True)
    text = fields.Text()
    provenance_id = fields.Many2one("moon.witness.provenance", index=True, ondelete="restrict")
    active = fields.Boolean(default=True, index=True)
    _sql_constraints = [("stable_key_unique", "unique(stable_key)", "Tradition unit key must be unique.")]


class MoonWitnessTraditionReference(models.Model):
    _name = "moon.witness.tradition.reference"
    _description = "Witness tradition source reference"
    name = fields.Char(required=True)
    unit_id = fields.Many2one("moon.witness.tradition.unit", required=True, index=True, ondelete="cascade")
    corpus_id = fields.Many2one("moon.witness.tradition.corpus", required=True, index=True, ondelete="cascade")
    edition_id = fields.Many2one("moon.witness.text.edition", index=True, ondelete="set null")
    source_id = fields.Many2one("moon.witness.source", required=True, index=True, ondelete="restrict")
    local_path = fields.Char(index=True)
    local_number = fields.Char(index=True)
    reference_scheme = fields.Char()
    stable_key = fields.Char(required=True, index=True)
    provenance_id = fields.Many2one("moon.witness.provenance", required=True, index=True, ondelete="restrict")
    active = fields.Boolean(default=True, index=True)
    _sql_constraints = [("stable_key_unique", "unique(stable_key)", "Tradition reference key must be unique.")]


class MoonWitnessRoot(models.Model):
    _name = "moon.witness.root"
    _description = "Witness lexical root"
    name = fields.Char(required=True)
    entity_id = fields.Many2one("moon.witness.entity", required=True, index=True, ondelete="restrict")
    stable_key = fields.Char(required=True, index=True)
    language_code = fields.Char(required=True, index=True)
    script = fields.Char(index=True)
    written_form = fields.Char(required=True, index=True)
    transliteration = fields.Char()
    source_id = fields.Many2one("moon.witness.source", index=True, ondelete="restrict")
    provenance_id = fields.Many2one("moon.witness.provenance", index=True, ondelete="restrict")
    active = fields.Boolean(default=True, index=True)


class MoonWitnessLexeme(models.Model):
    _name = "moon.witness.lexeme"
    _description = "Witness lexeme"
    name = fields.Char(required=True)
    entity_id = fields.Many2one("moon.witness.entity", required=True, index=True, ondelete="restrict")
    stable_key = fields.Char(required=True, index=True)
    language_code = fields.Char(required=True, index=True)
    script = fields.Char(index=True)
    lemma = fields.Char(required=True, index=True)
    transliteration = fields.Char()
    root_id = fields.Many2one("moon.witness.root", index=True, ondelete="set null")
    morphology = fields.Text()
    source_id = fields.Many2one("moon.witness.source", index=True, ondelete="restrict")
    provenance_id = fields.Many2one("moon.witness.provenance", index=True, ondelete="restrict")
    active = fields.Boolean(default=True, index=True)


class MoonWitnessSourceManifest(models.Model):
    _name = "moon.witness.source.manifest"
    _description = "Witness source manifest"
    name = fields.Char(required=True, index=True)
    code = fields.Char(required=True, index=True)
    source_id = fields.Many2one("moon.witness.source", index=True, ondelete="restrict")
    source_kind = fields.Char(required=True, index=True)
    parser_version = fields.Char(required=True)
    normalization_version = fields.Char(required=True)
    policy_version = fields.Char(required=True)
    manifest_checksum = fields.Char(index=True)
    active = fields.Boolean(default=True, index=True)
    _sql_constraints = [("manifest_code_unique", "unique(code)", "Manifest code must be unique.")]


class MoonWitnessSourcePolicy(models.Model):
    _name = "moon.witness.source.policy"
    _description = "Witness source policy"
    name = fields.Char(required=True)
    version = fields.Char(required=True, index=True)
    authority_class = fields.Char(required=True, index=True)
    allowed_engine_use = fields.Char(required=True, index=True)
    source_kind = fields.Char(index=True)
    rules = fields.Json(default=dict)
    active = fields.Boolean(default=True, index=True)
    _sql_constraints = [("policy_version_unique", "unique(name, version)", "Policy version must be unique per policy.")]
