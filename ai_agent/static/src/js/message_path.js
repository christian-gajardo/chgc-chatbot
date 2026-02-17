/** @odoo-module **/
import { ChatForm } from "@ai_agent/components/chat_form/chat_form"; // RECUERDA: Cambia @tu_modulo por el nombre real de tu carpeta
import { Component, useState, xml } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class MessagePath extends Component {
    static components = { ChatForm };

    // Definimos el XML directamente aquí para que OWL sepa cómo dibujar los mensajes
    static template = xml`
        <div class="o_a2ui_chat_container">
            <div t-foreach="state.messages" t-as="msg" t-key="msg.id" class="o_chat_bubble">
                <strong t-esc="msg.author"/>:
                
                <t t-if="msg.is_form">
                    <ChatForm fields="msg.fields"/>
                </t>
                <t t-else="">
                    <span t-esc="msg.body"/>
                </t>
            </div>
        </div>
    `;

    setup() {
        this.rpc = useService("rpc");
        this.state = useState({
            messages: []
        });
    }

    async onSendMessage(userInput) {
        try {
            const response = await this.rpc("/a2ui/get_dynamic_form", { prompt: userInput });

            let processedMessage;
            if (typeof response === 'object' && response.action === "render_form") {
                processedMessage = {
                    id: Date.now(),
                    is_form: true,
                    fields: response.fields,
                    author: "Asistente Inteligente A2UI"
                };
            } else {
                processedMessage = {
                    id: Date.now(),
                    is_form: false,
                    body: response.message || JSON.stringify(response),
                    author: "Asistente Inteligente A2UI"
                };
            }

            this.state.messages.push(processedMessage);
        } catch (error) {
            console.error("Error en el RPC:", error);
        }
    }
}