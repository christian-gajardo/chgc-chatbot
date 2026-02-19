/** @odoo-module **/

import { escapeHtml } from "../../utils.js";

/**
 * Renders a contact card with links.
 * @param {Object} data 
 * @returns {string} HTML string
 */
export function renderContactCard(data) {
    if (!data) return '';

    let content = '<div class="lod-component-card">';
    if (data.name) {
        content += '<div class="lod-card-name">' + escapeHtml(data.name) + '</div>';
    }
    if (data.phone) {
        content += '<div class="lod-card-row"><span class="lod-card-icon">📞</span>'
            + '<a href="tel:' + escapeHtml(data.phone) + '">' + escapeHtml(data.phone) + '</a></div>';
    }
    if (data.email) {
        content += '<div class="lod-card-row"><span class="lod-card-icon">📧</span>'
            + '<a href="mailto:' + escapeHtml(data.email) + '">' + escapeHtml(data.email) + '</a></div>';
    }
    content += '</div>';

    return content;
}
