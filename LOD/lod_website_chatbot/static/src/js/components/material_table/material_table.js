/** @odoo-module **/

import { escapeHtml } from "../../utils.js";

/**
 * Renders a material table with status badges.
 * @param {Array} materials 
 * @returns {string} HTML string
 */
export function renderMaterialTable(materials) {
    if (!materials || materials.length === 0) return '';

    let rows = '';
    for (const m of materials) {
        const stateLabel = m.state === 'available' ? 'Disponible'
            : m.state === 'low' ? 'Stock bajo' : 'Agotado';
        const stateClass = m.state === 'available' ? 'lod-state-available'
            : m.state === 'low' ? 'lod-state-low' : 'lod-state-out';
        rows += '<tr>'
            + '<td>' + escapeHtml(m.name) + '</td>'
            + '<td>' + escapeHtml(String(m.quantity)) + ' ' + escapeHtml(m.unit) + '</td>'
            + '<td><span class="lod-state-badge ' + stateClass + '">' + escapeHtml(stateLabel) + '</span></td>'
            + '</tr>';
    }

    return '<div class="lod-component-table">'
        + '<table><thead><tr><th>Material</th><th>Cantidad</th><th>Estado</th></tr></thead>'
        + '<tbody>' + rows + '</tbody></table></div>';
}
