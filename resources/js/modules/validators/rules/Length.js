export default class Length {
    constructor(min, max, message = `O campo {field} deve ter entre ${min} - ${max} caracteres.`) {
        this.min = min;
        this.max = max;
        this.message = message;
    }

    validate(value) {
        return value.length >= this.min && value.length <= this.max;
    }

    getMessage() {
        return this.message;
    }
}
