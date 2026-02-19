/** @odoo-module **/

import { escapeHtml, getCategoryPlaceholder } from "../../utils.js";

/**
 * Renders a product detail card.
 * @param {Object} data 
 * @returns {string} HTML string
 */
export function renderProductDetail(data) {
    if (!data) return '';

    let content = '<div class="lod-component-detail">';
    const imgSrc = data.image_url
        ? escapeHtml(data.image_url)
        : getCategoryPlaceholder(data.category);
    content += '<img class="lod-detail-image" src="' + imgSrc
        + '" alt="' + escapeHtml(data.name || '') + '"'
        + ' onerror="this.src=\'' + getCategoryPlaceholder(data.category) + '\'" />';
    content += '<div class="lod-detail-info">';
    if (data.name) {
        content += '<div class="lod-detail-name">' + escapeHtml(data.name) + '</div>';
    }
    if (data.category) {
        content += '<div class="lod-detail-category">' + escapeHtml(data.category) + '</div>';
    }
    if (data.description) {
        content += '<div class="lod-detail-desc">' + escapeHtml(data.description) + '</div>';
    }
    if (data.price > 0) {
        content += '<div class="lod-detail-price">$'
            + Number(data.price).toLocaleString('es-CL') + '</div>';
    }
    // Note: The onclick handler depends on global lod-chatbot-input and lod-chatbot-send being available in the DOM
    content += '<button class="lod-detail-btn" onclick="document.getElementById(\'lod-chatbot-input\').value=\'Quiero más información sobre ' + escapeHtml(data.name || '') + '\';document.getElementById(\'lod-chatbot-send\').click();">Consultar</button>';
    content += '</div></div>';

    return content;
}
