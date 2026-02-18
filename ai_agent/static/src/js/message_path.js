/** @odoo-module **/
import { ChatForm } from "@ai_agent/components/chat_form/chat_form";
import { Component, useState, xml } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

// Registro de componentes autorizados para la IA
const COMPONENT_MAP = {
    "ChatForm": ChatForm,
};

export class MessagePath extends Component {
    static components = { ChatForm }; // Deben estar registrados aquí también

    static template = xml`
        <div class="o_ai_chat_thread p-3">
            <div t-foreach="state.messages" t-as="msg" t-key="msg.id" class="mb-3">
                <t t-if="msg.type === 'component'">
                    <t t-component="msg.component" t-props="msg.props"/>
                </t>
                <t t-else="">
                    <div class="p-3 bg-light rounded border">
                        <strong class="text-primary d-block">Asistente:</strong>
                        <span t-esc="msg.body"/>
                    </div>
                </t>
            </div>
        </div>
    `;

    setup() {
        this.rpc = useService("rpc");
        this.state = useState({ messages: [] });
    }

    async onSendMessage(userInput) {
        const response = await this.rpc("/a2ui/execute_agent", { prompt: userInput });

        let newMessage = { id: Date.now() };

        // Verificamos si la IA pidió un componente y si lo tenemos en el mapa
        if (response.status === "success" && COMPONENT_MAP[response.component]) {
            newMessage.type = "component";
            newMessage.component = COMPONENT_MAP[response.component];
            newMessage.props = response.props;
        } else {
            newMessage.type = "text";
            newMessage.body = response.message || "Entendido.";
        }

        this.state.messages.push(newMessage);
    }
}