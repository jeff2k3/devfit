import FormValidator from "./validators/FormValidator.js";
import { APP_CONFIG } from "../utils/config.js";

export default class FormManager {
    constructor() {
        this.form = document.querySelector(APP_CONFIG.FORM.SELECTORS.FORM);
        this.validator = new FormValidator();
    }

    init() {
        if(this.form) {
            this.#setupValidation();
            this.#setupFormSubmission();
            this.#setupInputStates();
        }
    }

    #setupValidation() {
        const fields = {
            name: { required: true, length: [1, 50] },
            email: { required: true, email: true },
            phone: { required: true, tel: true },
            message: { length: [0, this.#getMessageMaxLength()] }
        };

        Object.entries(fields).forEach(([id, rules]) => {
            const element = document.querySelector(`#${id}`);
            if(element) this.validator.addRules(element, rules);
        });
    }

    #getMessageMaxLength() {
        const messageField = document.querySelector('#message');
        return parseInt(messageField?.getAttribute('maxlength') || 200);
    }

    #setupFormSubmission() {
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            if(this.validator.validateForm()) this.#handleSuccess();
        });
    }

    #handleSuccess() {
        alert('Formulário enviado com sucesso!');
        this.validator.clearAll();
        this.form.reset();
    }

    #setupInputStates() {
        document.querySelectorAll(APP_CONFIG.FORM.SELECTORS.INPUT).forEach(input => {
            this.#updateInputState(input);

            input.addEventListener('focus', () => this.#toggleActiveState(input, true));
            input.addEventListener('blur', () => this.#toggleActiveState(input, false));
        });
    }

    #toggleActiveState(input, isActive) {
        input.classList.toggle(APP_CONFIG.FORM.ACTIVE_CLASS, isActive);
    }

    #updateInputState(input) {
        this.#toggleActiveState(input, input.value.trim().length > 0);
    }
}
