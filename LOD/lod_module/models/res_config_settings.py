# -*- coding: utf-8 -*-
from odoo import fields, models 


class ResConfigSettings(models.TransientModel): # heredamos de res.config.settings
    _inherit = 'res.config.settings' # heredamos de res.config.settings

    chatbot_agent_id = fields.Many2one(
        'ai.agent',
        string="Chatbot AI Agent",
        config_parameter='construction_materials.chatbot_agent_id'
    )
