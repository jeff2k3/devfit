export const triggerAnimation = (element, styles = {}, animationClass = 'animating') => {
    return new Promise((resolve) => {
        if(!element || element.classList.contains(animationClass)) {
            resolve();
            return;
        }

        const handleAnimationEnd = () => {
            for(const prop in styles) {
                element.style.removeProperty(prop);
            }
            // Force reflow
            void element.offsetHeight;

            element.classList.remove(animationClass);
            resolve();
        };

        element.classList.add(animationClass);
        Object.assign(element.style, styles);
        element.addEventListener('animationend', handleAnimationEnd, { once: true });
    });
};
