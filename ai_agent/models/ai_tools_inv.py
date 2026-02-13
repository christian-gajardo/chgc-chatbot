from odoo import models, api

class AiToolsInv(models.AbstractModel):
    _name = 'ai.tools.inv'
    _description = 'Herramientas de Inventario para Gemini'

    @api.model
    def get_product_stock(self, product_name):
        """
        Consulta el stock disponible de un producto por su nombre.
        :param str product_name: Nombre o referencia del producto a buscar.
        :return: Dict con el stock y el ID del producto para A2UI.
        """
        product = self.env['product.product'].search([
            ('name', 'ilike', product_name)
        ], limit=1)
        
        if not product:
            return {"error": "Producto no encontrado"}

        # Retornamos un diccionario que Gemini procesará
        return {
            "id": product.id,
            "name": product.name,
            "qty": product.qty_available,
            "price": product.list_price,
            "ui_type": "product_card"  # Este flag servirá para A2UI
        }