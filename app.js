// app.js
// Main application logic for Brisbane North Bond & Carpet Cleaners website

// Application Configuration
const AppConfig = {
    company: {
        name: "Brisbane North Bond & Carpet Cleaners",
        phone: "0721436064",
        email: "info@bnbcc.com.au",
        address: "Servicing Brisbane North Side",
        hours: "Mon-Fri 7AM-7PM, Sat 8AM-5PM",
        abn: "14 132 271 327"
    },
    contactInfo: [
        { icon: "📞", title: "Phone", content: "0721436064" },
        { icon: "📧", title: "Email", content: "info@bnbcc.com.au" },
        { icon: "📍", title: "Location", content: "Servicing Brisbane North Side" },
        { icon: "🕒", title: "Business Hours", content: "Mon-Fri 7AM-7PM, Sat 8AM-5PM" },
        { icon: "⚡", title: "Response Time", content: "Within 24 hours" }
    ],
    whyUsData: [
        { 
            icon: "⭐", 
            title: "10+ Years Experience", 
            description: "Over a decade of professional cleaning expertise serving Brisbane's North Side communities." 
        },
        { 
            icon: "🏢", 
            title: "Real Estate Trusted", 
            description: "Preferred cleaning partner for leading real estate agencies across Brisbane North." 
        },
        { 
            icon: "⚡", 
            title: "Same Day Service", 
            description: "Fast response times with same-day service available for urgent cleaning needs." 
        },
        { 
            icon: "✔️", 
            title: "Satisfaction Guaranteed", 
            description: "Our work comes with a satisfaction guarantee and warranty for your peace of mind." 
        }
    
        
    ]
};

// Service Manager Class
class ServiceManager {
    constructor() {
        this.services = window.ServicesConfig || {};
    }

    init() {
        console.log('ServiceManager initializing...', this.services); // Debug line
        this.renderServices();
        this.renderServiceOptions();
    }

    renderServices() {
        const servicesGrid = document.getElementById('servicesGrid');
        if (!servicesGrid) {
            console.error('Services grid element not found');
            return;
        }

        const serviceCards = Object.entries(this.services).map(([id, service]) => `
            <div class="service-card" onclick="ServiceModal.open('${id}')">
                <div class="service-card-tooltip">Click for full details</div>
                <div class="price-tag">${service.price}</div>
                <span class="service-icon">${service.icon}</span>
                <h3>${service.title}</h3>
                <p>${service.description}</p>
                <button class="quote-btn" onclick="event.stopPropagation(); ContactManager.openQuote('${service.title}')">Get Quote</button>
            </div>
        `).join('');

        servicesGrid.innerHTML = serviceCards;
    }

    renderServiceOptions() {
        const serviceSelect = document.getElementById('serviceType');
        if (!serviceSelect) return;

        serviceSelect.innerHTML = `
            <option value="">Select a service...</option>
            ${Object.entries(this.services).map(([id, service]) => 
                `<option value="${id}">${service.title}</option>`
            ).join('')}
            <option value="other">Other</option>
        `;
    }

    getService(serviceId) {
        return this.services[serviceId];
    }

    getAllServices() {
        return this.services;
    }

    searchServices(query) {
        const searchTerm = query.toLowerCase();
        return Object.entries(this.services)
            .filter(([id, service]) => 
                service.title.toLowerCase().includes(searchTerm) ||
                service.description.toLowerCase().includes(searchTerm) ||
                service.features.some(feature => feature.toLowerCase().includes(searchTerm))
            );
    }
}

// Service Modal Manager Class
class ServiceModal {
    static open(serviceId) {
        const service = serviceManager.getService(serviceId);
        if (!service) return;

        const modal = document.getElementById('serviceModal');
        const title = document.getElementById('serviceModalTitle');
        const price = document.getElementById('serviceModalPrice');
        const description = document.getElementById('serviceModalDescription');
        const features = document.getElementById('serviceModalFeatures');

        title.textContent = service.title;
        price.textContent = service.price;
        description.textContent = service.description;

        features.innerHTML = service.features.map(feature => `<li>${feature}</li>`).join('');

        serviceManager.currentService = service.title;
        modal.classList.add('active');
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
    }

