// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const contactForm = document.getElementById('contact-form');
const modal = document.getElementById('success-modal');

// ===== EmailJS Configuration =====
// Diese Konfiguration müssen Sie bei EmailJS einrichten:
// 1. Registrieren Sie sich unter https://www.emailjs.com/
// 2. Erstellen Sie einen Email Service (z.B. mit Gmail)
// 3. Erstellen Sie ein Email Template
// 4. Ersetzen Sie die Werte unten mit Ihren Daten
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'zSCwx-IuiDsgmZ8Dz', // Hier Ihre Public Key von EmailJS eintragen
    SERVICE_ID: 'service_58md0n9', // Hier Ihre Service ID eintragen
    TEMPLATE_ID: 'template_4jvlajo' // Hier Ihre Template ID eintragen
};

// Initialize EmailJS
(function() {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
})();

// ===== Navbar Scroll Effect =====
let lastScroll = 0;

if (navbar) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ===== Mobile Menu Toggle =====
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ===== Smooth Scroll for Navigation Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Animate Numbers on Scroll =====
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// ===== Scroll Animations =====
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate stat numbers
            if (entry.target.classList.contains('hero-stats')) {
                entry.target.querySelectorAll('[data-count]').forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-count'));
                    animateValue(stat, 0, target, 2000);
                });
            }
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all animate-on-scroll elements
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Also observe hero stats for number animation
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    observer.observe(heroStats);
}

// ===== Contact Form Handling =====
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!data.name || !data.email || !data.phone || !data.privacy) {
            alert('Bitte füllen Sie alle Pflichtfelder aus.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
            return;
        }
        
        // Phone validation (basic)
        const phoneRegex = /^[\d\s\+\-\(\)]{8,}$/;
        if (!phoneRegex.test(data.phone)) {
            alert('Bitte geben Sie eine gültige Telefonnummer ein.');
            return;
        }
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Wird gesendet...</span>';
        submitBtn.disabled = true;
        
        try {
            // Send email via EmailJS
            const emailParams = {
                from_name: data.name,
                from_email: data.email,
                from_phone: data.phone,
                from_company: data.company || 'Keine Angabe',
                message: data.message || 'Keine Nachricht hinterlassen',
                timestamp: new Date().toLocaleString('de-DE')
            };
            
            console.log('Sende Email mit Parametern:', emailParams);
            console.log('EmailJS Konfiguration:', EMAILJS_CONFIG);
            
            const response = await emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID,
                emailParams
            );
            
            console.log('EmailJS Antwort:', response);
            
            if (response.status === 200) {
                // Show success modal
                if (modal) {
                    modal.classList.add('active');
                }
                
                // Reset form
                contactForm.reset();
                
                // Save to localStorage for admin dashboard
                const requests = JSON.parse(localStorage.getItem('contactRequests') || '[]');
                requests.push({
                    id: 'req-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                    name: data.name,
                    company: data.company || '',
                    email: data.email,
                    phone: data.phone,
                    message: data.message || '',
                    timestamp: new Date().toISOString(),
                    status: 'neu',
                    emailSent: true
                });
                localStorage.setItem('contactRequests', JSON.stringify(requests));
                
                alert('Email erfolgreich gesendet! Sie erhalten eine Bestätigung an mutlu.arabul97@gmail.com');
                
            } else {
                throw new Error('Email konnte nicht gesendet werden. Status: ' + response.status);
            }
            
        } catch (error) {
            console.error('Fehler beim Email-Versand:', error);
            alert('Fehler beim Email-Versand: ' + error.message + '\n\nDie Daten wurden lokal gespeichert. Bitte überprüfen Sie Ihre EmailJS-Konfiguration.');
            
            // Fallback: Nur lokal speichern wenn Email fehlschlägt
            const requests = JSON.parse(localStorage.getItem('contactRequests') || '[]');
            requests.push({
                id: 'req-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                name: data.name,
                company: data.company || '',
                email: data.email,
                phone: data.phone,
                message: data.message || '',
                timestamp: new Date().toISOString(),
                status: 'neu',
                emailSent: false,
                error: error.message
            });
            localStorage.setItem('contactRequests', JSON.stringify(requests));
            
            // Zeige Fehlermeldung aber speichere trotzdem
            alert('Ihre Anfrage wurde gespeichert, aber es gab ein Problem beim Email-Versand. Wir melden uns trotzdem bei Ihnen!');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ===== Close Modal =====
function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
}

// Close modal on backdrop click
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// ===== FAQ Accordion =====
document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('toggle', function() {
        if (this.open) {
            // Close other open items
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== this && otherItem.open) {
                    otherItem.open = false;
                }
            });
        }
    });
});

// ===== Parallax Effect for Hero Orbs =====
let ticking = false;

function initOrbBasePositions() {
    const orbs = document.querySelectorAll('.gradient-orb');
    orbs.forEach((orb) => {
        if (orb.dataset.baseTop || orb.dataset.baseBottom) return;

        const style = window.getComputedStyle(orb);
        const top = style.top;
        const bottom = style.bottom;

        if (top && top !== 'auto') {
            orb.dataset.baseTop = top;
        }
        if (bottom && bottom !== 'auto') {
            orb.dataset.baseBottom = bottom;
        }
    });
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const orbs = document.querySelectorAll('.gradient-orb');
            
            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 0.05;

                // Important: don't overwrite CSS transforms (they animate the orbs).
                // Instead, we offset via top/bottom.
                if (orb.classList.contains('orb-3')) {
                    orb.style.top = `calc(50% + ${scrolled * speed}px)`;
                    return;
                }

                if (orb.dataset.baseTop) {
                    const baseTop = parseFloat(orb.dataset.baseTop);
                    orb.style.top = `${baseTop + (scrolled * speed)}px`;
                } else if (orb.dataset.baseBottom) {
                    const baseBottom = parseFloat(orb.dataset.baseBottom);
                    orb.style.bottom = `${baseBottom - (scrolled * speed)}px`;
                }
            });
            
            ticking = false;
        });
        ticking = true;
    }
});

// ===== Add Active State to Navigation =====
const sections = document.querySelectorAll('section[id], header[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
});

// ===== Typing Effect for Hero Title (Optional Enhancement) =====
// Uncomment if you want a typing effect
/*
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}
*/

// ===== Performance: Lazy Load Images =====
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"][data-src]');
    images.forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lozad.js/1.16.0/lozad.min.js';
    script.onload = function() {
        const observer = lozad();
        observer.observe();
    };
    document.body.appendChild(script);
}

// ===== Console Easter Egg =====
console.log('%c🚀 WebPro Design', 'font-size: 24px; font-weight: bold; color: #6366f1;');
console.log('%cProfessionelle Websites mit strategischer Google-Platzierung', 'font-size: 14px; color: #6b7280;');
console.log('%cInteresse an einer Zusammenarbeit? Kontaktieren Sie uns!', 'font-size: 12px; color: #10b981;');

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class for initial animations
    document.body.classList.add('loaded');

    initOrbBasePositions();
    
    // Initialize any additional features
    console.log('Website initialized successfully');
});
