/** @odoo-module **/
import { Component } from "@odoo/owl";

export class AIProductCard extends Component {
    static template = "ai_agent.ProductCard";

    setup() {
        // Obtenemos los datos ya parseados desde el getter del mensaje
        this.product = this.props.message.aiData;
    }

    onViewProduct() {
        // Para abrir el formulario, puedes usar el servicio 'action'
        this.env.services.action.doAction({
            type: 'ir.actions.act_window',
            res_model: 'product.product',
            res_id: this.product.id,
            views: [[false, 'form']],
            target: 'current',
        });
    }
}