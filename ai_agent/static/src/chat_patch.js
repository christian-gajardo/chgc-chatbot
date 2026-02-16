/** @odoo-module **/
import { Message } from "@mail/core/common/message";
import { patch } from "@web/core/utils/patch";

patch(Message.prototype, {
    // Detectamos si es un mensaje de Agente con formato A2UI
    get aiData() {
        try {
            // Intentamos parsear el cuerpo si parece JSON
            if (this.body.includes('render_type')) {
                // Limpiamos posibles etiquetas HTML que Odoo añade al body
                const cleanBody = this.body.replace(/<[^>]*>/g, '').trim();
                return JSON.parse(cleanBody);
            }
        } catch (e) {
            return null;
        }
        return null;
    }
});