export default class Email {
    constructor(message = 'Por favor, insira um e-mail válido.') {
        this.message = message;
    }

    validate(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }

    getMessage() {
        return this.message; 
    }
}
