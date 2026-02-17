/** @odoo-module **/
import { renderToElement } from "@web/core/utils/render";
import { Component, xml, useState } from "@odoo/owl";

export class A2UIChatProcessor {
    // Esta función procesa el string que viene de Gemini
    async handleResponse(rawResponse, container) {
        try {
            const payload = JSON.parse(rawResponse);

            if (payload.action === "render" && payload.data.render_type === "product_card") {
                // Renderizamos la card usando el template XML
                const cardElement = await renderToElement("a2ui.ProductCard", {
                    data: payload.data,
                    onOpen: (id) => this.openProduct(id)
                });
                container.appendChild(cardElement);
            } else {
                this.appendText(rawResponse, container);
            }
        } catch (e) {
            // Si no es JSON, es texto normal
            this.appendText(rawResponse, container);
        }
    }

    openProduct(productId) {
        // Lógica para abrir el formulario de Odoo
        window.location.hash = `id=${productId}&model=product.product&view_type=form`;
    }

    appendText(text, container) {
        const span = document.createElement('span');
        span.innerText = text;
        container.appendChild(span);
    }
}