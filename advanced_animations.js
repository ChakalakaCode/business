// ===== Advanced Professional Animations =====

// Initialize Professional Design Elements
document.addEventListener('DOMContentLoaded', () => {
    initProfessionalBackgrounds();
    initMicroInteractions();
    initScrollEffects();
    initFloatingElements();
    initParallaxEffects();
    initMagneticButtons();
    initGlowEffects();
});

// ===== Professional Backgrounds =====
function initProfessionalBackgrounds() {
    // Add animated gradient class to hero
    const hero = document.querySelector('.hero-professional');
    if (hero) {
        hero.classList.add('animated-gradient-bg', 'noise-texture', 'particles-bg');
    }
    
    // Add mesh gradient to sections
    const sections = document.querySelectorAll('.section-professional');
    sections.forEach(section => {
        section.classList.add('mesh-gradient');
    });
}

// ===== Micro Interactions =====
function initMicroInteractions() {
    // Button hover effects
    const buttons = document.querySelectorAll('.btn-professional');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('btn-ripple');
            this.appendChild(ripple);
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Card hover effects
    const cards = document.querySelectorAll('.premium-card, .glass-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Input focus effects
    const inputs = document.querySelectorAll('.form-input-professional');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('input-focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('input-focused');
        });
    });
}

// ===== Enhanced Scroll Effects =====
function initScrollEffects() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add stagger animation for multiple elements
                const children = entry.target.querySelectorAll('.animate-stagger');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-in');
                    }, index * 100);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animateElements = document.querySelectorAll('.animate-on-scroll, .premium-card, .glass-card');
    animateElements.forEach(el => observer.observe(el));
}

// ===== Floating Elements =====
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.gradient-orb-professional');
    
    floatingElements.forEach((orb, index) => {
        // Add random floating animation
        const duration = 15 + (index * 5);
        const delay = index * 2;
        
        orb.style.animation = `floatOrb ${duration}s ease-in-out ${delay}s infinite`;
    });
    
    // Add floating cards
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        const duration = 3 + (index * 0.5);
        const delay = index * 0.3;
        
        card.style.animation = `floatCard ${duration}s ease-in-out ${delay}s infinite`;
    });
}

// ===== Parallax Effects =====
function initParallaxEffects() {
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // Add parallax class to hero elements
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        heroVisual.classList.add('parallax-element');
        heroVisual.dataset.speed = '0.3';
    }
}

// ===== Magnetic Buttons =====
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-professional-primary');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0)';
        });
    });
}

// ===== Glow Effects =====
function initGlowEffects() {
    // Add glow effect on hover
    const glowElements = document.querySelectorAll('.glow-on-hover');
    
    glowElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.boxShadow = 'var(--shadow-glow-strong)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
    
    // Pulsing glow for important elements
    const pulseElements = document.querySelectorAll('.pulse-glow');
    pulseElements.forEach(element => {
        element.style.animation = 'pulseGlow 2s ease-in-out infinite';
    });
}

// ===== CSS Animation Keyframes =====
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    /* Button Ripple Effect */
    .btn-ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    /* Floating Card Animation */
    @keyframes floatCard {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-10px) rotate(1deg); }
    }
    
    /* Animate In */
    .animate-in {
        animation: slideInUp 0.6s ease-out forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Input Focus */
    .input-focused .form-input-professional {
        background: rgba(255, 255, 255, 0.2);
        border-color: var(--primary-400);
        box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.3);
    }
    
    /* Pulse Glow */
    @keyframes pulseGlow {
        0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.4); }
        50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.8); }
    }
    
    /* Shimmer Effect */
    @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
    
    /* Gradient Animation */
    @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    
    /* Particle Float */
    @keyframes floatParticles {
        0% { transform: translate(0, 0) rotate(0deg); }
        100% { transform: translate(-100px, -100px) rotate(360deg); }
    }
    
    /* Enhanced Hover States */
    .premium-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }
    
    .glass-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
    }
    
    /* Smooth Transitions */
    * {
        transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
    }
`;

document.head.appendChild(styleSheet);

// ===== Performance Optimizations =====
function optimizePerformance() {
    // Reduce motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduced-motion');
    }
    
    // Add GPU acceleration for animated elements
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .gradient-orb, .floating-card');
    animatedElements.forEach(el => {
        el.classList.add('gpu-accelerated');
    });
    
    // Enable smooth scrolling
    document.documentElement.classList.add('smooth-scroll');
}

// Initialize performance optimizations
optimizePerformance();
