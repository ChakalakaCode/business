// Website Konfigurator JavaScript - Schrittweise Navigation
class StepConfigurator {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 6;
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
        this.setDefaultSelections();
    }

    bindEvents() {
        // Option selection events
        document.querySelectorAll('.config-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.handleOptionClick(e.currentTarget);
            });
        });

        // Step navigation events
        document.getElementById('next-step')?.addEventListener('click', () => {
            this.nextStep();
        });

        document.getElementById('prev-step')?.addEventListener('click', () => {
            this.prevStep();
        });

        document.getElementById('finish-config')?.addEventListener('click', () => {
            this.finishConfiguration();
        });

        // Reset button
        document.getElementById('reset-config')?.addEventListener('click', () => {
            this.resetConfiguration();
        });

        // Step progress click events
        document.querySelectorAll('.step-progress-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const step = parseInt(e.currentTarget.dataset.step);
                if (step < this.currentStep || this.isStepCompleted(step - 1)) {
                    this.goToStep(step);
                }
            });
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

    setDefaultSelections() {
        // Select default options
        document.querySelectorAll('.config-option[data-value="onepager"], .config-option[data-value="basic"], .config-option[data-value="none"]').forEach(option => {
            option.classList.add('selected');
        });
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
        this.updateStepProgress();
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

    // Step Navigation Methods
    nextStep() {
        if (this.currentStep < this.totalSteps && this.isStepValid(this.currentStep)) {
            this.goToStep(this.currentStep + 1);
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.goToStep(this.currentStep - 1);
        }
    }

    goToStep(step) {
        // Hide current step
        const currentStepElement = document.querySelector(`.config-step[data-step="${this.currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.classList.remove('active');
        }

        // Show new step
        const newStepElement = document.querySelector(`.config-step[data-step="${step}"]`);
        if (newStepElement) {
            newStepElement.classList.add('active');
        }

        // Update progress
        this.currentStep = step;
        this.updateStepProgress();
        this.updateNavigationButtons();
        this.animateStepTransition();
    }

    isStepValid(step) {
        switch(step) {
            case 1: // Website-Typ
                return this.selectedOptions.type.value !== null;
            case 2: // Design
                return this.selectedOptions.design.value !== null;
            case 3: // SEO-Texte
                return this.selectedOptions.seo.value !== null;
            case 4: // Rechtliches
                return this.selectedOptions.legal.value !== null;
            case 5: // Features (always valid, can be empty)
                return true;
            default:
                return false;
        }
    }

    isStepCompleted(step) {
        return this.isStepValid(step);
    }

    updateStepProgress() {
        // Update progress bar
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            const progress = (this.currentStep / this.totalSteps) * 100;
            progressFill.style.width = `${progress}%`;
        }

        // Update step indicators
        document.querySelectorAll('.step-progress-item').forEach((item, index) => {
            const stepNum = index + 1;
            item.classList.remove('active', 'completed');
            
            if (stepNum === this.currentStep) {
                item.classList.add('active');
            } else if (stepNum < this.currentStep || this.isStepCompleted(stepNum)) {
                item.classList.add('completed');
            }
        });
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-step');
        const nextBtn = document.getElementById('next-step');
        const finishBtn = document.getElementById('finish-config');

        // Update previous button
        if (prevBtn) {
            prevBtn.disabled = this.currentStep === 1;
        }

        // Update next/finish buttons
        if (nextBtn && finishBtn) {
            if (this.currentStep === this.totalSteps) {
                nextBtn.style.display = 'none';
                finishBtn.style.display = 'flex';
            } else {
                nextBtn.style.display = 'flex';
                finishBtn.style.display = 'none';
                nextBtn.disabled = !this.isStepValid(this.currentStep);
            }
        }
    }

    animateStepTransition() {
        const activeStep = document.querySelector('.config-step.active');
        if (activeStep) {
            const options = activeStep.querySelectorAll('.config-option');
            options.forEach((option, index) => {
                option.style.animation = 'none';
                option.offsetHeight; // Trigger reflow
                option.style.animation = `optionSlideIn 0.5s ease forwards`;
                option.style.animationDelay = `${index * 0.1}s`;
            });
        }
    }

    finishConfiguration() {
        this.showContactForm();
    }

    updateSummary() {
        const summaryItems = document.getElementById('summary-items');
        const summaryItemsMini = document.getElementById('summary-items-mini');
        
        if (summaryItems) {
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

        // Update mini summary
        if (summaryItemsMini) {
            let miniHTML = `
                <div class="summary-item">
                    <span>Basis-Paket</span>
                    <span>${this.basePrice}€</span>
                </div>
            `;

            // Add selected options with prices
            Object.keys(this.selectedOptions).forEach(category => {
                if (category === 'features') {
                    this.selectedOptions.features.forEach(feature => {
                        if (feature.price > 0) {
                            miniHTML += `
                                <div class="summary-item">
                                    <span>${feature.label}</span>
                                    <span>+${feature.price}€</span>
                                </div>
                            `;
                        }
                    });
                } else if (this.selectedOptions[category].price > 0) {
                    const option = this.selectedOptions[category];
                    miniHTML += `
                        <div class="summary-item">
                            <span>${option.label}</span>
                            <span>+${option.price}€</span>
                        </div>
                    `;
                }
            });

            summaryItemsMini.innerHTML = miniHTML;
        }
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
        const priceElements = ['price-onetime', 'price-onetime-mini'];
        const monthlyElements = ['price-monthly', 'price-monthly-mini'];

        priceElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = `${totalPrice.toLocaleString('de-DE')}€`;
            }
        });

        monthlyElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = `${totalMonthly.toFixed(2).replace('.', ',')}€`;
            }
        });

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
        this.setDefaultSelections();

        // Reset to first step
        this.goToStep(1);

        // Update display
        this.updateSummary();
        this.updatePrices();
    }

    // Contact Form Methods
    initContactForm() {
        // Initialize form if needed
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
}

// Initialize configurator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.stepConfigurator = new StepConfigurator();
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
