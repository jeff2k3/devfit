import { triggerAnimation } from "../utils/triggerAnimation.js";

export default class NavManager {

    #items;
    #links;

    static SELECTORS = {
        NAV: '#nav',
        TOGGLE: '.nav__toggle',
        LINK: 'a[href^="#"]',
        ITEM: '.nav__item',
        HEADER: '.header'
    };

    static ANIMATION = {
        NAME: 'fade-in',
        DURATION: 500,
        EASING: 'ease',
        STAGGER_RATIO: 0.25,
        FILL_MODE: 'forwards'
    };

    static BREAKPOINT = 768;

    static ARIA_LABELS = {
        OPEN: 'Abrir Menu',
        CLOSE: 'Fechar Menu'
    };

    constructor() {
        this.nav = document.querySelector(NavManager.SELECTORS.NAV);
        this.toggle = document.querySelector(NavManager.SELECTORS.TOGGLE);
        this.header = document.querySelector(NavManager.SELECTORS.HEADER);

        this.#validateEssentialElements();

        this.#items = this.#cacheElements(NavManager.SELECTORS.ITEM);
        this.#links = this.#cacheElements(NavManager.SELECTORS.LINK);

        this.#bindEventListeners();
    }

    #validateEssentialElements() {
        if(!this.nav || !this.toggle) {
            throw new Error('Elementos essenciais de navegação não encontrados');
        }
    }

    #cacheElements(selector) {
        return [...document.querySelectorAll(selector)];
    }

    #bindEventListeners() {
        this.toggle.addEventListener('click', this.#handleToggleClick);

        this.#links.forEach(link => link.addEventListener('click', this.#handleLinkClick));

        window.addEventListener('resize', this.#handleWindowEvent);
    }

    #handleToggleClick = () => {
        this.#updateItemsVisibility();

        this.nav.classList.toggle('nav--open');

        if(this.isOpen && this.isMobile) setTimeout(() => this.#animateMenuItems(), 150);

        this.#updateAriaAttributes();
    }

    #handleLinkClick = (event) => {
        this.#handleToggleClick();
        this.#scrollToSection(event.target.hash);
    }

    #handleWindowEvent = () => {
        if(this.isOpen && this.isMobile) this.#closeNavigation();
    }

    #animateMenuItems() {
        this.#items.forEach(async (item, index) => {
            const delay = this.#calculateAnimationDelay(index).toFixed(2);
            await triggerAnimation(item, {
                animation: `${NavManager.ANIMATION.NAME}
                            ${NavManager.ANIMATION.DURATION}ms
                            ${NavManager.ANIMATION.EASING}
                            ${NavManager.ANIMATION.FILL_MODE}
                            ${delay}s`
            }).then(() => item.style.setProperty('opacity', 1));
        });
    }

    #calculateAnimationDelay(index) {
        return (index + 1) / this.#items.length * NavManager.ANIMATION.STAGGER_RATIO;
    }

    #scrollToSection(targetHash) {
        const targetElement = document.querySelector(targetHash);
        if(!targetElement) return;

        const headerOffset = this.header ? this.header.offsetHeight : 0;

        const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;

        requestAnimationFrame(() => {
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        });

        history.replaceState(null, null, targetHash);
    }

    #updateItemsVisibility() {
        this.#items.forEach((item) => {
            if(this.isMobile) {
                item.style.setProperty('opacity', this.isOpen ? '1' : '0');
            }else{
                item.style.removeProperty('opacity');
            }
        });
    }

    #updateAriaAttributes() {
        const isOpen = this.isOpen;
        this.toggle.setAttribute('aria-expanded', isOpen);
        this.toggle.setAttribute('aria-label',
            isOpen ? NavManager.ARIA_LABELS.CLOSE : NavManager.ARIA_LABELS.OPEN);
    }

    #closeNavigation() {
        this.#updateItemsVisibility();
        this.nav.classList.remove('nav--open');
        this.#updateAriaAttributes();
    }

    get isMobile() {
        return window.innerWidth <= NavManager.BREAKPOINT;
    }

    get isOpen() {
        return this.nav.classList.contains('nav--open');
    }
}
