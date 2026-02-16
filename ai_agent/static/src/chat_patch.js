/** @odoo-module **/
import { Message } from "@mail/core/common/message";
import { patch } from "@web/core/utils/patch";
import { AIProductCard } from "@ai_agent/components/product_card/product_card";

patch(Message.prototype, {
    components: { ...Message.components, AIProductCard },

    get aiData() {
        if (!this.body.includes('render_type')) return null;
        try {
            // Eliminamos etiquetas <p> y espacios antes de parsear
            return JSON.parse(this.body.replace(/<[^>]*>/g, '').trim());
        } catch (e) {
            return null;
        }
    }
});