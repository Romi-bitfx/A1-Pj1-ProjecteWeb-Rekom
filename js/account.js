/* ==========================================================
   REKOM™ — COMPTE (demo: la sessió es guarda en aquest navegador)
   ========================================================== */
(() => {
  const R = window.REKOM;
  const { $, $$, esc, fmt, store, byId } = R;
  const root = $('#account-root');

  function renderAuth(mode = 'signin') {
    root.innerHTML = `
      <div class="auth-wrap">
        <div class="card glow auth-card reveal in">
          <img class="brand-icon" src="assets/img/logo.png" alt="REKOM" width="42" height="44">
          <h1 style="font-size:clamp(1.8rem,4vw,2.6rem)">${mode === 'signin' ? 'Welcome<br>back.' : 'Join the<br><span class="text-glow">underground.</span>'}</h1>
          <p class="muted mt-2 mb-3">${mode === 'signin' ? 'Sign in to keep track of your orders and saved pieces.' : 'Create an account for early access, order tracking and your wishlist in one place.'}</p>

          <div class="tabs mt-3" role="tablist">
            <button type="button" role="tab" class="${mode === 'signin' ? 'active' : ''}" aria-selected="${mode === 'signin'}" data-mode="signin">Sign in</button>
            <button type="button" role="tab" class="${mode === 'signup' ? 'active' : ''}" aria-selected="${mode === 'signup'}" data-mode="signup">Create account</button>
          </div>

          <form id="auth-form" style="display:grid;gap:16px">
            ${mode === 'signup' ? `<div class="field"><label for="a-name">Name</label><input class="input" id="a-name" autocomplete="given-name" required></div>` : ''}
            <div class="field"><label for="a-email">Email</label><input class="input" id="a-email" type="email" autocomplete="email" placeholder="you@example.com" required></div>
            <div class="field"><label for="a-pass">Password</label><input class="input" id="a-pass" type="password" autocomplete="${mode === 'signin' ? 'current-password' : 'new-password'}" minlength="6" placeholder="••••••••" required></div>
            <button class="btn btn-lg btn-block" type="submit">${mode === 'signin' ? 'Sign in' : 'Create account'} <i class="bi bi-arrow-right"></i></button>
          </form>

          <p class="dim mt-3 text-center" style="font-size:.8rem">Demo account — your session is stored only in this browser.<br>By continuing you agree to our <a href="terms_of_service.html" style="text-decoration:underline">Terms</a> and <a href="privacy_policy.html" style="text-decoration:underline">Privacy Policy</a>.</p>
        </div>
      </div>`;

    $$('[data-mode]', root).forEach(b => b.addEventListener('click', () => renderAuth(b.dataset.mode)));
    $('#auth-form').addEventListener('submit', e => {
      e.preventDefault();
      const email = $('#a-email').value.trim().toLowerCase();
      const name = $('#a-name')?.value.trim() || email.split('@')[0];
      store.set('user', { name, email, since: new Date().toISOString() });
      R.toast(`Signed in as ${email}`, 'bi-person-check');
      renderDash();
    });
  }

  function ordersHTML(user) {
    const orders = store.get('orders', []).filter(o => o.email === user.email);
    if (!orders.length) {
      return `<div class="cart-empty"><i class="bi bi-box-seam"></i><h3>No orders yet</h3><p>Your first piece is waiting.</p><a class="btn" href="shop.html">Shop the drop <i class="bi bi-arrow-right"></i></a></div>`;
    }
    return orders.map(o => {
      const prog = R.orderProgress(o);
      return `
        <a class="order-row" href="order_tracking.html?order=${o.number}&email=${encodeURIComponent(o.email)}">
          <span class="thumbs">${o.items.slice(0, 3).map(i => `<img src="${byId(i.id)?.img.front}" alt="">`).join('')}</span>
          <span>
            <b style="font-family:var(--f-display)">${o.number}</b>
            <span class="muted" style="display:block;font-size:.85rem">${new Date(o.date).toLocaleDateString('en-GB')} · ${o.items.reduce((a, i) => a + i.qty, 0)} item(s) · ${fmt(o.totals.total)}</span>
          </span>
          <span class="status-pill ${prog.current === 3 ? 'ok' : ''}">${prog.label}</span>
        </a>`;
    }).join('');
  }

  function renderDash(tab = 'orders') {
    const user = store.get('user', null);
    if (!user) return renderAuth();

    root.innerHTML = `
      <section class="page-hero" style="margin-inline:calc(var(--gutter) * -1);padding-inline:var(--gutter)">
        <span class="eyebrow">My account</span>
        <h1 class="mt-2">Hi, <span class="text-glow">${esc(user.name)}.</span></h1>
      </section>
      <div class="dash section-tight">
        <nav class="dash-nav" aria-label="Account">
          <button type="button" class="${tab === 'orders' ? 'active' : ''}" data-tab="orders"><i class="bi bi-box-seam"></i> Orders</button>
          <button type="button" class="${tab === 'wish' ? 'active' : ''}" data-tab="wish"><i class="bi bi-heart"></i> Wishlist</button>
          <button type="button" class="${tab === 'details' ? 'active' : ''}" data-tab="details"><i class="bi bi-person"></i> Details</button>
          <button type="button" data-logout><i class="bi bi-box-arrow-right"></i> Sign out</button>
        </nav>
        <div id="dash-panel"></div>
      </div>`;

    const panel = $('#dash-panel');
    if (tab === 'orders') panel.innerHTML = `<h2 style="font-size:1.3rem;margin-bottom:10px">Orders</h2>${ordersHTML(user)}`;
    if (tab === 'wish') {
      panel.innerHTML = `<h2 style="font-size:1.3rem;margin-bottom:24px">Wishlist</h2><div class="grid-products" id="acc-wish" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr))"></div>`;
      const list = R.wish.map(byId).filter(Boolean);
      if (list.length) { R.renderGrid($('#acc-wish'), list); $$('#acc-wish .reveal').forEach(e => e.classList.add('in')); }
      else $('#acc-wish').outerHTML = `<div class="cart-empty"><i class="bi bi-heart"></i><h3>Nothing saved yet</h3><p>Tap the heart on any piece.</p><a class="btn" href="shop.html">Explore <i class="bi bi-arrow-right"></i></a></div>`;
    }
    if (tab === 'details') {
      panel.innerHTML = `
        <h2 style="font-size:1.3rem;margin-bottom:24px">Details</h2>
        <ul class="spec-list" style="margin-top:0">
          <li><span>Name</span><span>${esc(user.name)}</span></li>
          <li><span>Email</span><span>${esc(user.email)}</span></li>
          <li><span>Member since</span><span>${new Date(user.since).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</span></li>
          <li><span>Newsletter</span><span>${store.get('subscribed', false) ? 'Subscribed' : 'Not subscribed'}</span></li>
        </ul>`;
    }

    $$('[data-tab]', root).forEach(b => b.addEventListener('click', () => renderDash(b.dataset.tab)));
    $('[data-logout]', root).addEventListener('click', () => {
      store.set('user', null);
      R.toast('Signed out', 'bi-box-arrow-right');
      renderAuth();
    });
  }

  document.addEventListener('rekom:wish', () => {
    if ($('#acc-wish') || ($('#dash-panel') && $('.dash-nav .active')?.dataset.tab === 'wish')) renderDash('wish');
  });

  renderDash();
})();
