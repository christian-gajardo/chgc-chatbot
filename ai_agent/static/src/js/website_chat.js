/** @odoo-module **/

import { Component, useState, useRef } from "@odoo/owl";
import { rpc } from "@web/core/network/rpc";
import { useService } from "@web/core/utils/hooks";

export class CustomAIChatbot extends Component {
    static template = "ai_agent.ChatbotTemplate"; // Archivo XML de QWeb

    setup() {
        this.state = useState({
            isOpen: false,
            messages: [],
            isTyping: false,
        });
        this.inputRef = useRef("chatInput");
        this.notification = useService("notification");
    }

    async sendMessage() {
        const input = this.inputRef.el;
        const message = input.value.trim();
        if (!message) return;

        // 1. Agregar mensaje localmente
        this.state.messages.push({ role: 'user', content: message });
        input.value = "";
        this.state.isTyping = true;

        try {
            // 2. Usar RPC nativo de Odoo (apunta a tu controlador Python)
            const result = await rpc("/api/chatbot/ask", {
                message: message,
                context: this.props.context || {},
            });

            if (result.success) {
                this.state.messages.push({
                    role: 'assistant',
                    content: result.text,
                    data: result.data // Aquí recibes tus tablas/cards
                });
            }
        } catch (error) {
            this.notification.add("Error de conexión con la IA", { type: "danger" });
        } finally {
            this.state.isTyping = false;
        }
    }

    toggleChat() {
        this.state.isOpen = !this.state.isOpen;
    }
}