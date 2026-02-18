/** @odoo-module **/
import { rpc } from "@web/core/network/rpc_service";

(function () {
    'use strict';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }

    function initChatbot() {
        const chatbotHTML = `
            <div id="lod-chatbot" class="lod-chatbot-closed">
                <button id="lod-chatbot-toggle" class="lod-chatbot-toggle">
                    <span class="lod-chatbot-icon">🤖</span>
                    <span class="lod-chatbot-text">Asistente Virtual</span>
                </button>
                
                <div id="lod-chatbot-window" class="lod-chatbot-window">
                    <div class="lod-chatbot-header">
                        <div class="lod-chatbot-title">
                            <span id="lod-bot-avatar" class="lod-chatbot-avatar">✨</span>
                            <div>
                                <h3 id="lod-bot-name">Asistente IA</h3>
                                <p class="lod-chatbot-status">En línea</p>
                            </div>
                        </div>
                        <button id="lod-chatbot-close" class="lod-chatbot-close">✕</button>
                    </div>

                    <div id="lod-chatbot-messages" class="lod-chatbot-messages">
                        <div class="lod-message lod-message-bot">
                            <div class="lod-message-content">¡Hola! Soy tu asistente inteligente. ¿En qué puedo ayudarte hoy?</div>
                        </div>
                    </div>

                    <div class="lod-chatbot-input-container">
                        <input type="text" id="lod-chatbot-input" class="lod-chatbot-input" placeholder="Escribe tu mensaje..." autocomplete="off"/>
                        <button id="lod-chatbot-send" class="lod-chatbot-send">Enviar</button>
                    </div>

                    <div id="lod-chatbot-typing" class="lod-chatbot-typing" style="display: none;">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);

        const chatbot = document.getElementById('lod-chatbot');
        const toggleBtn = document.getElementById('lod-chatbot-toggle');
        const closeBtn = document.getElementById('lod-chatbot-close');
        const messagesDiv = document.getElementById('lod-chatbot-messages');
        const input = document.getElementById('lod-chatbot-input');
        const sendBtn = document.getElementById('lod-chatbot-send');
        const typingIndicator = document.getElementById('lod-chatbot-typing');

        toggleBtn.addEventListener('click', toggleChat);
        closeBtn.addEventListener('click', toggleChat);
        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

        function toggleChat() {
            chatbot.classList.toggle('lod-chatbot-closed');
            chatbot.classList.toggle('lod-chatbot-open');
            if (chatbot.classList.contains('lod-chatbot-open')) input.focus();
        }

        async function sendMessage() {
            const message = input.value.trim();
            if (!message) return;

            addMessage(message, 'user');
            input.value = '';
            typingIndicator.style.display = 'flex';
            scrollToBottom();

            try {

                const agentId = await rpc("/web/dataset/call_kw", {
                    model: "ir.model.data",
                    method: "_xmlid_to_res_id",
                    args: ["ai_agent.ai_agent_a2ui"], // REEMPLAZA 'tu_modulo' por el nombre técnico de tu addon
                });

                // LLAMADA DIRECTA AL AGENTE DE ODOO 19
                const response = await rpc("/web/dataset/call_kw", {
                    model: "ai.agent",
                    method: "chat_process", // Método estándar para procesar chats en Odoo 19
                    args: [],
                    kwargs: {
                        agent_id: agentId, // Reemplazar por el ID de tu agente en Odoo
                        message: message,
                    }
                });

                typingIndicator.style.display = 'none';

                // Odoo 19 devuelve un objeto que puede contener texto o JSON estructurado
                if (response && response.payload) {
                    renderComponent(response.payload);
                } else if (response && response.text) {
                    addMessage(response.text, 'bot');
                }
            } catch (error) {
                console.error('Error IA:', error);
                typingIndicator.style.display = 'none';
                addMessage('Lo siento, tuve un problema al procesar tu solicitud.', 'error');
            }
        }

        function addMessage(text, type) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `lod-message lod-message-${type}`;
            messageDiv.innerHTML = `<div class="lod-message-content">${escapeHtml(text)}</div>`;
            messagesDiv.appendChild(messageDiv);
            scrollToBottom();
        }

        function scrollToBottom() { messagesDiv.scrollTop = messagesDiv.scrollHeight; }
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function renderComponent(payload) {
            if (payload.text) addMessage(payload.text, 'bot');
            if (!payload.data) return;

            switch (payload.type) {
                case 'table': renderTable(payload.data, payload.columns); break;
                case 'card': renderContactCard(payload.data); break;
                case 'list': renderProductList(payload.data); break;
                case 'detail': renderProductDetail(payload.data); break;
            }
        }

        // TABLA UNIVERSAL: Se adapta a cualquier columna enviada por Gemini
        function renderTable(data, columns = []) {
            if (!data || data.length === 0) return;
            const cols = columns.length ? columns : Object.keys(data[0]);

            let head = cols.map(c => `<th>${escapeHtml(c)}</th>`).join('');
            let rows = data.map(item => {
                return `<tr>${cols.map(c => `<td>${escapeHtml(String(item[c] || ''))}</td>`).join('')}</tr>`;
            }).join('');

            const html = `<div class="lod-component-table"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
            addComponentHTML(html);
        }

        function renderContactCard(data) {
            const html = `
                <div class="lod-component-card">
                    <div class="lod-card-name">${escapeHtml(data.name || 'Contacto')}</div>
                    ${data.phone ? `<div class="lod-card-row">📞 <a href="tel:${data.phone}">${escapeHtml(data.phone)}</a></div>` : ''}
                    ${data.email ? `<div class="lod-card-row">📧 <a href="mailto:${data.email}">${escapeHtml(data.email)}</a></div>` : ''}
                </div>`;
            addComponentHTML(html);
        }

        function renderProductList(products) {
            let items = products.map(p => `
                <div class="lod-product-item">
                    <div class="lod-product-thumb-placeholder">📦</div>
                    <span class="lod-product-name">${escapeHtml(p.name)}</span>
                    <span class="lod-product-price">${p.price ? '$' + Number(p.price).toLocaleString() : ''}</span>
                </div>`).join('');
            addComponentHTML(`<div class="lod-component-product">${items}</div>`);
        }

        function renderProductDetail(p) {
            const html = `
                <div class="lod-component-detail">
                    <div class="lod-detail-info">
                        <div class="lod-detail-name">${escapeHtml(p.name)}</div>
                        <div class="lod-detail-desc">${escapeHtml(p.description || '')}</div>
                        <div class="lod-detail-price">${p.price ? '$' + Number(p.price).toLocaleString() : ''}</div>
                        <button class="lod-detail-btn" onclick="document.getElementById('lod-chatbot-input').value='Consultar sobre ${escapeHtml(p.name)}';document.getElementById('lod-chatbot-send').click();">Me interesa</button>
                    </div>
                </div>`;
            addComponentHTML(html);
        }

        function addComponentHTML(html) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'lod-message lod-message-bot';
            messageDiv.innerHTML = `<div class="lod-message-content lod-component">${html}</div>`;
            messagesDiv.appendChild(messageDiv);
            scrollToBottom();
        }
    }
})();