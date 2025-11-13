// Conversion Tracking Enhancement Script
// This script enhances existing Google Analytics tracking with conversion events

(function() {
    'use strict';
    
    // Prevent multiple initialization
    if (window._conversionTrackingInitialized) {
        return;
    }
    window._conversionTrackingInitialized = true;
    
    // Conversion tracking configuration
    const CONVERSIONS = {
        CONTACT_FORM: 'contact_form_submission',
        PRICING_VIEW: 'pricing_page_view',
        DEMO_REQUEST: 'demo_request',
        PHONE_CLICK: 'phone_click',
        EMAIL_CLICK: 'email_click',
        CALCULATOR_USE: 'roi_calculator_use',
        BLOG_ENGAGEMENT: 'blog_engagement',
        COMPARE_VIEW: 'compare_view'
    };
    
    // Track conversion with Google Analytics
    function trackConversion(eventName, eventData = {}) {
        // Prevent recursion by checking if gtag exists and is a function
        if (typeof gtag === 'function' && window.dataLayer && !window._gtagRecursionGuard) {
            try {
                window._gtagRecursionGuard = true;
                gtag('event', eventName, {
                    event_category: 'conversion',
                    event_label: eventData.label || '',
                    value: eventData.value || 0,
                    custom_parameter: eventData.custom || ''
                });
                
                console.log('Conversion tracked:', eventName, eventData);
            } catch (error) {
                console.warn('Error tracking conversion:', error);
            } finally {
                window._gtagRecursionGuard = false;
            }
        }
        
        // Also send to external analytics dashboard if available
        if (typeof window.externalAnalytics === 'function') {
            try {
                window.externalAnalytics(eventName, eventData.value);
            } catch (error) {
                console.warn('Error sending to external analytics dashboard:', error);
            }
        }
    }
    
    // Initialize tracking when DOM is loaded
    function initializeTracking() {
        // Contact form tracking
        trackContactForms();
        
        // Pricing page engagement
        trackPricingEngagement();
        
        // Phone and email clicks
        trackContactClicks();
        
        // ROI Calculator usage
        trackCalculatorUsage();
        
        // Blog engagement
        trackBlogEngagement();
        
        // Compare page views
        trackCompareViews();
        
        // General page engagement
        trackPageEngagement();
    }
    
    function trackContactForms() {
        // Track all contact form submissions
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                trackConversion(CONVERSIONS.CONTACT_FORM, {
                    label: 'form_submission',
                    value: 1
                });
            });
        });
        
        // Track form field interactions
        const formInputs = document.querySelectorAll('input[type="email"], input[type="text"], textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                trackConversion('form_field_focus', {
                    label: input.name || input.type,
                    value: 0
                });
            });
        });
    }
    
    function trackPricingEngagement() {
        if (window.location.pathname.includes('pricing')) {
            // Track pricing page view
            trackConversion(CONVERSIONS.PRICING_VIEW, {
                label: 'pricing_page_view',
                value: 1
            });
            
            // Track scrolling on pricing page
            let hasScrolled50 = false;
            let hasScrolled75 = false;
            
            window.addEventListener('scroll', function() {
                const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
                
                if (scrollPercent > 50 && !hasScrolled50) {
                    hasScrolled50 = true;
                    trackConversion('pricing_scroll_50', {
                        label: 'pricing_engagement',
                        value: 0
                    });
                }
                
                if (scrollPercent > 75 && !hasScrolled75) {
                    hasScrolled75 = true;
                    trackConversion('pricing_scroll_75', {
                        label: 'pricing_deep_engagement',
                        value: 0
                    });
                }
            });
            
            // Track pricing plan clicks
            const pricingButtons = document.querySelectorAll('.pricing-button, .btn-primary, button');
            pricingButtons.forEach(button => {
                button.addEventListener('click', function() {
                    if (button.textContent.toLowerCase().includes('demo') || 
                        button.textContent.toLowerCase().includes('start') ||
                        button.textContent.toLowerCase().includes('get')) {
                        trackConversion(CONVERSIONS.DEMO_REQUEST, {
                            label: 'pricing_button_click',
                            value: 1
                        });
                    }
                });
            });
        }
    }
    
    function trackContactClicks() {
        // Track phone number clicks
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(link => {
            link.addEventListener('click', function() {
                trackConversion(CONVERSIONS.PHONE_CLICK, {
                    label: 'phone_click',
                    value: 1
                });
            });
        });
        
        // Track email clicks
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        emailLinks.forEach(link => {
            link.addEventListener('click', function() {
                trackConversion(CONVERSIONS.EMAIL_CLICK, {
                    label: 'email_click',
                    value: 1
                });
            });
        });
    }
    
    function trackCalculatorUsage() {
        // Track ROI calculator interactions
        const calculatorInputs = document.querySelectorAll('input[type="number"], input[type="range"]');
        let calculatorStarted = false;
        
        calculatorInputs.forEach(input => {
            input.addEventListener('input', function() {
                if (!calculatorStarted) {
                    calculatorStarted = true;
                    trackConversion(CONVERSIONS.CALCULATOR_USE, {
                        label: 'calculator_started',
                        value: 1
                    });
                }
            });
        });
        
        // Track calculate button clicks
        const calculateButtons = document.querySelectorAll('button[onclick*="calculate"], .calculate-btn');
        calculateButtons.forEach(button => {
            button.addEventListener('click', function() {
                trackConversion('calculator_completed', {
                    label: 'calculator_calculation',
                    value: 1
                });
            });
        });
    }
    
    function trackBlogEngagement() {
        if (window.location.pathname.includes('blog') || window.location.pathname.includes('posts')) {
            trackConversion(CONVERSIONS.BLOG_ENGAGEMENT, {
                label: 'blog_page_view',
                value: 1
            });
            
            // Track blog reading time
            let startTime = Date.now();
            let hasEngaged = false;
            
            // Track when user has been on page for 30 seconds
            setTimeout(() => {
                if (!hasEngaged) {
                    hasEngaged = true;
                    trackConversion('blog_30_second_read', {
                        label: 'blog_engagement',
                        value: 0
                    });
                }
            }, 30000);
            
            // Track scroll depth on blog posts
            let maxScroll = 0;
            window.addEventListener('scroll', function() {
                const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
                if (scrollPercent > maxScroll) {
                    maxScroll = scrollPercent;
                    if (maxScroll > 80) {
                        trackConversion('blog_read_completion', {
                            label: 'blog_full_read',
                            value: 1
                        });
                    }
                }
            });
        }
    }
    
    function trackCompareViews() {
        if (window.location.pathname.includes('compare')) {
            trackConversion(CONVERSIONS.COMPARE_VIEW, {
                label: 'compare_page_view',
                value: 1
            });
            
            // Track competitor comparison clicks
            const compareButtons = document.querySelectorAll('.compare-btn, button');
            compareButtons.forEach(button => {
                button.addEventListener('click', function() {
                    trackConversion('competitor_comparison', {
                        label: button.textContent.toLowerCase(),
                        value: 0
                    });
                });
            });
        }
    }
    
    function trackPageEngagement() {
        // Track time on page
        let startTime = Date.now();
        let engagementTracked = false;
        
        // Track 2+ minute engagement
        setTimeout(() => {
            if (!engagementTracked) {
                engagementTracked = true;
                const timeSpent = Math.round((Date.now() - startTime) / 1000);
                trackConversion('deep_page_engagement', {
                    label: window.location.pathname,
                    value: timeSpent
                });
            }
        }, 120000); // 2 minutes
        
        // Track scroll depth
        let maxScrollDepth = 0;
        window.addEventListener('scroll', function() {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            if (scrollPercent > maxScrollDepth) {
                maxScrollDepth = scrollPercent;
            }
        });
        
        // Track scroll depth when user leaves
        window.addEventListener('beforeunload', function() {
            if (maxScrollDepth > 75) {
                trackConversion('deep_scroll_engagement', {
                    label: window.location.pathname,
                    value: Math.round(maxScrollDepth)
                });
            }
        });
        
        // Track CTA button clicks
        const ctaButtons = document.querySelectorAll('.cta-button, .btn-primary, .get-started');
        ctaButtons.forEach(button => {
            button.addEventListener('click', function() {
                trackConversion('cta_button_click', {
                    label: button.textContent.trim(),
                    value: 1
                });
            });
        });
    }
    
    // Enhanced event tracking for specific elements
    function trackSpecificElements() {
        // Track navigation clicks
        const navLinks = document.querySelectorAll('nav a, .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                trackConversion('navigation_click', {
                    label: link.textContent.trim(),
                    value: 0
                });
            });
        });
        
        // Track feature interactions
        const featureElements = document.querySelectorAll('.feature, .feature-card');
        featureElements.forEach(feature => {
            feature.addEventListener('click', function() {
                trackConversion('feature_interaction', {
                    label: feature.textContent.substring(0, 50),
                    value: 0
                });
            });
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTracking);
    } else {
        initializeTracking();
    }
    
    // Initialize specific element tracking after a short delay
    setTimeout(trackSpecificElements, 1000);
    
    // Export tracking function for manual use (avoid circular reference)
    if (!window.ConversionTracker) {
        window.ConversionTracker = {
            track: trackConversion,
            EVENTS: CONVERSIONS
        };
    }
    
    console.log('Enhanced conversion tracking initialized');
})();