const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -10% 0px' };
let observer = null;

if (motionOk && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
}

function registerReveal(element, delayMs) {
    if (!element || element.dataset.revealInit) return;
    element.dataset.revealInit = '1';
    element.classList.add('reveal');
    if (typeof delayMs === 'number') {
        element.style.transitionDelay = `${delayMs}ms`;
    }
    if (observer) {
        observer.observe(element);
    } else {
        element.classList.add('is-visible');
    }
}

function initializeAnimations(root = document) {
    const sections = root.querySelectorAll('.main-content section');
    sections.forEach((section, index) => registerReveal(section, index * 90));

    const postCards = root.querySelectorAll('.post-card');
    postCards.forEach((card, index) => registerReveal(card, 120 + index * 70));

    const experienceItems = root.querySelectorAll('.experience-item, .education-item');
    experienceItems.forEach((item, index) => registerReveal(item, 160 + index * 50));
}

const mutationObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                initializeAnimations(node);
            }
        });
    }
});

mutationObserver.observe(document.documentElement, { childList: true, subtree: true });

window.addEventListener('load', () => {
    document.body.classList.add('js-ready');

    const loadingBar = document.createElement('div');
    loadingBar.classList.add('loading-bar');
    document.body.appendChild(loadingBar);

    setTimeout(() => {
        loadingBar.style.opacity = '0';
        setTimeout(() => {
            loadingBar.remove();
        }, 300);
    }, 1000);

    initializeAnimations();
});

if (motionOk) {
    const header = document.querySelector('.page-header');
    if (header) {
        let rafId = null;
        const updateHeader = () => {
            const scrolled = window.pageYOffset || 0;
            header.style.backgroundPosition = `50% ${scrolled * 0.2}px`;
            rafId = null;
        };
        window.addEventListener('scroll', () => {
            if (rafId) return;
            rafId = window.requestAnimationFrame(updateHeader);
        });
    }

    const sections = Array.from(document.querySelectorAll('.main-content section'));
    if (sections.length) {
        let rafId = null;
        const updateSections = () => {
            const viewportCenter = window.innerHeight * 0.6;
            sections.forEach((section) => {
                const rect = section.getBoundingClientRect();
                const offset = ((rect.top - viewportCenter) / window.innerHeight) * -12;
                section.style.setProperty('--panel-shift', `${offset}px`);
            });
            rafId = null;
        };
        window.addEventListener('scroll', () => {
            if (rafId) return;
            rafId = window.requestAnimationFrame(updateSections);
        });
        window.addEventListener('resize', () => {
            if (rafId) return;
            rafId = window.requestAnimationFrame(updateSections);
        });
        updateSections();
    }
}
