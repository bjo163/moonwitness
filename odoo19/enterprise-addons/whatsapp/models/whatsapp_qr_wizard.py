from odoo import api, fields, models


class WhatsappQRWizard(models.TransientModel):
    _name = 'whatsapp.qr.wizard'
    _description = 'WhatsApp QR Preview'

    qr_html = fields.Html(string='QR Preview', readonly=True)
