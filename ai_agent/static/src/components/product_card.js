/** @odoo-module **/
import { Component } from "@odoo/owl";
import { registry } from "@web/core/registry";

export class AIProductCard extends Component {
    static template = "ai_agent.ProductCard";

    setup() {
        // Aquí puedes añadir lógica para botones de "Añadir al carrito" o "Ver producto"
        this.product = this.props.message.payload;
    }

    onViewProduct() {
        // Lógica para abrir el formulario del producto en Odoo
    }
}

// Registramos el componente en el sistema de chat para que sepa usarlo
registry.category("ai_custom_renderers").add("product_card", AIProductCard);