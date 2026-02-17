/** @odoo-module **/

import { Component, useState } from "@odoo/owl";

export class ChatForm extends Component {
    static template = "mi_modulo_a2ui.ChatForm";

    setup() {
        // Inicializamos el estado del formulario basado en los campos recibidos
        // props.fields espera algo como: [{name: 'email', label: 'Correo', type: 'email'}, ...]
        const initialData = {};
        for (const field of this.props.fields) {
            initialData[field.name] = "";
        }

        this.state = useState({
            formData: initialData,
            isSubmitted: false
        });
    }

    // Captura los cambios de cada input y los guarda en el estado
    onInputChange(ev) {
        const { name, value } = ev.target;
        this.state.formData[name] = value;
    }

    // Maneja el envío del formulario
    async _onSubmitForm(ev) {
        // Evitamos que la página se recargue
        console.log("Datos capturados por la IA:", this.state.formData);

        // Aquí podrías enviar los datos de vuelta al servidor o al chat
        this.state.isSubmitted = true;

        // Ejemplo de notificación (opcional)
        // this.env.services.notification.add("Formulario enviado correctamente", { type: "success" });

        if (this.props.onFormSubmit) {
            await this.props.onFormSubmit(this.state.formData);
        }
    }
}

// Definimos qué propiedades esperamos recibir
ChatForm.props = {
    fields: { type: Array },
    onFormSubmit: { type: Function, optional: true },
};