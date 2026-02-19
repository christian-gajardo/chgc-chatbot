/** @odoo-module **/

/**
 * Escapes HTML characters to prevent XSS.
 * @param {string} text
 * @returns {string}
 */
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Generates an SVG placeholder based on product category.
 * @param {string} category
 * @returns {string} Base64/Data URI of SVG
 */
export function getCategoryPlaceholder(category) {
    var cat = (category || '').toLowerCase();
    var icon, color;
    if (cat.indexOf('hormig') !== -1 || cat.indexOf('concret') !== -1) {
        icon = 'M4 20h16v-2H4v2zm0-4h16v-2H4v2zm0-4h16v-2H4v2zm0-4h16V6H4v2zm0-4h16V2H4v2z';
        color = '7c8a96';
    } else if (cat.indexOf('fierro') !== -1 || cat.indexOf('acero') !== -1 || cat.indexOf('metal') !== -1) {
        icon = 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l6.59-6.59L20 9l-8 8z';
        color = '6b7b8d';
    } else if (cat.indexOf('moldaje') !== -1 || cat.indexOf('encofr') !== -1) {
        icon = 'M3 3h18v2H3V3zm0 16h18v2H3v-2zm0-8h18v2H3v-2zm4-4h10v2H7V7zm0 8h10v2H7v-2z';
        color = '8d6e63';
    } else if (cat.indexOf('cement') !== -1) {
        icon = 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z';
        color = '9e9e9e';
    } else if (cat.indexOf('arena') !== -1) {
        icon = 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z';
        color = 'c8a951';
    } else if (cat.indexOf('herramienta') !== -1 || cat.indexOf('tool') !== -1) {
        icon = 'M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z';
        color = 'f4a236';
    } else {
        icon = 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6v-2zm0 4h8v2H6v-2zm10 0h2v2h-2v-2zm-6-4h8v2h-8v-2z';
        color = '667eea';
    }
    return 'data:image/svg+xml,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
        + '<rect width="64" height="64" rx="8" fill="#' + color + '22"/>'
        + '<svg x="16" y="16" width="32" height="32" viewBox="0 0 24 24">'
        + '<path fill="#' + color + '" d="' + icon + '"/>'
        + '</svg></svg>'
    );
}
