/** @odoo-module **/
import { Message } from "@mail/core/common/message";
import { patch } from "@web/core/utils/patch";

patch(Message.prototype, {
    /**
     * Extendemos la lógica de renderizado del mensaje
     */
    get isA2UI() {
        // Lógica para detectar si el mensaje debe ser un componente
        return this.message.body.includes('ui_type');
    }
});