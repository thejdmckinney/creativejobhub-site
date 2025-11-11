// Social Media Traffic Tracking for Creative Job Hub
// This script tracks social media referrals and Open Graph engagement

(function() {
  'use strict';

  // Configuration
  const config = {
    trackingEnabled: true,
    debugMode: false, // Set to true for console logging
    trackingEvents: [
      'social_share',
      'social_click',
      'og_impression',
      'utm_campaign'
    ]
  };

  // Utility functions
  const utils = {
    log: function(message, data) {
      if (config.debugMode) {
        console.log('[Social Tracker]', message, data || '');
      }
    },

    getUrlParameter: function(name) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
    },

    getCookie: function(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    },

    setCookie: function(name, value, days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      const expires = `expires=${date.toUTCString()}`;
      document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
    },

    generateSessionId: function() {
      return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
  };

  // Social Media Detection
  const socialDetector = {
    platforms: {
      'facebook.com': 'Facebook',
      'fb.com': 'Facebook',
      'twitter.com': 'Twitter',
      'x.com': 'Twitter',
      'linkedin.com': 'LinkedIn',
      'instagram.com': 'Instagram',
      'youtube.com': 'YouTube',
      'tiktok.com': 'TikTok',
      'pinterest.com': 'Pinterest',
      'reddit.com': 'Reddit',
      'whatsapp.com': 'WhatsApp',
      'telegram.org': 'Telegram',
      'discord.com': 'Discord',
      'slack.com': 'Slack'
    },

    detectSource: function() {
      const referrer = document.referrer;
      const utm_source = utils.getUrlParameter('utm_source');
      const utm_medium = utils.getUrlParameter('utm_medium');
      
      // Check UTM parameters first
      if (utm_source && utm_medium === 'social') {
        return {
          source: utm_source,
          medium: 'social',
          campaign: utils.getUrlParameter('utm_campaign'),
          content: utils.getUrlParameter('utm_content'),
          isUTM: true
        };
      }

      // Check referrer
      if (referrer) {
        for (const domain in this.platforms) {
          if (referrer.includes(domain)) {
            return {
              source: this.platforms[domain],
              medium: 'referral',
              referrer: referrer,
              isUTM: false
            };
          }
        }
      }

      return null;
    }
  };

  // Analytics Integration
  const analytics = {
    track: function(event, data) {
      if (!config.trackingEnabled) return;

      // Google Analytics 4 (gtag)
      if (typeof gtag !== 'undefined') {
        gtag('event', event, {
          event_category: 'Social Media',
          event_label: data.source || 'unknown',
          custom_parameter_1: data.medium || '',
          custom_parameter_2: data.campaign || ''
        });
      }

      // Custom analytics endpoint (optional)
      this.sendToCustomEndpoint(event, data);

      utils.log('Event tracked:', { event, data });
    },

    sendToCustomEndpoint: function(event, data) {
      // You can implement custom tracking here
      // Example: send to your own analytics endpoint
      /*
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: event,
          data: data,
          timestamp: Date.now(),
          page: window.location.pathname,
          session: utils.getCookie('social_session_id')
        })
      }).catch(err => utils.log('Tracking error:', err));
      */
    }
  };

  // Open Graph Share Tracking
  const shareTracker = {
    init: function() {
      this.addShareButtons();
      this.trackCopyLink();
    },

    addShareButtons: function() {
      // Add social sharing buttons if they don't exist
      const shareContainer = document.getElementById('social-share-buttons');
      if (shareContainer) {
        this.enhanceShareButtons(shareContainer);
      }
    },

    enhanceShareButtons: function(container) {
      const buttons = container.querySelectorAll('a[data-social]');
      buttons.forEach(button => {
        button.addEventListener('click', (e) => {
          const platform = button.getAttribute('data-social');
          analytics.track('social_share', {
            source: platform,
            page: window.location.pathname,
            title: document.title
          });
        });
      });
    },

    trackCopyLink: function() {
      // Track when users copy the page URL
      document.addEventListener('copy', () => {
        const selection = window.getSelection().toString();
        if (selection.includes(window.location.hostname)) {
          analytics.track('link_copy', {
            source: 'copy_paste',
            page: window.location.pathname,
            content: selection.substring(0, 100)
          });
        }
      });
    }
  };

  // Main Tracking Initialization
  const socialTracker = {
    init: function() {
      utils.log('Social Media Tracker initialized');
      
      // Generate or get session ID
      let sessionId = utils.getCookie('social_session_id');
      if (!sessionId) {
        sessionId = utils.generateSessionId();
        utils.setCookie('social_session_id', sessionId, 30);
      }

      // Detect social media source
      const source = socialDetector.detectSource();
      if (source) {
        this.trackSocialVisit(source);
      }

      // Initialize share tracking
      shareTracker.init();

      // Track page engagement
      this.trackEngagement();
    },

    trackSocialVisit: function(source) {
      analytics.track('social_visit', {
        source: source.source,
        medium: source.medium,
        campaign: source.campaign || 'organic',
        page: window.location.pathname,
        is_utm: source.isUTM
      });

      // Store source for attribution
      utils.setCookie('social_source', JSON.stringify(source), 7);
    },

    trackEngagement: function() {
      let startTime = Date.now();
      let scrollDepth = 0;
      
      // Track scroll depth
      window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentDepth = Math.round((currentScroll / documentHeight) * 100);
        
        if (currentDepth > scrollDepth) {
          scrollDepth = currentDepth;
          
          // Track milestone scroll depths
          if ([25, 50, 75, 100].includes(currentDepth)) {
            analytics.track('scroll_depth', {
              depth: currentDepth,
              page: window.location.pathname
            });
          }
        }
      });

      // Track time on page when leaving
      window.addEventListener('beforeunload', () => {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        analytics.track('time_on_page', {
          duration: timeOnPage,
          max_scroll: scrollDepth,
          page: window.location.pathname
        });
      });
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', socialTracker.init.bind(socialTracker));
  } else {
    socialTracker.init();
  }

  // Expose utilities for manual tracking
  window.CreativeJobHubTracker = {
    trackEvent: analytics.track.bind(analytics),
    utils: utils,
    config: config
  };

})();