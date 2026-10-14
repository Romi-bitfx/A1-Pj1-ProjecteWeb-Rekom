/* ==========================================================
   REKOM™ — BOTIGA (filtres + ordenació + cerca)
   ========================================================== */
(() => {
  const { $, $$, renderGrid, stockOf, esc } = window.REKOM;
  const P = window.REKOM_PRODUCTS;

  const grid = $('#shop-grid');
  const empty = $('#shop-empty');
  const count = $('#result-count');
  const sort = $('#sort');
  const note = $('#query-note');

  const params = new URLSearchParams(location.search);
  let query = (params.get('q') || '').trim().toLowerCase();
  let filter = params.get('color') || 'all';

  function apply() {
    let list = P.filter(p => filter === 'all' || p.colors.includes(filter));
    if (query) {
      list = list.filter(p => [p.name, p.colorway, p.tagline, p.description, ...p.colors].join(' ').toLowerCase().includes(query));
    }
    const s = sort.value;
    if (s === 'az') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (s === 'za') list = [...list].sort((a, b) => b.name.localeCompare(a.name));
    if (s === 'scarce') list = [...list].sort((a, b) => stockOf(a) - stockOf(b));

    renderGrid(grid, list);
    $$('.reveal', grid).forEach(el => el.classList.add('in'));
    empty.hidden = list.length > 0;
    count.textContent = `${String(list.length).padStart(2, '0')} piece${list.length === 1 ? '' : 's'}`;
    $$('#filters [data-filter]').forEach(b => {
      b.classList.toggle('active', b.dataset.filter === filter);
      b.setAttribute('aria-pressed', b.dataset.filter === filter);
    });

    note.hidden = !query;
    if (query) {
      note.innerHTML = `Results for “${esc(query)}” — <button type="button" class="link-arrow" data-clear-query style="border:0">Clear search</button>`;
    }
  }

  document.addEventListener('click', e => {
    const f = e.target.closest('[data-filter]');
    if (f) { filter = f.dataset.filter; if (f.closest('#shop-empty')) query = ''; apply(); }
    if (e.target.closest('[data-clear-query]')) { query = ''; history.replaceState(null, '', 'shop.html'); apply(); }
  });
  sort.addEventListener('change', apply);

  apply();
})();
