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
        'data/ai_agent_data.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'ai_agent/static/src/chat_patch.js',
            
            'ai_agent/static/src/components/product_card/product_card.js',
            'ai_agent/static/src/components/product_card/product_card.xml',
            #'ai_agent/static/src/components/product_card/product_card.css',
        ],
    },
    'installable': True,
    'application': True,
    'license': 'OEEL-1',
}