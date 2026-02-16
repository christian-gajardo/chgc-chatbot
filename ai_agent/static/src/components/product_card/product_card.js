/** @odoo-module **/
import { Component } from "@odoo/owl";
import { registry } from "@web/core/registry";

export class AIProductCard extends Component {
    static template = "ai_agent.product_card";

    setup() {

    }
}

// Es vital registrarlo para que otros componentes puedan referenciarlo por nombre si es necesario
registry.category("ai_custom_renderers").add("product_card", AIProductCard);