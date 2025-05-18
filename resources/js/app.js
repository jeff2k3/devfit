import NavManager from './modules/NavManager.js';
import FormManager from './modules/FormManager.js';
import WhatsAppManager from './modules/WhatsAppManager.js';
import { debounce } from './utils/debounce.js';
import { scrollReveal } from './utils/scrollReveal.js';
import { APP_CONFIG } from './utils/config.js';

new class App {
    #modules = [];
    #eventListeners = [];
    #scrollHandler = debounce(() => scrollReveal(APP_CONFIG.SCROLL.SELECTOR, APP_CONFIG.SCROLL.OPTIONS));

    constructor() {
        this.#initializeCore();
        this.#registerModules();
        this.#setupEventListeners();
        this.#scrollHandler();
    }

    #initializeCore() {
        if('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        const scrollToTop = (offsetY) => window.scrollTo({ top: offsetY, behavior: 'smooth' });
        const scrollTo = (element) => {
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const targetPosition = element.getBoundingClientRect().top + window.scrollY - headerHeight;

            scrollToTop(targetPosition);
        };
        const hash = window.location.hash?.trim();
        const targetHash = hash && hash !== '#' ? document.querySelector(hash) : null;

        requestAnimationFrame(() => {
            targetHash ? scrollTo(targetHash) : scrollToTop(0);
        });
    }

    #registerModules() {
        this.#modules.push(
            new NavManager(),
            new FormManager(),
            new WhatsAppManager(APP_CONFIG.PHONE_WPP)
        );
    }

    #setupEventListeners() {
        const handlers = {
            resize: this.#scrollHandler,
            scroll: this.#scrollHandler,
            DOMContentLoaded: this.#initializeModules.bind(this)
        };

        Object.entries(handlers).forEach(([event, handler]) => {
            window.addEventListener(event, handler);
            this.#eventListeners.push({ event, handler });
        });
    }

    #initializeModules() {
        this.#modules.forEach(module => {
            try {
                module.init?.();
            }catch(error) {
                console.error(`Erro de inicialização em ${module.constructor.name}:`, error);
            }
        });
    }
}
