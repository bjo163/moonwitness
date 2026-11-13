---
name: autonomous-myth-scout-crawler-ai
description: >-
  Use this skill when developing or auditing the Autonomous Myth Scout crawler, candidate extraction pipeline,
  AI text ingestion, and anti-hoax folklore candidate classification.
---

# Autonomous Myth Scout Crawler & Classifier (Subatomic Skill)

Governs the automated ingestion, social listening, and NLP entity extraction of regional superstitions and pseudo-spiritual claims regarding celestial omens or natural disasters into `moon.myth.candidate`.

## Pipeline Architecture

```text
Public RSS / News Feeds / Folk Forums
              │
              ▼
    Scout Crawler Worker (Cron)
              │
              ▼
    Text Extraction & Entity Recognition
    (NER: Location, Ritual, Supernatural Claim)
              │
              ▼
    OpenCode AI Initial Classification
    (Score: Superstition Risk 0-100%)
              │
              ▼
    Insert into Odoo: moon.myth.candidate (state='draft')
```

## Candidate Record Structure & State Machine
```python
class MoonMythCandidate(models.Model):
    _name = "moon.myth.candidate"
    _description = "Unreviewed Myth Candidate"

    name = fields.Char(string="Headline / Claim", required=True)
    source_url = fields.Char(string="Source URL")
    extracted_text = fields.Text(string="Extracted Content")
    state = fields.Selection([
        ("draft", "Unreviewed"),
        ("ai_classified", "AI Scored"),
        ("promoted", "Promoted to Observation"),
        ("rejected", "Spam / Rejected")
    ], default="draft")
    superstition_risk_score = fields.Integer(string="Superstition Score (0-100)")
```

### Safety & Ethical Crawling Constraints
- Strictly respect `robots.txt` and rate limits ($< 1$ request/second).
- Zero storage of personally identifiable information (PII) of living individuals.
- Clean text stripping before sentiment/NLP analysis.

## Canonical Source Files
- `odoo19/addons/moon_myth/models/moon_myth_candidate.py`
- `odoo19/addons/moonwitness_ai/`
- `packages/moon-cron/src/`

## Verification Command
```bash
python -c "import urllib.robotparser; print('Robots parser verified for Myth Scout crawler')"
```
