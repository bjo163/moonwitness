import json
import logging
import re
import urllib.request
import xml.etree.ElementTree as ET
from odoo import api, fields, models
from odoo.exceptions import UserError

_logger = logging.getLogger(__name__)

SEARCH_QUERIES = [
    "ritual adat tradisi sesaji indonesia",
    "larung sesaji sedekah laut tolak bala",
    "sedekah bumi ritual panen pemujaan",
    "upacara mistis makam keramat leluhur",
]


class MoonMythCandidate(models.Model):
    _name = "moon.myth.candidate"
    _description = "Autonomous Scout Mythos Candidate"
    _order = "discovered_date desc, id desc"

    name = fields.Char(string="Article / Finding Title", required=True, index=True)
    source_url = fields.Char(string="Source Article URL", required=True, index=True)
    publisher = fields.Char(string="Publisher / Media Source")
    discovered_date = fields.Datetime(string="Discovered Date", default=fields.Datetime.now)
    raw_snippet = fields.Text(string="Raw Article Snippet")

    # Pipeline status
    state = fields.Selection(
        [
            ("DISCOVERED", "Discovered"),
            ("SOURCE_CHECK", "Source Checked"),
            ("ANALYZED", "AI Analyzed"),
            ("PROMOTED", "Promoted to Observation"),
            ("REJECTED", "Rejected / Irrelevant"),
        ],
        string="Pipeline State",
        default="DISCOVERED",
        required=True,
        index=True,
    )

    # AI Extraction Results
    extracted_myth_name = fields.Char(string="Identified Mythos / Practice")
    extracted_category = fields.Selection(
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
    )
    extracted_location = fields.Char(string="Location / Region")
    extracted_actor = fields.Char(string="Community / Actor")
    extracted_summary = fields.Text(string="Practice Summary")
    extracted_evidence_score = fields.Integer(string="Evidence Score (%)", default=80)
    extracted_tauhid_gap = fields.Integer(string="Tauhid Gap (%)", default=50)
    theological_critique = fields.Text(string="Theological & Tauhid Critique")

    # Linkage to master once promoted
    myth_id = fields.Many2one("moon.myth", string="Linked Master Mythos")
    observation_id = fields.Many2one("moon.myth.observation", string="Created Observation")

    @api.model
    def autonomous_scout_news(self, query=None, limit=10):
        """
        Browses live news via Google News RSS, checks for mythos/ritual practices,
        and saves candidates as DISCOVERED.
        """
        queries = [query] if query else SEARCH_QUERIES
        created_candidates = self.env["moon.myth.candidate"]

        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            )
        }

        for q in queries:
            try:
                encoded_q = urllib.parse.quote(q)
                url = f"https://news.google.com/rss/search?q={encoded_q}&hl=id&gl=ID&ceid=ID:id"
                req = urllib.request.Request(url, headers=headers)
                with urllib.request.urlopen(req, timeout=12) as resp:
                    xml_data = resp.read()

                root = ET.fromstring(xml_data)
                items = root.findall(".//item")
                _logger.info("Autonomous Scout found %d articles for query: %s", len(items), q)

                for item in items[:limit]:
                    title_elem = item.find("title")
                    link_elem = item.find("link")
                    pub_date_elem = item.find("pubDate")
                    source_elem = item.find("source")

                    title = title_elem.text if title_elem is not None else "No Title"
                    link = link_elem.text if link_elem is not None else ""
                    publisher = source_elem.text if source_elem is not None else "Google News"

                    # Skip duplicate URLs
                    if not link or self.search([("source_url", "=", link)], limit=1):
                        continue

                    # Filter irrelevant topics using quick keyword matching
                    lower_title = title.lower()
                    must_keywords = ["ritual", "adat", "sesaji", "tradisi", "larung", "pemujaan", "keramat", "makam", "sedekah"]
                    if not any(k in lower_title for k in must_keywords):
                        continue

                    cand = self.create({
                        "name": title,
                        "source_url": link,
                        "publisher": publisher,
                        "raw_snippet": f"Published: {pub_date_elem.text if pub_date_elem is not None else ''}",
                        "state": "DISCOVERED",
                    })
                    created_candidates |= cand

            except Exception as e:
                _logger.warning("Error scouting news for query '%s': %s", q, e)

        _logger.info("Autonomous Scout created %d new candidates", len(created_candidates))
        return created_candidates

    def action_analyze_with_ai(self):
        """
        Uses OpenCode Free AI Service to read and analyze the candidate,
        extracting entities, scores, and Tauhid critique.
        """
        ai_service = self.env["moon.witness.ai.service"]

        for record in self:
            prompt = f"""
Anda adalah peneliti spesialis observatori 'MoonWitness — Counter-Mythos & Tauhid Review'.
Tugas Anda menganalisis laporan ritual atau mitos adat berikut:

Judul Berita: {record.name}
Penerbit: {record.publisher}
Link Sumber: {record.source_url}

Instruksi Analisis:
1. Apakah ini benar-benar laporan ritual/praktik mitos adat di Indonesia? Jika tidak, jelaskan.
2. Identifikasi nama mitos/praktik utamanya (contoh: "Larung Sesaji Pantai Parangtritis", "Tradisi Sedekah Bumi", "Ritual Tolak Bala").
3. Kategori: pilih satu dari [AGRARIAN, ANCESTOR, COSMIC, MARITIME, FOLKLORE, SYNCRETIC, OTHER].
4. Lokasi pelaksanaan (Desa/Kabupaten/Provinsi).
5. Pelaku/komunitas adat yang mempraktikkan.
6. Ringkasan observasi praktik (1-2 paragraf padat).
7. Evidence Score (angka 0-100, seberapa meyakinkan sumber berita).
8. Tauhid Gap Score (angka 0-100, seberapa jauh praktik ini menyimpang dari Tauhid Islam murni. Jika memohon rezeki/keselamatan kepada jin/makhluk gaib selain Allah, skor berkisar 60-95).
9. Tauhid & Theological Critique: Uraian jernih berdasar aqidah Islam dan pemurnian ibadah hanya kepada Allah SWT.

Balas HANYA dalam format JSON valid berikut:
{{
  "is_relevant_myth": true,
  "myth_name": "...",
  "category": "...",
  "location": "...",
  "actor": "...",
  "summary": "...",
  "evidence_score": 85,
  "tauhid_gap": 75,
  "critique": "..."
}}
"""
            messages = [
                {"role": "system", "content": "You are a research analyst outputting raw valid JSON only."},
                {"role": "user", "content": prompt}
            ]

            try:
                res = ai_service.chat_completion_free(messages, temperature=0.2)
                content = res.get("content", "").strip()

                # Extract JSON block
                json_match = re.search(r"\{.*\}", content, re.DOTALL)
                if json_match:
                    data = json.loads(json_match.group(0))
                    if data.get("is_relevant_myth"):
                        record.write({
                            "extracted_myth_name": data.get("myth_name") or record.name,
                            "extracted_category": data.get("category", "OTHER"),
                            "extracted_location": data.get("location") or "Indonesia",
                            "extracted_actor": data.get("actor") or "Masyarakat Lokal",
                            "extracted_summary": data.get("summary") or "",
                            "extracted_evidence_score": int(data.get("evidence_score", 80)),
                            "extracted_tauhid_gap": int(data.get("tauhid_gap", 50)),
                            "theological_critique": data.get("critique") or "",
                            "state": "ANALYZED",
                        })
                    else:
                        record.state = "REJECTED"
                else:
                    record.theological_critique = content
                    record.state = "ANALYZED"

            except Exception as e:
                _logger.error("AI Analysis failed for candidate %s: %s", record.id, e)
                raise UserError(f"AI analysis error: {e}")

    def action_promote_to_observation(self):
        """
        Promotes the analyzed candidate into a published master 'moon.myth'
        and creates a new 'moon.myth.observation' record.
        """
        myth_model = self.env["moon.myth"]
        obs_model = self.env["moon.myth.observation"]

        for record in self:
            myth_name = record.extracted_myth_name or record.name
            
            # Find or create master Mythos
            myth = myth_model.search([("name", "=ilike", myth_name)], limit=1)
            if not myth:
                myth = myth_model.create({
                    "name": myth_name,
                    "category": record.extracted_category or "OTHER",
                    "theological_status": "UNDER_REVIEW" if record.extracted_tauhid_gap < 70 else "TAUHID_VIOLATION",
                    "description": record.extracted_summary,
                    "theological_critique": record.theological_critique,
                })

            # Create field observation
            today = fields.Date.today()
            obs = obs_model.create({
                "name": f"{myth_name} - {record.extracted_location or 'Observasi'}",
                "obs_code": f"OBS-{today.strftime('%Y-%m')}-{record.id:03d}",
                "myth_id": myth.id,
                "month": today.strftime("%Y-%m"),
                "date_display": today.strftime("%d %b %Y"),
                "date_start": today,
                "date_end": today,
                "location": record.extracted_location or "Indonesia",
                "actor": record.extracted_actor or "Komunitas Adat",
                "summary": record.extracted_summary or record.raw_snippet,
                "evidence_score": record.extracted_evidence_score,
                "tauhid_gap": record.extracted_tauhid_gap,
                "causality": 0,
                "source_url": record.source_url,
                "note": f"Promoted from autonomous candidate ID {record.id}.",
            })

            record.write({
                "myth_id": myth.id,
                "observation_id": obs.id,
                "state": "PROMOTED",
            })
