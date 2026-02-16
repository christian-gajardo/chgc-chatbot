from odoo import models, api

class AiToolsInv(models.AbstractModel):
    _name = 'ai.tools.inv'
    _description = 'Herramientas de Inventario para Gemini'

    @api.model
    def get_product_detail(self, product_name):
        """
        Consulta el detalle de un producto por su nombre.
        :param str product_name: Nombre o referencia del producto a buscar.
        :return: Dict con el detalle del producto para A2UI.
        """
        product = self.env['product.product'].search([
            ('name', 'ilike', product_name)
        ], limit=1)
        
        if not product:
            return {"error": "Producto no encontrado"}

        return {
            "render_type": "product_card",
            "id": product.id,
            "name": product.name,
            "qty": product.qty_available,
            "price": product.list_price,
        }

    @api.model
    def get_xml_example(self):
        """
        Retorna un ejemplo de XML para probar el renderizado.
        """
        xml_content = """<odoo>
    <data>
        <record id="example_id" model="product.product">
            <field name="name">Producto de Ejemplo</field>
        </record>
    </data>
</odoo>"""
        return {
            "render_type": "xml_renderer",
            "xml_content": xml_content,
        }