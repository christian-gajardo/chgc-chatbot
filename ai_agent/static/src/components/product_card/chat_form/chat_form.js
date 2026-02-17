/** @odoo-module **/
import { Component, useState } from "@odoo/owl";

export class ChatForm extends Component {
    static template = "mi_modulo_a2ui.ChatForm";

    setup() {
        const initialData = {};
        this.props.fields.forEach(f => initialData[f.name] = "");
        this.state = useState({ formData: initialData, submitted: false });
    }

    onInputChange(ev) {
        this.state.formData[ev.target.name] = ev.target.value;
    }

    async _onSubmitForm() {
        console.log("Datos para procesar:", this.state.formData);
        this.state.submitted = true;
        if (this.props.onFormSubmit) {
            await this.props.onFormSubmit(this.state.formData);
        }
    }
}