    static close() {
        const modal = document.getElementById('serviceModal');
        modal.classList.remove('active');
        
        // Restore body scrolling
        document.body.style.overflow = 'auto';
    }

    static openQuote() {
        this.close();
        ContactManager.openQuote(serviceManager.currentService);
    }
}

// Contact Manager Class
class ContactManager {
    static showContactPage() {
        const contactPage = document.getElementById('contactPage');
        contactPage.classList.add('active');
        window.scrollTo(0, 0);
        this.hideMainSections();
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
    }

    static hideContactPage() {
        const contactPage = document.getElementById('contactPage');
        contactPage.classList.remove('active');
        window.scrollTo(0, 0);
        this.showMainSections();
        
        // Restore body scrolling
        document.body.style.overflow = 'auto';
    }

    static hideMainSections() {
        const sections = ['hero', 'services', 'contact', 'why-us'];
        sections.forEach(section => {
            const element = document.querySelector(`.${section}`);
            if (element) element.style.display = 'none';
        });
    }

    static showMainSections() {
        const sections = {
            'hero': 'flex',
            'services': 'block', 
            'contact': 'block',
            'why-us': 'block'
        };
        
        Object.entries(sections).forEach(([section, display]) => {
            const element = document.querySelector(`.${section}`);
            if (element) element.style.display = display;
        });
    }

    static openQuote(serviceName) {
        const serviceSelect = document.getElementById('serviceType');
        const contactSection = document.getElementById('contact');
        
        // Find and select the matching service
        Array.from(serviceSelect.options).forEach(option => {
            if (option.text === serviceName) {
                option.selected = true;
            }
        });

        // Close any open modals
        ServiceModal.close();

        // Scroll to contact form
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    static init() {
        this.renderContactInfo();
    }

    static renderContactInfo() {
        const contactInfoItems = document.getElementById('contactInfoItems');
        if (!contactInfoItems) return;

        contactInfoItems.innerHTML = AppConfig.contactInfo.map(item => `
            <div class="contact-info-item">
                <div class="contact-info-icon">${item.icon}</div>
                <div class="contact-info-text">
                    <h3>${item.title}</h3>
                    <p>${item.content}</p>
                </div>
            </div>
        `).join('');
    }
}

// Content Manager Class
class ContentManager {
    static init() {
        this.renderWhyUs();
        this.renderFooter();
    }

    static renderWhyUs() {
        const whyUsGrid = document.getElementById('whyUsGrid');
        if (!whyUsGrid) return;

        whyUsGrid.innerHTML = AppConfig.whyUsData.map(item => `
            <div class="why-us-card">
                <div class="why-us-icon">${item.icon}</div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        `).join('');
    }

    static renderFooter() {
        const footerContent = document.getElementById('footerContent');
        if (!footerContent) return;

        footerContent.innerHTML = `
            <div class="footer-section">
                <h4>${AppConfig.company.name}</h4>
                <p>Professional cleaning services across Brisbane's North Side. Committed to quality, reliability, and customer satisfaction.</p>
            </div>
            
            <div class="footer-section">
                <h4>Contact Info</h4>
                <p>📞 ${AppConfig.company.phone}</p>
                <p>📧 ${AppConfig.company.email}</p>
                <p>📍 ${AppConfig.company.address}</p>
                <p>🕒 ${AppConfig.company.hours}</p>
                <p>📌 ABN ${AppConfig.company.abn}</p>
            </div>
            
            <div class="footer-section">
                <h4>Quick Links</h4>
                <a href="#home">Home</a>
                <a href="#services">Services</a>
                <a href="#why-us">Why Choose Us</a>
                <a href="#contact">Contact</a>
            </div>
        `;
    }
}

// Form Manager Class
class FormHandler {
    static init() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        // Create hidden iframe
        let iframe = document.getElementById('hidden_iframe');
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.name = 'hidden_iframe';
            iframe.id = 'hidden_iframe';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        }

        let submitted = false;

        // Handle iframe load
        iframe.addEventListener('load', () => {
            if (submitted) {
                const successScreen = document.getElementById('successScreen');
                const formContainer = document.querySelector('.form-container');
                
                // Hide form and show success screen
                if (formContainer && successScreen) {
                    formContainer.style.display = 'none';
                    successScreen.style.display = 'block';
                }

                // Reset form and state
                form.reset();
                submitted = false;
                this.resetSubmitButton();
            }
        });

