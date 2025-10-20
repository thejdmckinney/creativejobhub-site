// /assets/header.js
(function () {
  const mount = document.getElementById('site-header');
  if (!mount) return;

  fetch('/assets/header.html', { cache: 'no-cache' })
    .then(r => r.text())
    .then(html => {
      // Replace the placeholder so the header is a top-level element
      mount.outerHTML = html;

      // After we insert the header, mark the active nav link
      const normalize = (p) => p
        .replace(/index\.html$/i, '')     // /pricing/index.html -> /pricing/
        .replace(/\/$/, '/');             // ensure trailing slash for sections

      const current = normalize(location.pathname);

      document.querySelectorAll('.site-nav a').forEach(a => {
        const href = normalize(new URL(a.getAttribute('href'), location.origin).pathname);

        // consider /pricing and /pricing/ equivalent, same for anchors on home
        const same =
          href === current ||
          (href === '/pricing/' && current === '/pricing') ||
          (href === '/' && (current === '/' || current.startsWith('/#')));

        if (same) a.classList.add('active');
      });

      // === Safety padding: measure brand & CTA widths and set CSS variables so
      // the center nav never sits under the side columns.
      function setNavSafeSpacing() {
        const brand = document.querySelector('.site-brand');
        const ctas  = document.querySelector('.site-ctas');
        const nav   = document.querySelector('.site-nav');
        if (!brand || !ctas || !nav) return;

        // Add a small cushion (in px) so nav items don't touch the edges
        const cushion = 12;

        const leftRect  = brand.getBoundingClientRect();
        const rightRect = ctas.getBoundingClientRect();

        // Measured widths relative to header
        const leftWidth  = Math.ceil(leftRect.width) + cushion;
        const rightWidth = Math.ceil(rightRect.width) + cushion;

        // On very narrow viewports, ensure the safe padding doesn't exceed half the header
        const maxAllowed = Math.floor((nav.parentElement.getBoundingClientRect().width || window.innerWidth) / 2) - 20;

        const safeLeft  = Math.min(leftWidth,  Math.max(8, maxAllowed));
        const safeRight = Math.min(rightWidth, Math.max(8, maxAllowed));

        // Set CSS variables on :root so site CSS uses them
        document.documentElement.style.setProperty('--nav-safe-left', `${safeLeft}px`);
        document.documentElement.style.setProperty('--nav-safe-right', `${safeRight}px`);
      }

      // debounce helper
      let resizeTimer = null;
      function debounceSet() {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          setNavSafeSpacing();
          resizeTimer = null;
        }, 80);
      }

      // Initial spacing calc
      setNavSafeSpacing();

      // Recompute on resize and when fonts/images may have loaded
      window.addEventListener('resize', debounceSet);
      // In case images / fonts change layout after load
      window.addEventListener('load', () => {
        setTimeout(setNavSafeSpacing, 120);
      });
    })
    .catch(() => {
      // Fail-safe minimal header (unstyled) so the page still works
      const fallback =
        '<header class="site-header"><div class="site-header_inner container">' +
        '<a class="site-brand" href="/"><img class="site-brand__logo" src="/assets/logo.png" alt=""><span class="site-brand__name">CreativeJobHub</span></a>' +
        '</div></header>';
      mount.outerHTML = fallback;
    });
})();