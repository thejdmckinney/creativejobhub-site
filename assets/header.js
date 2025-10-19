(async function () {
  // Where to inject
  const mount = document.getElementById('site-header');
  if (!mount) return;

  // Fetch the shared header
  const res = await fetch('/assets/header.html', { cache: 'no-cache' });
  const html = await res.text();
  mount.innerHTML = html;

  // Basic styles (keeps everything self-contained)
  const css = `
    .site-header{background:#0b1320;border-bottom:1px solid #2b3652;position:sticky;top:0;z-index:50}
    .site-header__inner{max-width:1200px;margin:0 auto;padding:12px 16px;display:flex;align-items:center;justify-content:space-between}
    .brand{font-weight:800;color:#f8fafc;text-decoration:none}
    .nav{display:flex;gap:18px}
    .nav a{color:#cdd4e0;text-decoration:none;padding:8px 10px;border-radius:10px}
    .nav a:hover{background:#1b2340}
    .nav a.active{background:#7c6cf3;color:#fff}
    @media (max-width:640px){.nav{gap:10px}}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // Mark the current page active
  const path = location.pathname.replace(/\/index\.html$/, '/');
  mount.querySelectorAll('.nav a').forEach(a => {
    const href = new URL(a.href, location.origin).pathname;
    if (href === path) a.classList.add('active');
  });
})();
