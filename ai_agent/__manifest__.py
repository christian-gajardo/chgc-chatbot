{
    'name': 'AI Agent',
    'version': '0.1',
    'summary': 'Agente de IA para el sitio web y app Odoo',
    'author': 'AI-App-ChG',
    'depends': [
        'base',
        'mail',
        'stock',
        'im_livechat',
        'website',
        'ai',
        'ai_app',
    ],
    'data': [
        'security/ir.model.access.csv',
        'data/ai_agent_data/ai_agent_tools_data.xml',
        'data/ai_agent_data/ai_agent_topics_data.xml',
        'data/ai_agent_data/ai_agent_data.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'ai_agent/static/src/components/product_card/product_card.xml',
            'ai_agent/static/src/components/product_card/product_card.js',
            'ai_agent/static/src/components/chat_form/chat_form.xml',
            'ai_agent/static/src/components/chat_form/chat_form.js',
            'ai_agent/static/src/components/chat_form/chat_form.scss',
        ],
        'web.assets_frontend': [
            'ai_agent/static/src/js/message_path.js',
            'ai_agent/static/src/css/chatbot_style.css',
        ],
    },
    'installable': True,
    'application': True,
    'license': 'OEEL-1',
}