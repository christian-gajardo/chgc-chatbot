/** @odoo-module **/

import { Message } from "@mail/core/common/message";
import { patch } from "@web/core/utils/patch";

patch(Message.prototype, {
    /**
     * Extendemos el getter que comprueba si el mensaje tiene 
     * un componente personalizado para renderizar.
     */
    get isCustomProduct() {
        try {
            // Intentamos parsear el contenido para ver si es una instrucción A2UI
            // Odoo guarda el texto en this.message.body
            const body = this.message.body || "";
            if (body.includes('type": "product_card"')) {
                // Limpiamos el HTML que Odoo suele poner (pags <p>)
                const cleanJson = body.replace(/<[^>]*>/g, "");
                return JSON.parse(cleanJson);
            }
        } catch (e) {
            return false;
        }
        return false;
    }
});