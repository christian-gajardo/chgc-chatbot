/** @odoo-module **/
import { Message } from "@mail/core/common/message";
import { patch } from "@web/core/utils/patch";
import { ChatForm } from "./chat_form"; // Tu componente

// ESTA es la forma correcta en Odoo 19:
// Agregamos ChatForm a los componentes que Message reconoce.
Object.assign(Message.components, { ChatForm });

patch(Message.prototype, {
    setup() {
        super.setup();
        const body = this.props.message.body || "";
        this.isA2UIForm = body.includes('action": "render_form"');

        if (this.isA2UIForm) {
            try {
                const jsonMatch = body.match(/\{.*\}/s);
                this.a2uiFormData = JSON.parse(jsonMatch[0]);
            } catch (e) {
                this.isA2UIForm = false;
            }
        }
    },

    async handleAiFormSubmit(formData) {
        console.log("Datos capturados:", formData);
        // Aquí puedes ejecutar tu lógica RPC
    }
});