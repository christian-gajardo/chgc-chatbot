# -*- coding: utf-8 -*-
{
    'name': 'LOD Website Chatbot',
    'version': '1.0',
    'category': 'Website',
    'summary': 'Chatbot IA para consultas de materiales en el sitio web',
    'description': """
        Chatbot con IA integrado en el sitio web de Odoo
        
        Características:
        - Widget flotante en todas las páginas del sitio
        - Consultas sobre inventario de materiales
        - Integración con Google Gemini
        - Respuestas automáticas a clientes
    """,
    'author': 'raulcid-droid',
    'website': 'https://github.com/raulcid-droid/LOD',
    'depends': [
        'website',
        'lod_module',
    ],
    'data': [
        'views/chatbot_templates.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            'lod_website_chatbot/static/src/xml/chatbot_widget.xml',
            'lod_website_chatbot/static/src/js/utils.js',
            'lod_website_chatbot/static/src/js/components/material_table/material_table.js',
            'lod_website_chatbot/static/src/js/components/contact_card/contact_card.js',
            'lod_website_chatbot/static/src/js/components/product_list/product_list.js',
            'lod_website_chatbot/static/src/js/components/product_detail/product_detail.js',
            'lod_website_chatbot/static/src/js/chatbot_widget.js',
            'lod_website_chatbot/static/src/css/chatbot.css',
        ],
    },
    'installable': True,
    'application': False,
    'auto_install': False,
    'license': 'LGPL-3',
}
