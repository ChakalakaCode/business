// Website Konfigurator JavaScript
class WebsiteConfigurator {
    constructor() {
        this.basePrice = 499;
        this.baseMonthly = 29.95;
        this.selectedOptions = {
            type: { value: 'onepager', price: 0, label: 'Onepager' },
            design: { value: 'basic', price: 0, label: 'Basic Design' },
            seo: { value: 'none', price: 0, label: 'Ohne SEO-Texte' },
            legal: { value: 'basic', price: 0, label: 'Basic Rechtliches' },
            features: []
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateSummary();
        this.updatePrices();
        this.initContactForm();
    }

    bindEvents() {
        // Option selection events
        document.querySelectorAll('.config-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.handleOptionClick(e.currentTarget);
            });
        });

        // Reset button
        document.getElementById('reset-config')?.addEventListener('click', () => {
            this.resetConfiguration();
        });

        // Contact form events
        document.getElementById('back-to-config')?.addEventListener('click', () => {
            this.showConfigurator();
        });

        document.getElementById('configurator-form')?.addEventListener('submit', (e) => {
            this.handleFormSubmit(e);
        });

        // Add to navigation
        this.addToNavigation();
    }

    handleOptionClick(option) {
        const category = option.dataset.category;
        const value = option.dataset.value;
        const price = parseFloat(option.dataset.price);
        const label = this.getOptionLabel(option);

        // Handle checkbox options (features)
        if (option.classList.contains('checkbox-option')) {
            this.toggleFeature(option, category, value, price, label);
        } else {
            // Handle radio options
            this.selectOption(option, category, value, price, label);
        }

        this.updateSummary();
        this.updatePrices();
    }

    selectOption(option, category, value, price, label) {
        // Remove selected class from siblings
        const siblings = option.parentElement.querySelectorAll('.config-option');
        siblings.forEach(sibling => sibling.classList.remove('selected'));

        // Add selected class to clicked option
        option.classList.add('selected');

        // Update selected options
        this.selectedOptions[category] = { value, price, label };
    }

    toggleFeature(option, category, value, price, label) {
        option.classList.toggle('selected');

        const existingIndex = this.selectedOptions.features.findIndex(f => f.value === value);

        if (existingIndex > -1) {
            // Remove feature
            this.selectedOptions.features.splice(existingIndex, 1);
        } else {
            // Add feature
            this.selectedOptions.features.push({ value, price, label });
        }
    }

    getOptionLabel(option) {
        const titleElement = option.querySelector('h4');
        return titleElement ? titleElement.textContent.trim() : '';
    }

    updateSummary() {
        const summaryItems = document.getElementById('summary-items');
        if (!summaryItems) return;

        let summaryHTML = '';

        // Base package
        summaryHTML += `
            <div class="summary-item">
                <span>Basis-Paket (${this.selectedOptions.type.label})</span>
                <span>${this.basePrice}€</span>
            </div>
        `;

        // Add selected options
        Object.keys(this.selectedOptions).forEach(category => {
            if (category === 'features') {
                // Handle features array
                this.selectedOptions.features.forEach(feature => {
                    if (feature.price > 0) {
                        summaryHTML += `
                            <div class="summary-item">
                                <span>${feature.label}</span>
                                <span>+${feature.price}€</span>
                            </div>
                        `;
                    }
                });
            } else if (this.selectedOptions[category].price > 0) {
                // Handle other categories
                const option = this.selectedOptions[category];
                summaryHTML += `
                    <div class="summary-item">
                        <span>${option.label}</span>
                        <span>+${option.price}€</span>
                    </div>
                `;
            }
        });

        summaryItems.innerHTML = summaryHTML;
    }

    updatePrices() {
        let totalPrice = this.basePrice;
        let totalMonthly = this.baseMonthly;

        // Calculate additional costs
        Object.keys(this.selectedOptions).forEach(category => {
            if (category === 'features') {
                this.selectedOptions.features.forEach(feature => {
                    totalPrice += feature.price;
                });
            } else {
                totalPrice += this.selectedOptions[category].price;
            }
        });

        // Update monthly price based on selection
        if (this.selectedOptions.type.value === 'shop') {
            totalMonthly += 19.95; // Additional monthly cost for shop
        }

        // Update DOM
        const priceOnetime = document.getElementById('price-onetime');
        const priceMonthly = document.getElementById('price-monthly');

        if (priceOnetime) {
            priceOnetime.textContent = `${totalPrice.toLocaleString('de-DE')}€`;
        }

        if (priceMonthly) {
            priceMonthly.textContent = `${totalMonthly.toFixed(2).replace('.', ',')}€`;
        }

        // Store prices for form submission
        this.currentPrices = {
            onetime: totalPrice,
            monthly: totalMonthly
        };
    }

    resetConfiguration() {
        // Reset selected options
        this.selectedOptions = {
            type: { value: 'onepager', price: 0, label: 'Onepager' },
            design: { value: 'basic', price: 0, label: 'Basic Design' },
            seo: { value: 'none', price: 0, label: 'Ohne SEO-Texte' },
            legal: { value: 'basic', price: 0, label: 'Basic Rechtliches' },
            features: []
        };

        // Remove all selected classes
        document.querySelectorAll('.config-option.selected').forEach(option => {
            option.classList.remove('selected');
        });

        // Select default options
        document.querySelectorAll('.config-option[data-value="onepager"], .config-option[data-value="basic"], .config-option[data-value="none"]').forEach(option => {
            option.classList.add('selected');
        });

        // Update display
        this.updateSummary();
        this.updatePrices();

        // Scroll to top of configurator
        document.getElementById('konfigurator')?.scrollIntoView({ behavior: 'smooth' });
    }

    addToNavigation() {
        // Add configurator link to navigation
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && !document.querySelector('.nav-link[href="#konfigurator"]')) {
            const configuratorLink = document.createElement('a');
            configuratorLink.href = '#konfigurator';
            configuratorLink.className = 'nav-link';
            configuratorLink.textContent = 'Konfigurator';
            
            // Insert before CTA button
            const ctaButton = navMenu.querySelector('.nav-link.cta-nav');
            if (ctaButton) {
                navMenu.insertBefore(configuratorLink, ctaButton);
            } else {
                navMenu.appendChild(configuratorLink);
            }
        }
    }

    // Contact Form Methods
    initContactForm() {
        // Update summary button in configurator
        const summaryActions = document.querySelector('.summary-actions');
        if (summaryActions) {
            const requestBtn = summaryActions.querySelector('.btn-primary');
            if (requestBtn) {
                requestBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showContactForm();
                });
            }
        }
    }

    showContactForm() {
        // Hide configurator
        const configuratorSection = document.getElementById('konfigurator');
        const contactSection = document.getElementById('konfigurator-kontakt');
        
        if (configuratorSection && contactSection) {
            // Add fade out animation
            configuratorSection.style.opacity = '0';
            configuratorSection.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                configuratorSection.style.display = 'none';
                contactSection.style.display = 'block';
                
                // Update form with configuration data
                this.updateContactForm();
                
                // Fade in contact form
                setTimeout(() => {
                    contactSection.style.opacity = '1';
                    contactSection.style.transform = 'scale(1)';
                    
                    // Scroll to contact form
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }, 300);
        }
    }

    showConfigurator() {
        // Show configurator
        const configuratorSection = document.getElementById('konfigurator');
        const contactSection = document.getElementById('konfigurator-kontakt');
        
        if (configuratorSection && contactSection) {
            contactSection.style.opacity = '0';
            contactSection.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                contactSection.style.display = 'none';
                configuratorSection.style.display = 'block';
                
                setTimeout(() => {
                    configuratorSection.style.opacity = '1';
                    configuratorSection.style.transform = 'scale(1)';
                    
                    // Scroll to configurator
                    configuratorSection.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }, 300);
        }
    }

    updateContactForm() {
        // Update configuration summary in form
        const summaryList = document.getElementById('config-summary-list');
        const priceOnetimeForm = document.getElementById('price-onetime-form');
        const priceMonthlyForm = document.getElementById('price-monthly-form');
        const configDataHidden = document.getElementById('config-data');
        
        if (summaryList) {
            let summaryHTML = '';
            
            // Add base package
            summaryHTML += `
                <div class="config-summary-item">
                    <span>Basis-Paket (${this.selectedOptions.type.label})</span>
                    <span>${this.basePrice}€</span>
                </div>
            `;
            
            // Add selected options
            Object.keys(this.selectedOptions).forEach(category => {
                if (category === 'features') {
                    this.selectedOptions.features.forEach(feature => {
                        if (feature.price > 0) {
                            summaryHTML += `
                                <div class="config-summary-item">
                                    <span>${feature.label}</span>
                                    <span>+${feature.price}€</span>
                                </div>
                            `;
                        }
                    });
                } else if (this.selectedOptions[category].price > 0) {
                    const option = this.selectedOptions[category];
                    summaryHTML += `
                        <div class="config-summary-item">
                            <span>${option.label}</span>
                            <span>+${option.price}€</span>
                        </div>
                    `;
                }
            });
            
            summaryList.innerHTML = summaryHTML;
        }
        
        // Update prices
        if (priceOnetimeForm && this.currentPrices) {
            priceOnetimeForm.textContent = `${this.currentPrices.onetime.toLocaleString('de-DE')}€`;
        }
        
        if (priceMonthlyForm && this.currentPrices) {
            priceMonthlyForm.textContent = `${this.currentPrices.monthly.toFixed(2).replace('.', ',')}€`;
        }
        
        // Store configuration data in hidden field
        if (configDataHidden) {
            configDataHidden.value = JSON.stringify(this.getConfiguration());
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const configData = JSON.parse(formData.get('config-data') || '{}');
        
        // Show success animation
        this.showSuccessAnimation(formData, configData);
        
        // Here you would normally send the data to your server
        console.log('Form submitted:', {
            formData: Object.fromEntries(formData),
            configuration: configData
        });
    }

    showSuccessAnimation(formData, configData) {
        // Create success modal
        const successModal = document.createElement('div');
        successModal.className = 'configurator-success active';
        successModal.innerHTML = `
            <div class="success-icon">🎉</div>
            <h3>Vielen Dank für Ihre Anfrage!</h3>
            <p>Wir haben Ihre Konfiguration erhalten und melden uns innerhalb von 24 Stunden bei Ihnen.</p>
            <p><strong>Gesamtkosten:</strong> ${configData.prices?.onetime || 0}€ einmalig + ${configData.prices?.monthly || 0}€/monatlich</p>
            <button class="btn btn-primary" onclick="this.closest('.configurator-success').remove()">
                Alles klar
            </button>
        `;
        
        document.body.appendChild(successModal);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (successModal.parentNode) {
                successModal.remove();
            }
        }, 5000);
        
        // Reset form after delay
        setTimeout(() => {
            e.target.reset();
            this.showConfigurator();
        }, 2000);
    }

    // Get current configuration for form submission
    getConfiguration() {
        return {
            ...this.selectedOptions,
            prices: this.currentPrices,
            summary: this.getConfigurationSummary()
        };
    }

    getConfigurationSummary() {
        const summary = [];
        
        summary.push(`Website-Typ: ${this.selectedOptions.type.label}`);
        summary.push(`Design: ${this.selectedOptions.design.label}`);
        summary.push(`SEO: ${this.selectedOptions.seo.label}`);
        summary.push(`Rechtliches: ${this.selectedOptions.legal.label}`);
        
        if (this.selectedOptions.features.length > 0) {
            summary.push(`Features: ${this.selectedOptions.features.map(f => f.label).join(', ')}`);
        }
        
        return summary.join('\n');
    }
}

// Initialize configurator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.websiteConfigurator = new WebsiteConfigurator();
});

// Smooth scroll for navigation links
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // Account for fixed header
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
