/* ==========================================================
   REKOM™ — SEGUIMENT DE COMANDES
   Busca la comanda entre les guardades en aquest navegador.
   ========================================================== */
(() => {
  const R = window.REKOM;
  const { $, esc, fmt, store, byId } = R;

  const form = $('#track-form');
  const out = $('#track-result');
  const num = $('#track-number');
  const mail = $('#track-email');

  const params = new URLSearchParams(location.search);
  if (params.get('order')) num.value = params.get('order');
  if (params.get('email')) mail.value = params.get('email');

  function lookup() {
    const n = num.value.trim().toUpperCase().replace(/^#/, '');
    const e = mail.value.trim().toLowerCase();
    [num, mail].forEach(i => i.classList.toggle('invalid', !i.value.trim() || !i.checkValidity()));
    if (!n || !e || !mail.checkValidity()) return;

    const o = store.get('orders', []).find(x => x.number === n && x.email === e);
    if (!o) {
      out.innerHTML = `
        <div class="demo-note mt-3" style="margin-bottom:0"><i class="bi bi-search"></i>
          <span>We couldn't find order <b>${esc(n)}</b> for that email. Double-check your confirmation, or <a href="contact.html" style="text-decoration:underline">contact us</a>.</span>
        </div>`;
      return;
    }
    const prog = R.orderProgress(o);
    out.innerHTML = `
      <div class="mt-4" style="border-top:1px solid var(--line);padding-top:28px">
        <div class="flex between center wrap gap-2">
          <div>
            <span class="label">Order</span>
            <h2 style="font-size:1.6rem;margin-top:6px">${o.number}</h2>
            <p class="muted" style="font-size:.88rem">Placed ${new Date(o.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · ${fmt(o.totals.total)}</p>
          </div>
          <span class="status-pill ${prog.current === 3 ? 'ok' : ''}">${prog.label}</span>
        </div>
        ${R.timelineHTML(o)}
        <div>${o.items.map(i => R.lineItemHTML(i, { readonly: true, badge: true })).join('')}</div>
      </div>`;
  }

  form.addEventListener('submit', e => { e.preventDefault(); lookup(); });
  if (num.value && mail.value) lookup();
})();
