export default class Required {
    constructor(message = 'Campo obrigatório.') {
        this.message = message;
    }

    validate(value) {
        return value !== '';
    }

    getMessage() {
        return this.message; 
    }
}
