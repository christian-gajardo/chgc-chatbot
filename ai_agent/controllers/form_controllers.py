# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request
import json

class AiFormController(http.Controller):

    @http.route('/a2ui/get_dynamic_form', type='json', auth='user')
    def get_dynamic_form(self, prompt):
        """
        Endpoint que procesa la petición del usuario y devuelve la 
        estructura del formulario generada por la IA.
        """
        # Instrucción de sistema optimizada para Gemini/IA
        system_instruction = (
            "Eres un generador de interfaces para Odoo 19. "
            "Si el usuario pide un formulario, responde ÚNICAMENTE con un JSON: "
            "{\"status\": \"success\", \"fields\": [{\"name\": \"ID\", \"label\": \"ETIQUETA\", \"type\": \"TIPO\"}]}. "
            "Tipos permitidos: text, number, date, email."
        )

        # Aquí llamas a tu función de integración con Gemini
        # ai_response = self.env['ai.agent'].call_gemini(prompt, system_instruction)
        
        # Simulación de respuesta para pruebas:
        if "cliente" in prompt.lower():
            mock_response = {
                "status": "success",
                "fields": [
                    {"name": "customer_name", "label": "Nombre del Cliente", "type": "text"},
                    {"name": "email", "label": "Correo", "type": "email"},
                    {"name": "priority", "label": "Nivel de Urgencia (1-5)", "type": "number"}
                ]
            }
            return mock_response
        
        return {"status": "error", "message": "No se pudo interpretar el formulario."}