/** @odoo-module **/
import { patch } from "@web/core/utils/patch";
import { Composer } from "@mail/core/common/composer"; // Ruta correcta en v19
import { useService } from "@web/core/utils/hooks";

patch(Composer.prototype, {
    setup() {
        super.setup();
        this.rpc = useService("rpc");
        this.notification = useService("notification");
    },

    async postMessage() {
        const messageText = this.props.composer.text; // Captura el texto antes de enviarlo

        // Ejecutamos el envío original de Odoo
        const result = await super.postMessage(...arguments);

        // Si el usuario pide un formulario, activamos la IA
        if (messageText.toLowerCase().includes("crear") || messageText.toLowerCase().includes("formulario")) {
            try {
                const response = await this.rpc("/web/dataset/call_kw", {
                    model: "ai.agent",
                    method: "chat_process",
                    args: [],
                    kwargs: {
                        agent_id: 1, // Tu ID de Agente A2UI
                        message: messageText,
                    }
                });

                if (response && response.action === "render_form") {
                    // Aquí es donde "inyectas" el formulario en la UI
                    // Podrías usar un bus de eventos o guardar el JSON en el thread
                    console.log("Formulario detectado:", response.fields);
                }
            } catch (err) {
                console.error("Error llamando a la IA", err);
            }
        }
        return result;
    }
});