        // Handle form submit
        form.addEventListener('submit', (e) => {
            this.showLoadingState();
            submitted = true;
        });

        // Handle "Send Another Message" button
        const backBtn = document.querySelector('.back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.resetForm());
        }
    }

    static showLoadingState() {
        const submitBtn = document.getElementById('submitBtn');
        const spinner = document.getElementById('loadingSpinner');
        if (submitBtn && spinner) {
            submitBtn.disabled = true;
            spinner.style.display = 'inline-block';
            submitBtn.querySelector('.btn-text').textContent = 'Sending...';
        }
    }

    static resetSubmitButton() {
        const submitBtn = document.getElementById('submitBtn');
        const spinner = document.getElementById('loadingSpinner');
        if (submitBtn && spinner) {
            submitBtn.disabled = false;
            spinner.style.display = 'none';
            submitBtn.querySelector('.btn-text').textContent = 'Send Message';
        }
    }

    static resetForm() {
        const successScreen = document.getElementById('successScreen');
        const formContainer = document.querySelector('.form-container');
        
        if (formContainer && successScreen) {
            successScreen.style.display = 'none';
            formContainer.style.display = 'block';
        }

        const form = document.getElementById('contactForm');
        if (form) {
            form.reset();
        }
    }
}

// Event Manager Class
class EventManager {
    static init() {
        this.bindGlobalEvents();
        this.bindKeyboardEvents();
    }

    static bindGlobalEvents() {
        // Close modals when clicking outside
        window.addEventListener('click', (event) => {
            const serviceModal = document.getElementById('serviceModal');
            if (event.target === serviceModal) {
                ServiceModal.close();
            }
        });

        // Smooth scroll for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                
                // Only process valid hash fragments (must start with # and be longer than 1 char)
                if (href && href.startsWith('#') && href.length > 1) {
                    e.preventDefault();
                    try {
                        const target = document.querySelector(href);
                        if (target) {
                            target.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    } catch (error) {
                        console.warn('Invalid selector for smooth scroll:', href, error);
                    }
                }
                // If it's not a hash fragment, let the browser handle it normally (don't preventDefault)
            });
        });
    }

    static bindKeyboardEvents() {
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                ServiceModal.close();
                
                const contactPage = document.getElementById('contactPage');
                if (contactPage && contactPage.classList.contains('active')) {
                    ContactManager.hideContactPage();
                }
            }
        });
    }
}

// Review Manager Class
class ReviewManager {
    static init() {
        console.log('ReviewManager initializing...');
        console.log('window.ReviewConfig:', window.ReviewConfig);
        
        const reviewElements = {
            rating: document.getElementById('googleRating'),
            totalReviews: document.getElementById('totalReviews'),
            reviewLink: document.getElementById('googleReviewLink'),
            stars: document.querySelector('.google-reviews-ribbon .stars')
        };

        console.log('Review elements found:', reviewElements);

        if (window.ReviewConfig) {
            if (reviewElements.rating) {
                reviewElements.rating.textContent = ReviewConfig.rating;
            }
            if (reviewElements.totalReviews) {
                reviewElements.totalReviews.textContent = ReviewConfig.totalReviews;
            }
            if (reviewElements.reviewLink) {
                reviewElements.reviewLink.href = ReviewConfig.googlePageUrl;
            }
            if (reviewElements.stars) {
                // Generate stars based on rating
                const rating = parseFloat(ReviewConfig.rating);
                const fullStars = Math.floor(rating);
                const hasHalfStar = rating % 1 >= 0.5;
                const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
                
                let starsHTML = '★'.repeat(fullStars);
                if (hasHalfStar) {
                    starsHTML += '☆'; // Half star (or you could use a different character)
                }
                starsHTML += '☆'.repeat(emptyStars);
                
                reviewElements.stars.textContent = starsHTML;
            }
            console.log('ReviewManager initialized successfully');
        } else {
            console.error('ReviewConfig not found on window object');
        }
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize service manager
    const serviceManager = new ServiceManager();
    serviceManager.init();
    window.serviceManager = serviceManager; // Make it globally available

    // Initialize other managers
    ContactManager.init();
    ContentManager.init();
    FormHandler.init();
    EventManager.init();
    ReviewManager.init();
    
    // Initialize scroll handling
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    // Initialize form handling
    initializeFormHandling();
    
    console.log('Brisbane Carpet and Bond Cleaners website initialized successfully!');
});

