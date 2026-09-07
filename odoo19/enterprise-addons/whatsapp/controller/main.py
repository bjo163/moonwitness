# Part of Odoo. See LICENSE file for full copyright and licensing details.

import hashlib
import hmac
import json
import logging
from markupsafe import Markup
from werkzeug.exceptions import Forbidden

from http import HTTPStatus
import os
from odoo import http, _
from odoo.http import request
from odoo.tools import consteq

_logger = logging.getLogger(__name__)


class Webhook(http.Controller):

    @http.route('/whatsapp/webhook/', methods=['POST'], type="jsonrpc", auth="public")
    def webhookpost(self):
        data = json.loads(request.httprequest.data)
        for entry in data['entry']:
            account_id = entry['id']
            account = request.env['whatsapp.account'].sudo().search(
                [('account_uid', '=', account_id)])
            if not self._check_signature(account):
                raise Forbidden()

            for changes in entry.get('changes', []):
                value = changes['value']
                # Extract phone identifiers from webhook payload (support different wrapper payload shapes)
                metadata = value.get('metadata', {}) or {}
                wb_data = value.get('whatsapp_business_api_data', {}) or {}
                phone_number_id = metadata.get('phone_number_id') or wb_data.get('phone_number_id')
                display_phone = metadata.get('display_phone_number') or wb_data.get('display_phone_number')

                wa_account = None
                # Prefer strict match: phone_uid + account_uid
                if phone_number_id:
                    wa_account = request.env['whatsapp.account'].sudo().search([
                        ('phone_uid', '=', phone_number_id), ('account_uid', '=', account_id)], limit=1)
                # Fallback: match by phone_uid only
                if not wa_account and phone_number_id:
                    wa_account = request.env['whatsapp.account'].sudo().search([('phone_uid', '=', phone_number_id)], limit=1)
                # Fallback: match by exact display phone number
                if not wa_account and display_phone:
                    wa_account = request.env['whatsapp.account'].sudo().search([('phone_number', '=', display_phone)], limit=1)
                # Fallback: match by cleaned numeric phone (useful when formatting differs)
                if not wa_account and display_phone:
                    cleaned = ''.join([c for c in display_phone if c.isdigit()])
                    if cleaned:
                        wa_account = request.env['whatsapp.account'].sudo().search([('phone_number', 'ilike', cleaned)], limit=1)

                if wa_account:
                    # Process Messages and Status webhooks
                    if changes['field'] == 'messages':
                        request.env['whatsapp.message']._process_statuses(value)
                        wa_account._process_messages(value)
                else:
                    _logger.debug(
                        "No account matched for webhook entry (entry.id=%s, phone_number_id=%s, display_phone=%s)",
                        account_id, phone_number_id, display_phone
                    )
                    _logger.warning("There is no phone configured for this whatsapp webhook : %s ", data)

                # Process Template webhooks
                if value.get('message_template_id'):
                    # There is no user in webhook, so we need to SUPERUSER_ID to write on template object
                    template = request.env['whatsapp.template'].sudo().with_context(active_test=False).search([('wa_template_uid', '=', value['message_template_id'])])
                    if template:
                        if changes['field'] == 'message_template_status_update':
                            template.write({'status': value['event'].lower()})
                            if value['event'].lower() == 'rejected':
                                body = _("Your Template has been rejected.")
                                description = value.get('other_info', {}).get('description') or value.get('reason')
                                if description:
                                    body += Markup("<br/>") + _("Reason : %s", description)
                                template.message_post(body=body)
                            continue
                        if changes['field'] == 'message_template_quality_update':
                            new_quality_score = value['new_quality_score'].lower()
                            new_quality_score = {'unknown': 'none'}.get(new_quality_score, new_quality_score)
                            template.write({'quality': new_quality_score})
                            continue
                        if changes['field'] == 'template_category_update':
                            template.write({'template_type': value['new_category'].lower()})
                            continue
                        _logger.warning("Unknown Template webhook : %s ", value)
                    else:
                        _logger.warning("No Template found for this webhook : %s ", value)

    @http.route('/whatsapp/webhook/', methods=['GET'], type="http", auth="public", csrf=False)
    def webhookget(self, **kwargs):
        """
            This controller is used to verify the webhook.
            if challenge is matched then it will make response with challenge.
            once it is verified the webhook will be activated.
        """
        token = kwargs.get('hub.verify_token')
        mode = kwargs.get('hub.mode')
        challenge = kwargs.get('hub.challenge')
        if not (token and mode and challenge):
            return Forbidden()
        wa_account = request.env['whatsapp.account'].sudo().search([('webhook_verify_token', '=', token)])
        if mode == 'subscribe' and wa_account:
            response = request.make_response(challenge)
            response.status_code = HTTPStatus.OK
            return response
        response = request.make_response({})
        response.status_code = HTTPStatus.FORBIDDEN
        return response

    def _check_signature(self, business_account):
        """Whatsapp will sign all requests it makes to our endpoint.

        Bypass options:
        - Environment variable `WHATSAPP_SKIP_SIGNATURE_CHECK` (true/1/yes)
        - Per-account boolean `skip_signature_check`
        """
        # Global bypass via env var
        if os.getenv('WHATSAPP_SKIP_SIGNATURE_CHECK', '').lower() in ('1', 'true', 'yes'):
            _logger.warning('Bypassing signature verification via WHATSAPP_SKIP_SIGNATURE_CHECK')
            return True
        # Per-account bypass
        try:
            if business_account and getattr(business_account, 'skip_signature_check', False):
                _logger.warning('Bypassing signature verification for account %s via skip_signature_check flag', getattr(business_account, 'id', 'n/a'))
                return True
        except Exception:
            # be defensive; fallthrough to normal check
            pass

        signature = request.httprequest.headers.get('X-Hub-Signature-256')
        if not signature or not signature.startswith('sha256=') or len(signature) != 71:
            # Signature must be valid SHA-256 (sha256=<64 hex digits>)
            _logger.warning('Invalid signature header %r', signature)
            return False
        if not business_account.app_secret:
            _logger.warning('App-secret is missing, can not check signature')
            return False

        expected = hmac.new(
            business_account.app_secret.encode(),
            msg=request.httprequest.data,
            digestmod=hashlib.sha256,
        ).hexdigest()

        return consteq(signature[7:], expected)
