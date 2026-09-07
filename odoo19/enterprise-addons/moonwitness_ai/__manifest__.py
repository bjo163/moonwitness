# Part of MoonWitness. See LICENSE file for full copyright and licensing details.
{
    'name': 'MoonWitness AI Enhancement',
    'version': '1.0',
    'category': 'Hidden',
    'summary': """MoonWitness AI extensions: custom agents, themed chat, and domain-specific tools.""",
    'description': """
        Extends Odoo AI module with MoonWitness-specific features:
        * Custom MoonWitness Assistant agent with domain-aware system prompt
        * AI chat window styling matching MoonWitness theme
        * Domain-specific prompt suggestions
        * Additional LLM provider support (Anthropic, Ollama)
    """,
    'depends': ['ai', 'ai_app'],
    'data': [
        'data/ai_agent_data.xml',
        'data/ai_prompt_data.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'moonwitness_ai/static/src/**/*',
        ],
    },
    'author': 'MoonWitness',
    'license': 'LGPL-3',
    'auto_install': True,
}
