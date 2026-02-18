/** @odoo-module **/
import { patch } from "@web/core/utils/patch";
import { Composer } from "@mail/components/composer/composer"; // O el componente equivalente en v19
import { useService } from "@web/core/utils/hooks";

patch(Composer.prototype, {
    setup() {
        super.setup();
        this.rpc = useService("rpc");
    },

    async postMessage() {
        const userInput = this.props.composer.text; // Captura el texto
        const res = await super.postMessage(...arguments); // Deja que Odoo envíe el mensaje normal

        // AQUÍ DISPARAS TU IA
        if (userInput.includes("cliente")) {
            const aiResponse = await this.rpc("/ai/generate_response", { prompt: userInput });
            // Aquí tendrías que insertar el mensaje de la IA en el canal actual
            console.log("IA interceptada en chat original:", aiResponse);
        }
        return res;
    }
});