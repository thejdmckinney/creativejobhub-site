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
