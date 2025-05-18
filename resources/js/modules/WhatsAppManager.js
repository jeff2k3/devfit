export default class WhatsAppManager {

    constructor(phoneWpp) {
        this.phone = phoneWpp;
    }

    init() {
        this.#setupHeroCTA();
        this.#setupPlanButtons();
    }

    #setupHeroCTA() {
        const heroButton = document.querySelector('.hero__cta');
        if(!heroButton) return;

        heroButton.addEventListener('click', (event) => {
            event.preventDefault();
           this.#buildURL('Olá! Gostaria de agendar minha aula experimental na DevFit.');
        });
    }

    #setupPlanButtons() {
        document.querySelectorAll('.plano-card__cta').forEach(btn => {
            btn.addEventListener('click', (event) => {
                event.preventDefault();
                const plan_name = (btn.dataset.plan || 'undefined').replace(/\b\w/g, char => char.toUpperCase());

               this.#buildURL(`Olá! Quero saber sobre o plano *${plan_name}* DevFit.`);
            });
        });
    }

    #buildURL(message = '') {
        const hasValidMessage = message?.trim().length > 0;
        const url = `https://wa.me/${this.phone}${hasValidMessage ? `?text=${encodeURIComponent(message)}` : ''}`;

        window.open(url, '_blank');
    }
}