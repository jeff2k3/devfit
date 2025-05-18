import InputValidator from "./InputValidator.js";
import Required from "./rules/Required.js";
import Email from "./rules/Email.js";
import Length from "./rules/Length.js";
import Tel from "./rules/Tel.js";

export default class FormValidator {
    
    #rulesMap = new Map([
        ['required', Required],
        ['email', Email],
        ['length', Length],
        ['tel', Tel]
    ]);
    
    #fields = new Map();

    constructor() {
        this.#setupDefaultRules();
    }

    addRules(element, config = {}) {
        this.#validateElement(element);
        const rules = this.#createRuleInstances(element, config);
        this.#registerElement(element, rules);
        this.#setupElementListeners(element);
    }

    validateForm() {
        return Array.from(this.#fields.keys()).every(element => this.#validateField(element, true));
    }

    resetValidationState() {
        this.#fields.forEach((_, element) => {
            new InputValidator(element).clearValidation();
        });
    }

    #setupDefaultRules() {
        this.#rulesMap.forEach((RuleClass, name) => {
            if(typeof RuleClass.prototype.validate !== 'function') {
                throw new Error(`Classe de regra inválida para ${name}`);
            }
        });
    }

    #createRuleInstances(element, config) {
        return Object.entries(config).reduce((acc, [ruleName, params]) => {
            const RuleClass = this.#rulesMap.get(ruleName);
            
            if(RuleClass) {
                this.#handleSpecialRules(element, ruleName, params);
                acc.push(this.#instantiateRule(RuleClass, params));
            }
            
            return acc;
        }, []);
    }

    #handleSpecialRules(element, ruleName, params) {
        if(ruleName === 'length') {
            const [min, max] = this.#normalizeLengthParams(params);
            this.#setLengthAttributes(element, min, max);
        }
    }

    #normalizeLengthParams(params) {
        const normalized = Array.isArray(params) ? params : [null, params];
        return [
            parseInt(normalized[0]) || null,
            parseInt(normalized[1]) || null
        ];
    }

    #setLengthAttributes(element, min, max) {
        if(max && !element.hasAttribute('maxlength')) {
            element.setAttribute('maxlength', max);
        }
        if(min && !element.hasAttribute('minlength')) {
            element.setAttribute('minlength', min);
        }
    }

    #instantiateRule(RuleClass, params) {
        return Array.isArray(params) 
            ? new RuleClass(...params)
            : new RuleClass();
    }

    #registerElement(element, rules) {
        const existingRules = this.#fields.get(element) || [];
        this.#fields.set(element, [...existingRules, ...rules]);
    }

    #setupElementListeners(element) {
        const handler = () => this.#validateField(element);
        const events = ['input', 'blur', 'change'];
        
        events.forEach(event => {
            element.removeEventListener(event, handler);
            element.addEventListener(event, handler);
        });
    }

    #validateField(element, isFormValidation = false) {
        const inputValidator = new InputValidator(element);
        const rules = this.#fields.get(element) || [];
        let isValid = true;

        inputValidator.clearValidation();

        for(const rule of rules) {
            if(!rule.validate(element.value.trim())) {
                isValid = false;
                this.#handleValidationError(element, rule, inputValidator, isFormValidation);
                if(isFormValidation) element.focus();
                break;
            }
        }

        if(isValid) {
            inputValidator.markAsValid();
        }
        return isValid;
    }

    #handleValidationError(element, rule, inputValidator, shouldAnimate) {
        const message = rule.getMessage()
            .replace('{field}', element.name || element.id);
        
        inputValidator.showErrorMessage(message);
        
        if(shouldAnimate) {
            inputValidator.triggerErrorAnimation();
        }
    }

    #validateElement(element) {
        if(!(element instanceof HTMLElement)) {
            throw new Error('Elemento inválido fornecido para validação');
        }
    }
}