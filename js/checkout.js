/* ==========================================================
   REKOM™ — CHECKOUT (botiga de demostració)
   No es processa cap pagament real ni es guarden dades de targeta.
   ========================================================== */
(() => {
  const R = window.REKOM;
  const { $, $$, fmt, esc, store, byId, toast } = R;
  const C = window.REKOM_CONFIG;
  const root = $('#checkout');

  let method = 'standard';
  let placed = false;

  if (!R.cart.length) {
    root.innerHTML = `
      <div class="cart-empty" style="padding-block:120px">
        <i class="bi bi-bag-x"></i>
        <h3>Your bag is empty</h3>
        <p>Add something before checking out.</p>
        <a class="btn" href="shop.html">Shop the drop <i class="bi bi-arrow-right"></i></a>
      </div>`;
    return;
  }

  const user = store.get('user', null);

  root.innerHTML = `
    <div class="checkout">
      <form id="co-form" novalidate>
        <div class="demo-note"><i class="bi bi-info-circle"></i><span><b>Demo store.</b> This checkout is a prototype: no real payment is processed and no card data is stored or sent anywhere.</span></div>

        <div class="co-step">
          <h2><span class="n">1</span>Contact</h2>
          <div class="form-grid">
            <div class="field full">
              <label for="co-email">Email</label>
              <input class="input" id="co-email" type="email" autocomplete="email" required value="${esc(user?.email || '')}">
            </div>
            <label class="check full"><input type="checkbox" checked> <span>Email me early access to new drops</span></label>
          </div>
        </div>

        <div class="co-step">
          <h2><span class="n">2</span>Delivery</h2>
          <div class="form-grid">
            <div class="field"><label for="co-first">First name</label><input class="input" id="co-first" autocomplete="given-name" required value="${esc(user?.name || '')}"></div>
            <div class="field"><label for="co-last">Last name</label><input class="input" id="co-last" autocomplete="family-name" required></div>
            <div class="field full"><label for="co-address">Address</label><input class="input" id="co-address" autocomplete="address-line1" required></div>
            <div class="field full"><label for="co-address2">Apartment, floor… (optional)</label><input class="input" id="co-address2" autocomplete="address-line2"></div>
            <div class="field"><label for="co-zip">Postal code</label><input class="input" id="co-zip" autocomplete="postal-code" inputmode="numeric" required></div>
            <div class="field"><label for="co-city">City</label><input class="input" id="co-city" autocomplete="address-level2" required></div>
            <div class="field">
              <label for="co-country">Country</label>
              <select class="select" id="co-country" autocomplete="country-name">
                <option>Spain</option><option>Andorra</option><option>Portugal</option><option>France</option><option>Italy</option><option>Germany</option>
              </select>
            </div>
            <div class="field"><label for="co-phone">Phone</label><input class="input" id="co-phone" type="tel" autocomplete="tel" required></div>
          </div>
        </div>

        <div class="co-step">
          <h2><span class="n">3</span>Shipping</h2>
          <div style="display:grid;gap:10px" id="ship-methods"></div>
        </div>

        <div class="co-step" style="border:0">
          <h2><span class="n">4</span>Payment</h2>
          <div class="form-grid">
            <div class="field full"><label for="co-card">Card number</label><input class="input" id="co-card" inputmode="numeric" autocomplete="off" placeholder="4242 4242 4242 4242" maxlength="19" required></div>
            <div class="field"><label for="co-exp">Expiry</label><input class="input" id="co-exp" inputmode="numeric" autocomplete="off" placeholder="MM / YY" maxlength="7" required></div>
            <div class="field"><label for="co-cvc">CVC</label><input class="input" id="co-cvc" inputmode="numeric" autocomplete="off" placeholder="123" maxlength="4" required></div>
          </div>
          <div class="pay-icons mt-2" style="justify-content:flex-start"><i class="bi bi-credit-card-2-front"></i><i class="bi bi-apple"></i><i class="bi bi-google"></i><i class="bi bi-paypal"></i></div>
          <button class="btn btn-lg btn-block mt-3" type="submit" id="pay-btn"></button>
          <p class="secure-note"><i class="bi bi-shield-lock"></i> Encrypted connection · By paying you accept our <a href="terms_of_service.html" style="text-decoration:underline">Terms</a></p>
        </div>
      </form>

      <aside class="summary card">
        <h2 style="font-size:1.1rem;margin-bottom:8px">Order summary</h2>
        <div id="sum-items"></div>
        <form class="promo" id="promo-form">
          <label class="sr-only" for="promo-code">Discount code</label>
          <input class="input" id="promo-code" placeholder="Discount code" autocomplete="off">
          <button class="btn btn-ghost" type="submit">Apply</button>
        </form>
        <div class="totals" id="sum-totals"></div>
      </aside>
    </div>`;

  // ---------- RESUM ----------
  function render() {
    const t = R.totals(R.cart, method);
    $('#sum-items').innerHTML = R.cart.map(i => R.lineItemHTML(i, { readonly: true, badge: true })).join('');
    $('#sum-totals').innerHTML = `
      <div class="row"><span>Subtotal</span><span>${fmt(t.subtotal)}</span></div>
      ${t.discount ? `<div class="row discount"><span>${t.code} (−${t.pct}%) <button type="button" class="dim" data-remove-code style="text-decoration:underline">remove</button></span><span>−${fmt(t.discount)}</span></div>` : ''}
      <div class="row"><span>Shipping · ${C.shipping[method].label}</span><span>${t.shipping ? fmt(t.shipping) : 'Free'}</span></div>
      <div class="row total"><span>Total</span><span>${fmt(t.total)}</span></div>
      <p class="dim" style="font-size:.78rem">VAT included</p>`;

    $('#ship-methods').innerHTML = Object.entries(C.shipping).map(([k, s]) => {
      const free = k === 'standard' && t.freeShip;
      return `<label class="option-card">
                <input type="radio" name="ship" value="${k}" ${k === method ? 'checked' : ''}>
                <span class="grow">${s.label}<small>${s.eta}</small></span>
                <span class="mono">${free ? 'Free' : fmt(s.price)}</span>
              </label>`;
    }).join('');

    $('#pay-btn').innerHTML = `Pay ${fmt(t.total)} <i class="bi bi-lock"></i>`;
    return t;
  }

  root.addEventListener('change', e => {
    if (e.target.name === 'ship') { method = e.target.value; render(); }
  });
  root.addEventListener('click', e => {
    if (e.target.closest('[data-remove-code]')) { store.set('promo', null); render(); }
  });
  document.addEventListener('rekom:cart', () => {
    if (placed) return;
    if (R.cart.length) render(); else location.reload();
  });

  $('#promo-form').addEventListener('submit', e => {
    e.preventDefault();
    const code = $('#promo-code').value.trim().toUpperCase();
    if (C.discountCodes[code]) {
      store.set('promo', code);
      toast(`Code ${code} applied — ${C.discountCodes[code]}% off`, 'bi-stars');
      $('#promo-code').value = '';
      render();
    } else {
      toast('That code is not valid', 'bi-x-octagon', 'error');
    }
  });

  // ---------- FORMAT DE TARGETA ----------
  $('#co-card').addEventListener('input', e => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  });
  $('#co-exp').addEventListener('input', e => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 4);
    e.target.value = v.length > 2 ? `${v.slice(0, 2)} / ${v.slice(2)}` : v;
  });
  $('#co-cvc').addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4); });

  // ---------- ENVIAR ----------
  $('#co-form').addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target;
    let firstBad = null;
    $$('.input[required]', form).forEach(inp => {
      let ok = inp.checkValidity() && inp.value.trim() !== '';
      if (inp.id === 'co-card') ok = inp.value.replace(/\s/g, '').length >= 15;
      if (inp.id === 'co-exp') ok = /^\d{2} \/ \d{2}$/.test(inp.value) && +inp.value.slice(0, 2) >= 1 && +inp.value.slice(0, 2) <= 12;
      if (inp.id === 'co-cvc') ok = inp.value.length >= 3;
      inp.classList.toggle('invalid', !ok);
      if (!ok && !firstBad) firstBad = inp;
    });
    if (firstBad) {
      firstBad.focus();
      toast('Please check the highlighted fields', 'bi-exclamation-octagon', 'error');
      return;
    }

    const btn = $('#pay-btn');
    btn.disabled = true;
    btn.innerHTML = 'Processing…';

    setTimeout(() => {
      const t = R.totals(R.cart, method);
      const order = {
        number: 'REK-' + Math.floor(10000 + Math.random() * 90000),
        date: new Date().toISOString(),
        email: $('#co-email').value.trim().toLowerCase(),
        name: `${$('#co-first').value.trim()} ${$('#co-last').value.trim()}`,
        city: $('#co-city').value.trim(),
        method,
        items: R.cart.map(i => ({ ...i })),
        totals: t
      };
      // Mai guardem dades de targeta
      store.set('orders', [order, ...store.get('orders', [])]);
      if (t.code) store.set('promo', null);
      placed = true;
      R.clearCart();
      showConfirmation(order);
    }, 1400);
  });

  $$('.input', root).forEach(i => i.addEventListener('input', () => i.classList.remove('invalid')));

  function showConfirmation(o) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    root.innerHTML = `
      <div style="max-width:720px;margin:0 auto;padding-block:60px 120px">
        <div class="form-success" style="padding-bottom:20px">
          <div class="ok-ring"><i class="bi bi-check2"></i></div>
          <span class="eyebrow">Order confirmed</span>
          <h1 style="font-size:clamp(2.2rem,6vw,4rem)">Welcome to<br><span class="text-glow">the underground.</span></h1>
          <p class="muted">Thanks ${esc(o.name.split(' ')[0])}. Your pieces are being prepared by hand in our workshop. A confirmation has been sent to <b style="color:#fff">${esc(o.email)}</b>.</p>
          <span class="code-pill">${o.number}</span>
        </div>
        <div class="card mt-3">
          ${o.items.map(i => R.lineItemHTML(i, { readonly: true, badge: true })).join('')}
          <div class="totals mt-2">
            <div class="row"><span>Shipping · ${C.shipping[o.method].label}</span><span>${o.totals.shipping ? fmt(o.totals.shipping) : 'Free'}</span></div>
            ${o.totals.discount ? `<div class="row discount"><span>Discount</span><span>−${fmt(o.totals.discount)}</span></div>` : ''}
            <div class="row total"><span>Total paid</span><span>${fmt(o.totals.total)}</span></div>
          </div>
        </div>
        <div class="flex gap-1 wrap mt-3" style="justify-content:center">
          <a class="btn btn-lg" href="order_tracking.html?order=${o.number}&email=${encodeURIComponent(o.email)}">Track order <i class="bi bi-arrow-right"></i></a>
          <a class="btn btn-lg btn-ghost" href="shop.html">Keep shopping</a>
        </div>
      </div>`;
  }

  render();
})();
