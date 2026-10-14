/* ==========================================================
   REKOM™ — FITXA DE PRODUCTE
   ========================================================== */
(() => {
  const R = window.REKOM;
  const { $, $$, fmt, esc, byId, stockOf, toast } = R;
  const P = window.REKOM_PRODUCTS;
  const C = window.REKOM_CONFIG;

  const id = new URLSearchParams(location.search).get('id');
  const p = byId(id);
  const root = $('#pdp');

  if (!p) {
    root.style.display = 'block';
    root.innerHTML = `
      <div class="cart-empty" style="padding-block:120px">
        <i class="bi bi-question-octagon"></i>
        <h3>This piece doesn't exist (yet)</h3>
        <p>Maybe it's part of a future drop. Meanwhile:</p>
        <a class="btn" href="shop.html">Back to the shop <i class="bi bi-arrow-right"></i></a>
      </div>`;
    R.renderGrid($('#related'), P);
    return;
  }

  // ---------- SEO ----------
  document.title = `${p.name} Hoodie — ${p.colorway} — REKOM™`;
  $('meta[name="description"]').setAttribute('content', `${p.name} — ${p.tagline} ${p.description}`);
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `REKOM ${p.name} Hoodie`,
    image: [p.img.frontLg, p.img.backLg],
    description: p.description,
    brand: { '@type': 'Brand', name: 'REKOM' },
    color: p.colorway,
    offers: {
      '@type': 'Offer',
      priceCurrency: C.currency,
      price: p.price,
      availability: stockOf(p) ? 'https://schema.org/LimitedAvailability' : 'https://schema.org/SoldOut'
    }
  });
  document.head.appendChild(ld);

  $('#crumbs').insertAdjacentHTML('beforeend', ` <span>/</span> <span aria-current="page">${esc(p.name)}</span>`);

  // ---------- RENDER ----------
  const n = String(P.indexOf(p) + 1).padStart(3, '0');
  const left = stockOf(p);

  root.innerHTML = `
    <div class="gallery" id="gallery">
      <div class="shot wide" data-zoom>
        <img src="${p.img.frontLg}" alt="${esc(p.name)} hoodie — front" width="1400" height="1400">
        <span class="lbl">Front — R—${n}</span>
      </div>
      <div class="shot" data-zoom>
        <img src="${p.img.backLg}" alt="${esc(p.name)} hoodie — back" width="1400" height="1400" loading="lazy">
        <span class="lbl">Back</span>
      </div>
      <div class="shot dark">
        <div class="text-center" style="display:grid;gap:14px;justify-items:center;padding:24px">
          <img src="assets/img/logo.png" alt="" width="64" height="67" style="position:static;width:64px;height:auto;filter:drop-shadow(0 0 20px #5d00ff)">
          <span class="mono" style="color:var(--rekom-3)">R—${n} / ${C.editionSize}</span>
          <b style="font-family:var(--f-display);font-size:clamp(1.4rem,3vw,2.2rem);text-transform:uppercase;line-height:1">${esc(p.name)}</b>
          <span class="mono dim">Handmade in Reus</span>
        </div>
      </div>
    </div>

    <div class="pdp-info">
      <span class="eyebrow">${esc(p.drop)} — R—${n}</span>
      <h1>${esc(p.name)}</h1>
      <p class="tagline">${esc(p.tagline)}</p>

      <div class="pdp-price">
        <span class="now">${fmt(p.price)}</span>
        <small>VAT included</small>
      </div>

      <div class="stock-line ${left <= 8 ? 'low' : ''}" style="max-width:420px">
        <span class="bar"><i style="width:${Math.max(4, (left / C.editionSize) * 100)}%"></i></span>
        <span class="mono">${left ? `Only ${left} of ${C.editionSize} left` : 'Sold out'}</span>
      </div>

      <p class="pdp-desc">${esc(p.description)}</p>

      <div class="pdp-block">
        <div class="pdp-block-head">
          <span class="label">Colour — ${esc(p.colorway)}</span>
          <div class="swatches" style="margin:0">${p.swatch.map(c => `<span style="background:${c}"></span>`).join('')}</div>
        </div>
      </div>

      <div class="pdp-block">
        <div class="pdp-block-head">
          <span class="label" id="size-label">Size</span>
          <button type="button" data-open-guide><i class="bi bi-rulers"></i> Size guide</button>
        </div>
        <div class="sizes" role="radiogroup" aria-labelledby="size-label" id="sizes">
          ${C.sizes.map(s => {
            const st = p.stock[s] || 0;
            return `<button type="button" class="size-opt" role="radio" aria-checked="false" data-size="${s}" ${st ? '' : 'disabled'}>
                      <b>${s}</b><small>${st ? (st <= 3 ? `Last ${st}` : `${st} left`) : 'Sold out'}</small>
                    </button>`;
          }).join('')}
        </div>
      </div>

      <div class="buy-row">
        <div class="qty lg" aria-label="Quantity">
          <button type="button" data-step="-1" aria-label="Decrease">−</button>
          <span id="qty">1</span>
          <button type="button" data-step="1" aria-label="Increase">+</button>
        </div>
        <button class="btn btn-lg" type="button" id="add-btn" ${left ? '' : 'disabled'}>${left ? 'Select a size' : 'Sold out'}</button>
        <button class="wish-lg" type="button" data-wish="${p.id}" aria-label="Save to wishlist" aria-pressed="false"><i class="bi bi-heart"></i></button>
      </div>

      <div class="perks">
        <div><i class="bi bi-truck"></i> Free shipping over ${fmt(C.freeShippingFrom)} · ships from Spain</div>
        <div><i class="bi bi-arrow-repeat"></i> 14-day returns &amp; size exchanges</div>
        <div><i class="bi bi-scissors"></i> Cut, printed &amp; finished by hand in Reus</div>
        <div><i class="bi bi-shield-lock"></i> Secure, encrypted checkout</div>
      </div>

      <div class="acc">
        <details open>
          <summary>Details <i class="bi bi-plus-lg"></i></summary>
          <div class="acc-body"><ul>${p.details.map(d => `<li>${esc(d)}</li>`).join('')}</ul></div>
        </details>
        <details>
          <summary>Fit &amp; sizing <i class="bi bi-plus-lg"></i></summary>
          <div class="acc-body">
            <p>Relaxed, urban fit. <b>S–M</b> if you prefer a regular or slightly loose fit, <b>L–XL</b> if you like it oversized or have a bigger build. Between two options? Go for the bigger one for a more streetwear look.</p>
          </div>
        </details>
        <details>
          <summary>Shipping &amp; returns <i class="bi bi-plus-lg"></i></summary>
          <div class="acc-body">
            <p>Standard ${C.shipping.standard.eta} (${fmt(C.shipping.standard.price)}, free over ${fmt(C.freeShippingFrom)}). Express ${C.shipping.express.eta} (${fmt(C.shipping.express.price)}). Returns and exchanges within 14 days — <a href="returns_exchanges.html" style="text-decoration:underline">see conditions</a>.</p>
          </div>
        </details>
        <details>
          <summary>Care <i class="bi bi-plus-lg"></i></summary>
          <div class="acc-body"><ul><li>Wash inside out, cold or max 30 ºC</li><li>Avoid tumble drying when you can</li><li>Do not iron directly over prints</li></ul></div>
        </details>
      </div>
    </div>`;

  R.renderWish();

  // ---------- TALLA + QUANTITAT ----------
  let size = null;
  let qty = 1;
  const addBtn = $('#add-btn');
  const qtyEl = $('#qty');
  const sbBtn = $('#sb-btn');

  function refresh() {
    qtyEl.textContent = qty;
    if (!left) return;
    const label = size ? `Add to bag — ${fmt(p.price * qty)}` : 'Select a size';
    addBtn.innerHTML = size ? `${label} <i class="bi bi-bag-plus"></i>` : label;
    sbBtn.textContent = size ? 'Add to bag' : 'Choose size';
  }

  $$('.size-opt', root).forEach(b => b.addEventListener('click', () => {
    size = b.dataset.size;
    $$('.size-opt', root).forEach(o => {
      o.classList.toggle('active', o === b);
      o.setAttribute('aria-checked', o === b);
    });
    qty = Math.min(qty, p.stock[size]);
    refresh();
  }));

  $$('[data-step]', root).forEach(b => b.addEventListener('click', () => {
    const max = size ? p.stock[size] : Math.max(...Object.values(p.stock));
    qty = Math.min(max, Math.max(1, qty + Number(b.dataset.step)));
    refresh();
  }));

  function add() {
    if (!size) {
      $$('.size-opt:not([disabled])', root).forEach(o => { o.classList.remove('shake'); void o.offsetWidth; o.classList.add('shake'); });
      $('#sizes').scrollIntoView({ behavior: 'smooth', block: 'center' });
      toast('Choose your size first', 'bi-rulers', 'error');
      return;
    }
    if (R.addToCart(p.id, size, qty)) {
      toast(`${p.name} · ${size} ×${qty} added to your bag`, 'bi-bag-check');
      R.openCart();
    }
  }
  addBtn.addEventListener('click', add);
  sbBtn.addEventListener('click', add);
  refresh();

  // ---------- ZOOM ----------
  $$('[data-zoom]', root).forEach(shot => {
    const img = $('img', shot);
    shot.addEventListener('click', () => shot.classList.toggle('zoom'));
    shot.addEventListener('mousemove', e => {
      const r = shot.getBoundingClientRect();
      img.style.setProperty('--zx', `${((e.clientX - r.left) / r.width) * 100}%`);
      img.style.setProperty('--zy', `${((e.clientY - r.top) / r.height) * 100}%`);
    });
    shot.addEventListener('mouseleave', () => shot.classList.remove('zoom'));
  });

  // ---------- GUIA DE TALLES ----------
  const guide = $('#size-guide');
  const closeGuide = () => { guide.classList.remove('open'); document.body.classList.remove('lock'); };
  document.addEventListener('click', e => {
    if (e.target.closest('[data-open-guide]')) { guide.classList.add('open'); document.body.classList.add('lock'); }
    if (e.target.closest('[data-close-guide]') || e.target === guide) closeGuide();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && guide.classList.contains('open')) closeGuide(); });

  // ---------- BARRA DE COMPRA FIXA (mòbil) ----------
  const sticky = $('#sticky-buy');
  $('#sb-name').textContent = p.name;
  $('#sb-price').textContent = fmt(p.price);
  if (left) {
    new IntersectionObserver(([en]) => {
      const show = !en.isIntersecting && en.boundingClientRect.top < 0;
      sticky.classList.toggle('show', show);
      sticky.setAttribute('aria-hidden', !show);
    }).observe(addBtn);
  }

  // ---------- RELACIONATS ----------
  R.renderGrid($('#related'), P.filter(x => x.id !== p.id));
})();
