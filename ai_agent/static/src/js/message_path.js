/** @odoo-module **/
import { Message } from "@mail/core/common/message";
import { patch } from "@web/core/utils/patch";

patch(Message.prototype, {
    setup() {
        super.setup();
        // Verificamos si el body del mensaje contiene la estructura de tu prompt
        const body = this.props.message.body || "";
        this.isA2UIForm = body.includes('action": "render_form"');

        if (this.isA2UIForm) {
            try {
                // Extraemos el JSON puro del texto
                const jsonMatch = body.match(/\{.*\}/s);
                if (jsonMatch) {
                    this.a2uiFormData = JSON.parse(jsonMatch[0]);
                }
            } catch (e) {
                console.error("Error parseando formulario IA:", e);
                this.isA2UIForm = false;
            }
        }
    }
});