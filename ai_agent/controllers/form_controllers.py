# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request

class AiFormController(http.Controller):

    @http.route('/a2ui/execute_agent', type='jsonrpc', auth='user')
    def execute_agent(self, prompt):
        # 1. Definir instrucción de sistema (Catálogo de componentes)
        system_instruction = (
            "Eres un orquestador de UI. Responde ÚNICAMENTE en JSON. "
            "Componentes disponibles: ['ChatForm']. "
            "Si el usuario quiere registrar algo, usa 'ChatForm'. "
            "Formato: {'status': 'success', 'component': 'ChatForm', 'props': {'fields': [...]}}"
        )

        # 2. Simulación de lógica de negocio
        prompt_lower = prompt.lower()
        
        if "cliente" in prompt_lower or "registro" in prompt_lower:
            return {
                "status": "success",
                "component": "ChatForm",
                "props": {
                    "fields": [
                        {"name": "name", "label": "Nombre Completo", "type": "text"},
                        {"name": "email", "label": "Email", "type": "email"}
                    ]
                }
            }

        return {
            "status": "error", 
            "message": "No tengo un componente para esa solicitud aún."
        }