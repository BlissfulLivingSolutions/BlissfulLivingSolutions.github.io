/**
 * Blissful Living Solutions - Main Script
 * Handles mobile navigation, interactive components, and form validation.
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initSmoothScroll();
    initPathwayExplorer();
    initCostEstimator();
    initAccordion();
    initContactForm();
    initBanner();
});

/**
 * Licensing Banner
 */
function initBanner() {
    const banner = document.getElementById('licensing-banner');
    const closeBtn = document.getElementById('close-banner');

    if (!banner || !closeBtn) return;

    closeBtn.addEventListener('click', () => {
        banner.classList.add('hidden');
    });
}

/**
 * Mobile Navigation Toggle
 */
function initMobileNav() {
    const toggle = document.querySelector('.mobile-nav-toggle');
    const nav = document.querySelector('.main-nav');
    const hamburger = document.querySelector('.hamburger');
    
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
        nav.classList.toggle('active');
        
        // Animate hamburger (optional simple transform handled in CSS if added, 
        // but here we just toggle the class for the menu)
    });

    // Close nav when clicking a link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
}

/**
 * Smooth Scroll with Offset for Sticky Header
 */
function initSmoothScroll() {
    const headerHeight = document.querySelector('.site-header').offsetHeight;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Care Pathway Explorer
 */
function initPathwayExplorer() {
    const buttons = document.querySelectorAll('.pathway-btn');
    const contents = document.querySelectorAll('.pathway-content');

    if (!buttons.length || !contents.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            buttons.forEach(b => b.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked
            btn.classList.add('active');
            
            // Show target content
            const targetId = btn.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

/**
 * Cost Estimator
 */
function initCostEstimator() {
    const slider = document.getElementById('hours-range');
    const hoursDisplay = document.getElementById('hours-display');
    const weeklyCostDisplay = document.getElementById('weekly-cost');
    const monthlyCostDisplay = document.getElementById('monthly-cost');
    
    // Placeholder rate - easily editable
    const HOURLY_RATE = 32;

    if (!slider) return;

    function updateCost() {
        const hours = parseInt(slider.value);
        const weeklyCost = hours * HOURLY_RATE;
        const monthlyCost = weeklyCost * 4; // Approx 4 weeks/month

        hoursDisplay.textContent = hours;
        weeklyCostDisplay.textContent = `$${weeklyCost.toLocaleString()}`;
        monthlyCostDisplay.textContent = `$${monthlyCost.toLocaleString()}`;
    }

    slider.addEventListener('input', updateCost);
    
    // Initialize
    updateCost();
}

/**
 * Accordion for FAQs
 */
function initAccordion() {
    const headers = document.querySelectorAll('.accordion-header');

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isExpanded = header.getAttribute('aria-expanded') === 'true';

            // Close other items (optional, but good for focus)
            // document.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('active'));
            // document.querySelectorAll('.accordion-header').forEach(h => h.setAttribute('aria-expanded', 'false'));

            // Toggle current
            header.setAttribute('aria-expanded', !isExpanded);
            content.classList.toggle('active');
            
            // Update icon
            const icon = header.querySelector('.icon');
            if (icon) {
                icon.textContent = !isExpanded ? '-' : '+';
            }
        });
    });
}

/**
 * Contact Form Validation & Feedback
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic validation (HTML5 handles most, but we can double check)
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;

        if (name && email && phone && message) {
            // Simulate success
            feedback.textContent = "Thank you! We have prepared an email for you to send.";
            feedback.className = "form-feedback text-success";
            feedback.style.color = "var(--color-success)";

            // Construct mailto link
            const subject = encodeURIComponent(`New Inquiry from ${name}`);
            const body = encodeURIComponent(
                `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`
            );
            
            // Open email client
            window.location.href = `mailto:contact@blissfullivingsolutions.com?subject=${subject}&body=${body}`;
            
            // Reset form
            form.reset();
        } else {
            feedback.textContent = "Please fill out all fields.";
            feedback.style.color = "var(--color-error)";
        }
    });
}
