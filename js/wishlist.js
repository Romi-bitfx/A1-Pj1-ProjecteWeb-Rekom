/* ==========================================================
   REKOM™ — WISHLIST
   ========================================================== */
(() => {
  const R = window.REKOM;
  const grid = R.$('#wish-grid');
  const empty = R.$('#wish-empty');

  function render() {
    const list = R.wish.map(R.byId).filter(Boolean);
    R.renderGrid(grid, list);
    R.$$('.reveal', grid).forEach(el => el.classList.add('in'));
    empty.hidden = list.length > 0;
  }

  document.addEventListener('rekom:wish', render);
  render();
})();
