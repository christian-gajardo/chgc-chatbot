/** @odoo-module **/

import { escapeHtml } from "./utils.js";
import { renderMaterialTable } from "./components/material_table/material_table.js";
import { renderContactCard } from "./components/contact_card/contact_card.js";
import { renderProductList } from "./components/product_list/product_list.js";
import { renderProductDetail } from "./components/product_detail/product_detail.js";

import { renderToElement } from "@web/core/utils/render";

// funcion que se ejecuta al cargar el archivo, sirve para cargar el chatbot. 
(function () {
    'use strict';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }
    // funcion para cargar el chatbot , se define como una funcion anonima para que no se ejecute 
    // al cargar el archivo solo lo ejecuta cuando se llama
    // html para cargar el chatbot 
    function initChatbot() {
        // inserta el chatbot en el body usando renderToElement
        const chatbotElement = renderToElement("lod_website_chatbot.ChatbotWindow");
        document.body.appendChild(chatbotElement);

        // selecciona los elementos del chatbot , usando getElementById estos elementos estan definidos en el html. 
        const chatbot = document.getElementById('lod-chatbot');
        const toggleBtn = document.getElementById('lod-chatbot-toggle');
        const closeBtn = document.getElementById('lod-chatbot-close');
        const messagesDiv = document.getElementById('lod-chatbot-messages');
        const input = document.getElementById('lod-chatbot-input');
        const sendBtn = document.getElementById('lod-chatbot-send');
        const typingIndicator = document.getElementById('lod-chatbot-typing');

        // agrega los eventos a los botones, usando addEventListener
        toggleBtn.addEventListener('click', toggleChat);
        closeBtn.addEventListener('click', toggleChat);
        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        // funciones para el chatbot, su funcion es controlar el chatbot. toggleChat es para abrir y cerrar el chatbot
        function toggleChat() {
            chatbot.classList.toggle('lod-chatbot-closed'); // toggle para cerrar y abrir el chatbot
            chatbot.classList.toggle('lod-chatbot-open'); // toggle para cerrar y abrir el chatbot
            if (chatbot.classList.contains('lod-chatbot-open')) {// si el chatbot esta abierto se enfoca el input
                input.focus();
            }
        }
        // funcion para enviar el mensaje, usando async para que sea asincrona
        // esta funcion asincrona envia el mensaje al chatbot y espera la respuesta. 
        async function sendMessage() {
            const message = input.value.trim(); // quita los espacios en blanco al inicio y al final del mensaje
            if (!message) return; // si el mensaje esta vacio no hace nada

            addMessage(message, 'user'); // agrega el mensaje del usuario
            input.value = ''; // limpia el input

            typingIndicator.style.display = 'flex'; // muestra el indicador de typing
            scrollToBottom(); // scrollea al final del chat

            // envia el mensaje al chatbot
            try {
                const response = await fetch('/api/chatbot/ask', { // ruta de la api modulo python  
                    method: 'POST', // metodo post
                    headers: { 'Content-Type': 'application/json' }, // tipo de contenido
                    body: JSON.stringify({ // envia el mensaje en formato json
                        jsonrpc: "2.0", // version de jsonrpc
                        method: "call", // metodo de llamada
                        params: { message: message }//parametros del mensaje
                    })
                });
                // recibe la respuesta del chatbot
                const data = await response.json();
                typingIndicator.style.display = 'none'; // oculta el indicador de typing
                // agrega el mensaje del chatbot
                if (data.result && data.result.success) {
                    renderComponent(data.result); // renderiza el componente según el tipo
                } else {
                    const errorMsg = data.result?.error || 'Error al procesar tu consulta';
                    addMessage(errorMsg, 'error');
                }
                // maneja el error
            } catch (error) {
                console.error('Error:', error); // muestra el error en la consola
                typingIndicator.style.display = 'none'; // oculta el indicador de typing
                addMessage('Problema de conexión. Intenta nuevamente.', 'error'); // agrega el mensaje de error
            }
        }
        // agrega el mensaje al chat
        function addMessage(text, type) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `lod-message lod-message-${type}`; // agrega la clase del mensaje
            messageDiv.innerHTML = `<div class="lod-message-content">${escapeHtml(text)}</div>`; // agrega el contenido del mensaje
            messagesDiv.appendChild(messageDiv); // agrega el mensaje al chat
            scrollToBottom(); // scrollea al final del chat
        }
        // scrollea al final del chat
        function scrollToBottom() {
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        // renderiza el componente según el tipo devuelto por el backend
        function renderComponent(payload) {
            const type = payload.type || 'text';
            // Siempre mostrar el texto amigable de Gemini
            if (payload.text) {
                addMessage(payload.text, 'bot');
            }
            // Renderizar componente visual si hay data
            if (payload.data) {
                let html = '';
                switch (type) {
                    case 'material_table':
                        html = renderMaterialTable(payload.data);
                        break;
                    case 'contact_card':
                        html = renderContactCard(payload.data);
                        break;
                    case 'product_list':
                        html = renderProductList(payload.data);
                        break;
                    case 'product_detail':
                        html = renderProductDetail(payload.data);
                        break;
                }
                if (html) {
                    addComponentHTML(html);
                }
            }
        }

        // inserta HTML de componente como mensaje bot en el chat
        function addComponentHTML(html) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'lod-message lod-message-bot';
            messageDiv.innerHTML = '<div class="lod-message-content lod-component">' + html + '</div>';
            messagesDiv.appendChild(messageDiv);
            scrollToBottom();
        }
    }
})();


// en resumen ese codigo es el chatbot que se muestra en la pagina web , su estructura es la siguiente:
// 1. Crea el chatbot
// 2. Agrega los eventos a los botones
// 3. Agrega las funciones del chatbot
// 4. Agrega el mensaje del usuario
// 5. Agrega el mensaje del chatbot
// 6. Agrega el mensaje del error
// 7. Agrega el mensaje del typing. 