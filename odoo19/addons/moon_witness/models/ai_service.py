import json
import logging
import random
import requests
from odoo import api, models
from odoo.exceptions import UserError

_logger = logging.getLogger(__name__)

# Complete Pool of 100% Free, No-API-Key Models from OpenCode / Kilo Gateway
FREE_OPENCODE_MODELS = [
    {
        "provider": "kilo",
        "name": "Kilo Auto Free Router",
        "model": "kilo-auto/free",
        "base_url": "https://api.kilo.ai/api/gateway",
    },
    {
        "provider": "kilo",
        "name": "OpenRouter Free Models Router",
        "model": "openrouter/free",
        "base_url": "https://api.kilo.ai/api/gateway",
    },
    {
        "provider": "kilo",
        "name": "StepFun Step 3.7 Flash Free",
        "model": "stepfun/step-3.7-flash:free",
        "base_url": "https://api.kilo.ai/api/gateway",
    },
    {
        "provider": "kilo",
        "name": "MiniMax M3 Free",
        "model": "minimax/minimax-m3:free",
        "base_url": "https://api.kilo.ai/api/gateway",
    },
    {
        "provider": "kilo",
        "name": "MiniMax M2.7 Free",
        "model": "minimax/minimax-m2.7:free",
        "base_url": "https://api.kilo.ai/api/gateway",
    },
    {
        "provider": "kilo",
        "name": "NVIDIA Nemotron 3 Super Free",
        "model": "nvidia/nemotron-3-super-120b-a12b:free",
        "base_url": "https://api.kilo.ai/api/gateway",
    },
    {
        "provider": "kilo",
        "name": "NVIDIA Nemotron 3 Ultra Free",
        "model": "nvidia/nemotron-3-ultra-550b-a55b:free",
        "base_url": "https://api.kilo.ai/api/gateway",
    },
    {
        "provider": "kilo",
        "name": "NVIDIA Nemotron 3.5 Lightning Free",
        "model": "nvidia/nemotron-3.5-lightning:free",
        "base_url": "https://api.kilo.ai/api/gateway",
    },
    {
        "provider": "kilo",
        "name": "NVIDIA Nemotron 3 Nano Omni Free",
        "model": "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
        "base_url": "https://api.kilo.ai/api/gateway",
    },
    {
        "provider": "kilo",
        "name": "Poolside Laguna S 2.1 Free",
        "model": "poolside/laguna-s-2.1:free",
        "base_url": "https://api.kilo.ai/api/gateway",
    },
    {
        "provider": "kilo",
        "name": "Poolside Laguna XS 2.1 Free",
        "model": "poolside/laguna-xs-2.1:free",
        "base_url": "https://api.kilo.ai/api/gateway",
    },
    {
        "provider": "kilo",
        "name": "Cohere North Mini Code Free",
        "model": "cohere/north-mini-code:free",
        "base_url": "https://api.kilo.ai/api/gateway",
    },
    {
        "provider": "kilo",
        "name": "Thinking Machines Inkling Free",
        "model": "thinkingmachines/inkling:free",
        "base_url": "https://api.kilo.ai/api/gateway",
    },
    {
        "provider": "kilo",
        "name": "LiquidAI LFM 2.5 Free",
        "model": "liquid/lfm-2.5-2.6b:free",
        "base_url": "https://api.kilo.ai/api/gateway",
    },
    {
        "provider": "kilo",
        "name": "InclusionAI Ling 3.0 Flash Fin Free",
        "model": "inclusionai/ling-3.0-flash-fin:free",
        "base_url": "https://api.kilo.ai/api/gateway",
    },
    {
        "provider": "kilo",
        "name": "InclusionAI Ling 3.0 Flash Sante Free",
        "model": "inclusionai/ling-3.0-flash-sante:free",
        "base_url": "https://api.kilo.ai/api/gateway",
    },
]


class MoonWitnessAIService(models.AbstractModel):
    _name = "moon.witness.ai.service"
    _description = "MoonWitness AI Free OpenCode Provider"

    @api.model
    def chat_completion_free(self, messages, temperature=0.3, max_retries=6):
        """
        Sends chat completion request with randomized fallback across verified free models.
        No API key required.
        """
        # Create randomized copy of models pool to balance load
        candidates = list(FREE_OPENCODE_MODELS)
        random.shuffle(candidates)

        last_error = None
        for candidate in candidates[:max_retries]:
            model_id = candidate["model"]
            base_url = candidate["base_url"]
            endpoint = f"{base_url.rstrip('/')}/chat/completions"

            payload = {
                "model": model_id,
                "messages": messages,
                "temperature": temperature,
            }

            headers = {
                "Content-Type": "application/json",
            }

            try:
                _logger.info("Calling OpenCode Free LLM: %s (%s)", candidate["name"], model_id)
                response = requests.post(endpoint, headers=headers, json=payload, timeout=30)
                if response.status_code == 200:
                    data = response.json()
                    choices = data.get("choices") or []
                    if choices and "message" in choices[0]:
                        msg = choices[0]["message"]
                        return {
                            "content": msg.get("content", ""),
                            "model_used": model_id,
                            "provider": candidate["name"],
                        }
                else:
                    _logger.warning(
                        "Model %s failed with status %s: %s",
                        model_id,
                        response.status_code,
                        response.text[:200],
                    )
                    last_error = f"HTTP {response.status_code}: {response.text[:100]}"
            except Exception as e:
                _logger.warning("Error contacting %s: %s", model_id, e)
                last_error = str(e)

        raise UserError(f"All free OpenCode AI providers failed. Last error: {last_error}")


def _patch_odoo_ai_service():
    """
    Hook to support 'opencode' provider in Odoo Enterprise ai.utils.llm_api_service
    """
    try:
        from odoo.addons.ai.utils import llm_api_service

        orig_get_api_token = llm_api_service.LLMApiService._get_api_token
        orig_init = llm_api_service.LLMApiService.__init__

        def custom_init(self, env, provider="openai"):
            if provider == "opencode":
                self.provider = "opencode"
                self.base_url = "https://api.kilo.ai/api/gateway"
                self.env = env
            else:
                orig_init(self, env, provider=provider)

        def custom_get_api_token(self):
            if self.provider == "opencode":
                return "opencode-free-auto"
            return orig_get_api_token(self)

        def custom_request_llm_opencode(
            self,
            llm_model,
            system_prompts,
            user_prompts,
            tools=None,
            files=None,
            schema=None,
            temperature=0.2,
            inputs=(),
            web_grounding=False,
        ):
            # Convert system and user prompts to standard messages
            messages = []
            for sp in system_prompts or []:
                messages.append({"role": "system", "content": sp})
            for up in user_prompts or []:
                messages.append({"role": "user", "content": up})

            ai_service = self.env["moon.witness.ai.service"]
            result = ai_service.chat_completion_free(messages, temperature=temperature)
            response_text = result.get("content", "")
            return [response_text], [], list(inputs or ())

        llm_api_service.LLMApiService.__init__ = custom_init
        llm_api_service.LLMApiService._get_api_token = custom_get_api_token
        llm_api_service.LLMApiService._request_llm_opencode = custom_request_llm_opencode
        _logger.info("Successfully patched Odoo LLMApiService with OpenCode Free provider!")
    except Exception as exc:
        _logger.debug("Could not patch enterprise ai module (it might not be loaded yet): %s", exc)


_patch_odoo_ai_service()
