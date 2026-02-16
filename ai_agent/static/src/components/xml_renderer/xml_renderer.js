/** @odoo-module **/
import { Component } from "@odoo/owl";
import { registry } from "@web/core/registry";

export class AIXmlRenderer extends Component {
    static template = "ai_agent.XmlRenderer";

    get formattedXml() {
        return this.props.data.xml_content || '';
    }
}

registry.category("ai_custom_renderers").add("xml_renderer", AIXmlRenderer);
