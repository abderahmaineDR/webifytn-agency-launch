// Main JavaScript file for WebifyTN static website

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initMobileMenu();
    initFormHandling();
    initSmoothScrolling();
    initThemeToggle();
});

// Navigation functionality
function initNavigation() {
    // Highlight active navigation link
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath || 
            (currentPath === '/' && link.getAttribute('href') === '/index.html')) {
            link.classList.add('active');
        }
    });
}

// Mobile menu functionality
function initMobileMenu() {
    // Prevent duplicate initialization
    if (window.mobileMenuInitialized) return;
    window.mobileMenuInitialized = true;
    
    // Robust element selection with fallbacks
    const menuBtn = document.querySelector('.nav-menu-btn');
    const mobileMenuId = menuBtn?.getAttribute('aria-controls');
    const mobileMenu = mobileMenuId ? document.getElementById(mobileMenuId) : document.querySelector('.mobile-menu');
    
    // Fail gracefully if elements are missing
    if (!menuBtn || !mobileMenu) {
        console.warn('Mobile menu elements not found - hamburger menu disabled');
        return;
    }
    
    // Set initial ARIA states
    const isOpen = mobileMenu.classList.contains('open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    
    // Helper function to update menu state and icon
    function setMenuState(open) {
        mobileMenu.classList.toggle('open', open);
        menuBtn.setAttribute('aria-expanded', String(open));
        mobileMenu.setAttribute('aria-hidden', String(!open));
        
        // Update hamburger icon state
        menuBtn.innerHTML = open ? 
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' : 
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
    }
    
    // Toggle mobile menu on button click
    menuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation(); // Prevent document click listener from firing
        
        const currentlyOpen = mobileMenu.classList.contains('open');
        setMenuState(!currentlyOpen);
    });
    
    // Close menu when clicking on menu links
    const menuLinks = document.querySelectorAll('.mobile-menu-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent document click listener
            setMenuState(false);
        });
    });
    
    // Close menu when clicking outside (but not on the button)
    document.addEventListener('click', function(e) {
        const isClickInsideMenu = mobileMenu.contains(e.target);
        const isClickOnButton = menuBtn.contains(e.target);
        
        if (!isClickInsideMenu && !isClickOnButton && mobileMenu.classList.contains('open')) {
            setMenuState(false);
        }
    });
    
    // Close menu on escape key for accessibility
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
            setMenuState(false);
            menuBtn.focus(); // Return focus to button
        }
    });
    
    // Close menu on window resize to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768 && mobileMenu.classList.contains('open')) {
            setMenuState(false);
        }
    });
}

// Form handling functionality
function initFormHandling() {
    const contactForm = document.querySelector('#contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const formObject = {};
        
        for (let [key, value] of formData.entries()) {
            formObject[key] = value;
        }
        
        // Validate required fields
        if (!formObject.name || !formObject.email || !formObject.projectType || !formObject.message) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formObject.email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Show success message (in a real implementation, you would send the data to a server)
        alert('Thank you for your inquiry! We\'ll get back to you within 24 hours.');
        
        // Reset form
        contactForm.reset();
    });
    
    // Add input validation for real-time feedback
    const requiredInputs = contactForm.querySelectorAll('[required]');
    requiredInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.classList.add('input-error');
            } else {
                this.classList.remove('input-error');
            }
        });
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Theme toggle functionality
function initThemeToggle() {
    // Check for saved theme preference or respect OS preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
    
    // Update theme toggle icon
    function updateThemeIcon() {
        const themeToggles = document.querySelectorAll('.theme-toggle');
        themeToggles.forEach(toggle => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            
            // Remove existing SVG if present
            const existingSvg = toggle.querySelector('svg');
            if (existingSvg) existingSvg.remove();
            
            // Create new SVG based on current theme
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '24');
            svg.setAttribute('height', '24');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('fill', 'none');
            svg.setAttribute('stroke', 'currentColor');
            svg.setAttribute('stroke-width', '2');
            svg.setAttribute('stroke-linecap', 'round');
            svg.setAttribute('stroke-linejoin', 'round');
            svg.classList.add('h-5', 'w-5');
            
            if (currentTheme === 'dark') {
                // Moon icon (crescent moon)
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z');
                svg.appendChild(path);
            } else {
                // Sun icon
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', '12');
                circle.setAttribute('cy', '12');
                circle.setAttribute('r', '5');
                svg.appendChild(circle);
                
                const sunRays = [
                    { x1: '12', y1: '1', x2: '12', y2: '3' },
                    { x1: '12', y1: '21', x2: '12', y2: '23' },
                    { x1: '4.22', y1: '4.22', x2: '5.64', y2: '5.64' },
                    { x1: '18.36', y1: '18.36', x2: '19.78', y2: '19.78' },
                    { x1: '1', y1: '12', x2: '3', y2: '12' },
                    { x1: '21', y1: '12', x2: '23', y2: '12' },
                    { x1: '4.22', y1: '19.78', x2: '5.64', y2: '18.36' },
                    { x1: '18.36', y1: '5.64', x2: '19.78', y2: '4.22' }
                ];
                
                sunRays.forEach(ray => {
                    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    path.setAttribute('d', `M${ray.x1} ${ray.y1}L${ray.x2} ${ray.y2}`);
                    svg.appendChild(path);
                });
            }
            
            toggle.appendChild(svg);
        });
    }
    
    // Update icons on page load
    updateThemeIcon();
    
    // Add theme toggle functionality to ALL theme toggle buttons
    const themeToggles = document.querySelectorAll('.theme-toggle');
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (document.documentElement.getAttribute('data-theme') === 'dark') {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
            
            // Update ALL theme toggle icons after theme change
            updateThemeIcon();
        });
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Animation on scroll functionality
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', initScrollAnimations);

// Back to top button functionality
function initBackToTop() {
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>';
    backToTopButton.classList.add('back-to-top');
    backToTopButton.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopButton);
    
    // Style the button with CSS
    const style = document.createElement('style');
    style.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            background-color: var(--accent);
            color: var(--accent-foreground);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100;
            opacity: 0;
            visibility: hidden;
            transform: translateY(1rem);
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .back-to-top:hover {
            background-color: color-mix(in srgb, var(--accent) 90%, black);
            transform: translateY(-0.25rem);
        }
        
        .back-to-top:active {
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        const button = document.querySelector('.back-to-top');
        if (window.pageYOffset > 300) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    });
    
    // Scroll to top when button is clicked
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize back to top button
document.addEventListener('DOMContentLoaded', initBackToTop);