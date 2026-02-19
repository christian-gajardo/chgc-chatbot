# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request
import logging
import json

_logger = logging.getLogger(__name__)

class ChatbotWebController(http.Controller):
    
    @http.route('/api/chatbot/ask', type='json', auth='public', methods=['POST'], csrf=False, cors='*') # Define la ruta de la API
    def chatbot_ask(self, message, **kwargs): # Define la función que se ejecutará cuando se acceda a la ruta
        """API pública para consultas del chatbot web con acceso a contenido del sitio""" # Descripción de la función
        try:
            if not message or len(message.strip()) < 3:
                return {'success': False, 'error': 'Por favor escribe una pregunta más específica'}
            
            # Obtener agente configurado
            agent_param = request.env['ir.config_parameter'].sudo().get_param(
                'construction_materials.agent_id'
            )

            if not agent_param:
                return {'success': False, 'error': 'Agente IA no configurado'}

            try:
                agent = request.env['ai.agent'].sudo().browse(int(agent_param))
            except (ValueError, TypeError):
                return {'success': False, 'error': 'Configuración de Agente IA inválida'}

            if not agent.exists():
                return {'success': False, 'error': 'El Agente IA configurado ya no existe'}

            
            # ==============================================================================================
            # 1. RETRIEVAL (RECUPERACIÓN)
            # ==============================================================================================
            # En esta etapa, el sistema busca datos relevantes en "tiempo real" desde la base de datos de Odoo.
            # Estos datos recuperados formarán el "contexto" que se enviará al modelo.
            
            # Consultar inventario (materiales de construcción = product.template con categoría)
            materials = request.env['product.template'].sudo().search([('x_construction_category', '!=', False)])

            if not materials:
                inventory_text = "📦 No hay materiales en inventario.\n"
            else:
                inventory_text = "📦 MATERIALES DISPONIBLES:\n\n"
                for mat in materials:
                    emoji = "✅" if mat.x_construction_state == 'available' else "⚠️" if mat.x_construction_state == 'low' else "❌"
                    inventory_text += f"{emoji} {mat.name}: {mat.qty_available} {mat.uom_id.name}\n"
            
            # Consultar contenido del website
            website_content = ""
            
            # Páginas del website
            try:
                pages = request.env['website.page'].sudo().search([('website_published', '=', True)], limit=10, order='name')
                if pages:
                    website_content += "\n📄 PÁGINAS DEL SITIO:\n"
                    for page in pages:
                        website_content += f"- {page.name} ({page.url})\n"
            except:
                pass
            
            # Productos publicados
            try:
                products = request.env['product.template'].sudo().search([('website_published', '=', True)], limit=10, order='name')
                if products:
                    website_content += "\n🛒 PRODUCTOS/SERVICIOS:\n"
                    for prod in products:
                        price = f"${prod.list_price:,.0f}" if hasattr(prod, 'list_price') and prod.list_price > 0 else "Consultar"
                        website_content += f"- {prod.name}: {price}\n"
            except:
                pass
            
            # Posts del blog
            try:
                posts = request.env['blog.post'].sudo().search([('website_published', '=', True)], limit=5, order='create_date desc')
                if posts:
                    website_content += "\n📝 ÚLTIMOS ARTÍCULOS:\n"
                    for post in posts:
                        website_content += f"- {post.name}\n"
            except:
                pass
            
            # Información de contacto
            try:
                company = request.env['res.company'].sudo().browse(1)
                if company:
                    website_content += "\n🏢 CONTACTO:\n"
                    if company.phone:
                        website_content += f"- Teléfono: {company.phone}\n"
                    if company.email:
                        website_content += f"- Email: {company.email}\n"
            except:
                pass
            
            
            # ==============================================================================================
            # 2. AUGMENTATION (AUMENTACIÓN)
            # ==============================================================================================
            # Aquí "aumentamos" el conocimiento del modelo inyectando los datos recuperados directamente en el prompt.
            # El modelo (Gemini) no conoce tu inventario ni tus páginas web, pero aquí se lo "enseñamos" 
            # dinámicamente en cada consulta dentro de las variables {inventory_text} y {website_content}.
            # f string es una cadena de texto que permite incluir variables dentro de la cadena

            prompt = f"""Eres el asistente virtual de LOD - Libro de Obras Digital.

{inventory_text}

{website_content}

DATOS TÉCNICOS:
- Hormigón H30: 10-12 m³ por 100m²
- Fierro A630-420H: 800-1000 kg por 100m²
- Moldaje: 100-120 m² por 100m²

Pregunta del usuario: {message.strip()}

INSTRUCCIONES DE RESPUESTA:
Responde SIEMPRE en formato JSON válido con esta estructura:
{{
  "type": "text|material_table|contact_card|product_list|product_detail",
  "text": "tu mensaje amigable y breve (máximo 3 líneas)",
  "product_name": "nombre exacto del producto (solo para product_detail)"
}}

Reglas para elegir el type:
- "product_detail": cuando el usuario pregunte por UN material o producto específico (ej: "tienes fierro?", "hay hormigón?", "info de cemento", "tienes enfierradura"). OBLIGATORIO incluir "product_name" con el nombre EXACTO tal como aparece en la lista de materiales/productos de arriba. Ejemplo: si preguntan "tienes enfierradura", debes usar product_name "Fierro A630-420H" (el nombre real del inventario, NO el término del usuario).
- "material_table": SOLO cuando pregunten por TODO el inventario completo, listado general, o múltiples materiales a la vez (ej: "muéstrame todo el inventario", "qué materiales tienen?", "lista de stock").
- "contact_card": cuando pregunten por contacto, teléfono, email, dirección
- "product_list": cuando pregunten por productos de la tienda, servicios, precios, catálogo completo
- "text": para todo lo demás (saludos, dudas técnicas, cálculos, etc.)

IMPORTANTE sobre product_detail: El campo "product_name" debe contener el nombre EXACTO del producto/material tal como aparece en los datos de arriba, NO el término coloquial del usuario. Ejemplos:
- Usuario dice "enfierradura" → product_name: "Fierro A630-420H"
- Usuario dice "hormigón" → product_name: "Hormigón H30"
- Usuario dice "moldaje" → product_name: "Moldaje Fenólico"
{{"type": "product_detail", "text": "Aquí tienes los detalles:", "product_name": "Hormigón H30"}}

IMPORTANTE: Responde SOLO el JSON, sin markdown, sin backticks, sin texto adicional."""
            
            # ==============================================================================================
            # 3. GENERATION (GENERACIÓN)
            # ==============================================================================================
            # Finalmente, enviamos el prompt enriquecido al LLM. El modelo procesa la pregunta del usuario
            # JUNTOS con los datos del inventario y contenido web que le acabamos de pasar, y "genera" 
            # una respuesta en lenguaje natural basada en esa información exacta.


            # Usar el agente configurado
            ai_raw_response = agent._process_message(
                message=prompt,
                conversation=None,
            )

            if not ai_raw_response:
                raise Exception("Sin respuesta del agente")

            raw_text = ai_raw_response.strip()
            
            # Limpiar respuesta de bloques de código markdown (```json ... ```)
            if raw_text.startswith('```'):
                lines = raw_text.splitlines()
                # Quitar la primera línea si es la apertura del bloque
                if lines[0].startswith('```'):
                    lines = lines[1:]
                # Quitar la última línea si es el cierre del bloque
                if lines and lines[-1].startswith('```'):
                    lines = lines[:-1]
                raw_text = '\n'.join(lines).strip()

            _logger.info(f"Chatbot respondió: '{message[:50]}'")

            try:
                ai_response = json.loads(raw_text)
                component_type = ai_response.get('type', 'text')
                friendly_text = ai_response.get('text', raw_text)
            except (json.JSONDecodeError, AttributeError):
                # Fallback: tratar como texto si la IA no devolvió un JSON válido
                component_type = 'text'
                friendly_text = raw_text

            # Construir respuesta con datos reales de Odoo según el tipo
            result = {
                'success': True,
                'type': component_type,
                'text': friendly_text,
            }

            if component_type == 'material_table':
                result['data'] = [{
                    'name': m.name,
                    'quantity': m.qty_available,
                    'unit': m.uom_id.name,
                    'state': m.x_construction_state,
                    'category': m.x_construction_category,
                } for m in materials]

            elif component_type == 'contact_card':
                company = request.env['res.company'].sudo().browse(1)
                result['data'] = {
                    'phone': company.phone or '',
                    'email': company.email or '',
                    'name': company.name or '',
                }

            elif component_type == 'product_list':
                products = request.env['product.template'].sudo().search(
                    [('website_published', '=', True)], limit=10, order='name')
                result['data'] = [{
                    'name': p.name,
                    'price': p.list_price,
                    'image_url': '/web/image/product.template/%d/image_128' % p.id if p.image_1920 else '',
                    'category': p.categ_id.name if p.categ_id else '',
                } for p in products]

            elif component_type == 'product_detail':
                product_name = ai_response.get('product_name', '')
                product = None
                if product_name:
                    # Búsqueda exacta en product.template (incluye materiales de construcción)
                    product = request.env['product.template'].sudo().search(
                        [('name', 'ilike', product_name)], limit=1)
                    # Búsqueda por palabras si no hay match exacto
                    if not product:
                        for word in product_name.split():
                            if len(word) >= 3:
                                product = request.env['product.template'].sudo().search(
                                    [('name', 'ilike', word)], limit=1)
                                if product:
                                    break
                if product:
                    category_map = {'hormigon': 'Hormigón', 'fierro': 'Fierro', 'moldaje': 'Moldaje', 'cemento': 'Cemento', 'arena': 'Arena', 'herramientas': 'Herramientas', 'otros': 'Otros'}
                    state_map = {'available': 'Disponible', 'low': 'Stock bajo', 'out': 'Sin stock'}
                    # Si es material de construcción, incluir info de stock
                    if product.x_construction_category:
                        description = f"Stock: {product.qty_available} {product.uom_id.name} — {state_map.get(product.x_construction_state, '')}"
                        category = category_map.get(product.x_construction_category, product.x_construction_category or '')
                    else:
                        description = product.description_sale or ''
                        category = product.categ_id.name if product.categ_id else ''
                    result['data'] = {
                        'name': product.name,
                        'price': product.list_price,
                        'description': description,
                        'category': category,
                        'image_url': '/web/image/product.template/%d/image_256' % product.id if product.image_1920 else '',
                    }

            return result
            
        except Exception as e:
            _logger.error(f"Error chatbot: {str(e)}")
            return {'success': False, 'error': 'Lo siento, hubo un problema al procesar tu consulta técnica.'}
