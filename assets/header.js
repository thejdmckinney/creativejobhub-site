// assets/header.js — defensive header injector + overflow handling
(function () {
  // guard: ensure we're in a browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Banner removed per user request

  const mount = document.getElementById('site-header');
  if (!mount) return;

  // helper to safely fetch text; returns null on non-200 or non-text responses
  function safeFetchText(url) {
    return fetch(url, { cache: 'no-cache' })
      .then(resp => {
        if (!resp.ok) return null;
        const ct = resp.headers.get('content-type') || '';
        // accept text/* and application/javascript etc.
        if (!ct.includes('text') && !ct.includes('javascript') && !ct.includes('json')) {
          return null;
        }
        return resp.text().catch(() => null);
      })
      .catch(() => null);
  }

  safeFetchText('/assets/header.html').then(html => {
    if (!html) {
      // fallback: do nothing (avoid replacing mount with invalid content)
      return;
    }

    // Replace the placeholder so the header is a top-level element
    mount.outerHTML = html;

    // --- after header inserted ---
    const normalize = (p) => p
      .replace(/index\.html$/i, '')     // /pricing/index.html -> /pricing/
      .replace(/\/$/, '/');             // ensure trailing slash for sections

    const current = normalize(location.pathname);

    // mark active link
    document.querySelectorAll('.site-nav .nav-link:not(.dropdown-toggle)').forEach(a => {
      try {
        const href = normalize(new URL(a.getAttribute('href') || '', location.origin).pathname);
        const same =
          href === current ||
          (href === '/pricing/' && current === '/pricing') ||
          (href === '/' && (current === '/' || current.startsWith('/#')));
        if (same) a.classList.add('active');
      } catch (e) {
        // ignore invalid hrefs
      }
    });

    // === Safety padding: measure brand & CTA widths and set CSS variables so
    // the center nav never sits under the side columns.
    function setNavSafeSpacing() {
      const brand = document.querySelector('.site-brand');
      const ctas  = document.querySelector('.site-ctas');
      const nav   = document.querySelector('.site-nav');
      if (!brand || !ctas || !nav) return;

      const cushion = 12;
      const leftRect  = brand.getBoundingClientRect();
      const rightRect = ctas.getBoundingClientRect();

      const leftWidth  = Math.ceil(leftRect.width) + cushion;
      const rightWidth = Math.ceil(rightRect.width) + cushion;

      const parentWidth = (nav.parentElement && nav.parentElement.getBoundingClientRect().width) || window.innerWidth;
      const maxAllowed = Math.floor(parentWidth / 2) - 20;

      const safeLeft  = Math.min(leftWidth,  Math.max(8, maxAllowed));
      const safeRight = Math.min(rightWidth, Math.max(8, maxAllowed));

      document.documentElement.style.setProperty('--nav-safe-left', `${safeLeft}px`);
      document.documentElement.style.setProperty('--nav-safe-right', `${safeRight}px`);
    }

    // === Overflow collapse: move overflowing nav items into a "More" menu
    function ensureOverflowMenu() {
      const nav = document.querySelector('.site-nav');
      if (!nav) return null;

      let moreWrapper = nav.querySelector('.nav-more-wrapper');
      if (!moreWrapper) {
        moreWrapper = document.createElement('div');
        moreWrapper.className = 'nav-more-wrapper';
        moreWrapper.innerHTML =
          '<details class="nav-more"><summary aria-haspopup="true">More</summary><div class="nav-more-list" role="menu"></div></details>';
        nav.appendChild(moreWrapper);
      }

      const moreList = moreWrapper.querySelector('.nav-more-list');

      function getNavLinks() {
        return Array.from(nav.querySelectorAll(':scope > a'));
      }

      function restoreAll() {
        const items = Array.from(moreList.children);
        items.forEach(item => {
          const link = item.querySelector('a');
          if (link) nav.insertBefore(link, moreWrapper);
          item.remove();
        });
      }

      function redistribute() {
        restoreAll();
        let links = getNavLinks();
        const isOverflowing = () => nav.scrollWidth > nav.clientWidth + 1;

        if (!isOverflowing()) {
          moreWrapper.style.display = 'none';
          return;
        }

        moreWrapper.style.display = '';

        // keep moving last items into More until it fits; leave at least one
        while (isOverflowing() && links.length > 1) {
          const last = links[links.length - 1];
          const item = document.createElement('div');
          item.className = 'nav-more-item';
          item.appendChild(last);
          moreList.insertBefore(item, moreList.firstChild);
          links = getNavLinks();
          if (links.length === 0) break;
        }

        if (moreList.children.length === 0) moreWrapper.style.display = 'none';
        else moreWrapper.style.display = '';
      }

      return { redistribute, restoreAll };
    }

    // debounce helper
    let resizeTimer = null;
    function debounceSet() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setNavSafeSpacing();
        const ov = ensureOverflowMenu();
        if (ov) ov.redistribute();
        resizeTimer = null;
      }, 80);
    }

    // initial
    setNavSafeSpacing();
    const ov = ensureOverflowMenu();
    if (ov) ov.redistribute();

    window.addEventListener('resize', debounceSet);
    window.addEventListener('load', () => {
      setTimeout(() => {
        setNavSafeSpacing();
        const ov2 = ensureOverflowMenu();
        if (ov2) ov2.redistribute();
      }, 120);
    });

    // === Mobile hamburger navigation toggle ===
    const header = document.querySelector('.site-header');
    const navToggle = header.querySelector('.nav-toggle');
    const nav = header.querySelector('.site-nav');

    if (navToggle && nav) {
      function toggleNav() {
        const isOpen = header.classList.toggle('nav-open');
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.style.overflow = isOpen ? 'hidden' : '';
      }

      navToggle.addEventListener('click', toggleNav);
      
      // Close menu on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && header.classList.contains('nav-open')) {
          toggleNav();
        }
      });

      // Close menu when clicking nav links
      nav.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && header.classList.contains('nav-open')) {
          toggleNav();
        }
      });
    }

    // === Professional Dropdown Navigation ===
    function setupDropdowns() {
      const dropdowns = document.querySelectorAll('.nav-dropdown');
      
      dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (!toggle || !menu) return;

        // Remove previous event listeners by cloning
        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);

        // Desktop: hover behavior
        if (window.innerWidth > 860) {
          dropdown.addEventListener('mouseenter', () => {
            dropdown.classList.add('active');
          });

          dropdown.addEventListener('mouseleave', () => {
            dropdown.classList.remove('active');
          });
        }
        
        // Click behavior for all screen sizes
        newToggle.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          const isActive = dropdown.classList.contains('active');
          
          // Close all other dropdowns
          dropdowns.forEach(d => {
            if (d !== dropdown) d.classList.remove('active');
          });
          
          // Toggle current dropdown
          dropdown.classList.toggle('active', !isActive);
          newToggle.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
        });
      });

      // Close dropdowns when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown')) {
          dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
            const toggle = dropdown.querySelector('.dropdown-toggle');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
          });
        }
      });

      // Close dropdowns on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
            const toggle = dropdown.querySelector('.dropdown-toggle');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
          });
        }
      });
    }

    // Initialize dropdowns after header is injected
    setupDropdowns();

    // Reinitialize on window resize
    let dropdownTimer = null;
    window.addEventListener('resize', () => {
      if (dropdownTimer) clearTimeout(dropdownTimer);
      dropdownTimer = setTimeout(setupDropdowns, 100);
    });
  });

  // Fallback: If header is already present (e.g. homepage), ensure dropdowns are initialized
  document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.site-header')) {
      // Only run if not already initialized
      if (!window._dropdownsInitialized) {
        window._dropdownsInitialized = true;
        // Use the same setupDropdowns function as above
        const dropdowns = document.querySelectorAll('.nav-dropdown');
        dropdowns.forEach(dropdown => {
          const toggle = dropdown.querySelector('.dropdown-toggle');
          const menu = dropdown.querySelector('.dropdown-menu');
          if (!toggle || !menu) return;
          // Remove previous event listeners by cloning
          const newToggle = toggle.cloneNode(true);
          toggle.parentNode.replaceChild(newToggle, toggle);
          // Desktop: hover behavior
          if (window.innerWidth > 860) {
            dropdown.addEventListener('mouseenter', () => {
              dropdown.classList.add('active');
            });
            dropdown.addEventListener('mouseleave', () => {
              dropdown.classList.remove('active');
            });
          }
          // Click behavior for all screen sizes
          newToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isActive = dropdown.classList.contains('active');
            dropdowns.forEach(d => { if (d !== dropdown) d.classList.remove('active'); });
            dropdown.classList.toggle('active', !isActive);
            newToggle.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
          });
        });
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
          if (!e.target.closest('.nav-dropdown')) {
            dropdowns.forEach(dropdown => {
              dropdown.classList.remove('active');
              const toggle = dropdown.querySelector('.dropdown-toggle');
              if (toggle) toggle.setAttribute('aria-expanded', 'false');
            });
          }
        });
        // Close dropdowns on escape key
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            dropdowns.forEach(dropdown => {
              dropdown.classList.remove('active');
              const toggle = dropdown.querySelector('.dropdown-toggle');
              if (toggle) toggle.setAttribute('aria-expanded', 'false');
            });
          }
        });
      }
    }
  });
})();