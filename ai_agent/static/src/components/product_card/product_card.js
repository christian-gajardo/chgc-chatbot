/** @odoo-module **/
import { Component } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { registry } from "@web/core/registry";

export class AIProductCard extends Component {
    static template = "ai_agent.ProductCard";

    setup() {
        // Obtenemos los datos ya parseados desde el getter del mensaje (definido en tu patch)
        this.product = this.props.message.aiData;
        // Cargamos el servicio de acciones de Odoo
        this.actionService = useService("action");
    }

    onViewProduct() {
        if (!this.product || !this.product.id) return;

        this.actionService.doAction({
            type: 'ir.actions.act_window',
            res_model: 'product.product',
            res_id: this.product.id,
            views: [[false, 'form']],
            target: 'current',
        });
    }
}

// Es vital registrarlo para que otros componentes puedan referenciarlo por nombre si es necesario
registry.category("ai_custom_renderers").add("product_card", AIProductCard);