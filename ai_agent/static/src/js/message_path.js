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
        <div class="o_ai_chat_container d-flex flex-column h-100">
            <div class="o_ai_chat_thread p-3 flex-grow-1 overflow-auto">
                <div t-foreach="state.messages" t-as="msg" t-key="msg.id" class="mb-3">
                    <t t-if="msg.type === 'component'">
                        <div class="agent-component-wrapper border rounded p-2 bg-white">
                            <t t-component="msg.component" t-props="msg.props"/>
                        </div>
                    </t>
                    <t t-else="">
                        <div class="p-3 bg-light rounded border">
                            <strong class="text-primary d-block">Asistente:</strong>
                            <span t-esc="msg.body"/>
                        </div>
                    </t>
                </div>
            </div>

            <div class="o_ai_input_area p-3 border-top bg-white">
                <div class="input-group">
                    <input type="text" 
                        class="form-control" 
                        placeholder="Escribe un mensaje..."
                        t-model="state.currentInput"
                        t-on-keydown="(ev) => ev.key === 'Enter' &amp;&amp; this.onSendMessage(state.currentInput)"/>
                    <button class="btn btn-primary" 
                        t-on-click="() => this.onSendMessage(state.currentInput)">
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    `;

    setup() {
        this.rpc = useService("rpc");
        this.state = useState({
            messages: [],
            currentInput: "" // Necesario para capturar lo que escribes
        });
    }

    async onSendMessage(userInput) {

        console.group("A2UI: Depuración de Respuesta"); // Agrupa los logs para limpieza
        console.log("1. Prompt enviado:", userInput);
        // 1. Llamada nativa de Odoo
        const response = await this.rpc("/ai/generate_response", { prompt: userInput });

        let newMessage = { id: Date.now(), author: "Asistente A2UI" };

        // 2. Intentar parsear si la respuesta viene como String (común en respuestas de IA)
        let data = response;
        if (typeof response === "string") {
            try {
                // Intentamos limpiar posibles bloques de markdown ```json ... ```
                const cleanJson = response.replace(/```json|```/g, "").trim();
                data = JSON.parse(cleanJson);
            } catch (e) {
                data = { status: "text" };
            }
        }

        // 3. Validar si es un componente conocido en tu COMPONENT_MAP
        if (data && data.status === "success" && COMPONENT_MAP[data.component]) {
            newMessage.is_form = true;
            newMessage.type = "component";
            newMessage.component = COMPONENT_MAP[data.component];
            newMessage.props = {
                ...data.props,
                onFormSubmit: (formData) => this._onSaveData(formData)
            };
        } else {
            newMessage.is_form = false;
            newMessage.type = "text";
            newMessage.body = typeof response === "string" ? response : JSON.stringify(response);
        }

        this.state.messages.push(newMessage);
    }
}