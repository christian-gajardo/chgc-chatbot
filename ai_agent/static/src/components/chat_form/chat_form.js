/** @odoo-module **/
import { Component, useState, onWillUpdateProps } from "@odoo/owl";
import { registry } from "@web/core/registry";

export class ChatForm extends Component {
    static template = "ai_agent.ChatForm";

    setup() {
        this.state = useState({
            formData: this._createInitialData(this.props.fields),
            submitted: false
        });

        // Esto asegura que si la IA cambia los campos, el formulario se resetee
        onWillUpdateProps((nextProps) => {
            if (JSON.stringify(this.props.fields) !== JSON.stringify(nextProps.fields)) {
                this.state.formData = this._createInitialData(nextProps.fields);
                this.state.submitted = false;
            }
        });
    }

    _createInitialData(fields) {
        const data = {};
        fields.forEach(f => {
            data[f.name] = "";
        });
        return data;
    }

    onInputChange(name, value) {
        this.state.formData[name] = value;
    }

    async _onSubmitForm() {
        if (this.state.submitted) return; // Evitar doble click

        this.state.submitted = true;
        if (this.props.onFormSubmit) {
            // Enviamos una copia de los datos para evitar problemas de referencia
            await this.props.onFormSubmit({ ...this.state.formData });
        }
    }
}

registry.category("components").add("ChatForm", ChatForm);