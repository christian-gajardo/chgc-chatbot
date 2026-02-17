/** @odoo-module **/
import { ChatForm } from "@ai_agent/components/chat_form/chat_form";
import { Component, useState, xml } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class MessagePath extends Component {
    static components = { ChatForm };

    // Este template detecta si el mensaje es un formulario o texto
    static template = xml`
        <div class="o_ai_chat_thread">
            <div t-foreach="state.messages" t-as="msg" t-key="msg.id" class="mb-3 p-3 border-bottom">
                <strong t-esc="msg.author" class="text-primary"/>
                <div class="mt-2">
                    <t t-if="msg.is_form">
                        <ChatForm fields="msg.fields" onFormSubmit="(data) => this._onSaveData(data)"/>
                    </t>
                    <t t-else="">
                        <span t-esc="msg.body"/>
                    </t>
                </div>
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
        // Llamada al controlador que ya tienes en form_controller.py
        const response = await this.rpc("/a2ui/get_dynamic_form", { prompt: userInput });

        let newMessage = { id: Date.now(), author: "Asistente A2UI" };

        if (response && response.action === "render_form") {
            newMessage.is_form = true;
            newMessage.fields = response.fields;
        } else {
            newMessage.is_form = false;
            newMessage.body = response.message || JSON.stringify(response);
        }

        this.state.messages.push(newMessage);
    }

    _onSaveData(formData) {
        console.log("Datos recibidos del formulario:", formData);
        // Aquí iría la lógica para guardar en Odoo
    }
}