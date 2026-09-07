# Part of Odoo. See LICENSE file for full copyright and licensing details.
# Part of Odoo. See LICENSE file for full copyright and licensing details.

import logging
import mimetypes
import psycopg2
import secrets
import string
from markupsafe import Markup

from odoo import SUPERUSER_ID, api, fields, models, _
from odoo.exceptions import UserError, ValidationError
from odoo.addons.whatsapp.tools.whatsapp_api import WhatsAppApi
from odoo.addons.whatsapp.tools.whatsapp_exception import WhatsAppError
from odoo.modules.registry import Registry
from odoo.tools import plaintext2html

_logger = logging.getLogger(__name__)

import os
import requests

DEFAULT_WA_SERVER = os.getenv('WHATSAPP_DEFAULT_ENDPOINT', 'http://baileys-wrapper:3000')


class WhatsappAccount(models.Model):
    _name = 'whatsapp.account'
    _inherit = ['mail.thread']
    _description = 'WhatsApp Business Account'

    name = fields.Char(string="Name", required=True, tracking=1)
    active = fields.Boolean(default=True, tracking=6)

    # Only Baileys-relevant fields required
    device_id = fields.Char(string="Device ID", required=True, help="Device identifier on the WA server")
    token = fields.Char(
        string="Access Token",
        required=True,
        groups='whatsapp.group_whatsapp_admin',
        default=lambda self: os.getenv('WHATSAPP_DEFAULT_TOKEN', ''),
        help="Defaults to the WHATSAPP_DEFAULT_TOKEN environment variable if not set when creating an account.")

    # Optional/for compatibility, not required for Baileys
    app_uid = fields.Char(string="App ID", required=False, tracking=2)
    app_secret = fields.Char(string="App Secret", groups='whatsapp.group_whatsapp_admin', required=False)
    # When True, incoming webhook requests for this account won't be signature-verified.
    # Useful for non-Meta wrappers that don't provide X-Hub-Signature-256.
    skip_signature_check = fields.Boolean(string="Skip Signature Check", default=False,
        help="If set, Odoo will not verify the X-Hub-Signature-256 for incoming webhooks for this account.")
    account_uid = fields.Char(string="Account ID", required=False, tracking=3)
    phone_uid = fields.Char(string="Phone Number ID", required=False, tracking=4)
    phone_number = fields.Char(string="Phone Number", copy=False, readonly=True,
        help="The phone number used in the Whatsapp Business Account.")
    qr_link = fields.Char(string="QR Link", readonly=True, help="Last QR login link returned by server")
    qr_duration = fields.Integer(string="QR Duration (s)", readonly=True)
    pair_code = fields.Char(string="Pairing Code", readonly=True)
    is_connected = fields.Boolean(string="Is Connected", default=False, readonly=True, compute='_compute_is_connected', store=True)
    webhook_verify_token = fields.Char(string="Webhook Verify Token", compute='_compute_verify_token',
                                       groups='whatsapp.group_whatsapp_admin', store=True)
    callback_url = fields.Char(string="Callback URL", compute='_compute_callback_url', readonly=True, copy=False)
    debug_logging = fields.Boolean(string="Debug logging", help="Log requests in order to ease debugging")

    allowed_company_ids = fields.Many2many(
        comodel_name='res.company', string="Allowed Company",
        default=lambda self: self.env.company)
    notify_user_ids = fields.Many2many(
        comodel_name='res.users', default=lambda self: self.env.user,
        domain=[('share', '=', False)], required=False, tracking=5,
        help="Users to notify when a message is received and there is no template send in last 15 days")

    templates_count = fields.Integer(string="Message Count", compute='_compute_templates_count')

    _phone_uid_unique = models.Constraint(
        'unique(phone_uid)',
        "The same phone number ID already exists",
    )

    @api.constrains('notify_user_ids')
    def _check_notify_user_ids(self):
        for phone in self:
            if len(phone.notify_user_ids) < 1:
                raise ValidationError(_("Users to notify is required"))

    def _compute_callback_url(self):
        for account in self:
            account.callback_url = self.get_base_url() + '/whatsapp/webhook'

    @api.depends('account_uid')
    def _compute_verify_token(self):
        """ webhook_verify_token only set when record is created. Not update after that."""
        for rec in self:
            if rec.id and not rec.webhook_verify_token:
                rec.webhook_verify_token = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(8))

    def _compute_templates_count(self):
        for tmpl in self:
            tmpl.templates_count = self.env['whatsapp.template'].search_count([('wa_account_id', 'in', tmpl.ids)])

    def _fill_phone_from_uid(self):
        """Fill `phone_number` from `phone_uid` when `phone_number` is empty."""
        for rec in self:
            if not rec.phone_number and rec.phone_uid:
                # use context flag to avoid triggering the fill logic again
                rec.with_context(whatsapp_skip_fill_phone=True).write({'phone_number': rec.phone_uid})

    @api.model
    def create(self, vals):
        """Ensure token defaults to WHATSAPP_DEFAULT_TOKEN env var when not provided.

        Accept both a single dict and a list of dicts (created via ORM bulk create).
        Also auto-fill `phone_number` from `phone_uid` when admin only sets `phone_uid`.
        """
        default_token = os.getenv('WHATSAPP_DEFAULT_TOKEN', '')
        # If vals is a list (bulk create), populate token for each dict item
        if isinstance(vals, list):
            if default_token:
                for v in vals:
                    if not v.get('token'):
                        v['token'] = default_token
        else:
            if not vals.get('token'):
                vals['token'] = default_token
        res = super(WhatsappAccount, self).create(vals)
        # Auto-fill phone_number when left empty but phone_uid is present
        try:
            res._fill_phone_from_uid()
        except Exception:
            # silently ignore any fill errors to avoid failing create
            pass
        return res

    def write(self, vals):
        """Extend write to auto-fill `phone_number` from `phone_uid` when empty."""
        res = super(WhatsappAccount, self).write(vals)
        # Avoid recursion if called from _fill_phone_from_uid via context flag
        if self.env.context.get('whatsapp_skip_fill_phone'):
            return res
        to_fill = self.filtered(lambda r: not r.phone_number and r.phone_uid)
        for rec in to_fill:
            # write per-record, but set context flag so this secondary write won't loop
            rec.with_context(whatsapp_skip_fill_phone=True).write({'phone_number': rec.phone_uid})
        return res

    @api.model
    def set_default_token_for_existing(self):
        """Helper to set the default token for existing records that have blank token.

        Usage (Odoo shell):
            env['whatsapp.account'].set_default_token_for_existing()
        """
        default_token = os.getenv('WHATSAPP_DEFAULT_TOKEN', '')
        if not default_token:
            _logger.warning('WHATSAPP_DEFAULT_TOKEN not set; no changes applied.')
            return False
        accounts = self.search([('token', '=', False)])
        if accounts:
            accounts.write({'token': default_token})
            return True
        return True

    def button_sync_whatsapp_account_templates(self):
        """
            This method will sync all the templates of the WhatsApp Business Account.
            It will create new templates and update existing templates.
        """
        self.ensure_one()
        try:
            response = WhatsAppApi(self)._get_all_template(fetch_all=True)
            wa_phone_number = WhatsAppApi(self)._get_phone_number(self.phone_uid)
            if wa_phone_number:
                self.phone_number = wa_phone_number
        except WhatsAppError as err:
            raise ValidationError(str(err)) from err

        WhatsappTemplate = self.env['whatsapp.template']
        existing_tmpls = WhatsappTemplate.with_context(active_test=False).search([('wa_account_id', '=', self.id)])
        existing_tmpl_by_id = {t.wa_template_uid: t for t in existing_tmpls}
        template_update_count = 0
        template_create_count = 0
        if response.get('data'):
            create_vals = []
            for template in response['data']:
                existing_tmpl = existing_tmpl_by_id.get(template['id'])
                if existing_tmpl:
                    template_update_count += 1
                    existing_tmpl._update_template_from_response(template)
                else:
                    template_create_count += 1
                    create_vals.append(WhatsappTemplate._create_template_from_response(template, self))
            WhatsappTemplate.create(create_vals)
        return {
            'type': 'ir.actions.client',
            'tag': 'display_notification',
            'params': {
                'title': _("Templates synchronized!"),
                'type': 'success',
                'message': _("%(create_count)s were created, %(update_count)s were updated",
                    create_count=template_create_count, update_count=template_update_count),
                'next': {'type': 'ir.actions.act_window_close'},
            }
        }

    def button_test_connection(self):
        """ Test connection of the WhatsApp Business Account. with the given credentials.
        """
        self.ensure_one()
        wa_api = WhatsAppApi(self)
        try:
            wa_api._test_connection()
            wa_phone_number = wa_api._get_phone_number(self.phone_uid)
            if wa_phone_number:
                self.phone_number = wa_phone_number
        except WhatsAppError as e:
            raise UserError(str(e))
        return {
            'type': 'ir.actions.client',
            'tag': 'display_notification',
            'params': {
                'type': 'success',
                'message': _("Credentials look good!"),
                'next': {'type': 'ir.actions.act_window_close'},
            }
        }

    def action_debug(self):
        """Enable debug logging."""
        self.ensure_one()
        previous_debug_state = self.debug_logging
        self.debug_logging = True
        return {
                'type': 'ir.actions.client',
                'tag': 'display_notification',
                'params': {
                    'title': _('Warning'),
                    'type': 'warning',
                    'message': _('Enabling WhatsApp debug stops medias (pictures, videos, pdf, ...) from being received.'),
                },
            } if not previous_debug_state else None

    def action_stop_debug(self):
        """Disable debug logging."""
        self.ensure_one()
        self.debug_logging = False

    def action_open_templates(self):
        self.ensure_one()
        return {
            'name': _("Templates Of %(account_name)s", account_name=self.name),
            'view_mode': 'list,form',
            'res_model': 'whatsapp.template',
            'domain': [('wa_account_id', '=', self.id)],
            'type': 'ir.actions.act_window',
            'context': {'default_wa_account_id': self.id},
        }

    def _add_ir_log(self, name, message, func=''):
        self.ensure_one()
        self.env.flush_all()
        db_name = self.env.cr.dbname
        # Use a new cursor to avoid rollback that could be caused by an upper method
        try:
            db_registry = Registry(db_name)
            with db_registry.cursor() as cr:
                env = api.Environment(cr, SUPERUSER_ID, {})
                env['ir.logging'].create({
                    'dbname': db_name,
                    'func': func,
                    'level': 'DEBUG',
                    'line': '',
                    'message': message,
                    'name': name,
                    'path': f'whatsapp.account,id={self.id},name={self.name}',
                    'type': 'server',
                })
        except psycopg2.Error:
            pass

    def _wa_server_url(self):
        """Return the configured WA server endpoint (wrapper) to use for device operations."""
        # Prefer explicit env var, fallback to constant used by whatsapp_api module
        return os.getenv('WHATSAPP_DEFAULT_ENDPOINT', DEFAULT_WA_SERVER)

    @api.depends('device_id', 'token')
    def _compute_is_connected(self):
        """Compute connection status by querying the BAILEYS wrapper server for device info."""
        for rec in self:
            rec.is_connected = False
            if not rec.device_id:
                _logger.warning(f"Device {rec.id} has no device_id set.")
                continue
            wa_url = rec._wa_server_url()
            if not wa_url:
                _logger.warning(f"Device {rec.id} has no wa_server_url set.")
                continue
            try:
                headers = {}
                token = rec.token
                if token:
                    headers['Authorization'] = f"Bearer {token}"
                resp = requests.get(f"{wa_url.rstrip('/')}/devices/{rec.device_id}", headers=headers, timeout=5)
                if resp.status_code != 200:
                    _logger.warning(f"Device {rec.id} status request failed: HTTP {resp.status_code}")
                    rec.is_connected = False
                    continue
                data = resp.json() if resp.text else {}
                res = data.get('results') or {}
                if 'connected' not in res:
                    _logger.warning(f"Device {rec.id} response missing 'connected' field: {res}")
                rec.is_connected = bool(res.get('connected', False))
                # update device info when available
                if res.get('phone_uid'):
                    rec.phone_uid = res.get('phone_uid')
                    if not rec.phone_number:
                        rec.phone_number = res.get('phone_uid')
            except Exception as e:
                _logger.error(f'Error fetching device status for {rec.id}: {e}')
                rec.is_connected = False

    def button_refresh_connection(self):
        """Manually refresh connection status by querying wrapper."""
        self.ensure_one()
        try:
            self._compute_is_connected()
            return {
                'type': 'ir.actions.client',
                'tag': 'display_notification',
                'params': {
                    'title': _('Refreshed'),
                    'message': _('Connection status refreshed.'),
                    'type': 'success',
                    'sticky': False,
                },
            }
        except Exception as e:
            raise UserError(_('Failed to refresh connection status: %s') % e)

    def create_device(self, preferred_id=None):
        """Create a device slot on the configured WA server and store `device_id`.

        The wrapper endpoint is expected to accept POST /devices and return
        JSON with {"results": {"id": ...}} or {"results": "..."}.
        """
        self.ensure_one()
        wa_url = self._wa_server_url()
        if not wa_url:
            raise UserError(_('No WhatsApp wrapper server configured (WHATSAPP_DEFAULT_ENDPOINT)'))
        try:
            headers = {'Content-Type': 'application/json'}
            token = self.token
            if token:
                headers['Authorization'] = f"Bearer {token}"
            payload = {}
            if preferred_id:
                payload['device_id'] = preferred_id
            resp = requests.post(wa_url.rstrip('/') + '/devices', headers=headers, json=payload, timeout=10)
            data = resp.json() if resp.text else {}
            if resp.status_code in (200, 201):
                if 'error' in data:
                    detail = data.get('detail') or data['error']
                    raise UserError(_('Failed to create device: %s') % detail)
                dev = None
                if isinstance(data.get('results'), dict):
                    dev = data['results'].get('id') or data['results'].get('device_id')
                if not dev and isinstance(data.get('results'), str):
                    dev = data.get('results')
                self.device_id = dev or preferred_id or self.device_id
                return True
            else:
                detail = data.get('detail') or resp.text or resp.status_code
                raise UserError(_('Failed to create device: %s') % detail)
        except UserError:
            raise
        except Exception as e:
            _logger.exception('Error creating device for account %s: %s', self.id, e)
            raise UserError(_('Error creating device: %s') % e)

    def start_qr_login(self):
        """Start QR login for this account via the wrapper and store `qr_link`/`qr_duration`.

        Calls GET /devices/{device_id}/login on the wrapper.
        """
        self.ensure_one()
        wa_url = self._wa_server_url()
        if not wa_url:
            raise UserError(_('No WhatsApp wrapper server configured (WHATSAPP_DEFAULT_ENDPOINT)'))
        if not self.device_id:
            preferred = (self.name or 'odoo-account').strip().lower().replace(' ', '-')
            self.create_device(preferred_id=preferred)
        try:
            headers = {}
            token = self.token
            if token:
                headers['Authorization'] = f"Bearer {token}"
            resp = requests.get(f"{wa_url.rstrip('/')}/devices/{self.device_id}/login", headers=headers, timeout=10)
            data = resp.json() if resp.text else {}
            if resp.status_code == 200:
                if 'error' in data:
                    detail = data.get('detail') or data['error']
                    raise UserError(_('Failed to start QR login: %s') % detail)
                res = data.get('results') or {}
                # Prefer raw base64 `qr_b64` when provided by the wrapper
                qr_b64 = res.get('qr_b64')
                if qr_b64:
                    self.qr_link = 'data:image/png;base64,' + qr_b64
                else:
                    self.qr_link = res.get('qr_link') or self.qr_link
                self.qr_duration = res.get('qr_duration') or self.qr_duration
                # Build HTML for the wizard. Many Odoo deployments sanitize HTML and
                # strip <iframe> tags, which results in an empty popup. Prefer
                # embedding the QR as an <img> when a data URL/base64 is available;
                # otherwise provide a simple link to the wrapper preview page.
                qr_page = res.get('qr_page') or f"{wa_url.rstrip('/')}/devices/{self.device_id}/qr_html"
                # read refresh seconds from environment, default to 30
                refresh = int(os.getenv('WHATSAPP_QR_REFRESH_SECONDS', '30'))
                iframe_src = f"{qr_page}?refresh={refresh}"
                Wizard = self.env['whatsapp.qr.wizard']
                img_src = None
                if qr_b64:
                    img_src = 'data:image/png;base64,' + qr_b64
                elif (self.qr_link or '').startswith('data:'):
                    img_src = self.qr_link
                if img_src:
                    html = f'<div style="text-align:center;"><img src="{img_src}" style="max-width:100%;height:420px;border:none;"/></div>'
                else:
                    # fallback to a safe link if iframe will be stripped by sanitizer
                    html = f'<div style="text-align:center;"><a href="{iframe_src}" target="_blank">Open QR preview</a></div>'
                wiz = Wizard.create({'qr_html': html})
                view_id = self.env.ref('whatsapp.whatsapp_qr_wizard_form').id
                return {
                    'type': 'ir.actions.act_window',
                    'res_model': 'whatsapp.qr.wizard',
                    'res_id': wiz.id,
                    'view_mode': 'form',
                    'view_id': view_id,
                    'target': 'new',
                }
            else:
                detail = data.get('detail') or resp.text or resp.status_code
                _logger.warning('QR login start failed %s for account %s', resp.status_code, self.id)
                raise UserError(_('Failed to start QR login: %s') % detail)
        except Exception as e:
            _logger.exception('Error starting QR login for account %s: %s', self.id, e)
            raise UserError(_('Error starting QR login: %s') % e)

    def start_pairing_code(self, phone=None):
        """Request a pairing code for `phone` from the wrapper (POST /devices/{device_id}/login/code).

        When invoked from the UI the button does not pass arguments, so `phone` may be None.
        In that case we use the configured `phone_number` on the account. If no phone is
        available we raise a user-friendly error.
        """
        self.ensure_one()
        if phone is None:
            # prefer the explicit phone_number field; if empty, fall back to phone_uid (some deployments store the number there)
            phone = self.phone_number or self.phone_uid
        if not phone:
            raise UserError(_('A phone number is required to request a pairing code. Please set the Phone Number on the account or pass it as an argument.'))
        wa_url = self._wa_server_url()
        if not wa_url:
            raise UserError(_('No WhatsApp wrapper server configured (WHATSAPP_DEFAULT_ENDPOINT)'))
        if not self.device_id:
            preferred = (self.name or 'odoo-account').strip().lower().replace(' ', '-')
            self.create_device(preferred_id=preferred)
        try:
            headers = {'Content-Type': 'application/json'}
            token = self.token
            if token:
                headers['Authorization'] = f"Bearer {token}"
            # Send phone in both params and body for compatibility, but body must not be empty
            params = {'phone': phone}
            json_body = {'phone': phone}
            resp = requests.post(f"{wa_url.rstrip('/')}/devices/{self.device_id}/login/code", headers=headers, params=params, json=json_body, timeout=10)
            data = resp.json() if resp.text else {}
            if resp.status_code == 200:
                if 'error' in data:
                    detail = data.get('detail') or data['error']
                    raise UserError(_('Failed to request pairing code: %s') % detail)
                res = data.get('results') or {}
                self.pair_code = res.get('pair_code') or self.pair_code
                # When invoked from the UI, show the pairing code in a notification
                return {
                    'type': 'ir.actions.client',
                    'tag': 'display_notification',
                    'params': {
                        'title': 'Pairing Code',
                        'message': f"Pairing code: {self.pair_code}",
                        'sticky': False,
                    }
                }
            else:
                detail = data.get('detail') or resp.text or resp.status_code
                _logger.warning('Pairing code request failed %s for account %s', resp.status_code, self.id)
                raise UserError(_('Failed to request pairing code: %s') % detail)
        except Exception as e:
            _logger.exception('Error requesting pairing code for account %s: %s', self.id, e)
            raise UserError(_('Error requesting pairing code: %s') % e)

    def button_test_send_message(self):
        """Send a test WhatsApp message to the account's phone_number using the configured API.

        This uses the Odoo sending flow: create a `mail.message` and `whatsapp.message`, then call
        the message `_send()` method so the existing queue, template and logging behaviour is used.
        """
        self.ensure_one()
        # Prefer explicit phone_number, fall back to phone_uid (some deployments store the number there)
        phone = self.phone_number or self.phone_uid
        if not phone:
            raise UserError(_('No phone number set on this account.'))

        partner = self.env.user.partner_id
        subtype_id = self.env['ir.model.data']._xmlid_to_res_id('mail.mt_note')
        mail_vals = {
            'body': 'Test message from Odoo WhatsApp integration.',
            'message_type': 'whatsapp_message',
            'subtype_id': subtype_id,
            'partner_ids': [(6, 0, [partner.id])],
            # Do not set res_model/res_id to avoid _get_reply_to KeyError in environments where
            # receiver reply-to mapping returns no entry for the partner (see RPC_ERROR stacktrace).
            # This is just a test message and does not need to be linked to a specific record.
        }
        mail_message = self.env['mail.message'].create(mail_vals)

        wa_message_vals = {
            'mail_message_id': mail_message.id,
            'mobile_number': phone,
            'mobile_number_formatted': phone,
            'wa_account_id': self.id,
            'message_type': 'outbound',
            'state': 'outgoing',
        }
        wa_message = self.env['whatsapp.message'].create(wa_message_vals)

        try:
            wa_message._send()
            return {
                'type': 'ir.actions.client',
                'tag': 'display_notification',
                'params': {
                    'title': 'Test Message Sent',
                    'message': f'Successfully queued test message to {phone}.',
                    'sticky': False,
                }
            }
        except Exception as e:
            raise UserError(_('Failed to send test message: %s') % e)

    def _find_active_channel(self, sender_mobile_formatted, sender_name=False, create_if_not_found=False):
        """This method will find the active channel for the given sender mobile number."""
        self.ensure_one()
        whatsapp_message = self.env['whatsapp.message'].sudo().search(
            [
                ('mobile_number_formatted', '=', sender_mobile_formatted),
                ('wa_account_id', '=', self.id),
                ('wa_template_id', '!=', False),
                ('state', 'not in', ['outgoing', 'error', 'cancel']),
            ], limit=1, order='id desc')
        return self.env['discuss.channel'].sudo()._get_whatsapp_channel(
            whatsapp_number=sender_mobile_formatted or '',
            wa_account_id=self,
            sender_name=sender_name,
            create_if_not_found=create_if_not_found,
            related_message=whatsapp_message.mail_message_id,
        )

    def _process_messages(self, value):
        """
            This method is used for processing messages with the values received via webhook.
            If any whatsapp message template has been sent from this account then it will find the active channel or
            create new channel with last template message sent to that number and post message in that channel.
            And if channel is not found then it will create new channel with notify user set in account and post message.
            Supported Messages
             => Text Message
             => Attachment Message with caption
             => Location Message
             => Contact Message
             => Message Reactions
        """
        if 'messages' not in value and value.get('whatsapp_business_api_data', {}).get('messages'):
            value = value['whatsapp_business_api_data']

        wa_api = WhatsAppApi(self)

        for messages in value.get('messages', []):
            parent_msg_id = False
            parent_id = False
            channel = False
            sender_name = value.get('contacts', [{}])[0].get('profile', {}).get('name')
            sender_mobile = messages['from']
            message_type = messages['type']
            if 'context' in messages and messages['context'].get('id'):
                parent_whatsapp_message = self.env['whatsapp.message'].sudo().search([('msg_uid', '=', messages['context']['id'])])
                if parent_whatsapp_message:
                    parent_msg_id = parent_whatsapp_message.id
                    parent_id = parent_whatsapp_message.mail_message_id
                if parent_id:
                    channel = self.env['discuss.channel'].sudo().search([('message_ids', 'in', parent_id.id)], limit=1)

            if not channel:
                channel = self._find_active_channel(sender_mobile, sender_name=sender_name, create_if_not_found=True)
            kwargs = {
                'message_type': 'whatsapp_message',
                'author_id': channel.whatsapp_partner_id.id,
                'parent_msg_id': parent_msg_id,
                'subtype_xmlid': 'mail.mt_comment',
                'parent_id': parent_id.id if parent_id else None,
            }
            if message_type == 'text':
                kwargs['body'] = plaintext2html(messages['text']['body'])
            elif message_type == 'button':
                kwargs['body'] = messages['button']['text']
            elif message_type in ('document', 'image', 'audio', 'video', 'sticker'):
                filename = messages[message_type].get('filename')
                is_voice = messages[message_type].get('voice')
                mime_type = messages[message_type].get('mime_type')
                caption = messages[message_type].get('caption')
                datas = wa_api._get_whatsapp_document(messages[message_type]['id'])
                if not filename:
                    extension = mimetypes.guess_extension(mime_type) or ''
                    filename = message_type + extension
                kwargs['attachments'] = [(filename, datas, {'voice': is_voice})]
                if caption:
                    kwargs['body'] = plaintext2html(caption)
            elif message_type == 'location':
                url = Markup("https://maps.google.com/maps?q={latitude},{longitude}").format(
                    latitude=messages['location']['latitude'], longitude=messages['location']['longitude'])
                body = Markup('<a target="_blank" href="{url}"> <i class="fa fa-map-marker"/> {location_string} </a>').format(
                    url=url, location_string=_("Location"))
                if messages['location'].get('name'):
                    body += Markup("<br/>{location_name}").format(location_name=messages['location']['name'])
                if messages['location'].get('address'):
                    body += Markup("<br/>{location_address}").format(location_address=messages['location']['address'])
                kwargs['body'] = body
            elif message_type == 'contacts':
                body = ""
                for contact in messages['contacts']:
                    body += Markup("<i class='fa fa-address-book'/> {contact_name} <br/>").format(
                        contact_name=contact.get('name', {}).get('formatted_name', ''))
                    for phone in contact.get('phones'):
                        body += Markup("{phone_type}: {phone_number}<br/>").format(
                            phone_type=phone.get('type'), phone_number=phone.get('phone'))
                kwargs['body'] = body
            elif message_type == 'reaction':
                msg_uid = messages['reaction'].get('message_id')
                whatsapp_message = self.env['whatsapp.message'].sudo().search([('msg_uid', '=', msg_uid)])
                if whatsapp_message:
                    partner_id = channel.whatsapp_partner_id
                    emoji = messages['reaction'].get('emoji')
                    whatsapp_message.mail_message_id._post_whatsapp_reaction(reaction_content=emoji, partner_id=partner_id)
                    continue
            else:
                _logger.warning("Unsupported whatsapp message type: %s", messages)
                continue
            channel.message_post(whatsapp_inbound_msg_uid=messages['id'], **kwargs)

    def button_logout(self):
        """Logout the WhatsApp device associated with this account."""
        self.ensure_one()
        if not self.device_id:
            raise UserError(_('No device ID associated with this account.'))

        try:
            url = f"{self.callback_url}/devices/{self.device_id}/logout"
            headers = {"Authorization": f"Bearer {self.token}"}
            response = requests.post(url, headers=headers, timeout=10)
            response.raise_for_status()
            self.is_connected = False
            return {
                'type': 'ir.actions.client',
                'tag': 'display_notification',
                'params': {
                    'title': _('Logout Successful'),
                    'message': _('Device has been logged out successfully.'),
                    'sticky': False,
                }
            }
        except requests.RequestException as e:
            raise UserError(_('Failed to log out device: %s') % e)
