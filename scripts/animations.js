// Scroll reveal animation with pixel-perfect movement
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.transform = 'translate(0, 0)';
            entry.target.style.opacity = '1';
        }
    });
}, observerOptions);

// Dark themed hover effects
const interactiveElements = document.querySelectorAll('a, button, .skill-tag, .project-card');
interactiveElements.forEach(elem => {
    elem.addEventListener('mouseenter', () => {
        playDarkSound();
        elem.style.boxShadow = '0 0 20px rgba(139, 49, 238, 0.5)';
    });
    elem.addEventListener('mouseleave', () => {
        elem.style.boxShadow = '';
    });
});

// Dark themed sound effect
function playDarkSound() {
    const audio = new Audio();
    audio.src = 'data:audio/wav;base64,...'; // Base64 dark sound effect
    audio.volume = 0.1;
    audio.play();
}

// Loading animation
window.addEventListener('load', () => {
    const loadingBar = document.createElement('div');
    loadingBar.classList.add('loading-bar');
    document.body.appendChild(loadingBar);

    setTimeout(() => {
        loadingBar.style.opacity = '0';
        setTimeout(() => {
            loadingBar.remove();
        }, 300);
    }, 1000);
});

// Parallax effect for header
const header = document.querySelector('.page-header');
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    header.style.backgroundPositionY = scrolled * 0.5 + 'px';
});

// Export animation initialization
function initializeAnimations() {
    document.querySelectorAll('.main-content article').forEach((elem) => {
        elem.style.transform = 'translate(0, 16px)';
        elem.style.opacity = '0';
        elem.style.transition = 'all 0.3s steps(3)';
        observer.observe(elem);
    });
}

// Initial setup
initializeAnimations();