// Export for global access
window.ServiceModal = ServiceModal;
window.ContactManager = ContactManager;

// Mobile menu functionality
function toggleMobileMenu() {
    const sidebar = document.getElementById('mobileSidebar');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    sidebar.classList.toggle('active');
    toggle.classList.toggle('active');
}

// Scroll handling for floating elements
function handleScroll() {
    const floatingAction = document.querySelector('.floating-action');
    const googleReviewsRibbon = document.querySelector('.google-reviews-ribbon');
    const footer = document.querySelector('.footer');
    
    if (!floatingAction || !googleReviewsRibbon || !footer) return;
    
    const footerRect = footer.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Check if footer is visible (top of footer is above bottom of viewport)
    const isFooterVisible = footerRect.top < windowHeight;
    
    if (isFooterVisible) {
        floatingAction.style.opacity = '0';
        floatingAction.style.pointerEvents = 'none';
        googleReviewsRibbon.style.opacity = '0';
        googleReviewsRibbon.style.pointerEvents = 'none';
    } else {
        floatingAction.style.opacity = '1';
        floatingAction.style.pointerEvents = 'auto';
        googleReviewsRibbon.style.opacity = '1';
        googleReviewsRibbon.style.pointerEvents = 'auto';
    }
}

// Form validation and submission handling
function initializeFormHandling() {
    const form = document.getElementById('contactForm');
    const fields = Array.from(form.querySelectorAll('input[required], textarea[required]'));
    let isSubmitting = false;

    // Handle form submission
    form.addEventListener('submit', function(e) {
        if (isSubmitting) {
            e.preventDefault();
            return;
        }

        if (!validateForm()) {
            e.preventDefault();
            return;
        }

        isSubmitting = true;
        showLoadingState();
    });

    // Handle iframe load (form submission complete)
    document.getElementById('hidden_iframe').addEventListener('load', function() {
        if (isSubmitting) {
            handleFormSuccess();
        }
    });

    function validateForm() {
        let isValid = true;
        clearAllFieldErrors();

        // Check icepot field for bot detection
        const icepotField = document.getElementById('website');
        if (icepotField && icepotField.value !== '99') {
            // Bot detected - silently fail
            console.log('Bot submission detected');
            return false;
        }

        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    function validateField(field) {
        const value = field.value.trim();
        
        if (field.hasAttribute('required') && !value) {
            highlightField(field.id, true);
            return false;
        }
        
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                highlightField(field.id, true);
                return false;
            }
        }
        
        highlightField(field.id, false);
        return true;
    }

    function highlightField(fieldId, hasError) {
        const field = document.getElementById(fieldId);
        if (field) {
            const formGroup = field.closest('.form-group');
            if (formGroup) {
                formGroup.classList.toggle('error', hasError);
            }
        }
    }

    function showLoadingState() {
        const btn = document.getElementById('submitBtn');
        const spinner = document.getElementById('loadingSpinner');
        if (btn && spinner) {
            btn.disabled = true;
            spinner.style.display = 'inline-block';
            btn.querySelector('.btn-text').textContent = 'Sending...';
        }
    }

    function handleFormSuccess() {
        showSuccessMessage();
        resetForm();
        isSubmitting = false;
    }

    function showSuccessMessage() {
        const alert = document.createElement('div');
        alert.className = 'alert success';
        alert.textContent = 'Thank you! We will contact you within 24 hours.';
        form.parentNode.insertBefore(alert, form);
        
        setTimeout(() => alert.remove(), 5000);
    }

    function resetForm() {
        form.reset();
        const btn = document.getElementById('submitBtn');
        const spinner = document.getElementById('loadingSpinner');
        if (btn && spinner) {
            btn.disabled = false;
            spinner.style.display = 'none';
            btn.querySelector('.btn-text').textContent = 'Send Message';
        }
    }

    function clearAllFieldErrors() {
        fields.forEach(field => highlightField(field.id, false));
    }
}

// Make functions globally available
window.toggleMobileMenu = toggleMobileMenu;
