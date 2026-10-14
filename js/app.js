/* ==========================================================
   REKOM™ — APP CORE
   Layout compartit (header, footer, carret, cerca, popup),
   estat de la botiga (carret + wishlist a localStorage),
   targetes de producte i animacions.
   ========================================================== */
(() => {
  const P = window.REKOM_PRODUCTS;
  const C = window.REKOM_CONFIG;

  // ---------- UTILITATS ----------
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const money = new Intl.NumberFormat(C.locale, { style: 'currency', currency: C.currency });
  const fmt = n => money.format(n);
  const round2 = n => Math.round(n * 100) / 100;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const byId = id => P.find(p => p.id === id);
  const stockOf = p => Object.values(p.stock).reduce((a, b) => a + b, 0);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const store = {
    get(k, d) {
      try { const v = localStorage.getItem('rekom:' + k); return v ? JSON.parse(v) : d; } catch { return d; }
    },
    set(k, v) {
      try { localStorage.setItem('rekom:' + k, JSON.stringify(v)); } catch { /* mode privat */ }
    }
  };

  const page = document.body.dataset.page || '';

  // ---------- LAYOUT COMPARTIT ----------
  const socialsHTML = `
    <div class="socials">
      <a class="icon-btn" href="https://www.instagram.com/rekom_wear/" target="_blank" rel="noopener" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
      <a class="icon-btn" href="https://www.tiktok.com/@rekom_wear" target="_blank" rel="noopener" aria-label="TikTok"><i class="bi bi-tiktok"></i></a>
      <a class="icon-btn" href="https://x.com/RekomWear" target="_blank" rel="noopener" aria-label="X (Twitter)"><i class="bi bi-twitter-x"></i></a>
      <a class="icon-btn" href="https://www.youtube.com/@Rekom_Wear" target="_blank" rel="noopener" aria-label="YouTube"><i class="bi bi-youtube"></i></a>
    </div>`;

  const announceItems = [
    `Free shipping over <b>${fmt(C.freeShippingFrom)}</b>`,
    'Handmade in <b>Reus, ES</b>',
    '<b>Drop 001</b> is live',
    `Edition of <b>${C.editionSize}</b> per piece`,
    '10% off your first order — code <b>REKOM10</b>',
    'No restocks. Ever.'
  ].map(t => `<span>${t}</span><span class="star">✦</span>`).join('');

  const navLinks = [
    { href: 'shop.html', label: 'Shop', key: 'shop' },
    { href: 'shop.html#drop-001', label: 'Drop 001', key: 'drop', tag: 'Live' },
    { href: 'about_us.html', label: 'About', key: 'about' },
    { href: 'contact.html', label: 'Contact', key: 'contact' }
  ];

  const headerHTML = `
    <a class="skip-link" href="#main">Skip to content</a>
    <div class="announce" role="region" aria-label="Announcements">
      <div class="marquee"><span>${announceItems}</span><span aria-hidden="true">${announceItems}</span></div>
    </div>
    <header class="site-header" id="site-header">
      <div class="container header-inner">
        <div class="flex center">
          <button class="icon-btn menu-toggle" type="button" data-open-menu aria-label="Open menu"><i class="bi bi-list"></i></button>
          <nav class="main-nav" aria-label="Main">
            ${navLinks.map(l => `<a href="${l.href}" class="${l.key === page ? 'active' : ''}">${l.label}${l.tag ? `<span class="tag">${l.tag}</span>` : ''}</a>`).join('')}
          </nav>
        </div>
        <a class="brand" href="index.html" aria-label="REKOM — Home">
          <img src="assets/img/logo.png" alt="" width="33" height="34">
          <span class="brand-word">REKOM<sup>™</sup></span>
        </a>
        <div class="header-actions">
          <button class="icon-btn" type="button" data-open-search aria-label="Search"><i class="bi bi-search"></i></button>
          <a class="icon-btn hide-sm" href="wishlist.html" aria-label="Wishlist"><i class="bi bi-heart"></i><span class="count" data-wish-count></span></a>
          <a class="icon-btn hide-sm" href="account.html" aria-label="Account"><i class="bi bi-person"></i></a>
          <button class="icon-btn" type="button" data-open-cart aria-label="Cart"><i class="bi bi-bag"></i><span class="count" data-cart-count></span></button>
        </div>
      </div>
    </header>

    <div class="mobile-menu" id="mobile-menu" aria-hidden="true">
      <div class="mobile-menu-top">
        <a class="brand" href="index.html"><img src="assets/img/logo.png" alt="REKOM" width="33" height="34"></a>
        <button class="icon-btn" type="button" data-close-menu aria-label="Close menu"><i class="bi bi-x-lg"></i></button>
      </div>
      <nav aria-label="Mobile">
        <a href="index.html">Home</a>
        <a href="shop.html">Shop <small>04</small></a>
        <a href="about_us.html">About</a>
        <a href="wishlist.html">Wishlist <small data-wish-count-plain></small></a>
        <a href="account.html">Account</a>
      </nav>
      <div class="mobile-menu-foot">
        <a class="link-arrow" href="contact.html">Contact <i class="bi bi-arrow-right"></i></a>
        ${socialsHTML}
      </div>
    </div>`;

  const footerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-top">
          <div class="footer-brand">
            <img src="assets/img/logo.png" alt="REKOM" width="38" height="40">
            <p>Urban handmade hoodies. Cut, printed and finished by hand in Reus. Limited editions — when they're gone, they're gone.</p>
            ${socialsHTML}
          </div>
          <div>
            <h4>Shop</h4>
            <ul>
              <li><a href="shop.html">All products</a></li>
              ${P.map(p => `<li><a href="${p.url}">${p.name}</a></li>`).join('')}
            </ul>
          </div>
          <div>
            <h4>Help</h4>
            <ul>
              <li><a href="faqs.html">FAQs</a></li>
              <li><a href="order_tracking.html">Order tracking</a></li>
              <li><a href="returns_exchanges.html">Returns &amp; exchanges</a></li>
              <li><a href="contact.html">Contact</a></li>
              <li><a href="account.html">My account</a></li>
            </ul>
          </div>
          <div>
            <h4>Studio</h4>
            <address>
              Carrer del Duc, 7<br>
              08002 Barcelona, ES<br>
              Mon–Sat · 11:00–21:00<br>
              <a href="tel:+34977207089">+34 977 207 089</a>
            </address>
          </div>
        </div>

        <div class="footer-word" aria-hidden="true">REKOM<sup>™</sup></div>

        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} REKOM™ — All rights reserved.</span>
          <div class="flex gap-2 wrap">
            <a href="legal_notice.html">Legal notice</a>
            <a href="privacy_policy.html">Privacy</a>
            <a href="terms_of_service.html">Terms</a>
          </div>
          <div class="pay-icons" aria-label="Payment methods">
            <i class="bi bi-credit-card-2-front"></i><i class="bi bi-apple"></i><i class="bi bi-google"></i><i class="bi bi-paypal"></i>
          </div>
        </div>
      </div>
    </footer>`;

  const overlaysHTML = `
    <div class="search-overlay" id="search" role="dialog" aria-modal="true" aria-label="Search">
      <div class="container search-inner">
        <div class="search-top">
          <span class="eyebrow">Search the archive</span>
          <button class="icon-btn" type="button" data-close-search aria-label="Close search"><i class="bi bi-x-lg"></i></button>
        </div>
        <label class="search-field">
          <i class="bi bi-search"></i>
          <span class="sr-only">Search products</span>
          <input type="search" id="search-input" placeholder="Type to search" autocomplete="off">
        </label>
        <div class="search-hints">
          ${['Black', 'Purple', 'White', 'Navy', 'Camo'].map(h => `<button class="chip" type="button" data-hint="${h}">${h}</button>`).join('')}
        </div>
        <div class="search-results" id="search-results"></div>
        <p class="search-empty" id="search-empty" hidden>Nothing here. Yet. Try “black” or “Umbra”.</p>
      </div>
    </div>

    <div class="backdrop" id="backdrop"></div>
    <aside class="drawer" id="cart" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <div class="drawer-head">
        <h2 id="cart-title">Your bag<sup data-cart-count-plain></sup></h2>
        <button class="icon-btn" type="button" data-close-cart aria-label="Close cart"><i class="bi bi-x-lg"></i></button>
      </div>
      <div class="ship-progress" id="ship-progress"></div>
      <div class="drawer-body" id="cart-body"></div>
      <div class="drawer-foot" id="cart-foot"></div>
    </aside>

    <div class="toasts" id="toasts" aria-live="polite"></div>

    <div class="modal" id="promo" role="dialog" aria-modal="true" aria-labelledby="promo-title">
      <div class="modal-card">
        <button class="icon-btn modal-close" type="button" data-close-promo aria-label="Close"><i class="bi bi-x-lg"></i></button>
        <div class="modal-photo"><img src="assets/img/lookbook/alley-600.webp" alt="Person in a REKOM hoodie walking down a dark alley" loading="lazy"></div>
        <div class="modal-body" id="promo-body">
          <img src="assets/img/logo.png" alt="" width="34" height="36">
          <span class="eyebrow plain">Steal us</span>
          <h2 id="promo-title"><span class="text-glow">10% off</span> your first order</h2>
          <p class="muted">No tricks — there are others for that :) Join the list and get early access to every drop.</p>
          <form data-newsletter>
            <input class="input" type="text" name="name" placeholder="Name" autocomplete="given-name" required>
            <input class="input" type="email" name="email" placeholder="Email" autocomplete="email" required>
            <button class="btn btn-lg btn-block" type="submit">Give me my discount <i class="bi bi-arrow-right"></i></button>
          </form>
          <button class="modal-dismiss" type="button" data-close-promo>I'm not interested</button>
        </div>
      </div>
    </div>`;

  // Injectar
  document.body.insertAdjacentHTML('afterbegin', headerHTML);
  const main = $('main');
  if (main) main.id = 'main';
  if (!document.body.dataset.noFooter) document.body.insertAdjacentHTML('beforeend', footerHTML);
  document.body.insertAdjacentHTML('beforeend', overlaysHTML);

  // ---------- TOASTS ----------
  function toast(msg, icon = 'bi-check2-circle', type = '') {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<i class="bi ${icon}"></i><span>${msg}</span>`;
    $('#toasts').appendChild(el);
    setTimeout(() => { el.classList.add('out'); el.addEventListener('animationend', () => el.remove()); }, 3200);
  }

  // ---------- OVERLAYS (obrir / tancar) ----------
  const openStack = [];
  function openLayer(el, focusSel) {
    el.classList.add('open');
    el.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock');
    openStack.push(el);
    const f = focusSel ? $(focusSel, el) : el.querySelector('button, a, input');
    if (f) setTimeout(() => f.focus({ preventScroll: true }), 60);
  }
  function closeLayer(el) {
    el.classList.remove('open');
    el.setAttribute('aria-hidden', 'true');
    const i = openStack.indexOf(el);
    if (i > -1) openStack.splice(i, 1);
    if (!openStack.length) document.body.classList.remove('lock');
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && openStack.length) {
      const top = openStack[openStack.length - 1];
      if (top.id === 'cart') closeCart(); else closeLayer(top);
    }
  });

  const menu = $('#mobile-menu');
  const search = $('#search');
  const cartEl = $('#cart');
  const backdrop = $('#backdrop');
  const promo = $('#promo');

  function openCart() { openLayer(cartEl); backdrop.classList.add('open'); }
  function closeCart() { closeLayer(cartEl); backdrop.classList.remove('open'); }

  // ---------- CARRET ----------
  let cart = store.get('cart', []).filter(i => byId(i.id));

  function cartCount() { return cart.reduce((a, i) => a + i.qty, 0); }

  function totals(items = cart, method = 'standard') {
    const subtotal = round2(items.reduce((a, i) => a + byId(i.id).price * i.qty, 0));
    const code = store.get('promo', null);
    const pct = C.discountCodes[code] || 0;
    const discount = round2(subtotal * pct / 100);
    const freeShip = subtotal >= C.freeShippingFrom;
    let shipping = C.shipping[method].price;
    if (method === 'standard' && freeShip) shipping = 0;
    if (!items.length) shipping = 0;
    const total = round2(subtotal - discount + shipping);
    return { subtotal, discount, pct, code: pct ? code : null, shipping, freeShip, total };
  }

  function saveCart() {
    store.set('cart', cart);
    renderCart();
    document.dispatchEvent(new CustomEvent('rekom:cart'));
  }

  function addToCart(id, size, qty = 1) {
    const p = byId(id);
    if (!p) return false;
    const max = p.stock[size] || 0;
    const line = cart.find(i => i.id === id && i.size === size);
    const current = line ? line.qty : 0;
    if (current + qty > max) {
      toast(max ? `Only ${max} left in ${size}. You already have them all.` : `${size} is sold out.`, 'bi-exclamation-octagon', 'error');
      return false;
    }
    if (line) line.qty += qty; else cart.push({ id, size, qty });
    saveCart();
    bump('[data-cart-count]');
    return true;
  }

  function setQty(id, size, qty) {
    const line = cart.find(i => i.id === id && i.size === size);
    if (!line) return;
    const max = byId(id).stock[size];
    if (qty > max) { toast(`Only ${max} available in ${size}.`, 'bi-exclamation-octagon', 'error'); return; }
    if (qty <= 0) cart = cart.filter(i => i !== line); else line.qty = qty;
    saveCart();
  }

  function lineItemHTML(i, opts = {}) {
    const p = byId(i.id);
    return `
      <div class="line-item">
        <a class="thumb" href="${p.url}"><img src="${p.img.front}" alt="${esc(p.name)} hoodie" loading="lazy">${opts.badge ? `<em>${i.qty}</em>` : ''}</a>
        <div>
          <h3><a href="${p.url}">${esc(p.name)}</a></h3>
          <div class="meta">${esc(p.colorway)} · ${i.size}</div>
          ${opts.readonly ? '' : `
          <div class="qty" aria-label="Quantity">
            <button type="button" data-qty="-1" data-id="${i.id}" data-size="${i.size}" aria-label="Decrease">−</button>
            <span>${i.qty}</span>
            <button type="button" data-qty="1" data-id="${i.id}" data-size="${i.size}" aria-label="Increase">+</button>
          </div>`}
        </div>
        <div class="right">
          <span class="mono">${fmt(p.price * i.qty)}</span>
          ${opts.readonly ? '' : `<button type="button" class="remove" data-remove data-id="${i.id}" data-size="${i.size}">Remove</button>`}
        </div>
      </div>`;
  }

  function shipProgressHTML(subtotal) {
    const left = round2(C.freeShippingFrom - subtotal);
    const pct = Math.min(100, (subtotal / C.freeShippingFrom) * 100);
    return `<p>${left > 0 ? `You're <b>${fmt(left)}</b> away from free shipping.` : `<b>Free shipping</b> unlocked. Nice.`}</p>
            <div class="bar"><i style="width:${pct}%"></i></div>`;
  }

  function renderCart() {
    const n = cartCount();
    $$('[data-cart-count]').forEach(el => { el.textContent = n; el.classList.toggle('show', n > 0); });
    $$('[data-cart-count-plain]').forEach(el => { el.textContent = n ? `(${n})` : ''; });

    const body = $('#cart-body'), foot = $('#cart-foot'), prog = $('#ship-progress');
    if (!cart.length) {
      prog.hidden = true;
      foot.hidden = true;
      body.innerHTML = `
        <div class="cart-empty">
          <i class="bi bi-bag-x"></i>
          <h3>Your bag is empty</h3>
          <p>Drop 001 won't wait. Edition of ${C.editionSize} per piece.</p>
          <a class="btn" href="shop.html">Shop the drop <i class="bi bi-arrow-right"></i></a>
        </div>`;
      return;
    }
    const t = totals();
    prog.hidden = false;
    foot.hidden = false;
    prog.innerHTML = shipProgressHTML(t.subtotal);
    body.innerHTML = cart.map(i => lineItemHTML(i)).join('');
    foot.innerHTML = `
      <div class="totals">
        <div class="row"><span>Subtotal</span><span>${fmt(t.subtotal)}</span></div>
        ${t.discount ? `<div class="row discount"><span>Code ${t.code} (−${t.pct}%)</span><span>−${fmt(t.discount)}</span></div>` : ''}
        <div class="row"><span>Shipping</span><span>${t.freeShip ? 'Free' : 'Calculated at checkout'}</span></div>
        <div class="row total"><span>Total</span><span>${fmt(t.subtotal - t.discount)}</span></div>
      </div>
      <a class="btn btn-lg btn-block" href="checkout.html">Checkout <i class="bi bi-lock"></i></a>
      <p class="secure-note"><i class="bi bi-shield-check"></i> Secure checkout · 14-day returns</p>`;
  }

  // ---------- WISHLIST ----------
  let wish = store.get('wish', []).filter(byId);
  function renderWish() {
    $$('[data-wish-count]').forEach(el => { el.textContent = wish.length; el.classList.toggle('show', wish.length > 0); });
    $$('[data-wish-count-plain]').forEach(el => { el.textContent = wish.length ? String(wish.length).padStart(2, '0') : ''; });
    $$('[data-wish]').forEach(b => {
      const on = wish.includes(b.dataset.wish);
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on);
    });
  }
  function toggleWish(id, btn) {
    const on = wish.includes(id);
    wish = on ? wish.filter(w => w !== id) : [...wish, id];
    store.set('wish', wish);
    renderWish();
    if (btn) { btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop'); }
    toast(on ? `${byId(id).name} removed from wishlist` : `${byId(id).name} saved to wishlist`, on ? 'bi-heart' : 'bi-heart-fill');
    document.dispatchEvent(new CustomEvent('rekom:wish'));
  }

  function bump(sel) {
    $$(sel).forEach(el => { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); });
  }

  // ---------- TARGETA DE PRODUCTE ----------
  function badgeHTML(p) {
    const left = stockOf(p);
    if (!left) return '<span class="pcard-badge sold">Sold out</span>';
    if (!p.badge) return '';
    const cls = p.badge === 'New' ? 'purple' : p.badge === 'Low stock' ? 'warn' : '';
    return `<span class="pcard-badge ${cls}">${p.badge}</span>`;
  }

  function stockHTML(p) {
    const left = stockOf(p);
    const pct = Math.max(4, (left / C.editionSize) * 100);
    return `<div class="stock-line ${left <= 8 ? 'low' : ''}">
              <span class="bar"><i style="width:${pct}%"></i></span>
              <span class="mono">${left ? `${left} / ${C.editionSize} left` : 'Gone'}</span>
            </div>`;
  }

  function card(p, i = 0) {
    const n = String(P.indexOf(p) + 1).padStart(3, '0');
    return `
      <article class="pcard reveal ${i % 4 ? `reveal-d${i % 4}` : ''}">
        <div class="pcard-media">
          <img class="front" src="${p.img.front}" alt="${esc(p.name)} hoodie — front" loading="lazy" width="700" height="700">
          <img class="back" src="${p.img.back}" alt="${esc(p.name)} hoodie — back" loading="lazy" width="700" height="700">
          ${badgeHTML(p)}
          <span class="pcard-index">R—${n}</span>
          <button class="wish-btn" type="button" data-wish="${p.id}" aria-label="Save ${esc(p.name)} to wishlist" aria-pressed="false"><i class="bi bi-heart"></i></button>
          <div class="pcard-quick">
            <span class="mono">Quick add</span>
            ${C.sizes.map(s => `<button type="button" data-add="${p.id}" data-size="${s}" ${p.stock[s] ? '' : 'disabled'} aria-label="Add ${esc(p.name)} size ${s} to bag">${s}</button>`).join('')}
          </div>
        </div>
        <div class="pcard-info">
          <div>
            <h3><a href="${p.url}">${esc(p.name)}</a></h3>
            <p class="sub">${esc(p.colorway)}</p>
            <div class="swatches" aria-hidden="true">${p.swatch.map(c => `<span style="background:${c}"></span>`).join('')}</div>
          </div>
          <span class="price">${fmt(p.price)}</span>
        </div>
        ${stockHTML(p)}
      </article>`;
  }

  function renderGrid(el, list) {
    el.innerHTML = list.map(card).join('');
    renderWish();
    observeReveal(el);
  }

  // ---------- CERCA ----------
  const sInput = $('#search-input');
  function runSearch(q) {
    q = q.trim().toLowerCase();
    const res = $('#search-results'), empty = $('#search-empty');
    if (!q) { res.innerHTML = ''; empty.hidden = true; return; }
    const hits = P.filter(p => [p.name, p.colorway, p.tagline, p.description, ...p.colors].join(' ').toLowerCase().includes(q));
    empty.hidden = hits.length > 0;
    res.innerHTML = hits.map(card).join('');
    renderWish();
    $$('.reveal', res).forEach(el => el.classList.add('in'));
  }
  sInput.addEventListener('input', () => runSearch(sInput.value));
  sInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && sInput.value.trim()) location.href = `shop.html?q=${encodeURIComponent(sInput.value.trim())}`;
  });

  // ---------- POPUP DESCOMPTE ----------
  function maybeShowPromo() {
    if (store.get('promoSeen', false) || ['checkout'].includes(page)) return;
    let shown = false;
    const show = () => {
      if (shown || openStack.length) return;
      shown = true;
      store.set('promoSeen', true);
      openLayer(promo, 'input');
    };
    setTimeout(show, 9000);
    document.addEventListener('mouseout', e => { if (!e.relatedTarget && e.clientY < 10) show(); });
  }

  function newsletterSuccess(form) {
    const name = form.querySelector('[name="name"]')?.value.trim();
    store.set('promo', 'REKOM10');
    store.set('subscribed', true);
    renderCart();
    const box = form.closest('#promo-body') || form.parentElement;
    const html = `
      <div class="form-success">
        <div class="ok-ring"><i class="bi bi-stars"></i></div>
        <h3>${name ? `Welcome in, ${esc(name)}.` : "You're in."}</h3>
        <p class="muted">Your code is applied to your bag automatically.</p>
        <span class="code-pill">REKOM10</span>
        <a class="btn mt-1" href="shop.html">Use it now <i class="bi bi-arrow-right"></i></a>
      </div>`;
    if (box.id === 'promo-body') box.innerHTML = html;
    else form.outerHTML = html;
    toast('10% discount unlocked — code REKOM10', 'bi-stars');
  }

  // ---------- FORMULARIS DEMO ----------
  // Els formularis amb data-demo es validen al navegador i mostren un missatge d'èxit
  // (la web està publicada a GitHub Pages, que no executa PHP).
  document.addEventListener('submit', e => {
    const f = e.target;
    if (f.matches('[data-newsletter]')) {
      e.preventDefault();
      newsletterSuccess(f);
    } else if (f.matches('[data-demo]')) {
      e.preventDefault();
      const title = f.dataset.successTitle || 'Sent.';
      const text = f.dataset.success || "We'll get back to you as soon as possible.";
      f.outerHTML = `
        <div class="form-success">
          <div class="ok-ring"><i class="bi bi-check2"></i></div>
          <h3>${esc(title)}</h3>
          <p class="muted">${esc(text)}</p>
        </div>`;
    }
  });

  // ---------- DELEGACIÓ D'ESDEVENIMENTS ----------
  document.addEventListener('click', e => {
    const t = e.target.closest('button, a');
    if (!t) return;

    if (t.matches('[data-open-menu]')) openLayer(menu);
    else if (t.matches('[data-close-menu]')) closeLayer(menu);
    else if (t.matches('[data-open-search]')) { if (menu.classList.contains('open')) closeLayer(menu); openLayer(search, '#search-input'); }
    else if (t.matches('[data-close-search]')) closeLayer(search);
    else if (t.matches('[data-hint]')) { sInput.value = t.dataset.hint; runSearch(t.dataset.hint); sInput.focus(); }
    else if (t.matches('[data-open-cart]')) { e.preventDefault(); openCart(); }
    else if (t.matches('[data-close-cart]')) closeCart();
    else if (t.matches('[data-close-promo]')) closeLayer(promo);
    else if (t.matches('[data-add]')) {
      e.preventDefault();
      const p = byId(t.dataset.add);
      if (addToCart(p.id, t.dataset.size)) {
        if (search.classList.contains('open')) closeLayer(search);
        toast(`${p.name} · ${t.dataset.size} added to your bag`, 'bi-bag-check');
        openCart();
      }
    }
    else if (t.matches('[data-wish]')) { e.preventDefault(); toggleWish(t.dataset.wish, t); }
    else if (t.matches('[data-qty]')) {
      const line = cart.find(i => i.id === t.dataset.id && i.size === t.dataset.size);
      if (line) setQty(line.id, line.size, line.qty + Number(t.dataset.qty));
    }
    else if (t.matches('[data-remove]')) setQty(t.dataset.id, t.dataset.size, 0);
    else if (t.closest('.mobile-menu nav') && t.tagName === 'A') closeLayer(menu);
  });
  backdrop.addEventListener('click', closeCart);
  promo.addEventListener('click', e => { if (e.target === promo) closeLayer(promo); });

  // ---------- HEADER EN FER SCROLL ----------
  const header = $('#site-header');
  let lastY = window.scrollY;
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 40);
    // S'amaga en baixar i torna a aparèixer en pujar
    header.classList.toggle('hide', y > 600 && y > lastY && !openStack.length);
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- REVEAL ----------
  const io = 'IntersectionObserver' in window && !reduced
    ? new IntersectionObserver(entries => entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
    : null;
  function observeReveal(root = document) {
    $$('.reveal, [data-split]', root).forEach(el => io ? io.observe(el) : el.classList.add('in'));
  }

  // ---------- PARALLAX ----------
  const parallax = $$('[data-parallax]');
  if (parallax.length && !reduced) {
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      parallax.forEach(el => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const progress = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.transform = `translate3d(0, ${progress * parseFloat(el.dataset.parallax) * -100}px, 0)${el.dataset.scale ? ` scale(${el.dataset.scale})` : ''}`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
    update();
  }

  // ---------- COMPTADORS ----------
  function countUp(el) {
    const end = parseFloat(el.dataset.count);
    if (reduced) { el.firstChild.textContent = end; return; }
    const t0 = performance.now(), dur = 1600;
    const step = now => {
      const k = Math.min(1, (now - t0) / dur);
      el.firstChild.textContent = Math.round(end * (1 - Math.pow(1 - k, 4)));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const counters = $$('[data-count]');
  if (counters.length) {
    const cio = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); }
    }), { threshold: 0.5 });
    counters.forEach(c => cio.observe(c));
  }

  // ---------- COMPTE ENRERE ----------
  function startCountdowns() {
    const els = $$('[data-countdown]');
    if (!els.length) return;
    const target = new Date(C.nextDrop.date).getTime();
    const tick = () => {
      let d = Math.max(0, target - Date.now());
      const parts = { d: Math.floor(d / 864e5), h: Math.floor(d / 36e5) % 24, m: Math.floor(d / 6e4) % 60, s: Math.floor(d / 1e3) % 60 };
      els.forEach(el => Object.entries(parts).forEach(([k, v]) => {
        const b = el.querySelector(`[data-${k}]`);
        if (b) b.textContent = String(v).padStart(2, '0');
      }));
    };
    tick();
    setInterval(tick, 1000);
  }

  // ---------- INICI ----------
  renderCart();
  renderWish();
  $$('[data-products]').forEach(el => {
    const ids = el.dataset.products;
    renderGrid(el, ids === 'all' ? P : ids.split(',').map(byId).filter(Boolean));
  });
  observeReveal();
  startCountdowns();
  maybeShowPromo();

  // Les pestanyes obertes es mantenen sincronitzades
  window.addEventListener('storage', e => {
    if (e.key === 'rekom:cart') { cart = store.get('cart', []); renderCart(); }
    if (e.key === 'rekom:wish') { wish = store.get('wish', []); renderWish(); }
  });

  // ---------- ESTAT D'UNA COMANDA ----------
  // L'estat avança amb el temps des de la data de la comanda (simulació).
  function orderProgress(o) {
    const h = (Date.now() - new Date(o.date).getTime()) / 36e5;
    const current = h < 0.05 ? 0 : h < 24 ? 1 : h < 72 ? 2 : 3;
    const steps = [
      { t: 'Order confirmed', d: 'Payment received. Welcome in.', icon: 'bi-check2' },
      { t: 'In the workshop', d: 'Your pieces are being finished and packed by hand in Reus.', icon: 'bi-scissors' },
      { t: 'Shipped', d: `${C.shipping[o.method]?.label || 'Standard'} delivery · ${C.shipping[o.method]?.eta || ''}`, icon: 'bi-truck' },
      { t: 'Delivered', d: 'Enjoy it. Tag us @rekom_wear.', icon: 'bi-house-check' }
    ];
    return { steps, current, label: steps[current].t };
  }

  function timelineHTML(o) {
    const { steps, current } = orderProgress(o);
    return `<div class="timeline">${steps.map((s, i) => `
      <div class="tl-step ${i < current || current === steps.length - 1 ? 'done' : ''} ${i === current ? 'current' : ''}">
        <span class="tl-dot"><i class="bi ${s.icon}"></i></span>
        <div><h4 style="${i > current ? 'color:var(--dim)' : ''}">${s.t}</h4><p>${s.d}</p></div>
      </div>`).join('')}</div>`;
  }

  // API pública per a la resta de scripts
  window.REKOM = {
    $, $$, fmt, esc, byId, store, stockOf, round2, toast, card, renderGrid, renderWish, observeReveal,
    addToCart, totals, lineItemHTML, shipProgressHTML, openCart, toggleWish, orderProgress, timelineHTML,
    get cart() { return cart; },
    get wish() { return wish; },
    clearCart() { cart = []; saveCart(); }
  };
})();
