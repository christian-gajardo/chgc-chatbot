/** @odoo-module **/

import { escapeHtml, getCategoryPlaceholder } from "../../utils.js";

/**
 * Renders a list of products.
 * @param {Array} products 
 * @returns {string} HTML string
 */
export function renderProductList(products) {
    if (!products || products.length === 0) return '';

    let items = '';
    for (const p of products) {
        const price = p.price > 0
            ? '$' + Number(p.price).toLocaleString('es-CL')
            : 'Consultar';
        const imgSrc = p.image_url
            ? escapeHtml(p.image_url)
            : getCategoryPlaceholder(p.category);
        items += '<div class="lod-product-item">'
            + '<img class="lod-product-thumb" src="' + imgSrc
            + '" alt="" onerror="this.src=\'' + getCategoryPlaceholder(p.category) + '\'" />'
            + '<span class="lod-product-name">' + escapeHtml(p.name) + '</span>'
            + '<span class="lod-product-price">' + escapeHtml(price) + '</span>'
            + '</div>';
    }

    return '<div class="lod-component-product">' + items + '</div>';
}
