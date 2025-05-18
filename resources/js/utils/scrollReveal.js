export const scrollReveal = (elements, options = {}, callback) => {
    const targets = typeof elements === 'string' ? document.querySelectorAll(elements) : elements;
  
    if(!targets.length) return () => {};
  
    const handleIntersect = (entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const target = entry.target;

                if(callback) {
                    callback(target);
                }else{
                    target.classList.add('revealed');
                }
                observer.unobserve(target);
            }
        });
    };
  
    const observer = new IntersectionObserver(handleIntersect, options);
    targets.forEach(target => observer.observe(target));
  
    return () => observer.disconnect();
};