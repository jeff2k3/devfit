import { triggerAnimation } from "../../utils/triggerAnimation.js";

export default class InputValidator {
    static ERROR_CLASS = 'help-block';

    constructor(inputElement) {
        this.input = inputElement;
        this.errorId = `${this.input.id}-error`;
    }

    showErrorMessage(message) {
        this.clearValidation();

        this.#setAccessibilityAttributes(true);
        this.input.insertAdjacentElement('afterend', this.#createMessageElement(message));
        this.input.classList.add('is-invalid');
    }

    markAsValid() {
        this.clearValidation();
        this.input.classList.add('is-valid');
    }

    clearValidation() {
        this.#removeValidationClasses();
        this.#setAccessibilityAttributes(false);
        this.#removeExistingMessage();
    }

    async triggerErrorAnimation() {
        await triggerAnimation(this.input.parentElement, {
            animation: 'shake 600ms ease-in-out forwards',
            transformStyle: 'preserve-3d'
        });
    }

    #createMessageElement(message) {
        const element = document.createElement('div');
        element.className = InputValidator.ERROR_CLASS;
        element.textContent = message;
        element.id = this.errorId;
        element.setAttribute('role', 'alert');
        return element;
    }

    #removeValidationClasses() {
        this.input.classList.remove('is-valid', 'is-invalid');
    }

    #setAccessibilityAttributes(hasError) {
        this.input.setAttribute('aria-invalid', hasError);
        this.input.setAttribute('aria-describedby', hasError ? this.errorId : '');
    }

    #removeExistingMessage() {
        this.input.nextElementSibling?.classList?.contains(InputValidator.ERROR_CLASS) && this.input.nextElementSibling.remove();
    }
}
