export default class Tel {
    constructor(message = 'Por favor, insira um telefone válido.') {
        this.message = message;
    }

    validate(value) {
        const regex = /^(\(?\d{2}\)?[\s-]?)(9?\d{4}[\s-]?\d{4})$/;
        return regex.test(value);
    }

    getMessage() {
        return this.message;
    }
}